import gsap from "gsap";
import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   APE STUDIO — HERO

   DESKTOP
   --------
   Normal pinned MP4 scrub.

   MOBILE / TOUCH
   --------------
   NO native page scrolling during Hero.
   NO video.currentTime.
   Canvas image sequence.
   Finger speed is capped.

   This is intentionally different from the desktop system.
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const MOBILE_QUERY =
  "(max-width: 900px), (pointer: coarse)";


const MOBILE_FRAME_COUNT =
  252;


const MOBILE_FRAME_FOLDER =
  "/hero-mobile";


const VIDEO_END_PROGRESS =
  0.86;


/*
 * IMPORTANT
 *
 * Maximum progress the Hero is allowed to make
 * per REAL second while the finger is moving.
 *
 * 0.22 means:
 *
 * even if the user moves their thumb extremely quickly,
 * the complete Hero cannot be traversed in less than
 * about 4.5 seconds of active dragging.
 */
const MOBILE_MAX_PROGRESS_PER_SECOND =
  0.34;


/*
 * Natural sensitivity before the speed limiter.
 */
const MOBILE_TOUCH_SENSITIVITY =
  0.004;


/*
 * How quickly rendered frames follow the controlled target.
 */
const MOBILE_RENDER_DAMPING =
  14;


/*
 * After reaching the END, require a little more upward
 * finger movement before leaving the Hero.
 */
const MOBILE_EXIT_DISTANCE =
  45;


/*
 * Number of decoded frames kept around the current frame.
 */
const MOBILE_CACHE_LIMIT =
  48;


/*
 * Maximum simultaneous image requests.
 */
const MOBILE_MAX_LOADS =
  6;


/* =========================================================
   HELPERS
========================================================= */

function clamp(
  value,
  min,
  max
) {

  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );

}


function smoothstep(
  value
) {

  const t =
    clamp(
      value,
      0,
      1
    );


  return (
    t *
    t *
    (
      3 -
      2 * t
    )
  );

}


function getFrameURL(
  index
) {

  const number =
    String(
      index + 1
    ).padStart(
      4,
      "0"
    );


  return (
    `${MOBILE_FRAME_FOLDER}/frame-${number}.webp`
  );

}


/* =========================================================
   INIT
========================================================= */

export function initHero() {

  const hero =
    document.getElementById(
      "ape-hero"
    );


  const stage =
    document.getElementById(
      "ape-stage"
    );


  const video =
    document.getElementById(
      "ape-video"
    );


  const dark =
    document.getElementById(
      "ape-hero-dark"
    );


  const award =
    document.getElementById(
      "ape-transition-award"
    );


  const hint =
    document.getElementById(
      "ape-hint"
    );


  if (
    !hero
    ||
    !stage
    ||
    !video
  ) {

    return;

  }


  /* =====================================================
     CLEAN OLD HMR TRIGGER
  ===================================================== */

  const oldTrigger =
    ScrollTrigger.getById(
      "ape-hero-desktop-scroll"
    );


  if (
    oldTrigger
  ) {

    oldTrigger.kill(
      true
    );

  }


  const useMobileSystem =
    window.matchMedia(
      MOBILE_QUERY
    ).matches;


  if (
    useMobileSystem
  ) {

    initMobileHero({
      hero,
      stage,
      video,
      dark,
      award,
      hint
    });

  }
  else {

    initDesktopHero({
      hero,
      stage,
      video,
      dark,
      award,
      hint
    });

  }

}


/* =========================================================
   SHARED FINAL TRANSITION
========================================================= */

function renderTransition(
  progress,
  dark,
  award,
  hint
) {

  if (
    hint
  ) {

    const hintOpacity =
      clamp(
        1 -
        progress *
        7,
        0,
        1
      );


    hint.style.opacity =
      String(
        hintOpacity
      );

  }


  const transitionProgress =
    clamp(

      (
        progress -
        VIDEO_END_PROGRESS
      )
      /
      (
        1 -
        VIDEO_END_PROGRESS
      ),

      0,

      1

    );


  const eased =
    smoothstep(
      transitionProgress
    );


  if (
    dark
  ) {

    dark.style.opacity =
      String(
        eased *
        0.92
      );

  }


  if (
    award
  ) {

    const awardProgress =
      smoothstep(

        clamp(

          (
            transitionProgress -
            0.10
          )
          /
          0.72,

          0,

          1

        )

      );


    award.style.opacity =
      String(
        awardProgress
      );

  }

}


/* =========================================================
   MOBILE HERO
========================================================= */

function initMobileHero({
  hero,
  stage,
  video,
  dark,
  award,
  hint
}) {

  /* =====================================================
     MOBILE MODE
  ===================================================== */

  hero.classList.add(
    "ape-hero--mobile-controlled"
  );


  /*
   * The mobile frame sequence replaces the MP4.
   */
  video.pause();


  video.preload =
    "none";


  /* =====================================================
     CREATE / REUSE CANVAS
  ===================================================== */

  let canvas =
    stage.querySelector(
      ".ape-hero__canvas"
    );


  if (
    !canvas
  ) {

    canvas =
      document.createElement(
        "canvas"
      );


    canvas.className =
      "ape-hero__canvas";


    canvas.setAttribute(
      "aria-hidden",
      "true"
    );


    stage.insertBefore(
      canvas,
      dark || null
    );

  }


  const ctx =
    canvas.getContext(
      "2d",
      {
        alpha:
          false,

        desynchronized:
          true
      }
    );


  if (
    !ctx
  ) {

    return;

  }


  /* =====================================================
     FREEZE HERO VIEWPORT SIZE

     We intentionally do NOT keep recalculating this when
     Chrome's URL/bottom bars appear/disappear.

     That prevents the Hero itself from changing height.
  ===================================================== */

  function setStableMobileHeight() {

    const viewportHeight =
      window.visualViewport
        ?
        window.visualViewport.height
        :
        window.innerHeight;


    document.documentElement
      .style
      .setProperty(
        "--ape-mobile-hero-height",
        `${Math.round(viewportHeight)}px`
      );

  }


  setStableMobileHeight();


  /* =====================================================
     CANVAS SIZE
  ===================================================== */

  let canvasWidth =
    1;


  let canvasHeight =
    1;


  function resizeCanvas() {

    const rect =
      stage.getBoundingClientRect();


    const dpr =
      Math.min(
        window.devicePixelRatio || 1,
        1.5
      );


    canvasWidth =
      Math.max(
        1,
        Math.round(
          rect.width *
          dpr
        )
      );


    canvasHeight =
      Math.max(
        1,
        Math.round(
          rect.height *
          dpr
        )
      );


    if (
      canvas.width !==
      canvasWidth
    ) {

      canvas.width =
        canvasWidth;

    }


    if (
      canvas.height !==
      canvasHeight
    ) {

      canvas.height =
        canvasHeight;

    }

  }


  resizeCanvas();


  /* =====================================================
     FRAME CACHE
  ===================================================== */

  const frameCache =
    new Map();


  const frameUsage =
    new Map();


  const loading =
    new Set();


  const queued =
    new Set();


  const queue =
    [];


  let activeLoads =
    0;


  let usageCounter =
    0;


  let firstCanvasFrameShown =
    false;


  function markUsed(
    index
  ) {

    usageCounter +=
      1;


    frameUsage.set(
      index,
      usageCounter
    );

  }


  function pruneCache(
    currentIndex
  ) {

    if (
      frameCache.size <=
      MOBILE_CACHE_LIMIT
    ) {

      return;

    }


    const removable =
      Array.from(
        frameCache.keys()
      )
        .filter(
          function (
            index
          ) {

            return (
              Math.abs(
                index -
                currentIndex
              )
              >
              12
            );

          }
        )
        .sort(
          function (
            a,
            b
          ) {

            return (
              (
                frameUsage.get(a)
                ||
                0
              )
              -
              (
                frameUsage.get(b)
                ||
                0
              )
            );

          }
        );


    while (
      frameCache.size >
      MOBILE_CACHE_LIMIT
      &&
      removable.length >
      0
    ) {

      const removeIndex =
        removable.shift();


      frameCache.delete(
        removeIndex
      );


      frameUsage.delete(
        removeIndex
      );

    }

  }


  /* =====================================================
     FRAME LOADER
  ===================================================== */

  function enqueueFrame(
    index,
    priority =
      false
  ) {

    if (
      index <
      0
      ||
      index >=
      MOBILE_FRAME_COUNT
    ) {

      return;

    }


    if (
      frameCache.has(
        index
      )
      ||
      loading.has(
        index
      )
      ||
      queued.has(
        index
      )
    ) {

      return;

    }


    queued.add(
      index
    );


    if (
      priority
    ) {

      queue.unshift(
        index
      );

    }
    else {

      queue.push(
        index
      );

    }


    pumpQueue();

  }


  function pumpQueue() {

    while (
      activeLoads <
      MOBILE_MAX_LOADS
      &&
      queue.length >
      0
    ) {

      const index =
        queue.shift();


      queued.delete(
        index
      );


      loadFrame(
        index
      );

    }

  }


  function loadFrame(
    index
  ) {

    activeLoads +=
      1;


    loading.add(
      index
    );


    const image =
      new Image();


    image.decoding =
      "async";


    image.onload =
      function () {

        activeLoads -=
          1;


        loading.delete(
          index
        );


        frameCache.set(
          index,
          image
        );


        markUsed(
          index
        );


        if (
          !firstCanvasFrameShown
        ) {

          drawFrame(
            index
          );

        }


        pumpQueue();

      };


    image.onerror =
      function () {

        activeLoads -=
          1;


        loading.delete(
          index
        );


        pumpQueue();

      };


    image.src =
      getFrameURL(
        index
      );

  }


  /* =====================================================
     DRAW FRAME
  ===================================================== */

  function drawImageCover(
    image
  ) {

    if (
      !image
      ||
      !image.naturalWidth
      ||
      !image.naturalHeight
    ) {

      return;

    }


    const scale =
      Math.max(

        canvasWidth /
        image.naturalWidth,

        canvasHeight /
        image.naturalHeight

      );


    const width =
      image.naturalWidth *
      scale;


    const height =
      image.naturalHeight *
      scale;


    const x =
      (
        canvasWidth -
        width
      )
      /
      2;


    const y =
      (
        canvasHeight -
        height
      )
      /
      2;


    ctx.clearRect(
      0,
      0,
      canvasWidth,
      canvasHeight
    );


    ctx.drawImage(
      image,
      x,
      y,
      width,
      height
    );


    if (
      !firstCanvasFrameShown
    ) {

      firstCanvasFrameShown =
        true;


      canvas.classList.add(
        "is-ready"
      );


      video.classList.add(
        "is-mobile-sequence-hidden"
      );


      /*
       * Abort the unnecessary 42 MB MP4 request
       * after our canvas is ready.
       */

      const source =
        video.querySelector(
          "source"
        );


      if (
        source
      ) {

        source.removeAttribute(
          "src"
        );

      }


      try {

        video.load();

      }
      catch (
        error
      ) {

        /* safe */

      }

    }

  }


  function drawFrame(
    wantedIndex
  ) {

    wantedIndex =
      clamp(
        wantedIndex,
        0,
        MOBILE_FRAME_COUNT -
        1
      );


    if (
      frameCache.has(
        wantedIndex
      )
    ) {

      const image =
        frameCache.get(
          wantedIndex
        );


      markUsed(
        wantedIndex
      );


      drawImageCover(
        image
      );


      return;

    }


    /*
     * Exact frame hasn't arrived yet.
     * Use the nearest available frame.
     */

    for (
      let distance =
        1;
      distance <=
        18;
      distance +=
        1
    ) {

      const lower =
        wantedIndex -
        distance;


      const upper =
        wantedIndex +
        distance;


      if (
        lower >=
        0
        &&
        frameCache.has(
          lower
        )
      ) {

        markUsed(
          lower
        );


        drawImageCover(
          frameCache.get(
            lower
          )
        );


        return;

      }


      if (
        upper <
        MOBILE_FRAME_COUNT
        &&
        frameCache.has(
          upper
        )
      ) {

        markUsed(
          upper
        );


        drawImageCover(
          frameCache.get(
            upper
          )
        );


        return;

      }

    }

  }


  /* =====================================================
     FRAME PREFETCHING
  ===================================================== */

  let previousWantedFrame =
    0;


  function queueAround(
    index
  ) {

    const direction =
      index >=
      previousWantedFrame
        ?
        1
        :
        -1;


    previousWantedFrame =
      index;


    enqueueFrame(
      index,
      true
    );


    for (
      let distance =
        1;
      distance <=
        8;
      distance +=
        1
    ) {

      enqueueFrame(
        index +
        distance,
        true
      );


      enqueueFrame(
        index -
        distance,
        true
      );

    }


    for (
      let distance =
        9;
      distance <=
        24;
      distance +=
        1
    ) {

      enqueueFrame(

        index +
        (
          direction *
          distance
        ),

        false

      );

    }

  }


  /*
   * Start loading opening frames immediately.
   */

  for (
    let index =
      0;
    index <=
      24;
    index +=
      1
  ) {

    enqueueFrame(
      index,
      index ===
        0
    );

  }


  /* =====================================================
     VIRTUAL HERO PROGRESS

     THIS IS NOW THE MASTER CLOCK.

     Page scroll position is NOT the master clock.
  ===================================================== */

  let targetProgress =
    0;


  let displayedProgress =
    0;


  let displayedFrame =
    -1;


  /* =====================================================
     PAGE LOCK

     This is what prevents native finger momentum from
     throwing the whole Hero upward.

     It also means Chrome doesn't receive normal vertical
     document scrolling while the Hero is playing.
  ===================================================== */

  let heroLocked =
    false;


  function lockHero() {

    if (
      heroLocked
    ) {

      return;

    }


    heroLocked =
      true;


    hero.classList.add(
      "is-gesture-locked"
    );


    document.documentElement
      .classList
      .add(
        "ape-hero-gesture-lock"
      );


    document.body
      .classList
      .add(
        "ape-hero-gesture-lock"
      );

  }


  function unlockHero() {

    if (
      !heroLocked
    ) {

      return;

    }


    heroLocked =
      false;


    hero.classList.remove(
      "is-gesture-locked"
    );


    document.documentElement
      .classList
      .remove(
        "ape-hero-gesture-lock"
      );


    document.body
      .classList
      .remove(
        "ape-hero-gesture-lock"
      );

  }


  /* =====================================================
     EXIT HERO
  ===================================================== */

  let exiting =
    false;


  function exitHero() {

    if (
      exiting
    ) {

      return;

    }


    exiting =
      true;


    targetProgress =
      1;


    unlockHero();


    requestAnimationFrame(
      function () {

        const heroBottom =
          hero.offsetTop +
          hero.offsetHeight;


        window.scrollTo({
          top:
            Math.max(
              0,
              heroBottom -
              1
            ),

          behavior:
            "auto"
        });


        window.setTimeout(
          function () {

            ScrollTrigger.refresh();

          },
          80
        );

      }
    );

  }


  /* =====================================================
     TOUCH INPUT

     IMPORTANT:

     e.preventDefault()
     eliminates the native vertical scroll momentum.

     We then calculate OUR OWN controlled progress.
  ===================================================== */

  let touchActive =
    false;


  let previousTouchY =
    0;


  let previousTouchTime =
    0;


  let endExtraDistance =
    0;


  function handleTouchStart(
    event
  ) {

    if (
      !heroLocked
      ||
      event.touches.length !==
      1
    ) {

      return;

    }


    touchActive =
      true;


    previousTouchY =
      event.touches[0].clientY;


    previousTouchTime =
      performance.now();


    endExtraDistance =
      0;

  }


  function handleTouchMove(
    event
  ) {

    if (
      !heroLocked
      ||
      !touchActive
      ||
      event.touches.length !==
      1
    ) {

      return;

    }


    /*
     * CRITICAL.
     *
     * Stop Chrome/native page scrolling.
     */
    event.preventDefault();


    const now =
      performance.now();


    const currentY =
      event.touches[0].clientY;


    /*
     * Finger moving UP = positive.
     * Finger moving DOWN = negative.
     */
    const deltaY =
      previousTouchY -
      currentY;


    let deltaTime =
      (
        now -
        previousTouchTime
      )
      /
      1000;


    deltaTime =
      clamp(
        deltaTime,
        0.001,
        0.05
      );


    previousTouchY =
      currentY;


    previousTouchTime =
      now;


    /* ===================================================
       MAXIMUM SPEED LIMIT

       This is the part the old versions were missing.

       No matter how large deltaY becomes,
       progress cannot advance faster than:

       MOBILE_MAX_PROGRESS_PER_SECOND
    =================================================== */

    const requestedChange =
      deltaY *
      MOBILE_TOUCH_SENSITIVITY;


    const maximumChange =
      MOBILE_MAX_PROGRESS_PER_SECOND *
      deltaTime;


    const controlledChange =
      clamp(

        requestedChange,

        -maximumChange,

        maximumChange

      );


    /* ===================================================
       WE ARE ALREADY AT END

       Require an extra upward movement to leave Hero.
    =================================================== */

    if (
      targetProgress >=
      0.999
      &&
      deltaY >
      0
    ) {

      endExtraDistance +=
        deltaY;


      if (
        endExtraDistance >=
        MOBILE_EXIT_DISTANCE
      ) {

        exitHero();

      }


      return;

    }


    endExtraDistance =
      0;


    /* ===================================================
       UPDATE VIRTUAL PROGRESS
    =================================================== */

    targetProgress =
      clamp(

        targetProgress +
        controlledChange,

        0,

        1

      );


    const videoProgress =
      clamp(

        targetProgress /
        VIDEO_END_PROGRESS,

        0,

        1

      );


    const targetFrame =
      Math.round(

        videoProgress *
        (
          MOBILE_FRAME_COUNT -
          1
        )

      );


    queueAround(
      targetFrame
    );

  }


  function handleTouchEnd() {

    touchActive =
      false;


    previousTouchTime =
      0;


    endExtraDistance =
      0;

  }


  stage.addEventListener(
    "touchstart",
    handleTouchStart,
    {
      passive:
        true
    }
  );


  stage.addEventListener(
    "touchmove",
    handleTouchMove,
    {
      passive:
        false
    }
  );


  stage.addEventListener(
    "touchend",
    handleTouchEnd,
    {
      passive:
        true
    }
  );


  stage.addEventListener(
    "touchcancel",
    handleTouchEnd,
    {
      passive:
        true
    }
  );


  /* =====================================================
     RENDER LOOP
  ===================================================== */

  let previousRenderTime =
    performance.now();


  let rafId =
    0;


  function render(
    now
  ) {

    const delta =
      clamp(

        (
          now -
          previousRenderTime
        )
        /
        1000,

        0,

        0.05

      );


    previousRenderTime =
      now;


    const smoothing =
      1 -
      Math.exp(

        -MOBILE_RENDER_DAMPING *
        delta

      );


    displayedProgress +=
      (
        targetProgress -
        displayedProgress
      )
      *
      smoothing;


    if (
      Math.abs(
        targetProgress -
        displayedProgress
      )
      <
      0.0001
    ) {

      displayedProgress =
        targetProgress;

    }


    const videoProgress =
      clamp(

        displayedProgress /
        VIDEO_END_PROGRESS,

        0,

        1

      );


    const frame =
      Math.round(

        videoProgress *
        (
          MOBILE_FRAME_COUNT -
          1
        )

      );


    if (
      frame !==
      displayedFrame
    ) {

      displayedFrame =
        frame;


      enqueueFrame(
        frame,
        true
      );


      queueAround(
        frame
      );


      drawFrame(
        frame
      );


      pruneCache(
        frame
      );

    }


    renderTransition(
      displayedProgress,
      dark,
      award,
      hint
    );


    rafId =
      requestAnimationFrame(
        render
      );

  }


  rafId =
    requestAnimationFrame(
      render
    );


  /* =====================================================
     FIRST LOCK

     Delay until next frame so initHome() can finish
     creating its own ScrollTriggers first.
  ===================================================== */

  requestAnimationFrame(
    function () {

      if (
        window.scrollY <=
        5
      ) {

        lockHero();

      }

    }
  );


  /* =====================================================
     IF USER LATER RETURNS TO THE VERY TOP

     Re-arm Hero at its last frame so they can reverse it.
  ===================================================== */

  function handleWindowScroll() {

    if (
      exiting
      &&
      window.scrollY >
      5
    ) {

      return;

    }


    if (
      !heroLocked
      &&
      window.scrollY <=
      2
    ) {

      exiting =
        false;


      lockHero();

    }

  }


  window.addEventListener(
    "scroll",
    handleWindowScroll,
    {
      passive:
        true
    }
  );


  /* =====================================================
     ORIENTATION ONLY

     Notice:
     we do NOT resize Hero every time Chrome changes
     toolbar height.
  ===================================================== */

  function handleOrientation() {

    window.setTimeout(
      function () {

        setStableMobileHeight();


        resizeCanvas();


        drawFrame(
          displayedFrame >=
            0
            ?
            displayedFrame
            :
            0
        );


        ScrollTrigger.refresh();

      },
      350
    );

  }


  window.addEventListener(
    "orientationchange",
    handleOrientation,
    {
      passive:
        true
    }
  );

}


/* =========================================================
   DESKTOP HERO
========================================================= */

function initDesktopHero({
  hero,
  stage,
  video,
  dark,
  award,
  hint
}) {

  document.documentElement
    .classList
    .remove(
      "ape-hero-gesture-lock"
    );


  document.body
    .classList
    .remove(
      "ape-hero-gesture-lock"
    );


  hero.classList.remove(
    "ape-hero--mobile-controlled",
    "is-gesture-locked"
  );


  video.muted =
    true;


  video.playsInline =
    true;


  video.preload =
    "auto";


  video.setAttribute(
    "playsinline",
    ""
  );


  let duration =
    0;


  let ready =
    false;


  function prepareVideo() {

    if (
      !Number.isFinite(
        video.duration
      )
      ||
      video.duration <=
      0
    ) {

      return;

    }


    duration =
      video.duration;


    ready =
      true;


    ScrollTrigger.refresh();

  }


  if (
    video.readyState >=
    1
  ) {

    prepareVideo();

  }
  else {

    video.addEventListener(
      "loadedmetadata",
      prepareVideo,
      {
        once:
          true
      }
    );

  }


  ScrollTrigger.create({

    id:
      "ape-hero-desktop-scroll",


    trigger:
      hero,


    start:
      "top top",


    end:
      "bottom bottom",


    pin:
      stage,


    pinSpacing:
      false,


    anticipatePin:
      1,


    invalidateOnRefresh:
      true,


    onUpdate(
      self
    ) {

      const heroProgress =
        clamp(
          self.progress,
          0,
          1
        );


      const videoProgress =
        clamp(

          heroProgress /
          VIDEO_END_PROGRESS,

          0,

          1

        );


      if (
        ready
      ) {

        const time =
          duration *
          videoProgress;


        if (
          Math.abs(
            video.currentTime -
            time
          )
          >
          0.02
        ) {

          try {

            video.currentTime =
              time;

          }
          catch (
            error
          ) {

            /* safe */

          }

        }

      }


      renderTransition(
        heroProgress,
        dark,
        award,
        hint
      );

    }

  });


  window.addEventListener(
    "load",
    function () {

      ScrollTrigger.refresh();

    },
    {
      once:
        true
    }
  );

}