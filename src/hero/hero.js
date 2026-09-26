/* =========================================================
   APE STUDIO — HERO
   FINAL CLEAN VERSION
========================================================= */

export function initHero() {

  /* =======================================================
     ELEMENTS
  ======================================================= */

  const hero =
    document.getElementById("ape-hero");

  const stage =
    document.getElementById("ape-stage");

  const video =
    document.getElementById("ape-video");

  const hint =
    document.getElementById("ape-hint");

  const dark =
    document.getElementById("ape-hero-dark");

  const award =
    document.getElementById("ape-transition-award");

  const lineOne =
    document.getElementById("ape-transition-one");

  const lineTwo =
    document.getElementById("ape-transition-two");


  if (!hero || !stage || !video) {

    console.error(
      "[APE HERO] Missing required elements."
    );

    return;

  }



  /* =======================================================
     SETTINGS
  ======================================================= */

  const DESKTOP_SCROLL_PER_SECOND = 420;

  const MOBILE_SCROLL_PER_SECOND = 900;


  /*
   * Additional scroll distance after the video
   * reaches its final frame.
   *
   * This space is used for:
   *
   * 1. Award-winning statement
   * 2. We Don't Just Create
   * 3. We Build What's Next
   */

  const TRANSITION_SCROLL_DISTANCE = 3200;


  /*
   * Prevent seeking exactly to the final encoded frame.
   */

  const END_SAFETY = 0.06;


  /*
   * Video smoothing.
   */

  const BASE_SMOOTHING = 0.16;

  const FAST_SMOOTHING = 0.34;


  /*
   * Maximum currentTime movement per animation frame.
   */

  const MAX_STEP = 0.12;


  /*
   * Avoid excessive video seek operations.
   */

  const SEEK_THRESHOLD = 0.022;

  const MIN_SEEK_INTERVAL = 34;


  /*
   * Helps the video settle after scrolling stops.
   */

  const SETTLE_BOOST = 1.35;



  /* =======================================================
     STATE
  ======================================================= */

  let duration = 25;

  let videoScrollDistance = 9500;

  let totalScrollDistance = 12000;

  let heroTop = 0;

  let ready = false;

  let targetTime = 0;

  let displayedTime = 0;

  let rafId = null;

  let scrollQueued = false;

  let lastScrollY =
    window.scrollY;

  let lastScrollTime =
    performance.now();

  let scrollVelocity = 0;

  let lastSeekTime = 0;

  let userScrolling = false;

  let scrollStopTimer = null;



  /* =======================================================
     HELPERS
  ======================================================= */

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



  function smoothStep(value) {

    value =
      clamp(
        value,
        0,
        1
      );


    return (
      value *
      value *
      (3 - 2 * value)
    );

  }



  function range(
    progress,
    start,
    end
  ) {

    if (end === start) {

      return progress >= end
        ? 1
        : 0;

    }


    return smoothStep(

      (
        progress -
        start
      )

      /

      (
        end -
        start
      )

    );

  }



  function isMobile() {

    return (
      window.innerWidth <= 767
    );

  }



  function pixelsPerSecond() {

    return isMobile()
      ? MOBILE_SCROLL_PER_SECOND
      : DESKTOP_SCROLL_PER_SECOND;

  }



  /* =======================================================
     MEASURE
  ======================================================= */

  function measure() {

    videoScrollDistance =
      duration *
      pixelsPerSecond();


    totalScrollDistance =
      videoScrollDistance +
      TRANSITION_SCROLL_DISTANCE;


    hero.style.height =
      `${
        totalScrollDistance +
        window.innerHeight
      }px`;


    heroTop =
      hero.getBoundingClientRect().top +
      window.scrollY;

  }



  /* =======================================================
     SCROLL PROGRESS
  ======================================================= */

  function getLocalScroll() {

    return clamp(

      window.scrollY -
      heroTop,

      0,

      totalScrollDistance

    );

  }



  function getVideoProgress() {

    const local =
      getLocalScroll();


    return clamp(

      local /
      videoScrollDistance,

      0,

      1

    );

  }



  function getTransitionProgress() {

    const local =
      getLocalScroll();


    if (
      local <=
      videoScrollDistance
    ) {

      return 0;

    }


    return clamp(

      (
        local -
        videoScrollDistance
      )

      /

      TRANSITION_SCROLL_DISTANCE,

      0,

      1

    );

  }



  /* =======================================================
     PIN / RELEASE HERO
  ======================================================= */

  function updateStagePosition() {

    const y =
      window.scrollY;


    const heroEnd =
      heroTop +
      totalScrollDistance;


    /*
     * Before Hero.
     */

    if (
      y < heroTop
    ) {

      stage.classList.remove(
        "is-fixed",
        "is-ended"
      );

      return;

    }


    /*
     * While inside Hero.
     */

    if (
      y <= heroEnd
    ) {

      stage.classList.add(
        "is-fixed"
      );

      stage.classList.remove(
        "is-ended"
      );

      return;

    }


    /*
     * After Hero.
     */

    stage.classList.remove(
      "is-fixed"
    );


    stage.classList.add(
      "is-ended"
    );

  }



  /* =======================================================
     SCROLL VELOCITY
  ======================================================= */

  function updateScrollVelocity() {

    const now =
      performance.now();


    const currentScroll =
      window.scrollY;


    const deltaY =
      currentScroll -
      lastScrollY;


    const deltaT =
      Math.max(

        now -
        lastScrollTime,

        1

      );


    const rawVelocity =
      deltaY /
      deltaT;


    scrollVelocity =
      scrollVelocity * 0.72 +
      rawVelocity * 0.28;


    lastScrollY =
      currentScroll;


    lastScrollTime =
      now;

  }



  /* =======================================================
     TRANSITION ELEMENT HELPER
  ======================================================= */

  function setTransitionItem(
    element,
    opacity,
    offset = 24
  ) {

    if (!element) {
      return;
    }


    const visibleOpacity =
      clamp(
        opacity,
        0,
        1
      );


    element.style.opacity =
      String(
        visibleOpacity
      );


    element.style.transform =
      `translate(
        -50%,
        calc(
          -50% +
          ${
            offset *
            (1 - visibleOpacity)
          }px
        )
      )`;

  }



  /* =======================================================
     HERO TRANSITION
  ======================================================= */

  function updateTransition() {

    const p =
      getTransitionProgress();


    /* =====================================================
       DARKEN FINAL VIDEO FRAME
    ===================================================== */

    if (dark) {

      dark.style.opacity =
        String(

          range(
            p,
            0.02,
            0.18
          )

          *

          0.92

        );

    }



    /* =====================================================
       01 — AWARD-WINNING CREATIVE & DIGITAL AGENCY
    ===================================================== */

    const awardIn =
      range(
        p,
        0.10,
        0.22
      );


    const awardOut =
      range(
        p,
        0.29,
        0.38
      );


    setTransitionItem(

      award,

      awardIn *
      (1 - awardOut),

      18

    );



    /* =====================================================
       02 — WE DON'T JUST CREATE
    ===================================================== */

    const oneIn =
      range(
        p,
        0.33,
        0.46
      );


    const oneOut =
      range(
        p,
        0.53,
        0.62
      );


    setTransitionItem(

      lineOne,

      oneIn *
      (1 - oneOut),

      28

    );



    /* =====================================================
       03 — WE BUILD WHAT'S NEXT
    ===================================================== */

    const twoIn =
      range(
        p,
        0.57,
        0.70
      );


    const twoOut =
      range(
        p,
        0.89,
        0.98
      );


    setTransitionItem(

      lineTwo,

      twoIn *
      (1 - twoOut),

      28

    );

  }



  /* =======================================================
     UPDATE TARGET FROM SCROLL
  ======================================================= */

  function updateTargetFromScroll() {

    if (!ready) {
      return;
    }


    updateStagePosition();


    updateScrollVelocity();


    const progress =
      getVideoProgress();


    const maxTime =
      Math.max(

        0,

        duration -
        END_SAFETY

      );


    targetTime =
      progress *
      maxTime;


    updateTransition();


    /*
     * Hide initial Scroll To Explore hint
     * after scrolling begins.
     */

    if (hint) {

      hint.style.opacity =
        progress > 0.015
          ? "0"
          : "1";

    }


    userScrolling =
      true;


    clearTimeout(
      scrollStopTimer
    );


    scrollStopTimer =
      setTimeout(
        () => {

          userScrolling =
            false;

          startRender();

        },
        120
      );


    startRender();

  }



  /* =======================================================
     ADAPTIVE VIDEO SMOOTHING
  ======================================================= */

  function getAdaptiveSmoothing(
    difference
  ) {

    const distance =
      Math.abs(
        difference
      );


    let smoothing =

      BASE_SMOOTHING

      +

      clamp(
        distance / 2.5,
        0,
        1
      )

      *

      (
        FAST_SMOOTHING -
        BASE_SMOOTHING
      );


    if (
      !userScrolling
    ) {

      smoothing *=
        SETTLE_BOOST;

    }


    /*
     * A tiny velocity-based adjustment helps
     * when users make larger wheel / trackpad moves.
     */

    const velocityBoost =
      clamp(
        Math.abs(scrollVelocity) * 0.015,
        0,
        0.04
      );


    smoothing +=
      velocityBoost;


    return clamp(
      smoothing,
      0.12,
      0.42
    );

  }



  /* =======================================================
     RENDER VIDEO FRAME
  ======================================================= */

  function renderFrame() {

    rafId =
      null;


    if (!ready) {
      return;
    }


    const difference =
      targetTime -
      displayedTime;


    const smoothing =
      getAdaptiveSmoothing(
        difference
      );


    let step =
      difference *
      smoothing;


    step =
      clamp(
        step,
        -MAX_STEP,
        MAX_STEP
      );


    displayedTime +=
      step;


    /*
     * Snap when extremely close.
     */

    if (
      Math.abs(
        difference
      ) < 0.004
    ) {

      displayedTime =
        targetTime;

    }


    const maxTime =
      Math.max(

        0,

        duration -
        END_SAFETY

      );


    displayedTime =
      clamp(
        displayedTime,
        0,
        maxTime
      );


    const now =
      performance.now();


    const seekDifference =
      Math.abs(

        video.currentTime -
        displayedTime

      );


    /*
     * Seek only when necessary.
     */

    if (
      !video.seeking
      &&
      now -
      lastSeekTime >=
      MIN_SEEK_INTERVAL
      &&
      seekDifference >
      SEEK_THRESHOLD
    ) {

      try {

        video.currentTime =
          displayedTime;


        lastSeekTime =
          now;

      }

      catch (error) {

        /*
         * Ignore temporary seek failures.
         */

      }

    }



    /*
     * Continue rendering while video is catching up.
     */

    if (
      Math.abs(
        targetTime -
        displayedTime
      ) > 0.004
      ||
      video.seeking
    ) {

      rafId =
        requestAnimationFrame(
          renderFrame
        );

    }

  }



  function startRender() {

    if (
      rafId !== null
    ) {

      return;

    }


    rafId =
      requestAnimationFrame(
        renderFrame
      );

  }



  /* =======================================================
     SCROLL EVENT
  ======================================================= */

  window.addEventListener(

    "scroll",

    () => {

      if (scrollQueued) {
        return;
      }


      scrollQueued =
        true;


      requestAnimationFrame(
        () => {

          scrollQueued =
            false;


          updateTargetFromScroll();

        }
      );

    },

    {
      passive: true
    }

  );



  /* =======================================================
     VIDEO SEEK COMPLETE
  ======================================================= */

  video.addEventListener(

    "seeked",

    () => {

      if (
        Math.abs(

          targetTime -
          displayedTime

        ) > 0.004
      ) {

        startRender();

      }

    }

  );



  /* =======================================================
     VIDEO READY
  ======================================================= */

  function videoReady() {

    if (ready) {
      return;
    }


    if (
      !Number.isFinite(
        video.duration
      )
      ||
      video.duration <= 0
    ) {

      return;

    }


    duration =
      video.duration;


    ready =
      true;


    /*
     * This video is controlled entirely by scroll.
     */

    video.pause();


    measure();


    targetTime =

      getVideoProgress()

      *

      (
        duration -
        END_SAFETY
      );


    displayedTime =
      targetTime;


    /*
     * Prepare initial visible frame.
     */

    try {

      video.currentTime =
        Math.max(
          0.03,
          targetTime
        );

    }

    catch (error) {

      /*
       * Ignore browser-specific initial seek failure.
       */

    }


    updateTargetFromScroll();

  }



  video.addEventListener(
    "loadedmetadata",
    videoReady
  );


  video.addEventListener(
    "loadeddata",
    videoReady
  );


  video.addEventListener(
    "canplay",
    videoReady
  );



  /* =======================================================
     RESIZE
  ======================================================= */

  let resizeTimer;


  window.addEventListener(

    "resize",

    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            if (!ready) {
              return;
            }


            measure();


            updateTargetFromScroll();

          },
          160
        );

    }

  );



  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  if (
    video.readyState >= 1
    &&
    Number.isFinite(
      video.duration
    )
    &&
    video.duration > 0
  ) {

    videoReady();

  }

  else {

    video.load();

  }

}