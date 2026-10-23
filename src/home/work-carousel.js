import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/home-work.css";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   APE — WORK CAROUSEL
========================================================= */

export function initWorkCarousel() {
  const section =
    document.getElementById(
      "home-work"
    );

  if (!section) return;


  const stage =
    section.querySelector(
      ".home-work__stage"
    );


  const heading =
    section.querySelector(
      ".home-work__heading"
    );


  const viewport =
    section.querySelector(
      ".home-work__viewport"
    );


  const track =
    section.querySelector(
      ".home-work__track"
    );


  const cards =
    Array.from(
      section.querySelectorAll(
        ".home-work-card"
      )
    );


  if (
    !stage ||
    !viewport ||
    !track ||
    cards.length < 2
  ) {
    return;
  }


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* =========================================================
     REMOVE OLD WORK SCROLL LOGIC ONLY

     Services / About / Clients remain untouched.
  ========================================================= */

  ScrollTrigger
    .getAll()
    .forEach(
      trigger => {
        const triggerElement =
          trigger.trigger ||
          trigger.vars?.trigger;


        if (
          triggerElement === section
          ||
          (
            triggerElement instanceof Element
            &&
            section.contains(
              triggerElement
            )
          )
        ) {
          trigger.kill(true);
        }
      }
    );


  gsap.killTweensOf(
    [
      track,
      ...cards
    ]
  );


  cards.forEach(
    card => {
      const image =
        card.querySelector(
          "img"
        );

      if (image) {
        gsap.killTweensOf(
          image
        );
      }
    }
  );


  gsap.set(
    track,
    {
      clearProps:
        "transform"
    }
  );


  gsap.set(
    cards,
    {
      clearProps:
        "transform"
    }
  );


  /* =========================================================
     STATE
  ========================================================= */

  let currentX = 0;

  let minX = 0;

  let activeIndex = 0;

  let snapPoints = [];

  let dragTween = null;


  /* =========================================================
     POINTER STATE
  ========================================================= */

  let dragging = false;

  let horizontalDrag = false;

  let blockClick = false;

  let pointerId = null;


  let startPointerX = 0;

  let startPointerY = 0;

  let startTrackX = 0;


  let lastPointerX = 0;

  let lastMoveTime = 0;

  let velocityX = 0;


  /* =========================================================
     PROGRESS BAR
  ========================================================= */

  let progressRoot =
    stage.querySelector(
      ".home-work__drag-progress"
    );


  let progressFill =
    progressRoot
      ?.querySelector(
        "span"
      )
    ||
    null;


  if (
    !progressRoot
  ) {
    progressRoot =
      document.createElement(
        "div"
      );


    progressRoot.className =
      "home-work__drag-progress";


    progressRoot.setAttribute(
      "aria-hidden",
      "true"
    );


    progressFill =
      document.createElement(
        "span"
      );


    progressRoot.appendChild(
      progressFill
    );


    stage.appendChild(
      progressRoot
    );
  }


  /* =========================================================
     HELPERS
  ========================================================= */

  function clampX(
    value
  ) {
    return gsap.utils.clamp(
      minX,
      0,
      value
    );
  }


  /* =========================================================
     MEASURE
  ========================================================= */

  function measure() {
    gsap.set(
      track,
      {
        x: currentX
      }
    );


    const viewportWidth =
      viewport.clientWidth;


    const styles =
      window.getComputedStyle(
        track
      );


    const leftPadding =
      parseFloat(
        styles.paddingLeft
      )
      ||
      0;


    const contentWidth =
      track.scrollWidth;


    minX =
      Math.min(
        0,

        viewportWidth
        -
        contentWidth
      );


    /*
     * Every project becomes a snap position.
     */

    snapPoints =
      cards.map(
        card => {
          const desired =
            -(
              card.offsetLeft
              -
              leftPadding
            );


          return clampX(
            desired
          );
        }
      );


    /*
     * Last card should reach
     * the end cleanly.
     */

    snapPoints[
      snapPoints.length - 1
    ] =
      minX;


    currentX =
      clampX(
        currentX
      );


    gsap.set(
      track,
      {
        x: currentX
      }
    );


    render();
  }


  /* =========================================================
     FIND NEAREST CARD
  ========================================================= */

  function nearestSnapIndex(
    value
  ) {
    let nearest = 0;

    let smallest =
      Infinity;


    snapPoints.forEach(
      (
        point,
        index
      ) => {
        const distance =
          Math.abs(
            value -
            point
          );


        if (
          distance <
          smallest
        ) {
          smallest =
            distance;


          nearest =
            index;
        }
      }
    );


    return nearest;
  }


  /* =========================================================
     CARD DEPTH / BEAUTIFICATION

     Active card:
     - larger
     - brighter
     - straighter

     Side cards:
     - slightly lower
     - slightly rotated
     - slightly dimmer
  ========================================================= */

  function render() {
    const viewportRect =
      viewport
        .getBoundingClientRect();


    const viewportCenter =
      viewportRect.width / 2;


    let nearestIndex = 0;

    let nearestDistance =
      Infinity;


    cards.forEach(
      (
        card,
        index
      ) => {
        const center =
          card.offsetLeft
          +
          currentX
          +
          card.offsetWidth / 2;


        const rawDistance =
          center -
          viewportCenter;


        const normalized =
          rawDistance
          /
          Math.max(
            viewportRect.width,
            1
          );


        const absolute =
          Math.min(
            Math.abs(
              normalized
            ),
            1
          );


        const closeness =
          1 -
          absolute;


        const distance =
          Math.abs(
            rawDistance
          );


        if (
          distance <
          nearestDistance
        ) {
          nearestDistance =
            distance;


          nearestIndex =
            index;
        }


        /* CARD */

        gsap.set(
          card,
          {
            scale:
              0.93
              +
              closeness
              *
              0.07,

            y:
              absolute
              *
              18,

            rotation:
              gsap.utils.clamp(
                -1.6,
                1.6,
                normalized
                *
                -1.6
              ),

            opacity:
              0.72
              +
              closeness
              *
              0.28,

            transformOrigin:
              "50% 55%",

            force3D:
              true
          }
        );


        /* IMAGE */

        const image =
          card.querySelector(
            "img"
          );


        if (image) {
          gsap.set(
            image,
            {
              scale:
                1.035
                +
                closeness
                *
                0.025,

              xPercent:
                gsap.utils.clamp(
                  -2.5,
                  2.5,
                  normalized
                  *
                  -2.5
                ),

              force3D:
                true
            }
          );
        }
      }
    );


    /* =====================================================
       ACTIVE CARD
    ===================================================== */

    if (
      nearestIndex !==
      activeIndex
    ) {
      activeIndex =
        nearestIndex;


      cards.forEach(
        (
          card,
          index
        ) => {
          card.classList.toggle(
            "is-current",
            index ===
              activeIndex
          );
        }
      );
    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    if (
      progressFill
    ) {
      const progress =
        minX === 0
          ?
          0
          :
          gsap.utils.clamp(
            0,
            1,
            currentX /
            minX
          );


      gsap.set(
        progressFill,
        {
          scaleX:
            progress,

          transformOrigin:
            "left center"
        }
      );
    }
  }


  /* =========================================================
     SET POSITION DIRECTLY

     Used during finger/mouse drag:
     true 1:1 movement.
  ========================================================= */

  function setX(
    value
  ) {
    currentX =
      clampX(
        value
      );


    gsap.set(
      track,
      {
        x:
          currentX,

        force3D:
          true
      }
    );


    render();
  }


  /* =========================================================
     SMOOTH SNAP
  ========================================================= */

  function animateTo(
    value,
    velocity = 0
  ) {
    dragTween?.kill();


    const target =
      clampX(
        value
      );


    const distance =
      Math.abs(
        target -
        currentX
      );


    const speedBoost =
      Math.min(
        Math.abs(
          velocity
        )
        *
        0.18,

        0.16
      );


    const duration =
      gsap.utils.clamp(
        0.34,
        0.72,

        distance /
        950
        +
        0.34
        -
        speedBoost
      );


    dragTween =
      gsap.to(
        track,
        {
          x:
            target,

          duration,

          ease:
            "power4.out",

          overwrite:
            true,


          onUpdate() {
            currentX =
              Number(
                gsap.getProperty(
                  track,
                  "x"
                )
              )
              ||
              0;


            render();
          },


          onComplete() {
            currentX =
              target;


            render();


            dragTween =
              null;
          }
        }
      );
  }


  /* =========================================================
     RELEASE MOMENTUM
  ========================================================= */

  function snapFromRelease() {
    /*
     * Project forward using release velocity.
     */

    const projected =
      clampX(
        currentX
        +
        velocityX
        *
        220
      );


    let index =
      nearestSnapIndex(
        projected
      );


    /*
     * Strong flick should definitely
     * advance at least one project.
     */

    if (
      Math.abs(
        velocityX
      ) >
      0.35
    ) {
      if (
        velocityX <
        0
      ) {
        index =
          Math.min(
            cards.length - 1,

            Math.max(
              activeIndex + 1,
              index
            )
          );
      }

      else {
        index =
          Math.max(
            0,

            Math.min(
              activeIndex - 1,
              index
            )
          );
      }
    }


    animateTo(
      snapPoints[
        index
      ],

      velocityX
    );
  }


  /* =========================================================
     POINTER CONFIG
  ========================================================= */

  viewport.style.touchAction =
    "pan-y";


  viewport.style.userSelect =
    "none";


  viewport.style.webkitUserSelect =
    "none";


  viewport.addEventListener(
    "dragstart",
    event => {
      event.preventDefault();
    }
  );


  /* =========================================================
     POINTER DOWN
  ========================================================= */

  viewport.addEventListener(
    "pointerdown",
    event => {
      if (
        event.button !==
          undefined
        &&
        event.button !==
          0
      ) {
        return;
      }


      dragTween?.kill();

      dragTween =
        null;


      dragging =
        true;


      horizontalDrag =
        false;


      blockClick =
        false;


      pointerId =
        event.pointerId;


      startPointerX =
        event.clientX;


      startPointerY =
        event.clientY;


      startTrackX =
        currentX;


      lastPointerX =
        event.clientX;


      lastMoveTime =
        performance.now();


      velocityX =
        0;


      viewport.classList.add(
        "is-dragging"
      );
    }
  );


  /* =========================================================
     POINTER MOVE
  ========================================================= */

  viewport.addEventListener(
    "pointermove",
    event => {
      if (!dragging) {
        return;
      }


      const dx =
        event.clientX -
        startPointerX;


      const dy =
        event.clientY -
        startPointerY;


      /* =====================================================
         DETERMINE INTENT
      ===================================================== */

      if (
        !horizontalDrag
      ) {
        if (
          Math.abs(dx) < 6
          &&
          Math.abs(dy) < 6
        ) {
          return;
        }


        /*
         * Vertical gesture:
         * allow normal page scrolling.
         */

        if (
          Math.abs(dy)
          >
          Math.abs(dx)
          *
          1.12
        ) {
          dragging =
            false;


          viewport.classList.remove(
            "is-dragging"
          );


          pointerId =
            null;


          return;
        }


        horizontalDrag =
          true;


        blockClick =
          true;


        try {
          viewport.setPointerCapture?.(
            event.pointerId
          );
        }

        catch {}
      }


      if (
        event.cancelable
      ) {
        event.preventDefault();
      }


      /* =====================================================
         VELOCITY
      ===================================================== */

      const now =
        performance.now();


      const elapsed =
        Math.max(
          now -
          lastMoveTime,
          1
        );


      velocityX =
        (
          event.clientX -
          lastPointerX
        )
        /
        elapsed;


      lastPointerX =
        event.clientX;


      lastMoveTime =
        now;


      /* =====================================================
         TRUE 1:1 DRAG

         Small resistance only past edges.
      ===================================================== */

      const resistance =
        0.28;


      let nextX =
        startTrackX
        +
        dx;


      if (
        nextX >
        0
      ) {
        nextX *=
          resistance;
      }


      if (
        nextX <
        minX
      ) {
        nextX =
          minX
          +
          (
            nextX -
            minX
          )
          *
          resistance;
      }


      currentX =
        nextX;


      gsap.set(
        track,
        {
          x:
            currentX,

          force3D:
            true
        }
      );


      render();
    },
    {
      passive: false
    }
  );


  /* =========================================================
     RELEASE
  ========================================================= */

  function finishDrag() {
    if (!dragging) {
      return;
    }


    dragging =
      false;


    viewport.classList.remove(
      "is-dragging"
    );


    if (
      horizontalDrag
    ) {
      snapFromRelease();
    }

    else {
      const index =
        nearestSnapIndex(
          currentX
        );


      animateTo(
        snapPoints[
          index
        ]
      );
    }


    if (
      pointerId !==
      null
    ) {
      try {
        viewport.releasePointerCapture?.(
          pointerId
        );
      }

      catch {}
    }


    pointerId =
      null;


    horizontalDrag =
      false;
  }


  viewport.addEventListener(
    "pointerup",
    finishDrag
  );


  viewport.addEventListener(
    "pointercancel",
    () => {
      if (!dragging) {
        return;
      }


      dragging =
        false;


      horizontalDrag =
        false;


      viewport.classList.remove(
        "is-dragging"
      );


      pointerId =
        null;


      const index =
        nearestSnapIndex(
          currentX
        );


      animateTo(
        snapPoints[
          index
        ]
      );
    }
  );


  /* =========================================================
     PREVENT LINK OPEN AFTER DRAG
  ========================================================= */

  viewport.addEventListener(
    "click",
    event => {
      if (
        !blockClick
      ) {
        return;
      }


      event.preventDefault();

      event.stopPropagation();


      blockClick =
        false;
    },
    true
  );


  /* =========================================================
     LAPTOP TRACKPAD HORIZONTAL SWIPE
  ========================================================= */

  let wheelTimer =
    null;


  viewport.addEventListener(
    "wheel",
    event => {
      /*
       * Only intercept actual horizontal
       * trackpad gestures.
       *
       * Normal vertical scrolling remains normal.
       */

      if (
        Math.abs(
          event.deltaX
        )
        <=
        Math.abs(
          event.deltaY
        )
      ) {
        return;
      }


      event.preventDefault();


      dragTween?.kill();


      setX(
        currentX
        -
        event.deltaX
        *
        0.9
      );


      window.clearTimeout(
        wheelTimer
      );


      wheelTimer =
        window.setTimeout(
          () => {
            const index =
              nearestSnapIndex(
                currentX
              );


            animateTo(
              snapPoints[
                index
              ]
            );
          },
          90
        );
    },
    {
      passive: false
    }
  );


  /* =========================================================
     KEYBOARD
  ========================================================= */

  section.addEventListener(
    "keydown",
    event => {
      if (
        event.key !==
          "ArrowLeft"
        &&
        event.key !==
          "ArrowRight"
      ) {
        return;
      }


      event.preventDefault();


      const next =
        event.key ===
        "ArrowRight"
          ?
          Math.min(
            cards.length - 1,
            activeIndex + 1
          )
          :
          Math.max(
            0,
            activeIndex - 1
          );


      animateTo(
        snapPoints[
          next
        ]
      );
    }
  );


  /* =========================================================
     ENTRANCE
  ========================================================= */

  if (
    !reducedMotion
    &&
    heading
  ) {
    gsap.fromTo(
      heading,
      {
        y: 26,

        opacity: 0
      },
      {
        y: 0,

        opacity: 1,

        duration: 0.75,

        ease:
          "power3.out",

        scrollTrigger: {
          trigger:
            section,

          start:
            "top 82%",

          once:
            true
        }
      }
    );
  }


  if (
    !reducedMotion
  ) {
    gsap.fromTo(
      cards,
      {
        y: 50,

        opacity: 0
      },
      {
        y: 0,

        opacity: 1,

        duration: 0.85,

        stagger: 0.06,

        ease:
          "power4.out",

        scrollTrigger: {
          trigger:
            viewport,

          start:
            "top 88%",

          once:
            true,

          onComplete:
            render
        }
      }
    );
  }


  /* =========================================================
     RESIZE
  ========================================================= */

  let resizeTimer =
    null;


  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(
        resizeTimer
      );


      resizeTimer =
        window.setTimeout(
          () => {
            const previousIndex =
              activeIndex;


            measure();


            animateTo(
              snapPoints[
                Math.min(
                  previousIndex,
                  snapPoints.length - 1
                )
              ]
              ||
              0
            );


            ScrollTrigger.refresh();
          },
          140
        );
    },
    {
      passive: true
    }
  );


  /* =========================================================
     INITIALIZE
  ========================================================= */

  cards.forEach(
    (
      card,
      index
    ) => {
      card.classList.toggle(
        "is-current",
        index === 0
      );
    }
  );


  requestAnimationFrame(
    () => {
      measure();

      setX(0);
    }
  );
}