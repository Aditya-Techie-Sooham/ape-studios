import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   APE HERO
   MOBILE-FIRST
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

    return (
      window.innerWidth <
      768
    );

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

  let activeIndex =
    0;


  let carouselAnimating =
    false;


  let autoplayCall =
    null;


  let hoverCall =
    null;


  let hoverDirection =
    0;


  /* =========================================================
     DRAG STATE
  ========================================================= */

  let dragging =
    false;


  let horizontalDrag =
    false;


  let blockClick =
    false;


  let dragDirection =
    0;


  let dragProgress =
    0;


  let startX =
    0;


  let startY =
    0;


  let lastX =
    0;


  let lastTime =
    0;


  let velocityX =
    0;


  let capturedPointerId =
    null;


  /* =========================================================
     TITLE STATE
  ========================================================= */

  const titleChars =
    [];


  let titleTimeline =
    null;


  let scrambleTimer =
    null;


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
     BUILD KINETIC H1
     WORDS NEVER BREAK
  ========================================================= */

  function buildTitleLine(
    line
  ) {

    if (!line) return;


    const originalText =
      line.textContent
        .trim()
        .replace(
          /\s+/g,
          " "
        );


    const words =
      originalText.split(
        " "
      );


    line.textContent =
      "";


    line.style.overflow =
      "visible";


    words.forEach(
      (
        word,
        wordIndex
      ) => {

        const wordWrapper =
          document.createElement(
            "span"
          );


        wordWrapper.className =
          "ape-hero__kinetic-word";


        wordWrapper.style.display =
          "inline-block";


        wordWrapper.style.whiteSpace =
          "nowrap";


        wordWrapper.style.verticalAlign =
          "bottom";


        Array.from(
          word
        ).forEach(
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


            wordWrapper.appendChild(
              char
            );


            titleChars.push(
              char
            );

          }
        );


        line.appendChild(
          wordWrapper
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
     FINAL TITLE
  ========================================================= */

  function restoreTitle() {

    titleChars.forEach(
      char => {

        char.textContent =
          char.dataset.final ||
          "";

      }
    );

  }


  /* =========================================================
     TITLE SCRAMBLE
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


      scrambleTimer =
        null;

    }


    if (restore) {

      restoreTitle();

    }

  }


  function startScramble() {

    stopScramble(
      false
    );


    const chance =
      isMobile()
        ?
        0.25
        :
        0.34;


    const speed =
      isMobile()
        ?
        165
        :
        140;


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
        speed
      );

  }


  /* =========================================================
     CONTINUOUS H1 LOOP
  ========================================================= */

  function createTitleLoop() {

    if (
      reducedMotion ||
      !titleChars.length
    ) {
      return;
    }


    if (
      titleTimeline
    ) {

      titleTimeline.kill();

    }


    stopScramble(
      true
    );


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
      gsap.timeline(
        {
          repeat: -1
        }
      );


    titleTimeline.call(
      startScramble
    );


    titleTimeline.fromTo(
      titleChars,
      {
        x:
          () =>
            gsap.utils.random(
              isMobile()
                ? -6
                : -10,

              isMobile()
                ? 6
                : 10
            ),

        y:
          () =>
            gsap.utils.random(
              isMobile()
                ? -5
                : -8,

              isMobile()
                ? 5
                : 8
            ),

        rotation:
          () =>
            gsap.utils.random(
              isMobile()
                ? -4
                : -7,

              isMobile()
                ? 4
                : 7
            ),

        scale:
          () =>
            gsap.utils.random(
              0.95,
              1.05
            ),

        opacity:
          () =>
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
            ?
            2
            :
            1.8,

        stagger: {
          each:
            isMobile()
              ?
              0.012
              :
              0.014,

          from:
            "random"
        },

        ease:
          "power3.out"
      }
    );


    titleTimeline.call(
      () => {

        stopScramble(
          true
        );

      },
      null,
      isMobile()
        ?
        1.55
        :
        1.4
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
     * Correct final title remains
     * untouched for five seconds.
     */

    titleTimeline.to(
      {},
      {
        duration: 5
      }
    );

  }


  /* =========================================================
     SUPPORT COPY
  ========================================================= */

  function splitCopyWords(
    element
  ) {

    if (!element) return;


    const text =
      element.textContent
        .trim()
        .replace(
          /\s+/g,
          " "
        );


    const words =
      text.split(
        " "
      );


    element.textContent =
      "";


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


  /* =========================================================
     SUPPORT COPY LOOP
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
      gsap.timeline(
        {
          repeat: -1,

          repeatDelay: 0.55
        }
      );


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
                ?
                0.72
                :
                0.62,

            stagger:
              isMobile()
                ?
                0.052
                :
                0.045,

            ease:
              "power4.out"
          }
        );


        timeline.to(
          {},
          {
            duration:
              isMobile()
                ?
                3.6
                :
                index ===
                copyLines.length - 1
                  ?
                  3.5
                  :
                  3
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
                ?
                0.03
                :
                0.023,

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
                ?
                0.8
                :
                0.65
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
        ?
        cards[0]
          .getBoundingClientRect()
          .width
        :
        0;


    let sideScale =
      0.76;


    if (
      isMobile()
    ) {

      sideScale =
        0.7;

    }

    else if (
      isTablet()
    ) {

      sideScale =
        0.73;

    }


    const edgeGap =
      isMobile()
        ?
        10
        :
        14;


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
        ?
        cardWidth * 0.48
        :
        isTablet()
          ?
          cardWidth * 0.55
          :
          cardWidth * 0.6;


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
          ?
          0.55
          :
          0.6,

      sideRotation:
        isMobile()
          ?
          2.5
          :
          4

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

        overwrite:
          true
      }
    );

  }


  /* =========================================================
     BASE CAROUSEL
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


        /* CENTER */

        if (
          index === center
        ) {

          state = {

            xPercent: -50,

            yPercent: -50,

            x: 0,

            y: 0,

            scale: 1,

            rotation: 0,

            rotationY: 0,

            opacity: 1,

            zIndex: 30

          };

        }


        /* LEFT */

        else if (
          index === left
        ) {

          state = {

            xPercent: -50,

            yPercent: -50,

            x:
              -layout.sideShift,

            y:
              isMobile()
                ?
                3
                :
                8,

            scale:
              layout.sideScale,

            rotation:
              -layout.sideRotation,

            rotationY:
              isMobile()
                ?
                0
                :
                4,

            opacity:
              layout.sideOpacity,

            zIndex: 15

          };

        }


        /* RIGHT */

        else if (
          index === right
        ) {

          state = {

            xPercent: -50,

            yPercent: -50,

            x:
              layout.sideShift,

            y:
              isMobile()
                ?
                3
                :
                8,

            scale:
              layout.sideScale,

            rotation:
              layout.sideRotation,

            rotationY:
              isMobile()
                ?
                0
                :
                -4,

            opacity:
              layout.sideOpacity,

            zIndex: 15

          };

        }


        /* HIDDEN */

        else {

          state = {

            xPercent: -50,

            yPercent: -50,

            x: 0,

            y: 8,

            scale: 0.56,

            rotation: 0,

            rotationY: 0,

            opacity: 0,

            zIndex: 1

          };

        }


        card.classList.toggle(
          "is-active",
          index === center
        );


        gsap.to(
          card,
          {
            ...state,

            duration:
              immediate
                ?
                0
                :
                0.75,

            ease:
              "power3.inOut",

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

    if (
      autoplayCall
    ) {

      autoplayCall.kill();

      autoplayCall =
        null;

    }

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
        slideNext
      );

  }


  /* =========================================================
     DESKTOP HOVER TIMER
  ========================================================= */

  function cancelHoverMove() {

    if (
      hoverCall
    ) {

      hoverCall.kill();

      hoverCall =
        null;

    }

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

          if (
            hoverDirection === 1
          ) {

            slideNext();

          }

          else if (
            hoverDirection === -1
          ) {

            slidePrevious();

          }

        }
      );

  }


  /* =========================================================
     SLIDE NEXT
     EVERYTHING MOVES LEFT
  ========================================================= */

  function slideNext() {

    if (
      carouselAnimating
    ) {
      return;
    }


    carouselAnimating =
      true;


    cancelAutoplay();


    const layout =
      getLayout();


    const oldLeft =
      previousIndex();


    const oldCenter =
      activeIndex;


    const oldRight =
      nextIndex();


    const incoming =
      nextNextIndex();


    gsap.set(
      cards[incoming],
      {
        xPercent: -50,

        yPercent: -50,

        x:
          layout.sideShift
          +
          layout.cardWidth *
          0.45,

        y: 8,

        scale: 0.54,

        rotation:
          layout.sideRotation +
          2,

        opacity: 0,

        zIndex: 5
      }
    );


    const timeline =
      gsap.timeline(
        {

          defaults: {

            duration:
              isMobile()
                ?
                0.72
                :
                0.88,

            ease:
              "power4.inOut"

          },


          onComplete: () => {

            activeIndex =
              wrapIndex(
                activeIndex + 1
              );


            carouselAnimating =
              false;


            setBaseStack(
              true
            );


            if (
              hoverDirection === 1
            ) {

              scheduleHoverMove(
                0.7
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


    /* LEFT EXITS */

    timeline.to(
      cards[oldLeft],
      {
        x:
          -layout.sideShift
          -
          layout.cardWidth *
          0.45,

        scale: 0.54,

        rotation:
          -layout.sideRotation -
          2,

        opacity: 0
      },
      0
    );


    /* CENTER → LEFT */

    timeline.to(
      cards[oldCenter],
      {
        x:
          -layout.sideShift,

        y:
          isMobile()
            ?
            3
            :
            8,

        scale:
          layout.sideScale,

        rotation:
          -layout.sideRotation,

        opacity:
          layout.sideOpacity,

        zIndex: 15
      },
      0
    );


    /* RIGHT → CENTER */

    timeline.to(
      cards[oldRight],
      {
        x: 0,

        y: 0,

        scale: 1,

        rotation: 0,

        rotationY: 0,

        opacity: 1,

        zIndex: 30
      },
      0
    );


    /* NEW ENTERS RIGHT */

    timeline.to(
      cards[incoming],
      {
        x:
          layout.sideShift,

        y:
          isMobile()
            ?
            3
            :
            8,

        scale:
          layout.sideScale,

        rotation:
          layout.sideRotation,

        opacity:
          layout.sideOpacity,

        zIndex: 15
      },
      0
    );

  }


  /* =========================================================
     SLIDE PREVIOUS
     EVERYTHING MOVES RIGHT
  ========================================================= */

  function slidePrevious() {

    if (
      carouselAnimating
    ) {
      return;
    }


    carouselAnimating =
      true;


    cancelAutoplay();


    const layout =
      getLayout();


    const oldLeft =
      previousIndex();


    const oldCenter =
      activeIndex;


    const oldRight =
      nextIndex();


    const incoming =
      previousPreviousIndex();


    gsap.set(
      cards[incoming],
      {
        xPercent: -50,

        yPercent: -50,

        x:
          -layout.sideShift
          -
          layout.cardWidth *
          0.45,

        y: 8,

        scale: 0.54,

        rotation:
          -layout.sideRotation -
          2,

        opacity: 0,

        zIndex: 5
      }
    );


    const timeline =
      gsap.timeline(
        {

          defaults: {

            duration:
              isMobile()
                ?
                0.72
                :
                0.88,

            ease:
              "power4.inOut"

          },


          onComplete: () => {

            activeIndex =
              wrapIndex(
                activeIndex - 1
              );


            carouselAnimating =
              false;


            setBaseStack(
              true
            );


            if (
              hoverDirection === -1
            ) {

              scheduleHoverMove(
                0.7
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


    /* RIGHT EXITS */

    timeline.to(
      cards[oldRight],
      {
        x:
          layout.sideShift
          +
          layout.cardWidth *
          0.45,

        scale: 0.54,

        rotation:
          layout.sideRotation +
          2,

        opacity: 0
      },
      0
    );


    /* CENTER → RIGHT */

    timeline.to(
      cards[oldCenter],
      {
        x:
          layout.sideShift,

        y:
          isMobile()
            ?
            3
            :
            8,

        scale:
          layout.sideScale,

        rotation:
          layout.sideRotation,

        opacity:
          layout.sideOpacity,

        zIndex: 15
      },
      0
    );


    /* LEFT → CENTER */

    timeline.to(
      cards[oldLeft],
      {
        x: 0,

        y: 0,

        scale: 1,

        rotation: 0,

        rotationY: 0,

        opacity: 1,

        zIndex: 30
      },
      0
    );


    /* NEW ENTERS LEFT */

    timeline.to(
      cards[incoming],
      {
        x:
          -layout.sideShift,

        y:
          isMobile()
            ?
            3
            :
            8,

        scale:
          layout.sideScale,

        rotation:
          -layout.sideRotation,

        opacity:
          layout.sideOpacity,

        zIndex: 15
      },
      0
    );

  }


  /* =========================================================
     LIVE MOBILE DRAG
     THIS MAKES THE CAROUSEL FOLLOW YOUR FINGER
  ========================================================= */

  function previewDrag(
    distance
  ) {

    const layout =
      getLayout();


    /*
     * How far the finger has travelled
     * relative to the card.
     */

    const dragRange =
      Math.max(
        layout.cardWidth *
        0.72,

        150
      );


    const limited =
      gsap.utils.clamp(
        -dragRange,

        dragRange,

        distance
      );


    /*
     * -1 = finger moving LEFT
     *  1 = finger moving RIGHT
     */

    const direction =
      limited < 0
        ?
        -1
        :
        limited > 0
          ?
          1
          :
          0;


    dragDirection =
      direction;


    dragProgress =
      Math.min(
        Math.abs(
          limited
        )
        /
        dragRange,

        1
      );


    const p =
      dragProgress;


    const left =
      previousIndex();


    const center =
      activeIndex;


    const right =
      nextIndex();


    /* =====================================================
       SWIPE LEFT
       NEXT IMAGE ENTERS FROM RIGHT
    ===================================================== */

    if (
      direction === -1
    ) {

      const incoming =
        nextNextIndex();


      /*
       * Incoming next card becomes visible
       * while the finger is still moving.
       */

      gsap.set(
        cards[incoming],
        {
          xPercent: -50,

          yPercent: -50,

          x:
            gsap.utils.interpolate(
              layout.sideShift
              +
              layout.cardWidth *
              0.5,

              layout.sideShift,

              p
            ),

          y:
            gsap.utils.interpolate(
              8,
              3,
              p
            ),

          scale:
            gsap.utils.interpolate(
              0.54,
              layout.sideScale,
              p
            ),

          rotation:
            gsap.utils.interpolate(
              layout.sideRotation + 3,

              layout.sideRotation,

              p
            ),

          opacity:
            gsap.utils.interpolate(
              0,

              layout.sideOpacity,

              p
            ),

          zIndex: 10
        }
      );


      /*
       * Previous left exits left.
       */

      gsap.set(
        cards[left],
        {
          x:
            gsap.utils.interpolate(
              -layout.sideShift,

              -layout.sideShift
              -
              layout.cardWidth *
              0.5,

              p
            ),

          scale:
            gsap.utils.interpolate(
              layout.sideScale,

              0.54,

              p
            ),

          opacity:
            gsap.utils.interpolate(
              layout.sideOpacity,

              0,

              p
            )
        }
      );


      /*
       * Center moves to left.
       */

      gsap.set(
        cards[center],
        {
          x:
            gsap.utils.interpolate(
              0,

              -layout.sideShift,

              p
            ),

          y:
            gsap.utils.interpolate(
              0,

              3,

              p
            ),

          scale:
            gsap.utils.interpolate(
              1,

              layout.sideScale,

              p
            ),

          rotation:
            gsap.utils.interpolate(
              0,

              -layout.sideRotation,

              p
            ),

          opacity:
            gsap.utils.interpolate(
              1,

              layout.sideOpacity,

              p
            )
        }
      );


      /*
       * Current right becomes center.
       */

      gsap.set(
        cards[right],
        {
          x:
            gsap.utils.interpolate(
              layout.sideShift,

              0,

              p
            ),

          y:
            gsap.utils.interpolate(
              3,

              0,

              p
            ),

          scale:
            gsap.utils.interpolate(
              layout.sideScale,

              1,

              p
            ),

          rotation:
            gsap.utils.interpolate(
              layout.sideRotation,

              0,

              p
            ),

          opacity:
            gsap.utils.interpolate(
              layout.sideOpacity,

              1,

              p
            ),

          zIndex: 30
        }
      );

    }


    /* =====================================================
       SWIPE RIGHT
       PREVIOUS IMAGE ENTERS FROM LEFT
    ===================================================== */

    else if (
      direction === 1
    ) {

      const incoming =
        previousPreviousIndex();


      /*
       * New previous card enters left.
       */

      gsap.set(
        cards[incoming],
        {
          xPercent: -50,

          yPercent: -50,

          x:
            gsap.utils.interpolate(
              -layout.sideShift
              -
              layout.cardWidth *
              0.5,

              -layout.sideShift,

              p
            ),

          y:
            gsap.utils.interpolate(
              8,
              3,
              p
            ),

          scale:
            gsap.utils.interpolate(
              0.54,

              layout.sideScale,

              p
            ),

          rotation:
            gsap.utils.interpolate(
              -layout.sideRotation - 3,

              -layout.sideRotation,

              p
            ),

          opacity:
            gsap.utils.interpolate(
              0,

              layout.sideOpacity,

              p
            ),

          zIndex: 10
        }
      );


      /*
       * Current right exits right.
       */

      gsap.set(
        cards[right],
        {
          x:
            gsap.utils.interpolate(
              layout.sideShift,

              layout.sideShift
              +
              layout.cardWidth *
              0.5,

              p
            ),

          scale:
            gsap.utils.interpolate(
              layout.sideScale,

              0.54,

              p
            ),

          opacity:
            gsap.utils.interpolate(
              layout.sideOpacity,

              0,

              p
            )
        }
      );


      /*
       * Center moves right.
       */

      gsap.set(
        cards[center],
        {
          x:
            gsap.utils.interpolate(
              0,

              layout.sideShift,

              p
            ),

          y:
            gsap.utils.interpolate(
              0,

              3,

              p
            ),

          scale:
            gsap.utils.interpolate(
              1,

              layout.sideScale,

              p
            ),

          rotation:
            gsap.utils.interpolate(
              0,

              layout.sideRotation,

              p
            ),

          opacity:
            gsap.utils.interpolate(
              1,

              layout.sideOpacity,

              p
            )
        }
      );


      /*
       * Current left becomes center.
       */

      gsap.set(
        cards[left],
        {
          x:
            gsap.utils.interpolate(
              -layout.sideShift,

              0,

              p
            ),

          y:
            gsap.utils.interpolate(
              3,

              0,

              p
            ),

          scale:
            gsap.utils.interpolate(
              layout.sideScale,

              1,

              p
            ),

          rotation:
            gsap.utils.interpolate(
              -layout.sideRotation,

              0,

              p
            ),

          opacity:
            gsap.utils.interpolate(
              layout.sideOpacity,

              1,

              p
            ),

          zIndex: 30
        }
      );

    }

  }


  /* =========================================================
     COMPLETE SWIPE
     CONTINUES FROM CURRENT FINGER POSITION
  ========================================================= */

  function completeSwipe(
    direction
  ) {

    /*
     * Finger moved left.
     */

    if (
      direction === -1
    ) {

      slideNext();

    }


    /*
     * Finger moved right.
     */

    else if (
      direction === 1
    ) {

      slidePrevious();

    }

  }


  /* =========================================================
     POINTER / TOUCH START
  ========================================================= */

  deck.style.touchAction =
    "pan-y";


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

    }
  );


  /* =========================================================
     POINTER / TOUCH MOVE
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


      /* =====================================================
         DETERMINE USER INTENT
      ===================================================== */

      if (
        !horizontalDrag
      ) {

        if (
          Math.abs(dx) < 7
          &&
          Math.abs(dy) < 7
        ) {

          return;

        }


        /*
         * Vertical movement means:
         * user wants to scroll page.
         */

        if (
          Math.abs(dy)
          >
          Math.abs(dx)
        ) {

          dragging =
            false;


          deck.classList.remove(
            "is-dragging"
          );


          setBaseStack(
            false
          );


          scheduleAutoplay(
            3
          );


          return;

        }


        /*
         * Now we KNOW it's a horizontal swipe.
         */

        horizontalDrag =
          true;


        blockClick =
          true;


        try {

          deck.setPointerCapture?.(
            event.pointerId
          );


          capturedPointerId =
            event.pointerId;

        }

        catch {
          /* no-op */
        }

      }


      /*
       * Prevent browser from interpreting
       * the horizontal gesture as something else.
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
         LIVE CAROUSEL MOVEMENT
      ===================================================== */

      previewDrag(
        dx
      );

    },
    {
      passive: false
    }
  );


  /* =========================================================
     END SWIPE
  ========================================================= */

  function finishDrag(
    event
  ) {

    if (
      !dragging
    ) {
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


    /*
     * Mobile needs less movement
     * to commit the slide.
     */

    const distanceThreshold =
      isMobile()
        ?
        28
        :
        46;


    const velocityThreshold =
      isMobile()
        ?
        0.16
        :
        0.22;


    const strongLeft =
      dx <
      -distanceThreshold
      ||
      velocityX <
      -velocityThreshold;


    const strongRight =
      dx >
      distanceThreshold
      ||
      velocityX >
      velocityThreshold;


    /* =====================================================
       COMMIT LEFT SWIPE
    ===================================================== */

    if (
      strongLeft
    ) {

      completeSwipe(
        -1
      );

    }


    /* =====================================================
       COMMIT RIGHT SWIPE
    ===================================================== */

    else if (
      strongRight
    ) {

      completeSwipe(
        1
      );

    }


    /* =====================================================
       NOT ENOUGH MOVEMENT → SNAP BACK
    ===================================================== */

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


    dragDirection =
      0;


    dragProgress =
      0;

  }


  deck.addEventListener(
    "pointerup",
    finishDrag
  );


  deck.addEventListener(
    "pointercancel",
    event => {

      if (
        !dragging
      ) {
        return;
      }


      dragging =
        false;


      horizontalDrag =
        false;


      deck.classList.remove(
        "is-dragging"
      );


      setBaseStack(
        false
      );


      scheduleAutoplay(
        3
      );


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

    }
  );


  /* =========================================================
     PREVENT LINK OPEN AFTER SWIPE
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

  if (
    finePointer
  ) {

    gallery.addEventListener(
      "pointermove",
      event => {

        if (
          dragging
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


        /* LEFT THIRD */

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


        /* RIGHT THIRD */

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


        /* CENTER */

        else {

          if (
            hoverDirection !==
            0
          ) {

            hoverDirection =
              0;


            cancelHoverMove();


            scheduleAutoplay(
              3
            );

          }

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
     INITIAL CAROUSEL
  ========================================================= */

  setBaseStack(
    true
  );


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
     HERO INTRO
  ========================================================= */

  gsap.set(
    gallery,
    {
      opacity: 0,

      y:
        isMobile()
          ?
          28
          :
          0,

      x:
        isMobile()
          ?
          0
          :
          25,

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


  /* =========================================================
     TITLE LOOP
  ========================================================= */

  createTitleLoop();


  /* =========================================================
     GALLERY INTRO
  ========================================================= */

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


  /* =========================================================
     CTAs
  ========================================================= */

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


  /* =========================================================
     SUPPORTING COPY
  ========================================================= */

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


        stopScramble(
          true
        );

      },


      onLeaveBack: () => {

        titleTimeline?.pause();


        stopScramble(
          true
        );

      }

    }
  );


  /* =========================================================
     AUTOPLAY
  ========================================================= */

  scheduleAutoplay(
    4
  );


  /* =========================================================
     RESIZE / ORIENTATION CHANGE
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


        stopScramble(
          true
        );

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