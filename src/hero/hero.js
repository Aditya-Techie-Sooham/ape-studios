import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  const hero = document.getElementById("ape-hero");
  if (!hero) return;

  const titleLines = Array.from(
    hero.querySelectorAll(".ape-hero__title-line")
  );

  const copyLines = Array.from(
    hero.querySelectorAll(".ape-hero__copy-line")
  );

  const actions = hero.querySelector(".ape-hero__actions");
  const gallery = hero.querySelector(".ape-hero__gallery");
  const deck = hero.querySelector(".ape-hero__deck");

  const cards = Array.from(
    hero.querySelectorAll(".ape-hero-card")
  );

  const progress = hero.querySelector(
    ".ape-hero__progress span"
  );

  if (!gallery || !deck || !cards.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  const isMobile = () => window.innerWidth < 768;

  const isTablet = () =>
    window.innerWidth >= 768 &&
    window.innerWidth < 1200;


  /* =========================================================
     CAROUSEL STATE
  ========================================================= */

  let activeIndex = 0;

  let autoplayCall = null;
  let hoverCall = null;
  let hoverDirection = 0;

  let transitionTween = null;
  let transitionRunning = false;


  /* =========================================================
     DRAG STATE
  ========================================================= */

  let dragging = false;
  let horizontalDrag = false;
  let blockClick = false;

  let startX = 0;
  let startY = 0;

  let lastX = 0;
  let lastTime = 0;

  let velocityX = 0;

  let dragDirection = 0;
  let dragProgress = 0;

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
     KINETIC TITLE
  ========================================================= */

  function buildTitleLine(line) {
    if (!line) return;

    const text = line.textContent
      .trim()
      .replace(/\s+/g, " ");

    const words = text.split(" ");

    line.textContent = "";
    line.style.overflow = "visible";


    words.forEach(
      (word, wordIndex) => {
        const wordWrap =
          document.createElement("span");

        wordWrap.className =
          "ape-hero__kinetic-word";

        Object.assign(
          wordWrap.style,
          {
            display:
              "inline-block",

            whiteSpace:
              "nowrap",

            verticalAlign:
              "bottom"
          }
        );


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

            Object.assign(
              char.style,
              {
                display:
                  "inline-block",

                position:
                  "relative",

                transformOrigin:
                  "50% 50%",

                willChange:
                  "transform, opacity, filter"
              }
            );

            wordWrap.appendChild(
              char
            );

            titleChars.push(
              char
            );
          }
        );


        line.appendChild(
          wordWrap
        );


        if (
          wordIndex <
          words.length - 1
        ) {
          line.appendChild(
            document.createTextNode(
              " "
            )
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
    if (scrambleTimer) {
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

    const chance =
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
          Math.random() <
          0.45
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
                chance
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
     TITLE LOOP
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

        filter:
          "blur(0px)"
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
            isMobile()
              ? -6
              : -10,

            isMobile()
              ? 6
              : 10
          ),

        y: () =>
          gsap.utils.random(
            isMobile()
              ? -5
              : -8,

            isMobile()
              ? 5
              : 8
          ),

        rotation: () =>
          gsap.utils.random(
            isMobile()
              ? -4
              : -7,

            isMobile()
              ? 4
              : 7
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

          from:
            "random"
        },

        ease:
          "power3.out"
      }
    );


    titleTimeline.call(
      () =>
        stopScramble(true),
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


    titleTimeline.to(
      {},
      {
        duration: 5
      }
    );
  }


  /* =========================================================
     SUPPORTING COPY
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
      (word, index) => {
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
            document.createTextNode(
              " "
            )
          );
        }
      }
    );
  }


  copyLines.forEach(
    splitCopyWords
  );


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
      (line, index) => {
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


    let sideScale =
      0.76;


    if (isMobile()) {
      sideScale =
        0.7;
    }

    else if (isTablet()) {
      sideScale =
        0.73;
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
        (
          cardWidth *
          sideScale
        )
        /
        2
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

  function wrapIndex(index) {
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


  function indices() {
    return {
      pp:
        wrapIndex(
          activeIndex - 2
        ),

      p:
        wrapIndex(
          activeIndex - 1
        ),

      c:
        activeIndex,

      n:
        wrapIndex(
          activeIndex + 1
        ),

      nn:
        wrapIndex(
          activeIndex + 2
        )
    };
  }


  /* =========================================================
     CAROUSEL STATES
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
        layout.cardWidth *
        0.56,

      y:
        layout.sideY + 4,

      scale: 0.54,

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
        layout.cardWidth *
        0.56,

      y:
        layout.sideY + 4,

      scale: 0.54,

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
     INTERPOLATE STATES
  ========================================================= */

  function mixState(
    from,
    to,
    t
  ) {
    return {
      x:
        gsap.utils.interpolate(
          from.x,
          to.x,
          t
        ),

      y:
        gsap.utils.interpolate(
          from.y,
          to.y,
          t
        ),

      scale:
        gsap.utils.interpolate(
          from.scale,
          to.scale,
          t
        ),

      rotation:
        gsap.utils.interpolate(
          from.rotation,
          to.rotation,
          t
        ),

      rotationY:
        gsap.utils.interpolate(
          from.rotationY,
          to.rotationY,
          t
        ),

      opacity:
        gsap.utils.interpolate(
          from.opacity,
          to.opacity,
          t
        )
    };
  }


  /* =========================================================
     APPLY STATE
  ========================================================= */

  function applyState(
    card,
    state,
    zIndex = 1
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
     PROGRESS BAR
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

        duration: 0.45,

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
    immediate = true
  ) {
    const layout =
      getLayout();


    const {
      p,
      c,
      n
    } =
      indices();


    cards.forEach(
      (
        card,
        index
      ) => {
        let state = {
          x: 0,
          y: 8,

          scale: 0.56,

          rotation: 0,
          rotationY: 0,

          opacity: 0
        };


        let zIndex = 1;


        if (
          index === c
        ) {
          state =
            centerState();

          zIndex = 30;
        }


        else if (
          index === p
        ) {
          state =
            leftState(
              layout
            );

          zIndex = 15;
        }


        else if (
          index === n
        ) {
          state =
            rightState(
              layout
            );

          zIndex = 15;
        }


        card.classList.toggle(
          "is-active",
          index === c
        );


        if (immediate) {
          applyState(
            card,
            state,
            zIndex
          );
        }


        else {
          gsap.to(
            card,
            {
              xPercent: -50,

              yPercent: -50,

              ...state,

              zIndex,

              duration: 0.35,

              ease:
                "power3.out",

              overwrite:
                true
            }
          );
        }
      }
    );


    updateProgress();
  }


  /* =========================================================
     LIVE TRANSITION RENDER

     direction 1  = NEXT
     direction -1 = PREVIOUS
  ========================================================= */

  function renderTransition(
    direction,
    t
  ) {
    const layout =
      getLayout();


    const {
      pp,
      p,
      c,
      n,
      nn
    } =
      indices();


    /*
     * Hide all first.
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
       NEXT
       EVERYTHING MOVES LEFT
    ===================================================== */

    if (
      direction === 1
    ) {
      applyState(
        cards[p],

        mixState(
          leftState(layout),
          offLeftState(layout),
          t
        ),

        8
      );


      applyState(
        cards[c],

        mixState(
          centerState(),
          leftState(layout),
          t
        ),

        t > 0.55
          ? 18
          : 30
      );


      applyState(
        cards[n],

        mixState(
          rightState(layout),
          centerState(),
          t
        ),

        t > 0.45
          ? 30
          : 18
      );


      applyState(
        cards[nn],

        mixState(
          offRightState(layout),
          rightState(layout),
          t
        ),

        15
      );
    }


    /* =====================================================
       PREVIOUS
       EVERYTHING MOVES RIGHT
    ===================================================== */

    else {
      applyState(
        cards[pp],

        mixState(
          offLeftState(layout),
          leftState(layout),
          t
        ),

        15
      );


      applyState(
        cards[p],

        mixState(
          leftState(layout),
          centerState(),
          t
        ),

        t > 0.45
          ? 30
          : 18
      );


      applyState(
        cards[c],

        mixState(
          centerState(),
          rightState(layout),
          t
        ),

        t > 0.55
          ? 18
          : 30
      );


      applyState(
        cards[n],

        mixState(
          rightState(layout),
          offRightState(layout),
          t
        ),

        8
      );
    }
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
        () =>
          animateTransition(
            1,
            0,
            true
          )
      );
  }


  /* =========================================================
     HOVER
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
      hoverDirection === 0 ||
      transitionRunning
    ) {
      return;
    }


    hoverCall =
      gsap.delayedCall(
        delay,
        () =>
          animateTransition(
            hoverDirection,
            0,
            true
          )
      );
  }


  /* =========================================================
     ONE SINGLE TRANSITION ENGINE

     This is the important fix.
  ========================================================= */

  function animateTransition(
    direction,
    fromT = 0,
    commit = true
  ) {
    if (
      transitionRunning
    ) {
      return;
    }


    transitionRunning =
      true;


    cancelAutoplay();

    cancelHoverMove();


    transitionTween?.kill();


    const proxy = {
      t: fromT
    };


    const target =
      commit
        ? 1
        : 0;


    const remaining =
      Math.abs(
        target - fromT
      );


    const duration =
      commit
        ? gsap.utils.clamp(
            0.18,
            0.46,
            remaining * 0.46
          )
        : gsap.utils.clamp(
            0.18,
            0.34,
            remaining * 0.34
          );


    transitionTween =
      gsap.to(
        proxy,
        {
          t:
            target,

          duration,

          ease:
            commit
              ? "power3.out"
              : "power2.out",


          onUpdate: () => {
            renderTransition(
              direction,
              proxy.t
            );
          },


          onComplete: () => {
            if (commit) {
              activeIndex =
                wrapIndex(
                  activeIndex +
                  direction
                );
            }


            transitionRunning =
              false;


            transitionTween =
              null;


            setBaseStack(
              true
            );


            if (
              hoverDirection ===
              direction
            ) {
              scheduleHoverMove(
                0.65
              );
            }


            else {
              scheduleAutoplay(
                4
              );
            }
          }
        }
      );
  }


  /* =========================================================
     TOUCH CONFIG
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


  /* =========================================================
     POINTER DOWN
  ========================================================= */

  deck.addEventListener(
    "pointerdown",
    event => {
      if (
        transitionRunning
      ) {
        return;
      }


      cancelAutoplay();

      cancelHoverMove();

      transitionTween?.kill();


      dragging =
        true;


      horizontalDrag =
        false;


      blockClick =
        false;


      dragDirection =
        0;


      dragProgress =
        0;


      startX =
        event.clientX;


      startY =
        event.clientY;


      lastX =
        event.clientX;


      lastTime =
        performance.now();


      velocityX =
        0;


      capturedPointerId =
        event.pointerId;


      deck.classList.add(
        "is-dragging"
      );


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
      if (!dragging) {
        return;
      }


      const dx =
        event.clientX -
        startX;


      const dy =
        event.clientY -
        startY;


      /* =====================================================
         DETERMINE USER INTENT
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
         * Vertical gesture =
         * normal page scrolling.
         */
        if (
          Math.abs(dy) >
          Math.abs(dx) * 1.1
        ) {
          dragging =
            false;


          deck.classList.remove(
            "is-dragging"
          );


          setBaseStack(
            false
          );


          try {
            deck.releasePointerCapture?.(
              event.pointerId
            );
          }

          catch {
            /* no-op */
          }


          capturedPointerId =
            null;


          scheduleAutoplay(
            3
          );


          return;
        }


        horizontalDrag =
          true;


        blockClick =
          true;
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
          lastTime,
          1
        );


      velocityX =
        (
          event.clientX -
          lastX
        )
        /
        elapsed;


      lastX =
        event.clientX;


      lastTime =
        now;


      /* =====================================================
         CONVERT FINGER DISTANCE → TRANSITION PROGRESS
      ===================================================== */

      const layout =
        getLayout();


      const range =
        Math.max(
          layout.cardWidth *
          0.72,

          150
        );


      dragDirection =
        dx < 0
          ? 1
          : -1;


      dragProgress =
        Math.min(
          Math.abs(dx) /
          range,

          1
        );


      /*
       * Cards now follow finger directly.
       */
      renderTransition(
        dragDirection,
        dragProgress
      );
    },
    {
      passive: false
    }
  );


  /* =========================================================
     FINISH DRAG
  ========================================================= */

  function finishDrag(
    event
  ) {
    if (!dragging) {
      return;
    }


    dragging =
      false;


    deck.classList.remove(
      "is-dragging"
    );


    const dx =
      event.clientX -
      startX;


    const distanceThreshold =
      isMobile()
        ? 30
        : 46;


    const velocityThreshold =
      isMobile()
        ? 0.16
        : 0.22;


    const shouldCommit =
      Math.abs(dx) >=
        distanceThreshold
      ||
      Math.abs(
        velocityX
      ) >=
        velocityThreshold;


    /*
     * KEY FIX:
     * Continue from EXACT current
     * drag progress.
     *
     * No reposition first.
     */
    if (
      horizontalDrag &&
      dragDirection !== 0
    ) {
      animateTransition(
        dragDirection,
        dragProgress,
        shouldCommit
      );
    }


    else {
      setBaseStack(
        false
      );


      scheduleAutoplay(
        3
      );
    }


    if (
      capturedPointerId !==
      null
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


    capturedPointerId =
      null;


    horizontalDrag =
      false;
  }


  deck.addEventListener(
    "pointerup",
    finishDrag
  );


  /* =========================================================
     POINTER CANCEL
  ========================================================= */

  deck.addEventListener(
    "pointercancel",
    () => {
      if (!dragging) {
        return;
      }


      dragging =
        false;


      horizontalDrag =
        false;


      deck.classList.remove(
        "is-dragging"
      );


      if (
        dragDirection !== 0 &&
        dragProgress > 0
      ) {
        animateTransition(
          dragDirection,
          dragProgress,
          false
        );
      }


      else {
        setBaseStack(
          false
        );


        scheduleAutoplay(
          3
        );
      }


      capturedPointerId =
        null;
    }
  );


  /* =========================================================
     PREVENT LINK CLICK AFTER DRAG
  ========================================================= */

  deck.addEventListener(
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
     DESKTOP HOVER
  ========================================================= */

  if (finePointer) {
    gallery.addEventListener(
      "pointermove",
      event => {
        if (
          dragging ||
          transitionRunning
        ) {
          return;
        }


        const rect =
          gallery
            .getBoundingClientRect();


        const position =
          (
            event.clientX -
            rect.left
          )
          /
          rect.width;


        if (
          position <
          0.33
        ) {
          if (
            hoverDirection !==
            -1
          ) {
            hoverDirection =
              -1;


            cancelAutoplay();


            scheduleHoverMove(
              0.22
            );
          }
        }


        else if (
          position >
          0.67
        ) {
          if (
            hoverDirection !==
            1
          ) {
            hoverDirection =
              1;


            cancelAutoplay();


            scheduleHoverMove(
              0.22
            );
          }
        }


        else if (
          hoverDirection !== 0
        ) {
          hoverDirection =
            0;


          cancelHoverMove();


          scheduleAutoplay(
            3
          );
        }
      }
    );


    gallery.addEventListener(
      "pointerleave",
      () => {
        hoverDirection =
          0;


        cancelHoverMove();


        scheduleAutoplay(
          3
        );
      }
    );
  }


  /* =========================================================
     INITIAL STACK
  ========================================================= */

  setBaseStack(
    true
  );


  /* =========================================================
     REDUCED MOTION
  ========================================================= */

  if (reducedMotion) {
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


  if (actions) {
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


  if (actions) {
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

  ScrollTrigger.create({
    trigger: hero,

    start:
      "top bottom",

    end:
      "bottom top",

    onEnter: () =>
      titleTimeline?.play(),

    onEnterBack: () =>
      titleTimeline?.play(),

    onLeave: () => {
      titleTimeline?.pause();

      stopScramble(true);
    },

    onLeaveBack: () => {
      titleTimeline?.pause();

      stopScramble(true);
    }
  });


  /* =========================================================
     AUTOPLAY
  ========================================================= */

  scheduleAutoplay(
    4
  );


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
            transitionTween?.kill();

            transitionRunning =
              false;


            setBaseStack(
              true
            );


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

        scheduleAutoplay(
          2
        );
      }
    }
  );
}