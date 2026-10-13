import gsap from "gsap";
import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   APE STUDIO
   HERO SCROLL SYSTEM

   DESKTOP
   --------
   Existing MP4 scroll scrub.

   MOBILE / TOUCH
   --------------
   Canvas image sequence.
   NO video.currentTime seeking.

   This removes the mobile H.264 random-seeking problem.
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const VIDEO_END_PROGRESS =
  0.86;


/*
 * Mobile sequence generated from the real Hero video.
 */
const MOBILE_FRAME_COUNT =
  252;


const MOBILE_FRAME_FOLDER =
  "/hero-mobile";


const MOBILE_FRAME_PREFIX =
  "frame-";


const MOBILE_FRAME_EXTENSION =
  ".webp";


/*
 * Maximum decoded images kept in memory.
 *
 * Do NOT preload all 252 decoded frames.
 * That could consume hundreds of MB of RAM.
 */
const MOBILE_CACHE_LIMIT =
  36;


/*
 * Concurrent HTTP image requests.
 */
const MAX_FRAME_LOADS =
  6;


/*
 * Controls how smoothly the visual frame approaches
 * the finger's requested scroll position.
 */
const MOBILE_DAMPING =
  9;


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


function frameNumber(
  index
) {

  return String(
    index + 1
  ).padStart(
    4,
    "0"
  );

}


function frameURL(
  index
) {

  return (
    MOBILE_FRAME_FOLDER +
    "/" +
    MOBILE_FRAME_PREFIX +
    frameNumber(
      index
    ) +
    MOBILE_FRAME_EXTENSION
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
     REMOVE OLD TRIGGER DURING VITE HMR
  ===================================================== */

  const existingTrigger =
    ScrollTrigger.getById(
      "ape-hero-scroll"
    );


  if (
    existingTrigger
  ) {

    existingTrigger.kill(
      true
    );

  }


  /* =====================================================
     MOBILE / TOUCH DETECTION
  ===================================================== */

  const isTouchDevice =
    window.matchMedia(
      "(pointer: coarse)"
    ).matches;


  const isSmallScreen =
    window.innerWidth <=
    900;


  const useMobileSequence =
    isTouchDevice
    ||
    isSmallScreen;


  /* =====================================================
     SHARED PROGRESS
  ===================================================== */

  let targetHeroProgress =
    0;


  let displayHeroProgress =
    0;


  /* =====================================================
     TRANSITION VISUALS
  ===================================================== */

  function renderTransition(
    progress
  ) {

    /* -------------------------
       Scroll hint
    ------------------------- */

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


    /* -------------------------
       Final Hero transition
    ------------------------- */

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


  /* =====================================================
     MOBILE IMAGE-SEQUENCE VERSION
  ===================================================== */

  if (
    useMobileSequence
  ) {

    initMobileSequence();

    return;

  }


  /* =====================================================
     DESKTOP MP4 VERSION
  ===================================================== */

  initDesktopVideo();



  /* =====================================================
     MOBILE CANVAS SYSTEM
  ===================================================== */

  function initMobileSequence() {

    /* ===================================================
       STOP MOBILE FROM DOWNLOADING / DECODING
       THE 42 MB VIDEO
    =================================================== */

    video.pause();


    video.preload =
      "none";


    const videoSource =
      video.querySelector(
        "source"
      );


    /*
     * Canvas will cover the video once its first
     * frame is ready.
     */


    /* ===================================================
       CREATE CANVAS DYNAMICALLY

       No index.html modification required.
    =================================================== */

    const canvas =
      document.createElement(
        "canvas"
      );


    canvas.className =
      "ape-hero__canvas";


    canvas.setAttribute(
      "aria-hidden",
      "true"
    );


    /*
     * Put canvas above video but below overlays.
     */
    stage.insertBefore(
      canvas,
      dark || null
    );


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


    /* ===================================================
       CANVAS SIZE
    =================================================== */

    let canvasWidth =
      0;


    let canvasHeight =
      0;


    function resizeCanvas() {

      const width =
        stage.clientWidth;


      const height =
        stage.clientHeight;


      /*
       * Cap DPR to avoid unnecessarily huge mobile
       * canvas buffers.
       */
      const dpr =
        Math.min(
          window.devicePixelRatio || 1,
          1.5
        );


      canvasWidth =
        Math.max(
          1,
          Math.round(
            width *
            dpr
          )
        );


      canvasHeight =
        Math.max(
          1,
          Math.round(
            height *
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


      drawNearestFrame(
        currentFrameIndex
      );

    }


    /* ===================================================
       FRAME CACHE
    =================================================== */

    const frameCache =
      new Map();


    const loadingFrames =
      new Set();


    const queuedFrames =
      new Set();


    const loadQueue =
      [];


    let activeLoads =
      0;


    let cacheCounter =
      0;


    const cacheAccess =
      new Map();


    let firstFrameRendered =
      false;


    let currentFrameIndex =
      0;


    let targetFrameIndex =
      0;


    let previousTargetFrameIndex =
      0;


    /* ===================================================
       CACHE UTILITIES
    =================================================== */

    function markFrameUsed(
      index
    ) {

      cacheCounter +=
        1;


      cacheAccess.set(
        index,
        cacheCounter
      );

    }


    function pruneCache() {

      if (
        frameCache.size <=
        MOBILE_CACHE_LIMIT
      ) {

        return;

      }


      const candidates =
        Array.from(
          frameCache.keys()
        )
          .filter(
            function (
              index
            ) {

              /*
               * Keep frames close to what we're
               * currently displaying.
               */
              return (
                Math.abs(
                  index -
                  currentFrameIndex
                )
                >
                8
              );

            }
          )
          .sort(
            function (
              a,
              b
            ) {

              const accessA =
                cacheAccess.get(
                  a
                )
                ||
                0;


              const accessB =
                cacheAccess.get(
                  b
                )
                ||
                0;


              return (
                accessA -
                accessB
              );

            }
          );


      while (
        frameCache.size >
        MOBILE_CACHE_LIMIT
        &&
        candidates.length
      ) {

        const removeIndex =
          candidates.shift();


        frameCache.delete(
          removeIndex
        );


        cacheAccess.delete(
          removeIndex
        );

      }

    }


    /* ===================================================
       FRAME LOADING QUEUE
    =================================================== */

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
        loadingFrames.has(
          index
        )
        ||
        queuedFrames.has(
          index
        )
      ) {

        return;

      }


      queuedFrames.add(
        index
      );


      if (
        priority
      ) {

        loadQueue.unshift(
          index
        );

      }
      else {

        loadQueue.push(
          index
        );

      }


      pumpQueue();

    }


    function pumpQueue() {

      while (
        activeLoads <
        MAX_FRAME_LOADS
        &&
        loadQueue.length >
        0
      ) {

        const index =
          loadQueue.shift();


        queuedFrames.delete(
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


      loadingFrames.add(
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


          loadingFrames.delete(
            index
          );


          frameCache.set(
            index,
            image
          );


          markFrameUsed(
            index
          );


          pruneCache();


          /*
           * Draw immediately if this is useful
           * for the current requested position.
           */
          if (
            !firstFrameRendered
            ||
            Math.abs(
              index -
              currentFrameIndex
            )
            <=
            2
          ) {

            drawNearestFrame(
              currentFrameIndex
            );

          }


          pumpQueue();

        };


      image.onerror =
        function () {

          activeLoads -=
            1;


          loadingFrames.delete(
            index
          );


          pumpQueue();

        };


      image.src =
        frameURL(
          index
        );

    }


    /* ===================================================
       DRAW IMAGE AS OBJECT-FIT:COVER
    =================================================== */

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


      const imageWidth =
        image.naturalWidth;


      const imageHeight =
        image.naturalHeight;


      const scale =
        Math.max(

          canvasWidth /
          imageWidth,

          canvasHeight /
          imageHeight

        );


      const drawWidth =
        imageWidth *
        scale;


      const drawHeight =
        imageHeight *
        scale;


      const x =
        (
          canvasWidth -
          drawWidth
        )
        /
        2;


      const y =
        (
          canvasHeight -
          drawHeight
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
        drawWidth,
        drawHeight
      );


      /*
       * Once canvas has a valid Hero frame,
       * hide/unload the MP4 on mobile.
       */
      if (
        !firstFrameRendered
      ) {

        firstFrameRendered =
          true;


        canvas.classList.add(
          "is-ready"
        );


        video.classList.add(
          "is-mobile-sequence-hidden"
        );


        /*
         * Abort the heavy MP4 download.
         */
        if (
          videoSource
        ) {

          videoSource.removeAttribute(
            "src"
          );

        }


        try {

          video.load();

        }
        catch (
          error
        ) {

          /*
           * Safe to ignore.
           */

        }

      }

    }


    /* ===================================================
       FIND NEAREST DECODED FRAME
    =================================================== */

    function drawNearestFrame(
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


        markFrameUsed(
          wantedIndex
        );


        drawImageCover(
          image
        );


        return;

      }


      /*
       * If exact frame hasn't arrived yet,
       * use nearest decoded neighbour.
       */
      for (
        let distance =
          1;
        distance <=
          14;
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

          markFrameUsed(
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

          markFrameUsed(
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


    /* ===================================================
       PRIORITISE FRAMES AROUND USER POSITION
    =================================================== */

    function queueAroundFrame(
      index
    ) {

      const direction =
        index >=
        previousTargetFrameIndex
          ?
          1
          :
          -1;


      previousTargetFrameIndex =
        index;


      /*
       * Exact target first.
       */
      enqueueFrame(
        index,
        true
      );


      /*
       * Closest neighbours.
       */
      for (
        let distance =
          1;
        distance <=
          4;
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


      /*
       * Load extra frames in scrolling direction.
       */
      for (
        let distance =
          5;
        distance <=
          12;
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


    /* ===================================================
       INITIAL FRAMES

       Preload first second-ish of sequence.
    =================================================== */

    for (
      let index =
        0;
      index <
        14;
      index +=
        1
    ) {

      enqueueFrame(
        index,
        index ===
          0
      );

    }


    /* ===================================================
       INITIAL CANVAS SIZE
    =================================================== */

    resizeCanvas();


    /* ===================================================
       SCROLL PROGRESS
    =================================================== */

    let targetVideoProgress =
      0;


    let displayedVideoProgress =
      0;


    const heroTrigger =
      ScrollTrigger.create({

        id:
          "ape-hero-scroll",


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

          targetHeroProgress =
            clamp(
              self.progress,
              0,
              1
            );


          targetVideoProgress =
            clamp(

              targetHeroProgress /
              VIDEO_END_PROGRESS,

              0,

              1

            );


          targetFrameIndex =
            Math.round(

              targetVideoProgress *
              (
                MOBILE_FRAME_COUNT -
                1
              )

            );


          queueAroundFrame(
            targetFrameIndex
          );

        }

      });


    /* ===================================================
       RAF SMOOTHING
    =================================================== */

    let previousTime =
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
            previousTime
          )
          /
          1000,

          0,

          0.05

        );


      previousTime =
        now;


      const smoothing =
        1 -
        Math.exp(
          -MOBILE_DAMPING *
          delta
        );


      displayedVideoProgress +=
        (
          targetVideoProgress -
          displayedVideoProgress
        )
        *
        smoothing;


      displayHeroProgress +=
        (
          targetHeroProgress -
          displayHeroProgress
        )
        *
        smoothing;


      const nextFrame =
        Math.round(

          displayedVideoProgress *
          (
            MOBILE_FRAME_COUNT -
            1
          )

        );


      if (
        nextFrame !==
        currentFrameIndex
      ) {

        currentFrameIndex =
          nextFrame;


        enqueueFrame(
          currentFrameIndex,
          true
        );


        drawNearestFrame(
          currentFrameIndex
        );

      }


      renderTransition(
        displayHeroProgress
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


    /* ===================================================
       RESIZE

       Ignore mobile browser URL-bar height changes
       unless actual width/layout changes.
    =================================================== */

    let previousWidth =
      window.innerWidth;


    function handleResize() {

      const nextWidth =
        window.innerWidth;


      if (
        Math.abs(
          nextWidth -
          previousWidth
        )
        <=
        3
      ) {

        return;

      }


      previousWidth =
        nextWidth;


      resizeCanvas();


      ScrollTrigger.refresh();

    }


    window.addEventListener(
      "resize",
      handleResize,
      {
        passive:
          true
      }
    );


    window.addEventListener(
      "orientationchange",
      function () {

        window.setTimeout(
          function () {

            previousWidth =
              window.innerWidth;


            resizeCanvas();


            ScrollTrigger.refresh();

          },
          300
        );

      },
      {
        passive:
          true
      }
    );


    window.addEventListener(
      "load",
      function () {

        resizeCanvas();


        ScrollTrigger.refresh();

      },
      {
        once:
          true
      }
    );

  }



  /* =====================================================
     DESKTOP VIDEO VERSION
  ===================================================== */

  function initDesktopVideo() {

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


    video.pause();


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
        "ape-hero-scroll",


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

        targetHeroProgress =
          clamp(
            self.progress,
            0,
            1
          );


        const videoProgress =
          clamp(

            targetHeroProgress /
            VIDEO_END_PROGRESS,

            0,

            1

          );


        if (
          ready
        ) {

          const wantedTime =
            videoProgress *
            duration;


          /*
           * Desktop random seeking is retained.
           * Desktop was not the failing platform.
           */
          if (
            Math.abs(
              video.currentTime -
              wantedTime
            )
            >
            0.015
          ) {

            try {

              video.currentTime =
                wantedTime;

            }
            catch (
              error
            ) {

              /*
               * Ignore.
               */

            }

          }

        }


        renderTransition(
          targetHeroProgress
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

}