import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   APE HERO
========================================================= */

export function initHero() {

  const hero =
    document.getElementById("ape-hero");

  if (!hero) return;


  const titleLines =
    Array.from(
      hero.querySelectorAll(
        ".ape-hero__title-line"
      )
    );


  const copyLines =
    Array.from(
      hero.querySelectorAll(
        ".ape-hero__copy-line"
      )
    );


  const actions =
    hero.querySelector(
      ".ape-hero__actions"
    );


  const gallery =
    hero.querySelector(
      ".ape-hero__gallery"
    );


  const deck =
    hero.querySelector(
      ".ape-hero__deck"
    );


  const cards =
    Array.from(
      hero.querySelectorAll(
        ".ape-hero-card"
      )
    );


  const progress =
    hero.querySelector(
      ".ape-hero__progress span"
    );


  if (
    !gallery ||
    !deck ||
    !cards.length
  ) {
    return;
  }


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  const finePointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;


  /* =========================================================
     RESPONSIVE
  ========================================================= */

  function isMobile() {

    return window.innerWidth < 768;

  }


  function isTablet() {

    return (
      window.innerWidth >= 768 &&
      window.innerWidth < 1200
    );

  }


  /* =========================================================
     CAROUSEL STATE
  ========================================================= */

  let activeIndex = 0;

  let carouselAnimating = false;

  let autoplayCall = null;

  let hoverCall = null;

  let hoverDirection = 0;


  /* =========================================================
     DRAG STATE
  ========================================================= */

  let dragging = false;

  let horizontalDrag = false;

  let blockClick = false;

  let startX = 0;

  let startY = 0;

  let currentX = 0;

  let lastX = 0;

  let lastTime = 0;

  let velocityX = 0;

  let capturedPointerId = null;


  /* =========================================================
     TITLE STATE
  ========================================================= */

  const titleChars = [];

  let titleTimeline = null;

  let scrambleTimer = null;


  const glyphs =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&+?";


  /* =========================================================
     RANDOM GLYPH
  ========================================================= */

  function randomGlyph() {

    return glyphs[
      Math.floor(
        Math.random() *
        glyphs.length
      )
    ];

  }


  /* =========================================================
     KINETIC H1
     WORDS NEVER BREAK
  ========================================================= */

  function buildTitleLine(
    line
  ) {

    if (!line) return;


    const originalText =
      line.textContent
        .trim()
        .replace(/\s+/g, " ");


    const words =
      originalText.split(" ");


    line.textContent = "";

    line.style.overflow =
      "visible";


    words.forEach(
      (
        word,
        wordIndex
      ) => {

        const wrapper =
          document.createElement(
            "span"
          );


        wrapper.className =
          "ape-hero__kinetic-word";


        wrapper.style.display =
          "inline-block";


        wrapper.style.whiteSpace =
          "nowrap";


        wrapper.style.verticalAlign =
          "bottom";


        Array.from(word).forEach(
          character => {

            const char =
              document.createElement(
                "span"
              );


            char.className =
              "ape-hero__kinetic-char";


            char.dataset.final =
              character;


            char.textContent =
              character;


            char.style.display =
              "inline-block";


            char.style.position =
              "relative";


            char.style.transformOrigin =
              "50% 50%";


            char.style.willChange =
              "transform, opacity, filter";


            wrapper.appendChild(
              char
            );


            titleChars.push(
              char
            );

          }
        );


        line.appendChild(
          wrapper
        );


        if (
          wordIndex <
          words.length - 1
        ) {

          line.appendChild(
            document.createTextNode(" ")
          );

        }

      }
    );

  }


  titleLines.forEach(
    buildTitleLine
  );


  /* =========================================================
     RESTORE TITLE
  ========================================================= */

  function restoreTitle() {

    titleChars.forEach(
      char => {

        char.textContent =
          char.dataset.final || "";

      }
    );

  }


  /* =========================================================
     SCRAMBLE
  ========================================================= */

  function stopScramble(
    restore = true
  ) {

    if (
      scrambleTimer
    ) {

      window.clearInterval(
        scrambleTimer
      );


      scrambleTimer = null;

    }


    if (restore) {

      restoreTitle();

    }

  }


  function startScramble() {

    stopScramble(false);


    const probability =
      isMobile()
        ? 0.25
        : 0.34;


    const interval =
      isMobile()
        ? 165
        : 140;


    titleChars.forEach(
      char => {

        if (
          Math.random() < 0.45
        ) {

          char.textContent =
            randomGlyph();

        }

      }
    );


    scrambleTimer =
      window.setInterval(
        () => {

          titleChars.forEach(
            char => {

              if (
                Math.random() <
                probability
              ) {

                char.textContent =
                  randomGlyph();

              }

            }
          );

        },
        interval
      );

  }


  /* =========================================================
     H1 LOOP
  ========================================================= */

  function createTitleLoop() {

    if (
      reducedMotion ||
      !titleChars.length
    ) {
      return;
    }


    titleTimeline?.kill();


    stopScramble(true);


    gsap.set(
      titleChars,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)"
      }
    );


    titleTimeline =
      gsap.timeline({
        repeat: -1
      });


    titleTimeline.call(
      startScramble
    );


    titleTimeline.fromTo(
      titleChars,
      {
        x: () =>
          gsap.utils.random(
            isMobile() ? -6 : -10,
            isMobile() ? 6 : 10
          ),

        y: () =>
          gsap.utils.random(
            isMobile() ? -5 : -8,
            isMobile() ? 5 : 8
          ),

        rotation: () =>
          gsap.utils.random(
            isMobile() ? -4 : -7,
            isMobile() ? 4 : 7
          ),

        scale: () =>
          gsap.utils.random(
            0.95,
            1.05
          ),

        opacity: () =>
          gsap.utils.random(
            0.65,
            0.95
          ),

        filter:
          "blur(2px)"
      },
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        filter:
          "blur(0px)",

        duration:
          isMobile()
            ? 2
            : 1.8,

        stagger: {
          each:
            isMobile()
              ? 0.012
              : 0.014,

          from: "random"
        },

        ease:
          "power3.out"
      }
    );


    titleTimeline.call(
      () => {

        stopScramble(true);

      },
      null,
      isMobile()
        ? 1.55
        : 1.4
    );


    titleTimeline.to(
      titleChars,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        filter:
          "blur(0px)",

        duration: 0.45,

        ease:
          "power2.out"
      }
    );


    /*
     * Final H1 remains readable
     * for five seconds.
     */

    titleTimeline.to(
      {},
      {
        duration: 5
      }
    );

  }


  /* =========================================================
     SUPPORT COPY WORDS
  ========================================================= */

  function splitCopyWords(
    element
  ) {

    if (!element) return;


    const text =
      element.textContent
        .trim()
        .replace(/\s+/g, " ");


    const words =
      text.split(" ");


    element.textContent = "";


    words.forEach(
      (
        word,
        index
      ) => {

        const mask =
          document.createElement(
            "span"
          );


        mask.className =
          "ape-hero__word-mask";


        const wordElement =
          document.createElement(
            "span"
          );


        wordElement.className =
          "ape-hero__word";


        wordElement.textContent =
          word;


        mask.appendChild(
          wordElement
        );


        element.appendChild(
          mask
        );


        if (
          index <
          words.length - 1
        ) {

          element.appendChild(
            document.createTextNode(" ")
          );

        }

      }
    );

  }


  copyLines.forEach(
    splitCopyWords
  );


  /* =========================================================
     SUPPORT COPY ANIMATION
  ========================================================= */

  function animateCopy() {

    if (
      reducedMotion ||
      !copyLines.length
    ) {
      return;
    }


    copyLines.forEach(
      line => {

        gsap.set(
          line,
          {
            autoAlpha: 0
          }
        );


        gsap.set(
          line.querySelectorAll(
            ".ape-hero__word"
          ),
          {
            yPercent: 105,
            opacity: 0,
            filter:
              "blur(5px)"
          }
        );

      }
    );


    const timeline =
      gsap.timeline({
        repeat: -1,
        repeatDelay: 0.55
      });


    copyLines.forEach(
      (
        line,
        index
      ) => {

        const words =
          Array.from(
            line.querySelectorAll(
              ".ape-hero__word"
            )
          );


        timeline.set(
          line,
          {
            autoAlpha: 1
          }
        );


        timeline.fromTo(
          words,
          {
            yPercent: 105,
            opacity: 0,
            filter:
              "blur(5px)"
          },
          {
            yPercent: 0,
            opacity: 1,
            filter:
              "blur(0px)",

            duration:
              isMobile()
                ? 0.72
                : 0.62,

            stagger:
              isMobile()
                ? 0.052
                : 0.045,

            ease:
              "power4.out"
          }
        );


        timeline.to(
          {},
          {
            duration:
              isMobile()
                ? 3.6
                : index ===
                  copyLines.length - 1
                    ? 3.5
                    : 3
          }
        );


        timeline.to(
          words,
          {
            yPercent: -105,
            opacity: 0,
            filter:
              "blur(4px)",

            duration: 0.45,

            stagger:
              isMobile()
                ? 0.03
                : 0.023,

            ease:
              "power3.in"
          }
        );


        timeline.set(
          line,
          {
            autoAlpha: 0
          }
        );


        timeline.to(
          {},
          {
            duration:
              isMobile()
                ? 0.8
                : 0.65
          }
        );

      }
    );

  }


  /* =========================================================
     CAROUSEL LAYOUT
  ========================================================= */

  function getLayout() {

    const deckWidth =
      deck
        .getBoundingClientRect()
        .width;


    const cardWidth =
      cards[0]
        ? cards[0]
            .getBoundingClientRect()
            .width
        : 0;


    let sideScale = 0.76;


    if (isMobile()) {

      sideScale = 0.7;

    }

    else if (isTablet()) {

      sideScale = 0.73;

    }


    const edgeGap =
      isMobile()
        ? 10
        : 14;


    const safeShift =
      Math.max(
        0,

        deckWidth / 2
        -
        cardWidth *
        sideScale / 2
        -
        edgeGap
      );


    const preferredShift =
      isMobile()
        ? cardWidth * 0.48
        : isTablet()
          ? cardWidth * 0.55
          : cardWidth * 0.6;


    return {

      cardWidth,

      sideScale,

      sideShift:
        Math.min(
          safeShift,
          preferredShift
        ),

      sideOpacity:
        isMobile()
          ? 0.55
          : 0.6,

      sideRotation:
        isMobile()
          ? 2.5
          : 4,

      sideY:
        isMobile()
          ? 3
          : 8

    };

  }


  /* =========================================================
     INDEX HELPERS
  ========================================================= */

  function wrapIndex(
    index
  ) {

    return (
      (
        index %
        cards.length
      )
      +
      cards.length
    )
    %
    cards.length;

  }


  function previousIndex() {

    return wrapIndex(
      activeIndex - 1
    );

  }


  function nextIndex() {

    return wrapIndex(
      activeIndex + 1
    );

  }


  function nextNextIndex() {

    return wrapIndex(
      activeIndex + 2
    );

  }


  function previousPreviousIndex() {

    return wrapIndex(
      activeIndex - 2
    );

  }


  /* =========================================================
     CARD STATES
  ========================================================= */

  function centerState() {

    return {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      rotationY: 0,
      opacity: 1
    };

  }


  function leftState(
    layout
  ) {

    return {
      x:
        -layout.sideShift,

      y:
        layout.sideY,

      scale:
        layout.sideScale,

      rotation:
        -layout.sideRotation,

      rotationY:
        isMobile()
          ? 0
          : 4,

      opacity:
        layout.sideOpacity
    };

  }


  function rightState(
    layout
  ) {

    return {
      x:
        layout.sideShift,

      y:
        layout.sideY,

      scale:
        layout.sideScale,

      rotation:
        layout.sideRotation,

      rotationY:
        isMobile()
          ? 0
          : -4,

      opacity:
        layout.sideOpacity
    };

  }


  function offLeftState(
    layout
  ) {

    return {
      x:
        -layout.sideShift
        -
        layout.cardWidth * 0.52,

      y:
        layout.sideY + 5,

      scale:
        0.54,

      rotation:
        -layout.sideRotation - 3,

      rotationY:
        isMobile()
          ? 0
          : 5,

      opacity: 0
    };

  }


  function offRightState(
    layout
  ) {

    return {
      x:
        layout.sideShift
        +
        layout.cardWidth * 0.52,

      y:
        layout.sideY + 5,

      scale:
        0.54,

      rotation:
        layout.sideRotation + 3,

      rotationY:
        isMobile()
          ? 0
          : -5,

      opacity: 0
    };

  }


  /* =========================================================
     INTERPOLATE STATE
  ========================================================= */

  function mix(
    from,
    to,
    progressValue
  ) {

    return {

      x:
        gsap.utils.interpolate(
          from.x,
          to.x,
          progressValue
        ),

      y:
        gsap.utils.interpolate(
          from.y,
          to.y,
          progressValue
        ),

      scale:
        gsap.utils.interpolate(
          from.scale,
          to.scale,
          progressValue
        ),

      rotation:
        gsap.utils.interpolate(
          from.rotation,
          to.rotation,
          progressValue
        ),

      rotationY:
        gsap.utils.interpolate(
          from.rotationY,
          to.rotationY,
          progressValue
        ),

      opacity:
        gsap.utils.interpolate(
          from.opacity,
          to.opacity,
          progressValue
        )

    };

  }


  /* =========================================================
     APPLY STATE
  ========================================================= */

  function applyState(
    card,
    state,
    zIndex
  ) {

    gsap.set(
      card,
      {
        xPercent: -50,
        yPercent: -50,

        x:
          state.x,

        y:
          state.y,

        scale:
          state.scale,

        rotation:
          state.rotation,

        rotationY:
          state.rotationY,

        opacity:
          state.opacity,

        zIndex
      }
    );

  }


  /* =========================================================
     PROGRESS
  ========================================================= */

  function updateProgress() {

    if (!progress) return;


    gsap.to(
      progress,
      {
        scaleX:
          (
            activeIndex + 1
          )
          /
          cards.length,

        duration: 0.5,

        ease:
          "power3.out",

        overwrite: true
      }
    );

  }


  /* =========================================================
     BASE STACK
  ========================================================= */

  function setBaseStack(
    immediate = false
  ) {

    const layout =
      getLayout();


    const left =
      previousIndex();


    const center =
      activeIndex;


    const right =
      nextIndex();


    cards.forEach(
      (
        card,
        index
      ) => {

        let state;

        let zIndex;


        if (
          index === center
        ) {

          state =
            centerState();

          zIndex = 30;

        }


        else if (
          index === left
        ) {

          state =
            leftState(
              layout
            );

          zIndex = 15;

        }


        else if (
          index === right
        ) {

          state =
            rightState(
              layout
            );

          zIndex = 15;

        }


        else {

          state = {
            x: 0,
            y: 8,
            scale: 0.56,
            rotation: 0,
            rotationY: 0,
            opacity: 0
          };

          zIndex = 1;

        }


        card.classList.toggle(
          "is-active",
          index === center
        );


        gsap.to(
          card,
          {
            xPercent: -50,
            yPercent: -50,

            ...state,

            zIndex,

            duration:
              immediate
                ? 0
                : 0.72,

            ease:
              "power3.out",

            overwrite:
              true
          }
        );

      }
    );


    updateProgress();

  }


  /* =========================================================
     AUTOPLAY
  ========================================================= */

  function cancelAutoplay() {

    autoplayCall?.kill();

    autoplayCall = null;

  }


  function scheduleAutoplay(
    delay = 4
  ) {

    cancelAutoplay();


    if (
      reducedMotion ||
      dragging ||
      hoverDirection !== 0
    ) {
      return;
    }


    autoplayCall =
      gsap.delayedCall(
        delay,
        () => {

          animateStep(
            1,
            false
          );

        }
      );

  }


  /* =========================================================
     HOVER CONTROL
  ========================================================= */

  function cancelHoverMove() {

    hoverCall?.kill();

    hoverCall = null;

  }


  function scheduleHoverMove(
    delay = 0.7
  ) {

    cancelHoverMove();


    if (
      dragging ||
      hoverDirection === 0
    ) {
      return;
    }


    hoverCall =
      gsap.delayedCall(
        delay,
        () => {

          animateStep(
            hoverDirection,
            false
          );

        }
      );

  }


  /* =========================================================
     LIVE DRAG PREVIEW

     direction:
      1  = next / finger LEFT
     -1  = previous / finger RIGHT
  ========================================================= */

  function renderDrag(
    dx
  ) {

    const layout =
      getLayout();


    const range =
      Math.max(
        layout.cardWidth * 0.72,
        150
      );


    const limited =
      gsap.utils.clamp(
        -range,
        range,
        dx
      );


    /*
     * Clear all cards first.
     * This prevents the wrong incoming
     * card staying visible when the user
     * reverses swipe direction.
     */

    cards.forEach(
      card => {

        gsap.set(
          card,
          {
            opacity: 0,
            zIndex: 1
          }
        );

      }
    );


    /* =====================================================
       FINGER MOVES LEFT → NEXT PROJECT
    ===================================================== */

    if (
      limited < 0
    ) {

      const p =
        Math.min(
          Math.abs(limited) /
          range,
          1
        );


      const oldLeft =
        previousIndex();


      const oldCenter =
        activeIndex;


      const oldRight =
        nextIndex();


      const incoming =
        nextNextIndex();


      applyState(
        cards[oldLeft],

        mix(
          leftState(layout),
          offLeftState(layout),
          p
        ),

        8
      );


      applyState(
        cards[oldCenter],

        mix(
          centerState(),
          leftState(layout),
          p
        ),

        22
      );


      applyState(
        cards[oldRight],

        mix(
          rightState(layout),
          centerState(),
          p
        ),

        30
      );


      applyState(
        cards[incoming],

        mix(
          offRightState(layout),
          rightState(layout),
          p
        ),

        15
      );

    }


    /* =====================================================
       FINGER MOVES RIGHT → PREVIOUS PROJECT
    ===================================================== */

    else if (
      limited > 0
    ) {

      const p =
        Math.min(
          limited /
          range,
          1
        );


      const incoming =
        previousPreviousIndex();


      const oldLeft =
        previousIndex();


      const oldCenter =
        activeIndex;


      const oldRight =
        nextIndex();


      applyState(
        cards[incoming],

        mix(
          offLeftState(layout),
          leftState(layout),
          p
        ),

        15
      );


      applyState(
        cards[oldLeft],

        mix(
          leftState(layout),
          centerState(),
          p
        ),

        30
      );


      applyState(
        cards[oldCenter],

        mix(
          centerState(),
          rightState(layout),
          p
        ),

        22
      );


      applyState(
        cards[oldRight],

        mix(
          rightState(layout),
          offRightState(layout),
          p
        ),

        8
      );

    }


    else {

      setBaseStack(true);

    }

  }


  /* =========================================================
     SINGLE TRANSITION ENGINE

     direction:
       1 = next / move LEFT
      -1 = previous / move RIGHT

     fromDrag:
       true means DON'T reset positions.
       Continue directly from finger position.
  ========================================================= */

  function animateStep(
    direction,
    fromDrag = false
  ) {

    if (
      carouselAnimating
    ) {
      return;
    }


    carouselAnimating = true;


    cancelAutoplay();

    cancelHoverMove();


    const layout =
      getLayout();


    const oldLeft =
      previousIndex();


    const oldCenter =
      activeIndex;


    const oldRight =
      nextIndex();


    const duration =
      fromDrag
        ? 0.48
        : isMobile()
          ? 0.72
          : 0.88;


    const timeline =
      gsap.timeline({

        defaults: {
          duration,
          ease:
            fromDrag
              ? "power3.out"
              : "power4.inOut"
        },


        onComplete: () => {

          activeIndex =
            wrapIndex(
              activeIndex +
              direction
            );


          carouselAnimating =
            false;


          setBaseStack(true);


          if (
            hoverDirection ===
            direction
          ) {

            scheduleHoverMove(
              0.68
            );

          }

          else {

            scheduleAutoplay(4);

          }

        }

      });


    /* =====================================================
       NEXT — MOVE EVERYTHING LEFT
    ===================================================== */

    if (
      direction === 1
    ) {

      const incoming =
        nextNextIndex();


      /*
       * Only prepare incoming position
       * when this is autoplay/hover.
       *
       * During touch drag it is ALREADY
       * in the correct intermediate position.
       */

      if (!fromDrag) {

        applyState(
          cards[incoming],
          offRightState(layout),
          5
        );

      }


      timeline.to(
        cards[oldLeft],
        {
          ...offLeftState(
            layout
          ),

          zIndex: 5
        },
        0
      );


      timeline.to(
        cards[oldCenter],
        {
          ...leftState(
            layout
          ),

          zIndex: 15
        },
        0
      );


      timeline.to(
        cards[oldRight],
        {
          ...centerState(),

          zIndex: 30
        },
        0
      );


      timeline.to(
        cards[incoming],
        {
          ...rightState(
            layout
          ),

          zIndex: 15
        },
        0
      );

    }


    /* =====================================================
       PREVIOUS — MOVE EVERYTHING RIGHT
    ===================================================== */

    else {

      const incoming =
        previousPreviousIndex();


      if (!fromDrag) {

        applyState(
          cards[incoming],
          offLeftState(layout),
          5
        );

      }


      timeline.to(
        cards[oldRight],
        {
          ...offRightState(
            layout
          ),

          zIndex: 5
        },
        0
      );


      timeline.to(
        cards[oldCenter],
        {
          ...rightState(
            layout
          ),

          zIndex: 15
        },
        0
      );


      timeline.to(
        cards[oldLeft],
        {
          ...centerState(),

          zIndex: 30
        },
        0
      );


      timeline.to(
        cards[incoming],
        {
          ...leftState(
            layout
          ),

          zIndex: 15
        },
        0
      );

    }

  }


  /* =========================================================
     POINTER DOWN
  ========================================================= */

  deck.style.touchAction =
    "pan-y";


  deck.style.overscrollBehaviorX =
    "contain";


  deck.addEventListener(
    "dragstart",
    event => {

      event.preventDefault();

    }
  );


  deck.addEventListener(
    "pointerdown",
    event => {

      if (
        carouselAnimating
      ) {
        return;
      }


      cancelAutoplay();

      cancelHoverMove();


      dragging = true;

      horizontalDrag = false;

      blockClick = false;


      startX =
        event.clientX;


      startY =
        event.clientY;


      currentX =
        event.clientX;


      lastX =
        event.clientX;


      lastTime =
        performance.now();


      velocityX = 0;


      capturedPointerId =
        event.pointerId;


      deck.classList.add(
        "is-dragging"
      );


      /*
       * Capture from the beginning so
       * the swipe doesn't get lost when
       * finger moves outside the image.
       */

      try {

        deck.setPointerCapture?.(
          event.pointerId
        );

      }

      catch {
        /* no-op */
      }

    }
  );


  /* =========================================================
     POINTER MOVE
  ========================================================= */

  deck.addEventListener(
    "pointermove",
    event => {

      if (
        !dragging
      ) {
        return;
      }


      const dx =
        event.clientX -
        startX;


      const dy =
        event.clientY -
        startY;


      currentX =
        event.clientX;


      /* =====================================================
         DETERMINE SWIPE DIRECTION
      ===================================================== */

      if (
        !horizontalDrag
      ) {

        if (
          Math.abs(dx) < 6 &&
          Math.abs(dy) < 6
        ) {
          return;
        }


        /*
         * Vertical movement:
         * let the page scroll.
         */

        if (
          Math.abs(dy) >
          Math.abs(dx) * 1.1
        ) {

          dragging = false;


          deck.classList.remove(
            "is-dragging"
          );


          setBaseStack(false);


          try {

            deck.releasePointerCapture?.(
              event.pointerId
            );

          }

          catch {
            /* no-op */
          }


          capturedPointerId = null;


          scheduleAutoplay(3);


          return;

        }


        horizontalDrag = true;

        blockClick = true;

      }


      /*
       * We now know this is a carousel
       * gesture, not vertical scrolling.
       */

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
          now - lastTime,
          1
        );


      velocityX =
        (
          event.clientX -
          lastX
        ) /
        elapsed;


      lastX =
        event.clientX;


      lastTime =
        now;


      /* =====================================================
         LIVE MOVEMENT
      ===================================================== */

      renderDrag(dx);

    },
    {
      passive: false
    }
  );


  /* =========================================================
     END DRAG
  ========================================================= */

  function finishDrag(
    event
  ) {

    if (!dragging) {
      return;
    }


    dragging = false;


    deck.classList.remove(
      "is-dragging"
    );


    const dx =
      currentX -
      startX;


    const distanceThreshold =
      isMobile()
        ? 34
        : 48;


    const velocityThreshold =
      isMobile()
        ? 0.18
        : 0.24;


    const goNext =
      dx <
      -distanceThreshold
      ||
      velocityX <
      -velocityThreshold;


    const goPrevious =
      dx >
      distanceThreshold
      ||
      velocityX >
      velocityThreshold;


    /* =====================================================
       LEFT SWIPE
       Continue FROM CURRENT POSITION.
    ===================================================== */

    if (
      goNext
    ) {

      animateStep(
        1,
        true
      );

    }


    /* =====================================================
       RIGHT SWIPE
       Continue FROM CURRENT POSITION.
    ===================================================== */

    else if (
      goPrevious
    ) {

      animateStep(
        -1,
        true
      );

    }


    /* =====================================================
       SMALL MOVEMENT → SNAP BACK
    ===================================================== */

    else {

      setBaseStack(false);

      scheduleAutoplay(3);

    }


    if (
      capturedPointerId !== null
    ) {

      try {

        deck.releasePointerCapture?.(
          capturedPointerId
        );

      }

      catch {
        /* no-op */
      }

    }


    capturedPointerId = null;

    horizontalDrag = false;

  }


  deck.addEventListener(
    "pointerup",
    finishDrag
  );


  deck.addEventListener(
    "pointercancel",
    () => {

      if (!dragging) {
        return;
      }


      dragging = false;

      horizontalDrag = false;


      deck.classList.remove(
        "is-dragging"
      );


      setBaseStack(false);


      capturedPointerId = null;


      scheduleAutoplay(3);

    }
  );


  /* =========================================================
     PREVENT PROJECT OPEN AFTER SWIPE
  ========================================================= */

  deck.addEventListener(
    "click",
    event => {

      if (!blockClick) {
        return;
      }


      event.preventDefault();

      event.stopPropagation();


      blockClick = false;

    },
    true
  );


  /* =========================================================
     DESKTOP HOVER
  ========================================================= */

  if (
    finePointer
  ) {

    gallery.addEventListener(
      "pointermove",
      event => {

        if (
          dragging ||
          carouselAnimating
        ) {
          return;
        }


        const rect =
          gallery.getBoundingClientRect();


        const position =
          (
            event.clientX -
            rect.left
          ) /
          rect.width;


        /* LEFT */

        if (
          position < 0.33
        ) {

          if (
            hoverDirection !== -1
          ) {

            hoverDirection = -1;


            cancelAutoplay();


            scheduleHoverMove(
              0.22
            );

          }

        }


        /* RIGHT */

        else if (
          position > 0.67
        ) {

          if (
            hoverDirection !== 1
          ) {

            hoverDirection = 1;


            cancelAutoplay();


            scheduleHoverMove(
              0.22
            );

          }

        }


        /* CENTER */

        else {

          if (
            hoverDirection !== 0
          ) {

            hoverDirection = 0;


            cancelHoverMove();


            scheduleAutoplay(3);

          }

        }

      }
    );


    gallery.addEventListener(
      "pointerleave",
      () => {

        hoverDirection = 0;


        cancelHoverMove();


        scheduleAutoplay(3);

      }
    );

  }


  /* =========================================================
     INITIAL STACK
  ========================================================= */

  setBaseStack(true);


  /* =========================================================
     REDUCED MOTION
  ========================================================= */

  if (
    reducedMotion
  ) {

    restoreTitle();


    gsap.set(
      titleChars,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        filter:
          "blur(0px)"
      }
    );


    if (
      copyLines[0]
    ) {

      gsap.set(
        copyLines[0],
        {
          autoAlpha: 1
        }
      );


      gsap.set(
        copyLines[0]
          .querySelectorAll(
            ".ape-hero__word"
          ),
        {
          yPercent: 0,
          opacity: 1,
          filter:
            "blur(0px)"
        }
      );

    }


    return;

  }


  /* =========================================================
     INTRO
  ========================================================= */

  gsap.set(
    gallery,
    {
      opacity: 0,

      y:
        isMobile()
          ? 28
          : 0,

      x:
        isMobile()
          ? 0
          : 25,

      scale: 0.95
    }
  );


  if (
    actions
  ) {

    gsap.set(
      actions,
      {
        opacity: 0,
        y: 18
      }
    );

  }


  createTitleLoop();


  gsap.to(
    gallery,
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,

      duration: 0.95,

      delay: 0.3,

      ease:
        "power4.out"
    }
  );


  if (
    actions
  ) {

    gsap.to(
      actions,
      {
        opacity: 1,
        y: 0,

        duration: 0.65,

        delay: 0.65,

        ease:
          "power3.out"
      }
    );

  }


  gsap.delayedCall(
    0.75,
    animateCopy
  );


  /* =========================================================
     HERO VISIBILITY
  ========================================================= */

  ScrollTrigger.create(
    {
      trigger: hero,

      start:
        "top bottom",

      end:
        "bottom top",


      onEnter: () => {

        titleTimeline?.play();

      },


      onEnterBack: () => {

        titleTimeline?.play();

      },


      onLeave: () => {

        titleTimeline?.pause();


        stopScramble(true);

      },


      onLeaveBack: () => {

        titleTimeline?.pause();


        stopScramble(true);

      }
    }
  );


  /* =========================================================
     AUTOPLAY
  ========================================================= */

  scheduleAutoplay(4);


  /* =========================================================
     RESIZE / ORIENTATION
  ========================================================= */

  let resizeTimer = null;


  window.addEventListener(
    "resize",
    () => {

      window.clearTimeout(
        resizeTimer
      );


      resizeTimer =
        window.setTimeout(
          () => {

            setBaseStack(true);


            ScrollTrigger.refresh();

          },
          120
        );

    },
    {
      passive: true
    }
  );


  /* =========================================================
     TAB VISIBILITY
  ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden
      ) {

        cancelAutoplay();

        cancelHoverMove();


        titleTimeline?.pause();


        stopScramble(true);

      }

      else {

        titleTimeline?.play();


        scheduleAutoplay(2);

      }

    }
  );

}