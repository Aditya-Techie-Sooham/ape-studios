import gsap from "gsap";
import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   APE STUDIO — HERO SCROLL VIDEO
   ---------------------------------------------------------
   RESPONSIBILITIES

   ScrollTrigger:
   - keeps the Hero video pinned
   - measures normal native page scrolling

   Smooth playhead:
   - receives scroll destination
   - moves video toward that destination gradually
   - prevents aggressive mobile flicks from instantly
     skipping through the video

   We DO NOT:
   - prevent touch scrolling
   - intercept wheel events
   - use CSS sticky
   - calculate animation using FPS
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const MOBILE_MEDIA =
  "(max-width: 767px)";


/*
 * Percentage of Hero scroll devoted to video.
 *
 * Final portion remains available for your current
 * transition / award content.
 */
const VIDEO_END_PROGRESS =
  0.86;


/*
 * Higher = video catches scroll faster.
 * Lower = smoother / heavier.
 */
const DESKTOP_DAMPING =
  9.0;

const MOBILE_DAMPING =
  5.5;


/*
 * HARD LIMIT FOR HUGE SCROLL JUMPS.
 *
 * If somebody violently flicks the phone,
 * the entire video cannot visually travel faster
 * than approximately this many real-world seconds.
 */
const DESKTOP_FULL_TRAVEL_SECONDS =
  1.5;

const MOBILE_FULL_TRAVEL_SECONDS =
  2.8;


/*
 * Video seeking rate.
 *
 * Desktop ≈ 60 seeks / second.
 * Mobile  ≈ 30 seeks / second.
 */
const DESKTOP_SEEK_INTERVAL =
  16;

const MOBILE_SEEK_INTERVAL =
  33;


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
    )
    ||
    hero?.querySelector(
      ".ape-hero__stage"
    );


  const video =
    document.getElementById(
      "ape-video"
    )
    ||
    hero?.querySelector(
      ".ape-hero__video"
    );


  const dark =
    document.getElementById(
      "ape-hero-dark"
    )
    ||
    hero?.querySelector(
      ".ape-hero__dark"
    );


  const award =
    document.getElementById(
      "ape-transition-award"
    )
    ||
    hero?.querySelector(
      ".ape-transition-award"
    );


  const hint =
    document.getElementById(
      "ape-hint"
    )
    ||
    hero?.querySelector(
      ".ape-hero__hint"
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


  /* =======================================================
     REMOVE ANY OLD HERO TRIGGER

     Helpful during Vite hot reload.
  ======================================================= */

  const previousTrigger =
    ScrollTrigger.getById(
      "ape-hero-scroll-video"
    );


  if (previousTrigger) {

    previousTrigger.kill(
      true
    );

  }


  /* =======================================================
     VIDEO SETUP
  ======================================================= */

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


  video.setAttribute(
    "webkit-playsinline",
    ""
  );


  video.pause();


  /*
   * Force browser to begin loading the MP4.
   */
  if (
    video.readyState ===
    0
  ) {

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


  /* =======================================================
     REDUCED MOTION
  ======================================================= */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (
    reducedMotion
  ) {

    if (dark) {

      dark.style.opacity =
        "0.72";

    }


    if (award) {

      award.style.opacity =
        "1";

      award.style.transform =
        "translate3d(-50%, -50%, 0)";

    }


    if (hint) {

      hint.style.opacity =
        "0";

    }


    return;

  }


  /* =======================================================
     DEVICE STATE
  ======================================================= */

  let isMobile =
    window.matchMedia(
      MOBILE_MEDIA
    ).matches;


  /* =======================================================
     PLAYHEAD STATE
  ======================================================= */

  let duration =
    0;


  let targetTime =
    0;


  let displayedTime =
    0;


  let targetHeroProgress =
    0;


  let displayedHeroProgress =
    0;


  let metadataReady =
    false;


  let animationFrameId =
    0;


  let lastAnimationTime =
    performance.now();


  let lastSeekTime =
    0;


  /* =======================================================
     INITIAL VISUAL STATE
  ======================================================= */

  if (dark) {

    dark.style.opacity =
      "0";

  }


  if (award) {

    award.style.opacity =
      "0";

    award.style.transform =
      "translate3d(-50%, calc(-50% + 26px), 0)";

  }


  if (hint) {

    hint.style.opacity =
      "1";

  }


  /* =======================================================
     CONVERT SCROLL PROGRESS → TARGET VIDEO TIME
  ======================================================= */

  function updateTargetFromProgress(
    progress
  ) {

    targetHeroProgress =
      clamp(
        progress,
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
      duration >
      0
    ) {

      targetTime =
        duration *
        videoProgress;

    }

  }


  /* =======================================================
     GSAP PIN

     THIS IS THE IMPORTANT FIX.

     stage stays physically on-screen while
     the tall .ape-hero section scrolls underneath it.
  ======================================================= */

  const heroTrigger =
    ScrollTrigger.create({

      id:
        "ape-hero-scroll-video",


      trigger:
        hero,


      start:
        "top top",


      end:
        "bottom bottom",


      /*
       * GSAP owns pinning.
       */
      pin:
        stage,


      /*
       * Hero itself already supplies the scroll distance.
       * We do not need GSAP to create another large spacer.
       */
      pinSpacing:
        false,


      /*
       * Use actual fixed pinning against the viewport.
       */
      pinType:
        "fixed",


      anticipatePin:
        1,


      invalidateOnRefresh:
        true,


      refreshPriority:
        10,


      onUpdate(
        self
      ) {

        updateTargetFromProgress(
          self.progress
        );

      }

    });


  /*
   * Handle refresh / restored scroll position.
   */
  updateTargetFromProgress(
    heroTrigger.progress
  );


  /* =======================================================
     VIDEO METADATA
  ======================================================= */

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


    /*
     * If the browser restored a scroll position,
     * calculate its corresponding target immediately.
     */
    updateTargetFromProgress(
      heroTrigger.progress
    );


    /*
     * Start rendered playhead from current decoded position.
     */
    displayedTime =
      clamp(
        video.currentTime || 0,
        0,
        duration
      );


    metadataReady =
      true;


    /*
     * Seek very slightly away from zero.
     * This helps some mobile browsers decode
     * the opening frame reliably.
     */
    if (
      displayedTime <=
      0.001
    ) {

      try {

        video.currentTime =
          Math.min(
            0.01,
            duration
          );

        displayedTime =
          video.currentTime;

      }
      catch (
        error
      ) {

        /*
         * Browser will retry naturally later.
         */

      }

    }


    /*
     * Metadata can affect measurements.
     */
    requestAnimationFrame(
      function () {

        ScrollTrigger.refresh();

      }
    );

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


  /* =======================================================
     MOBILE VIDEO PRIMING

     Some mobile browsers decode a muted inline video
     more reliably after one play/pause cycle.

     This does NOT start visible playback.
  ======================================================= */

  let videoPrimed =
    false;


  function primeVideo() {

    if (
      videoPrimed
    ) {

      return;

    }


    videoPrimed =
      true;


    const playPromise =
      video.play();


    if (
      playPromise
      &&
      typeof playPromise.then ===
      "function"
    ) {

      playPromise
        .then(
          function () {

            video.pause();

          }
        )
        .catch(
          function () {

            /*
             * Not fatal.
             * Seeking can still work without priming.
             */

          }
        );

    }
    else {

      video.pause();

    }


    window.removeEventListener(
      "touchstart",
      primeVideo
    );


    window.removeEventListener(
      "pointerdown",
      primeVideo
    );


    window.removeEventListener(
      "wheel",
      primeVideo
    );

  }


  window.addEventListener(
    "touchstart",
    primeVideo,
    {
      passive:
        true,
      once:
        true
    }
  );


  window.addEventListener(
    "pointerdown",
    primeVideo,
    {
      passive:
        true,
      once:
        true
    }
  );


  window.addEventListener(
    "wheel",
    primeVideo,
    {
      passive:
        true,
      once:
        true
    }
  );


  /* =======================================================
     SMOOTH PLAYHEAD ENGINE

     Scroll changes targetTime immediately.

     displayedTime approaches targetTime at a
     controlled real-world speed.

     This normalises:
     - mouse wheel
     - trackpad
     - mobile finger drag
     - mobile momentum flick
     - 60 Hz displays
     - 90 / 120 Hz displays
  ======================================================= */

  function renderFrame(
    now
  ) {

    const rawDelta =
      (
        now -
        lastAnimationTime
      ) /
      1000;


    /*
     * Avoid huge jumps if browser tab was inactive.
     */
    const delta =
      Math.min(
        Math.max(
          rawDelta,
          0
        ),
        0.05
      );


    lastAnimationTime =
      now;


    const damping =
      isMobile
        ? MOBILE_DAMPING
        : DESKTOP_DAMPING;


    /*
     * Frame-rate independent smoothing.
     */
    const smoothing =
      1 -
      Math.exp(
        -damping *
        delta
      );


    /* =====================================================
       SMOOTH HERO VISUAL PROGRESS
    ===================================================== */

    displayedHeroProgress +=
      (
        targetHeroProgress -
        displayedHeroProgress
      ) *
      smoothing;


    /* =====================================================
       SMOOTH VIDEO TIME
    ===================================================== */

    if (
      metadataReady
      &&
      duration >
      0
    ) {

      const difference =
        targetTime -
        displayedTime;


      let movement =
        difference *
        smoothing;


      /*
       * HARD MAXIMUM SPEED.
       *
       * This is what stops a hard finger flick
       * from causing an instant video jump.
       */
      const fullTravelSeconds =
        isMobile
          ? MOBILE_FULL_TRAVEL_SECONDS
          : DESKTOP_FULL_TRAVEL_SECONDS;


      const maximumVideoRate =
        duration /
        fullTravelSeconds;


      const maximumMovement =
        maximumVideoRate *
        delta;


      movement =
        clamp(
          movement,
          -maximumMovement,
          maximumMovement
        );


      /*
       * Snap microscopic remainder.
       */
      if (
        Math.abs(
          difference
        ) <
        0.002
      ) {

        displayedTime =
          targetTime;

      }
      else {

        displayedTime +=
          movement;

      }


      displayedTime =
        clamp(
          displayedTime,
          0,
          duration
        );


      /* ===================================================
         SEEK THROTTLING
      =================================================== */

      const seekInterval =
        isMobile
          ? MOBILE_SEEK_INTERVAL
          : DESKTOP_SEEK_INTERVAL;


      if (
        now -
        lastSeekTime >=
        seekInterval
      ) {

        const seekDifference =
          Math.abs(
            video.currentTime -
            displayedTime
          );


        if (
          seekDifference >
          0.008
        ) {

          try {

            video.currentTime =
              displayedTime;

          }
          catch (
            error
          ) {

            /*
             * Retry on next frame.
             */

          }

        }


        lastSeekTime =
          now;

      }

    }


    /* =====================================================
       CURRENT EXISTING FINAL TRANSITION

       Keeping this operational.
       We are NOT redesigning it in this fix.
    ===================================================== */

    const transitionProgress =
      clamp(

        (
          displayedHeroProgress -
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


    const easedTransition =
      smoothstep(
        transitionProgress
      );


    if (dark) {

      dark.style.opacity =
        String(
          easedTransition *
          0.92
        );

    }


    if (award) {

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


      const awardOffset =
        (
          1 -
          awardProgress
        ) *
        26;


      award.style.transform =
        `translate3d(
          -50%,
          calc(-50% + ${awardOffset}px),
          0
        )`;

    }


    if (hint) {

      const hintOpacity =
        clamp(
          1 -
          displayedHeroProgress *
          7,
          0,
          1
        );


      hint.style.opacity =
        String(
          hintOpacity
        );

    }


    animationFrameId =
      requestAnimationFrame(
        renderFrame
      );

  }


  animationFrameId =
    requestAnimationFrame(
      renderFrame
    );


  /* =======================================================
     MOBILE ADDRESS-BAR PROTECTION

     Mobile browsers constantly change innerHeight as their
     URL bar opens/closes.

     Refreshing ScrollTrigger every time that happens
     causes jumps.

     Therefore on mobile we refresh mainly when WIDTH changes
     (orientation / actual layout change).
  ======================================================= */

  let previousWidth =
    window.innerWidth;


  let previousHeight =
    window.innerHeight;


  function handleResize() {

    const nextWidth =
      window.innerWidth;


    const nextHeight =
      window.innerHeight;


    const widthChanged =
      Math.abs(
        nextWidth -
        previousWidth
      ) >
      2;


    const heightChanged =
      Math.abs(
        nextHeight -
        previousHeight
      ) >
      2;


    const nextMobile =
      window.matchMedia(
        MOBILE_MEDIA
      ).matches;


    const deviceModeChanged =
      nextMobile !==
      isMobile;


    /*
     * Ignore mobile URL-bar-only resize events.
     */
    if (
      nextMobile
      &&
      !widthChanged
      &&
      !deviceModeChanged
    ) {

      previousHeight =
        nextHeight;

      return;

    }


    /*
     * Desktop window resizing should refresh normally.
     */
    if (
      !nextMobile
      &&
      !widthChanged
      &&
      !heightChanged
    ) {

      return;

    }


    previousWidth =
      nextWidth;


    previousHeight =
      nextHeight;


    isMobile =
      nextMobile;


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


  /* =======================================================
     ORIENTATION CHANGE
  ======================================================= */

  function handleOrientationChange() {

    window.setTimeout(
      function () {

        previousWidth =
          window.innerWidth;


        previousHeight =
          window.innerHeight;


        isMobile =
          window.matchMedia(
            MOBILE_MEDIA
          ).matches;


        ScrollTrigger.refresh();

      },
      300
    );

  }


  window.addEventListener(
    "orientationchange",
    handleOrientationChange,
    {
      passive:
        true
    }
  );


  /* =======================================================
     WINDOW LOAD REFRESH
  ======================================================= */

  function handleWindowLoad() {

    ScrollTrigger.refresh();

  }


  if (
    document.readyState ===
    "complete"
  ) {

    requestAnimationFrame(
      handleWindowLoad
    );

  }
  else {

    window.addEventListener(
      "load",
      handleWindowLoad,
      {
        once:
          true
      }
    );

  }


  /* =======================================================
     TAB VISIBILITY
  ======================================================= */

  function handleVisibilityChange() {

    if (
      !document.hidden
    ) {

      lastAnimationTime =
        performance.now();

    }

  }


  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );


  /* =======================================================
     BROWSER BACK/FORWARD CACHE
  ======================================================= */

  function handlePageShow() {

    lastAnimationTime =
      performance.now();


    window.setTimeout(
      function () {

        ScrollTrigger.refresh();

      },
      50
    );

  }


  window.addEventListener(
    "pageshow",
    handlePageShow
  );


  /* =======================================================
     CLEANUP
  ======================================================= */

  return function destroyHero() {

    heroTrigger.kill(
      true
    );


    if (
      animationFrameId
    ) {

      cancelAnimationFrame(
        animationFrameId
      );

    }


    window.removeEventListener(
      "resize",
      handleResize
    );


    window.removeEventListener(
      "orientationchange",
      handleOrientationChange
    );


    window.removeEventListener(
      "load",
      handleWindowLoad
    );


    window.removeEventListener(
      "pageshow",
      handlePageShow
    );


    window.removeEventListener(
      "touchstart",
      primeVideo
    );


    window.removeEventListener(
      "pointerdown",
      primeVideo
    );


    window.removeEventListener(
      "wheel",
      primeVideo
    );


    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

  };

}