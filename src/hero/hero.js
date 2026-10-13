import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   APE STUDIO HERO
   MOBILE-SAFE SCROLL VIDEO SCRUB

   IMPORTANT:

   ScrollTrigger:
   - pins the Hero
   - gives us progress 0 → 1

   RAF:
   - smooths that progress

   Video:
   - NEVER receives another seek while a previous
     seek is still decoding

   This prevents:
   freeze → freeze → huge jump
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const MOBILE_QUERY =
  "(max-width: 767px)";


/*
 * First 86% of Hero scroll = video.
 * Remaining Hero progress = final transition.
 */
const VIDEO_END_PROGRESS =
  0.86;


/*
 * Responsiveness.
 *
 * Higher = follows finger faster.
 * Lower = smoother/heavier.
 */
const DESKTOP_DAMPING =
  10;

const MOBILE_DAMPING =
  7;


/*
 * Maximum amount of the ENTIRE video that can
 * move per real-world second.
 *
 * Mobile 0.38 =
 * complete video cannot visually cross in
 * less than roughly 2.6 seconds.
 */
const DESKTOP_MAX_PROGRESS_PER_SECOND =
  0.60;

const MOBILE_MAX_PROGRESS_PER_SECOND =
  0.38;


/*
 * Minimum time between NEW seek requests.
 *
 * We are NOT sending 30/60 seek requests every second
 * anymore.
 */
const DESKTOP_MIN_SEEK_GAP =
  32;

const MOBILE_MIN_SEEK_GAP =
  60;


/*
 * Ignore microscopic seeks.
 */
const DESKTOP_SEEK_THRESHOLD =
  0.025;

const MOBILE_SEEK_THRESHOLD =
  0.045;


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
     REMOVE OLD TRIGGER DURING VITE HOT RELOAD
  ===================================================== */

  const oldTrigger =
    ScrollTrigger.getById(
      "ape-hero-scroll"
    );


  if (
    oldTrigger
  ) {

    oldTrigger.kill(
      true
    );

  }


  /* =====================================================
     VIDEO SETUP
  ===================================================== */

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


  video.setAttribute(
    "disablepictureinpicture",
    ""
  );


  video.pause();


  /* =====================================================
     DEVICE STATE
  ===================================================== */

  let isMobile =
    window.matchMedia(
      MOBILE_QUERY
    ).matches;


  /* =====================================================
     VIDEO STATE
  ===================================================== */

  let duration =
    0;


  let metadataReady =
    false;


  /*
   * Where scrolling wants us to be.
   */
  let targetProgress =
    0;


  /*
   * Smoothly rendered video progress.
   */
  let renderedProgress =
    0;


  /*
   * Full Hero progress for overlay/award animations.
   */
  let targetHeroProgress =
    0;


  let renderedHeroProgress =
    0;


  /*
   * Desired video time after smoothing.
   */
  let desiredVideoTime =
    0;


  /*
   * Last time we ASKED browser to seek.
   */
  let lastSeekRequest =
    0;


  /*
   * requestAnimationFrame.
   */
  let rafId =
    0;


  let previousFrameTime =
    performance.now();


  /* =====================================================
     INITIAL VISUAL STATE
  ===================================================== */

  if (
    dark
  ) {

    dark.style.opacity =
      "0";

  }


  if (
    award
  ) {

    award.style.opacity =
      "0";

  }


  if (
    hint
  ) {

    hint.style.opacity =
      "1";

  }


  /* =====================================================
     VIDEO METADATA
  ===================================================== */

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


    metadataReady =
      true;


    /*
     * Start from browser's current video position.
     */
    renderedProgress =
      clamp(
        video.currentTime /
        duration,
        0,
        1
      );


    desiredVideoTime =
      renderedProgress *
      duration;


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


  /* =====================================================
     SCROLLTRIGGER

     THIS CONTROLS THE PIN.

     No video.currentTime calls here.
  ===================================================== */

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


        /*
         * Convert Hero scrolling into video scrolling.
         */
        targetProgress =
          clamp(

            targetHeroProgress /
            VIDEO_END_PROGRESS,

            0,

            1

          );

      }

    });


  /* =====================================================
     SAFE SEEK FUNCTION

     THIS IS THE IMPORTANT FIX.

     If Chrome is currently decoding a seek:
         video.seeking === true

     We DO NOTHING.

     We wait until it finishes.

     Therefore we no longer cancel the decoder over
     and over during finger momentum.
  ===================================================== */

  function requestVideoSeek(
    now
  ) {

    if (
      !metadataReady
      ||
      duration <=
      0
    ) {

      return;

    }


    /*
     * CRITICAL:
     *
     * Never issue another seek while browser
     * is processing the previous one.
     */
    if (
      video.seeking
    ) {

      return;

    }


    const minimumGap =
      isMobile
        ? MOBILE_MIN_SEEK_GAP
        : DESKTOP_MIN_SEEK_GAP;


    if (
      now -
      lastSeekRequest <
      minimumGap
    ) {

      return;

    }


    const threshold =
      isMobile
        ? MOBILE_SEEK_THRESHOLD
        : DESKTOP_SEEK_THRESHOLD;


    const difference =
      Math.abs(
        desiredVideoTime -
        video.currentTime
      );


    if (
      difference <
      threshold
    ) {

      return;

    }


    /*
     * ONE seek request.
     *
     * Browser gets time to decode it completely.
     */
    try {

      video.currentTime =
        clamp(
          desiredVideoTime,
          0,
          duration
        );


      lastSeekRequest =
        now;

    }
    catch (
      error
    ) {

      /*
       * Next animation frame will retry.
       */

    }

  }


  /* =====================================================
     SEEKED EVENT

     Browser has finished decoding the requested frame.

     No additional seek is made directly here.
     The RAF loop will decide whether another one is needed.
  ===================================================== */

  function handleSeeked() {

    /*
     * Nothing required.
     *
     * The important thing is that video.seeking is now false,
     * allowing render() to request the latest destination.
     */

  }


  video.addEventListener(
    "seeked",
    handleSeeked
  );


  /* =====================================================
     RENDER LOOP
  ===================================================== */

  function render(
    now
  ) {

    let delta =
      (
        now -
        previousFrameTime
      ) /
      1000;


    /*
     * Protect against tab switching / lag spikes.
     */
    delta =
      clamp(
        delta,
        0,
        0.05
      );


    previousFrameTime =
      now;


    /* ===================================================
       SMOOTH HERO PROGRESS
    =================================================== */

    const damping =
      isMobile
        ? MOBILE_DAMPING
        : DESKTOP_DAMPING;


    const smoothing =
      1 -
      Math.exp(
        -damping *
        delta
      );


    renderedHeroProgress +=
      (
        targetHeroProgress -
        renderedHeroProgress
      )
      *
      smoothing;


    /* ===================================================
       SMOOTH VIDEO PROGRESS
    =================================================== */

    const progressDifference =
      targetProgress -
      renderedProgress;


    let progressMovement =
      progressDifference *
      smoothing;


    /*
     * Limit how quickly the video can cross
     * its total duration after a huge finger flick.
     */
    const maxProgressPerSecond =
      isMobile
        ? MOBILE_MAX_PROGRESS_PER_SECOND
        : DESKTOP_MAX_PROGRESS_PER_SECOND;


    const maxProgressMovement =
      maxProgressPerSecond *
      delta;


    progressMovement =
      clamp(

        progressMovement,

        -maxProgressMovement,

        maxProgressMovement

      );


    renderedProgress +=
      progressMovement;


    renderedProgress =
      clamp(
        renderedProgress,
        0,
        1
      );


    /*
     * Snap very tiny remaining difference.
     */
    if (
      Math.abs(
        targetProgress -
        renderedProgress
      )
      <
      0.0001
    ) {

      renderedProgress =
        targetProgress;

    }


    if (
      metadataReady
      &&
      duration >
      0
    ) {

      desiredVideoTime =
        renderedProgress *
        duration;


      /*
       * Ask browser for the frame safely.
       */
      requestVideoSeek(
        now
      );

    }


    /* ===================================================
       SCROLL HINT
    =================================================== */

    if (
      hint
    ) {

      const hintOpacity =
        clamp(

          1 -
          renderedHeroProgress *
          7,

          0,

          1

        );


      hint.style.opacity =
        String(
          hintOpacity
        );

    }


    /* ===================================================
       CURRENT FINAL HERO TRANSITION

       Not redesigning it.
       Keeping existing functionality.
    =================================================== */

    const transitionProgress =
      clamp(

        (
          renderedHeroProgress -
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


    if (
      dark
    ) {

      dark.style.opacity =
        String(
          easedTransition *
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
     MOBILE RESIZE PROTECTION

     Chrome mobile changes viewport HEIGHT constantly
     when address bar appears/disappears.

     We should NOT refresh ScrollTrigger every time.
  ===================================================== */

  let previousWidth =
    window.innerWidth;


  function handleResize() {

    const currentWidth =
      window.innerWidth;


    const widthChanged =
      Math.abs(
        currentWidth -
        previousWidth
      )
      >
      3;


    const nextMobile =
      window.matchMedia(
        MOBILE_QUERY
      ).matches;


    const modeChanged =
      nextMobile !==
      isMobile;


    /*
     * Mobile URL bar changed only the height.
     *
     * Ignore it.
     */
    if (
      nextMobile
      &&
      !widthChanged
      &&
      !modeChanged
    ) {

      return;

    }


    previousWidth =
      currentWidth;


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


  /* =====================================================
     ORIENTATION
  ===================================================== */

  function handleOrientationChange() {

    window.setTimeout(
      function () {

        previousWidth =
          window.innerWidth;


        isMobile =
          window.matchMedia(
            MOBILE_QUERY
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


  /* =====================================================
     PAGE LOAD
  ===================================================== */

  function refreshHero() {

    ScrollTrigger.refresh();

  }


  if (
    document.readyState ===
    "complete"
  ) {

    requestAnimationFrame(
      refreshHero
    );

  }
  else {

    window.addEventListener(
      "load",
      refreshHero,
      {
        once:
          true
      }
    );

  }


  /* =====================================================
     TAB RETURN
  ===================================================== */

  function handleVisibility() {

    if (
      !document.hidden
    ) {

      previousFrameTime =
        performance.now();

    }

  }


  document.addEventListener(
    "visibilitychange",
    handleVisibility
  );


  /* =====================================================
     CLEANUP
  ===================================================== */

  return function destroyHero() {

    heroTrigger.kill(
      true
    );


    cancelAnimationFrame(
      rafId
    );


    video.removeEventListener(
      "seeked",
      handleSeeked
    );


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
      refreshHero
    );


    document.removeEventListener(
      "visibilitychange",
      handleVisibility
    );

  };

}