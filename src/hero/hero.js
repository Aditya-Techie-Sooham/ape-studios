/* =========================================================
   APE STUDIO — HERO
   SMOOTH SCROLL-SCRUB VIDEO

   IMPORTANT:
   - Native mouse/touch scrolling remains untouched.
   - Scroll only sets TARGET progress.
   - Video smoothly follows target progress.
   - Fast finger swipes cannot instantly skip the video.
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


gsap.registerPlugin(
  ScrollTrigger
);



/* =========================================================
   SETTINGS
========================================================= */


/*
 * First part of Hero = video.
 * Last part = award-winning statement.
 *
 * 0.84 means:
 * first 84% of Hero scroll controls the video,
 * final 16% reveals the H1.
 */

const VIDEO_END_PROGRESS =
  0.84;


/*
 * Damping controls how tightly the video follows scrolling.
 *
 * Higher = faster response.
 * Lower = heavier / smoother.
 */

const DESKTOP_DAMPING =
  10;


const MOBILE_DAMPING =
  5.5;


/*
 * Maximum catch-up speed.
 *
 * This is what protects us from a violent mobile swipe.
 *
 * Example:
 * MOBILE_FULL_TRAVEL_SECONDS = 2.8
 *
 * Even if scroll jumps from 0 → 100%,
 * video cannot visually cover its entire duration
 * in less than roughly 2.8 seconds.
 */

const DESKTOP_FULL_TRAVEL_SECONDS =
  1.6;


const MOBILE_FULL_TRAVEL_SECONDS =
  2.8;


/*
 * Don't hammer mobile video decoding at 60/120Hz.
 *
 * Desktop ≈ 60 seeks/sec
 * Mobile ≈ 30 seeks/sec
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
   INIT HERO
========================================================= */

export function initHero() {

  const hero =
    document.getElementById(
      "ape-hero"
    )
    ||
    document.querySelector(
      ".ape-hero"
    );


  if (!hero) {
    return;
  }



  const stage =
    hero.querySelector(
      ".ape-hero__stage"
    );


  const video =
    hero.querySelector(
      ".ape-hero__video"
    );


  const dark =
    hero.querySelector(
      ".ape-hero__dark"
    );


  const award =
    hero.querySelector(
      ".ape-transition-award"
    );


  const hint =
    hero.querySelector(
      ".ape-hero__hint"
    );


  if (
    !stage
    ||
    !video
  ) {

    return;

  }



  /* =====================================================
     IMPORTANT:
     OLD HERO JS USED THESE CLASSES FOR MANUAL FIXING.
     THEY ARE NOT NEEDED ANYMORE.
  ===================================================== */

  stage.classList.remove(
    "is-fixed",
    "is-ended"
  );



  /* =====================================================
     VIDEO BASICS
  ===================================================== */

  video.muted =
    true;


  video.playsInline =
    true;


  video.setAttribute(
    "playsinline",
    ""
  );


  video.setAttribute(
    "webkit-playsinline",
    ""
  );


  video.preload =
    "auto";


  /*
   * We never allow normal playback.
   * The scroll controls the playhead.
  */

  video.pause();



  /* =====================================================
     REDUCED MOTION
  ===================================================== */

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduceMotion) {

    if (dark) {

      gsap.set(
        dark,
        {
          opacity:
            0.72
        }
      );

    }


    if (award) {

      gsap.set(
        award,
        {
          opacity:
            1,

          y:
            0
        }
      );

    }


    if (hint) {

      gsap.set(
        hint,
        {
          opacity:
            0
        }
      );

    }


    return;

  }



  /* =====================================================
     DEVICE MODE
  ===================================================== */

  let isMobile =
    window.matchMedia(
      "(max-width: 767px)"
    ).matches;



  /* =====================================================
     PLAYHEAD STATE
  ===================================================== */

  let targetTime =
    0;


  let displayedTime =
    0;


  let targetHeroProgress =
    0;


  let displayedHeroProgress =
    0;


  let duration =
    0;


  let lastFrameTime =
    performance.now();


  let lastSeekTime =
    0;


  let rafId =
    null;


  let ready =
    false;



  /* =====================================================
     INITIAL VISUAL STATE
  ===================================================== */

  if (dark) {

    gsap.set(
      dark,
      {
        opacity:
          0
      }
    );

  }


  if (award) {

    gsap.set(
      award,
      {
        opacity:
          0,

        y:
          24
      }
    );

  }


  if (hint) {

    gsap.set(
      hint,
      {
        opacity:
          1
      }
    );

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


    displayedTime =
      clamp(
        video.currentTime || 0,
        0,
        duration
      );


    targetTime =
      displayedTime;


    ready =
      true;


    /*
     * Helps mobile browsers display a decoded first frame.
     */

    if (
      displayedTime === 0
    ) {

      try {

        video.currentTime =
          Math.min(
            0.01,
            duration
          );

      }
      catch (
        error
      ) {

        /*
         * Safe to ignore.
         */

      }

    }


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



  /* =====================================================
     SCROLL → TARGET

     NO VIDEO SEEKING HAPPENS HERE.

     This is essential.

     Touch momentum is allowed to move ScrollTrigger
     however it wants.

     We only record where the user WANTS to be.
  ===================================================== */

  const heroTrigger =
    ScrollTrigger.create({

      trigger:
        hero,

      start:
        "top top",

      end:
        "bottom bottom",

      invalidateOnRefresh:
        true,


      onUpdate:
        function (
          self
        ) {

          targetHeroProgress =
            clamp(
              self.progress,
              0,
              1
            );


          /*
           * Only first 84% controls video.
          */

          const videoProgress =
            clamp(

              targetHeroProgress
              /
              VIDEO_END_PROGRESS,

              0,

              1

            );


          if (
            duration >
            0
          ) {

            targetTime =
              videoProgress
              *
              duration;

          }

        }

    });



  /* =====================================================
     SMOOTH VIDEO ENGINE

     This runs independently from scroll events.

     Different mouse-wheel speed,
     trackpad speed,
     touch momentum,
     60Hz screen,
     120Hz screen...

     all get normalized here.
  ===================================================== */

  function tick(
    now
  ) {

    const rawDelta =
      (
        now -
        lastFrameTime
      )
      /
      1000;


    /*
     * Prevent giant delta after tab switching etc.
    */

    const delta =
      Math.min(
        rawDelta,
        0.05
      );


    lastFrameTime =
      now;



    const damping =
      isMobile
        ? MOBILE_DAMPING
        : DESKTOP_DAMPING;



    /*
     * Frame-rate-independent exponential damping.
     */

    const smoothing =
      1 -
      Math.exp(
        -damping
        *
        delta
      );



    /* ===================================================
       SMOOTH HERO PROGRESS
    =================================================== */

    displayedHeroProgress +=
      (
        targetHeroProgress -
        displayedHeroProgress
      )
      *
      smoothing;



    /* ===================================================
       SMOOTH VIDEO TIME
    =================================================== */

    if (
      ready
      &&
      duration >
      0
    ) {

      const difference =
        targetTime -
        displayedTime;



      let desiredMovement =
        difference
        *
        smoothing;



      /*
       * HARD PROTECTION AGAINST FAST MOBILE SWIPES.
       *
       * Limit the amount of video-time that may
       * move during this real-world frame.
      */

      const fullTravelSeconds =
        isMobile
          ? MOBILE_FULL_TRAVEL_SECONDS
          : DESKTOP_FULL_TRAVEL_SECONDS;



      const maxVideoSecondsPerSecond =
        duration
        /
        fullTravelSeconds;



      const maxMovement =
        maxVideoSecondsPerSecond
        *
        delta;



      desiredMovement =
        clamp(

          desiredMovement,

          -maxMovement,

          maxMovement

        );



      displayedTime +=
        desiredMovement;



      displayedTime =
        clamp(
          displayedTime,
          0,
          duration
        );



      /* =================================================
         SEEK THROTTLING

         Mobile gets ≈30 currentTime updates / second.

         This avoids flooding the decoder.
      ================================================= */

      const seekInterval =
        isMobile
          ? MOBILE_SEEK_INTERVAL
          : DESKTOP_SEEK_INTERVAL;



      if (
        (
          now -
          lastSeekTime
        )
        >=
        seekInterval
      ) {

        /*
         * Don't perform useless microscopic seeks.
        */

        if (
          Math.abs(
            video.currentTime -
            displayedTime
          )
          >
          0.012
        ) {

          try {

            video.currentTime =
              displayedTime;

          }
          catch (
            error
          ) {

            /*
             * Browser may temporarily reject a seek
             * while metadata/decode state changes.
             * Next frame will retry.
            */

          }

        }


        lastSeekTime =
          now;

      }

    }



    /* ===================================================
       FINAL TRANSITION

       Last 16% of Hero.
    =================================================== */

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



    /* ===================================================
       DARKEN VIDEO
    =================================================== */

    if (dark) {

      dark.style.opacity =
        String(
          easedTransition
          *
          0.92
        );

    }



    /* ===================================================
       AWARD-WINNING H1
    =================================================== */

    if (award) {

      /*
       * Starts slightly after the dark fade begins.
      */

      const awardProgress =
        smoothstep(

          clamp(

            (
              transitionProgress -
              0.12
            )
            /
            0.58,

            0,

            1

          )

        );


      award.style.opacity =
        String(
          awardProgress
        );


      award.style.transform =
        `translate(
          -50%,
          calc(
            -50% +
            ${
              (
                1 -
                awardProgress
              )
              *
              26
            }px
          )
        )`;

    }



    /* ===================================================
       SCROLL HINT
    =================================================== */

    if (hint) {

      const hintOpacity =
        clamp(

          1 -
          displayedHeroProgress
          *
          7,

          0,

          1

        );


      hint.style.opacity =
        String(
          hintOpacity
        );

    }



    rafId =
      requestAnimationFrame(
        tick
      );

  }



  rafId =
    requestAnimationFrame(
      tick
    );



  /* =====================================================
     RESIZE / ROTATION
  ===================================================== */

  function handleResize() {

    isMobile =
      window.matchMedia(
        "(max-width: 767px)"
      ).matches;


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
        handleResize,
        250
      );

    }
  );



  /* =====================================================
     PAGE VISIBILITY

     Avoid huge timing jump when returning to tab.
  ===================================================== */

  document.addEventListener(
    "visibilitychange",
    function () {

      if (
        !document.hidden
      ) {

        lastFrameTime =
          performance.now();

      }

    }
  );



  /* =====================================================
     CLEANUP SUPPORT
  ===================================================== */

  return function destroyHero() {

    heroTrigger.kill();


    if (rafId) {

      cancelAnimationFrame(
        rafId
      );

    }


    window.removeEventListener(
      "resize",
      handleResize
    );

  };

}