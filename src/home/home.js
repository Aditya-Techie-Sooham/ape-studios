import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/home-who.css";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   HOME
========================================================= */

export function initHome() {
  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  initFooterYear();

  if (reduceMotion) {
    showHomeContent();
    return;
  }

  initWho();
  initAbout();
  initWork();
  initClients();
  initRecognition();

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}


/* =========================================================
   REDUCED MOTION
========================================================= */

function showHomeContent() {
  gsap.set(
    [
      ".home-who__content",
      ".home-who__visual",
      ".home-about__heading",
      ".home-about__content",
      ".home-work-new__header",
      ".home-work-new__project",
      ".home-clients__heading",
      ".home-client-logo",
      ".home-recognition__visual",
      ".home-recognition__content"
    ],
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1
    }
  );
}


/* =========================================================
   WHO / ABOUT APE
========================================================= */

function initWho() {
  const section =
    document.getElementById("home-who");

  if (!section) return;


  const heading =
    section.querySelector(
      ".home-who__content h2"
    ) ||
    section.querySelector(
      ".home-who__title"
    );


  const description =
    section.querySelector(
      ".home-who__description"
    ) ||
    section.querySelector(
      ".home-who__body p"
    );


  const actions =
    section.querySelector(
      ".home-who__actions"
    ) ||
    section.querySelector(
      ".home-who__button"
    ) ||
    section.querySelector(
      ".home-action"
    );


  const visual =
    section.querySelector(
      ".home-who__visual"
    );


  const imageFrame =
    section.querySelector(
      ".home-who__image"
    );


  const image =
    imageFrame?.querySelector("img");


  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  const finePointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;


  const isMobile =
    () =>
      window.innerWidth < 768;


  /* =========================================================
     REMOVE OLD RECTANGLE / BALL / SHAPES
  ========================================================= */

  section
    .querySelectorAll(
      [
        ".home-who__rear",
        ".home-who__disc",
        ".home-who__visual-back"
      ].join(",")
    )
    .forEach(element => {
      element.remove();
    });


  /* =========================================================
     HEADING SETUP
  ========================================================= */

  const headingChars =
    prepareWhoHeading(
      heading
    );


  /* =========================================================
     DESCRIPTION SETUP
  ========================================================= */

  const descriptionWords =
    prepareWhoDescription(
      description
    );


  if (reduceMotion) {
    restoreWhoHeading(
      headingChars
    );

    gsap.set(
      headingChars,
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

    gsap.set(
      descriptionWords,
      {
        yPercent: 0,
        opacity: 1,
        filter:
          "blur(0px)"
      }
    );

    return;
  }


  /* =========================================================
     HEADING SCRAMBLE
  ========================================================= */

  let headingTimeline =
    null;

  let scrambleTimer =
    null;


  const glyphPool =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&+?";


  function randomGlyph() {
    return glyphPool[
      Math.floor(
        Math.random() *
        glyphPool.length
      )
    ];
  }


  function stopHeadingScramble(
    restore = true
  ) {
    if (scrambleTimer) {
      window.clearInterval(
        scrambleTimer
      );

      scrambleTimer =
        null;
    }

    if (restore) {
      restoreWhoHeading(
        headingChars
      );
    }
  }


  function startHeadingScramble() {
    stopHeadingScramble(false);

    const probability =
      isMobile()
        ? 0.21
        : 0.28;

    const speed =
      isMobile()
        ? 175
        : 150;


    headingChars.forEach(
      char => {
        if (
          Math.random() < 0.36
        ) {
          char.textContent =
            randomGlyph();
        }
      }
    );


    scrambleTimer =
      window.setInterval(
        () => {
          headingChars.forEach(
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
        speed
      );
  }


  function createHeadingLoop() {
    if (!headingChars.length) {
      return null;
    }

    stopHeadingScramble(true);


    gsap.set(
      headingChars,
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


    const timeline =
      gsap.timeline({
        paused: true,
        repeat: -1
      });


    timeline.call(
      startHeadingScramble
    );


    timeline.fromTo(
      headingChars,
      {
        x: () =>
          gsap.utils.random(
            isMobile()
              ? -5
              : -9,

            isMobile()
              ? 5
              : 9
          ),

        y: () =>
          gsap.utils.random(
            isMobile()
              ? -4
              : -7,

            isMobile()
              ? 4
              : 7
          ),

        rotation: () =>
          gsap.utils.random(
            isMobile()
              ? -3
              : -6,

            isMobile()
              ? 3
              : 6
          ),

        scale: () =>
          gsap.utils.random(
            0.96,
            1.045
          ),

        opacity: () =>
          gsap.utils.random(
            0.7,
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
            : 1.85,

        stagger: {
          each:
            isMobile()
              ? 0.011
              : 0.013,

          from: "random"
        },

        ease:
          "power3.out"
      }
    );


    timeline.call(
      () => {
        stopHeadingScramble(
          true
        );
      },
      null,
      isMobile()
        ? 1.52
        : 1.42
    );


    timeline.to(
      headingChars,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        filter:
          "blur(0px)",

        duration: 0.42,

        ease:
          "power2.out"
      }
    );


    /*
     * CLEAN READING TIME
     */
    timeline.to(
      {},
      {
        duration: 5
      }
    );


    return timeline;
  }


  headingTimeline =
    createHeadingLoop();


  /* =========================================================
     DESCRIPTION LOOP
  ========================================================= */

  const descriptionTimeline =
    createDescriptionLoop(
      descriptionWords,
      isMobile
    );


  /* =========================================================
     IMAGE INTRO
  ========================================================= */

  if (visual) {
    gsap.fromTo(
      visual,
      {
        y:
          isMobile()
            ? 30
            : 42,

        opacity: 0,

        scale: 0.94
      },
      {
        y: 0,

        opacity: 1,

        scale: 1,

        duration: 1,

        ease:
          "power4.out",

        scrollTrigger: {
          trigger:
            visual,

          start:
            "top 87%",

          once: true
        }
      }
    );
  }


  /* =========================================================
     TRUE 360° IMAGE SYSTEM
  ========================================================= */

  const image360 =
    setupWhoImage360({
      section,
      visual,
      imageFrame,
      image,
      finePointer,
      isMobile
    });


  /* =========================================================
     SECTION VISIBILITY
  ========================================================= */

  ScrollTrigger.create({
    trigger:
      section,

    start:
      "top 82%",

    end:
      "bottom 10%",


    onEnter: () => {
      headingTimeline?.restart();

      descriptionTimeline?.restart();


      /*
       * SHOW THE 360 EFFECT
       * AS SOON AS SECTION ENTERS.
       */
      gsap.delayedCall(
        0.55,
        () => {
          image360?.spin(
            1,
            1.65
          );
        }
      );
    },


    onEnterBack: () => {
      headingTimeline?.play();

      descriptionTimeline?.play();


      image360?.spin(
        -1,
        1.55
      );
    },


    onLeave: () => {
      headingTimeline?.pause();

      descriptionTimeline?.pause();

      stopHeadingScramble(
        true
      );
    },


    onLeaveBack: () => {
      headingTimeline?.pause();

      descriptionTimeline?.pause();

      stopHeadingScramble(
        true
      );
    }
  });


  /* =========================================================
     CTA
  ========================================================= */

  if (actions) {
    gsap.fromTo(
      actions,
      {
        y: 18,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,

        duration: 0.7,

        ease:
          "power3.out",

        scrollTrigger: {
          trigger:
            section,

          start:
            "top 74%",

          once: true
        }
      }
    );
  }
}


/* =========================================================
   TRUE 360° PICTURE INTERACTION
========================================================= */

function setupWhoImage360({
  section,
  visual,
  imageFrame,
  image,
  finePointer,
  isMobile
}) {
  if (
    !section ||
    !visual ||
    !imageFrame ||
    !image
  ) {
    return null;
  }


  /* =========================================================
     CREATE FRONT + BACK FACES
  ========================================================= */

  image.classList.add(
    "home-who__image-front"
  );


  let backImage =
    imageFrame.querySelector(
      ".home-who__image-back"
    );


  if (!backImage) {
    backImage =
      image.cloneNode(true);

    backImage.removeAttribute(
      "id"
    );

    backImage.classList.remove(
      "home-who__image-front"
    );

    backImage.classList.add(
      "home-who__image-back"
    );

    backImage.alt = "";

    backImage.setAttribute(
      "aria-hidden",
      "true"
    );

    imageFrame.appendChild(
      backImage
    );
  }


  imageFrame.classList.add(
    "is-360-ready"
  );


  /* =========================================================
     INITIAL 3D STATE
  ========================================================= */

  gsap.set(
    imageFrame,
    {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,

      transformPerspective:
        1400,

      transformStyle:
        "preserve-3d",

      transformOrigin:
        "50% 50%",

      force3D: true
    }
  );


  gsap.set(
    image,
    {
      rotationY: 0,

      backfaceVisibility:
        "hidden",

      transformStyle:
        "preserve-3d",

      scale: 1.04
    }
  );


  gsap.set(
    backImage,
    {
      rotationY: 180,

      backfaceVisibility:
        "hidden",

      transformStyle:
        "preserve-3d",

      scale: 1.04
    }
  );


  /* =========================================================
     STATE
  ========================================================= */

  let tracking =
    false;

  let horizontalDrag =
    false;

  let startX =
    0;

  let startY =
    0;

  let startRotation =
    0;

  let currentRotation =
    0;

  let lastX =
    0;

  let lastTime =
    0;

  let velocityX =
    0;

  let pointerId =
    null;

  let spinTween =
    null;

  let lastHoverSpin =
    0;


  /* =========================================================
     HELPERS
  ========================================================= */

  function getRotation() {
    const value =
      Number(
        gsap.getProperty(
          imageFrame,
          "rotationY"
        )
      );

    return Number.isFinite(value)
      ? value
      : 0;
  }


  function nearestFullTurn(
    value
  ) {
    return (
      Math.round(
        value / 360
      ) * 360
    );
  }


  /* =========================================================
     360 SPIN
  ========================================================= */

  function spin(
    direction = 1,
    duration = 1.55
  ) {
    if (tracking) {
      return;
    }


    spinTween?.kill();


    const current =
      getRotation();


    const cleanBase =
      nearestFullTurn(
        current
      );


    const target =
      cleanBase +
      (
        direction >= 0
          ? 360
          : -360
      );


    currentRotation =
      target;


    spinTween =
      gsap.to(
        imageFrame,
        {
          rotationY:
            target,

          rotationX: 0,

          rotationZ: 0,

          z: 0,

          duration,

          ease:
            "power4.inOut",

          overwrite:
            true,

          onComplete: () => {
            spinTween =
              null;
          }
        }
      );
  }


  /* =========================================================
     IMAGE PARALLAX
  ========================================================= */

  gsap.to(
    [
      image,
      backImage
    ],
    {
      yPercent: -4,

      ease:
        "none",

      scrollTrigger: {
        trigger:
          section,

        start:
          "top bottom",

        end:
          "bottom top",

        scrub:
          0.8
      }
    }
  );


  /* =========================================================
     TOUCH BEHAVIOUR
  ========================================================= */

  visual.style.touchAction =
    "pan-y";


  visual.style.userSelect =
    "none";


  visual.style.webkitUserSelect =
    "none";


  visual.addEventListener(
    "dragstart",
    event => {
      event.preventDefault();
    }
  );


  /* =========================================================
     POINTER DOWN
  ========================================================= */

  visual.addEventListener(
    "pointerdown",
    event => {
      if (
        event.button !== undefined &&
        event.button !== 0
      ) {
        return;
      }


      spinTween?.kill();

      spinTween =
        null;


      tracking =
        true;


      horizontalDrag =
        false;


      pointerId =
        event.pointerId;


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


      startRotation =
        getRotation();


      currentRotation =
        startRotation;
    }
  );


  /* =========================================================
     POINTER MOVE
  ========================================================= */

  visual.addEventListener(
    "pointermove",
    event => {
      /*
       * NORMAL DESKTOP HOVER DEPTH
       */
      if (
        !tracking &&
        finePointer
      ) {
        const rect =
          visual.getBoundingClientRect();


        const nx =
          (
            event.clientX -
            rect.left
          ) /
          rect.width -
          0.5;


        const ny =
          (
            event.clientY -
            rect.top
          ) /
          rect.height -
          0.5;


        gsap.to(
          imageFrame,
          {
            rotationX:
              ny * -5,

            z: 10,

            y:
              ny * 5,

            duration: 0.45,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );


        return;
      }


      if (!tracking) {
        return;
      }


      const dx =
        event.clientX -
        startX;


      const dy =
        event.clientY -
        startY;


      /* =====================================================
         DETERMINE HORIZONTAL VS VERTICAL
      ===================================================== */

      if (!horizontalDrag) {
        if (
          Math.abs(dx) < 6 &&
          Math.abs(dy) < 6
        ) {
          return;
        }


        /*
         * MOBILE VERTICAL SCROLL WINS.
         */
        if (
          Math.abs(dy) >
          Math.abs(dx) *
          1.15
        ) {
          tracking =
            false;

          horizontalDrag =
            false;

          pointerId =
            null;

          return;
        }


        horizontalDrag =
          true;


        visual.classList.add(
          "is-dragging"
        );


        try {
          visual.setPointerCapture?.(
            event.pointerId
          );
        }

        catch {
          /* no-op */
        }
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
        ) /
        elapsed;


      lastX =
        event.clientX;


      lastTime =
        now;


      /* =====================================================
         FULL 360 DRAG

         ~400px horizontal movement =
         roughly one full rotation.
      ===================================================== */

      const sensitivity =
        isMobile()
          ? 0.92
          : 0.78;


      currentRotation =
        startRotation +
        dx *
        sensitivity;


      const tiltX =
        gsap.utils.clamp(
          -5,
          5,
          -dy * 0.035
        );


      gsap.set(
        imageFrame,
        {
          rotationY:
            currentRotation,

          rotationX:
            tiltX,

          z:
            horizontalDrag
              ? 14
              : 0,

          force3D:
            true
        }
      );
    },
    {
      passive: false
    }
  );


  /* =========================================================
     RELEASE
  ========================================================= */

  function finishRotation(
    event
  ) {
    if (!tracking) {
      return;
    }


    tracking =
      false;


    visual.classList.remove(
      "is-dragging"
    );


    const dragDistance =
      event.clientX -
      startX;


    /*
     * TAP ON MOBILE:
     * DO ONE CLEAN FULL 360 SPIN.
     */
    if (!horizontalDrag) {
      if (
        event.pointerType ===
        "touch"
      ) {
        spin(
          1,
          1.45
        );
      }

      return;
    }


    /* =====================================================
       MOMENTUM
    ===================================================== */

    const momentum =
      velocityX *
      (
        isMobile()
          ? 190
          : 160
      );


    const predicted =
      currentRotation +
      momentum;


    let target =
      nearestFullTurn(
        predicted
      );


    const startClean =
      nearestFullTurn(
        startRotation
      );


    /*
     * If user clearly dragged but nearest
     * snap would return to the same position,
     * force one full 360° turn.
     */
    if (
      Math.abs(
        dragDistance
      ) > 34 &&
      target ===
        startClean
    ) {
      target +=
        dragDistance > 0
          ? 360
          : -360;
    }


    /*
     * Direction should follow the swipe.
     */
    if (
      dragDistance > 0 &&
      target <
        currentRotation
    ) {
      target += 360;
    }


    if (
      dragDistance < 0 &&
      target >
        currentRotation
    ) {
      target -= 360;
    }


    const distance =
      Math.abs(
        target -
        currentRotation
      );


    const duration =
      gsap.utils.clamp(
        0.5,
        1.25,
        distance / 330
      );


    spinTween =
      gsap.to(
        imageFrame,
        {
          rotationY:
            target,

          rotationX: 0,

          rotationZ: 0,

          z: 0,

          y: 0,

          duration,

          ease:
            "power4.out",

          overwrite:
            true,

          onComplete: () => {
            currentRotation =
              target;

            spinTween =
              null;
          }
        }
      );


    if (
      pointerId !== null
    ) {
      try {
        visual.releasePointerCapture?.(
          pointerId
        );
      }

      catch {
        /* no-op */
      }
    }


    pointerId =
      null;


    horizontalDrag =
      false;
  }


  visual.addEventListener(
    "pointerup",
    finishRotation
  );


  visual.addEventListener(
    "pointercancel",
    event => {
      if (!tracking) {
        return;
      }


      tracking =
        false;

      horizontalDrag =
        false;


      visual.classList.remove(
        "is-dragging"
      );


      const clean =
        nearestFullTurn(
          getRotation()
        );


      gsap.to(
        imageFrame,
        {
          rotationY:
            clean,

          rotationX: 0,

          z: 0,

          y: 0,

          duration: 0.65,

          ease:
            "power3.out"
        }
      );


      try {
        visual.releasePointerCapture?.(
          event.pointerId
        );
      }

      catch {
        /* no-op */
      }


      pointerId =
        null;
    }
  );


  /* =========================================================
     DESKTOP HOVER = FULL 360
  ========================================================= */

  if (finePointer) {
    visual.addEventListener(
      "pointerenter",
      event => {
        if (
          tracking
        ) {
          return;
        }


        const now =
          performance.now();


        /*
         * Prevent repeated spins caused by
         * tiny pointer re-entries.
         */
        if (
          now -
          lastHoverSpin <
          900
        ) {
          return;
        }


        lastHoverSpin =
          now;


        const rect =
          visual.getBoundingClientRect();


        const direction =
          event.clientX <
          (
            rect.left +
            rect.width / 2
          )
            ? -1
            : 1;


        spin(
          direction,
          1.45
        );
      }
    );


    visual.addEventListener(
      "pointerleave",
      () => {
        if (tracking) {
          return;
        }


        gsap.to(
          imageFrame,
          {
            rotationX: 0,

            z: 0,

            y: 0,

            duration: 0.55,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );
      }
    );
  }


  return {
    spin
  };
}


/* =========================================================
   PREPARE HEADING
========================================================= */

function prepareWhoHeading(
  heading
) {
  if (!heading) {
    return [];
  }


  if (
    heading.dataset
      .kineticReady ===
    "true"
  ) {
    return Array.from(
      heading.querySelectorAll(
        ".home-who__kinetic-char"
      )
    );
  }


  const textNodes = [];


  const walker =
    document.createTreeWalker(
      heading,
      NodeFilter.SHOW_TEXT
    );


  let node;


  while (
    (
      node =
        walker.nextNode()
    )
  ) {
    if (
      node.textContent.trim()
    ) {
      textNodes.push(node);
    }
  }


  const characters = [];


  textNodes.forEach(
    textNode => {
      const text =
        textNode.textContent
          .trim()
          .replace(
            /\s+/g,
            " "
          );


      const words =
        text.split(" ");


      const fragment =
        document.createDocumentFragment();


      words.forEach(
        (
          word,
          wordIndex
        ) => {
          const wordWrap =
            document.createElement(
              "span"
            );


          wordWrap.className =
            "home-who__kinetic-word";


          Array.from(
            word
          ).forEach(
            character => {
              const char =
                document.createElement(
                  "span"
                );


              char.className =
                "home-who__kinetic-char";


              char.dataset.final =
                character;


              char.textContent =
                character;


              wordWrap.appendChild(
                char
              );


              characters.push(
                char
              );
            }
          );


          fragment.appendChild(
            wordWrap
          );


          if (
            wordIndex <
            words.length - 1
          ) {
            fragment.appendChild(
              document.createTextNode(
                " "
              )
            );
          }
        }
      );


      textNode.parentNode
        .replaceChild(
          fragment,
          textNode
        );
    }
  );


  heading.dataset
    .kineticReady =
    "true";


  return characters;
}


/* =========================================================
   RESTORE HEADING
========================================================= */

function restoreWhoHeading(
  characters
) {
  characters.forEach(
    char => {
      char.textContent =
        char.dataset.final || "";
    }
  );
}


/* =========================================================
   PREPARE DESCRIPTION
========================================================= */

function prepareWhoDescription(
  description
) {
  if (!description) {
    return [];
  }


  if (
    description.dataset
      .wordsReady ===
    "true"
  ) {
    return Array.from(
      description.querySelectorAll(
        ".home-who__description-word"
      )
    );
  }


  const text =
    description.textContent
      .trim()
      .replace(
        /\s+/g,
        " "
      );


  const words =
    text.split(" ");


  description.textContent = "";


  const elements = [];


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
        "home-who__description-mask";


      const span =
        document.createElement(
          "span"
        );


      span.className =
        "home-who__description-word";


      span.textContent =
        word;


      mask.appendChild(
        span
      );


      description.appendChild(
        mask
      );


      elements.push(
        span
      );


      if (
        index <
        words.length - 1
      ) {
        description.appendChild(
          document.createTextNode(
            " "
          )
        );
      }
    }
  );


  description.dataset
    .wordsReady =
    "true";


  return elements;
}


/* =========================================================
   DESCRIPTION LOOP
========================================================= */

function createDescriptionLoop(
  words,
  isMobile
) {
  if (!words.length) {
    return null;
  }


  const timeline =
    gsap.timeline({
      paused: true,
      repeat: -1
    });


  timeline.set(
    words,
    {
      yPercent: 105,

      opacity: 0,

      filter:
        "blur(5px)"
    }
  );


  timeline.to(
    words,
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
          ? 0.035
          : 0.028,

      ease:
        "power4.out"
    }
  );


  timeline.to(
    {},
    {
      duration: 5
    }
  );


  timeline.to(
    words,
    {
      yPercent: -70,

      opacity: 0,

      filter:
        "blur(3px)",

      duration: 0.42,

      stagger:
        isMobile()
          ? 0.018
          : 0.014,

      ease:
        "power3.in"
    }
  );


  timeline.to(
    {},
    {
      duration: 0.8
    }
  );


  return timeline;
}


/* =========================================================
   ABOUT
========================================================= */

function initAbout() {
  const section =
    document.getElementById(
      "home-about"
    );

  if (!section) return;


  const heading =
    section.querySelector(
      ".home-about__heading"
    );


  const content =
    section.querySelector(
      ".home-about__content"
    );


  if (heading) {
    gsap.fromTo(
      heading,
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,

        duration: 0.8,

        ease:
          "power3.out",

        scrollTrigger: {
          trigger:
            section,

          start:
            "top 84%",

          once: true
        }
      }
    );
  }


  if (content) {
    gsap.fromTo(
      content,
      {
        y: 34,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,

        duration: 0.85,

        delay: 0.07,

        ease:
          "power3.out",

        scrollTrigger: {
          trigger:
            section,

          start:
            "top 84%",

          once: true
        }
      }
    );
  }
}


/* =========================================================
   WORK
========================================================= */

function initWork() {
  const section =
    document.getElementById(
      "home-work"
    );

  if (!section) return;


  const header =
    section.querySelector(
      ".home-work-new__header"
    );


  const projects =
    section.querySelectorAll(
      ".home-work-new__project"
    );


  if (header) {
    gsap.fromTo(
      header,
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,

        duration: 0.8,

        ease:
          "power3.out",

        scrollTrigger: {
          trigger:
            header,

          start:
            "top 88%",

          once: true
        }
      }
    );
  }


  projects.forEach(
    (
      project,
      index
    ) => {
      gsap.fromTo(
        project,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,

          duration: 0.75,

          delay:
            index * 0.06,

          ease:
            "power3.out",

          scrollTrigger: {
            trigger:
              project,

            start:
              "top 90%",

            once: true
          }
        }
      );
    }
  );
}


/* =========================================================
   CLIENTS
========================================================= */

function initClients() {
  const section =
    document.getElementById(
      "home-clients"
    );

  if (!section) return;


  const heading =
    section.querySelector(
      ".home-clients__heading"
    );


  const logos =
    section.querySelectorAll(
      ".home-client-logo"
    );


  if (heading) {
    gsap.fromTo(
      heading,
      {
        y: 28,
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
            heading,

          start:
            "top 88%",

          once: true
        }
      }
    );
  }


  if (logos.length) {
    gsap.fromTo(
      logos,
      {
        y: 16,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,

        duration: 0.55,

        stagger: 0.035,

        ease:
          "power2.out",

        scrollTrigger: {
          trigger:
            ".home-clients__logos",

          start:
            "top 88%",

          once: true
        }
      }
    );
  }
}


/* =========================================================
   RECOGNITION
========================================================= */

function initRecognition() {
  const section =
    document.getElementById(
      "home-recognition"
    );

  if (!section) return;


  const visual =
    section.querySelector(
      ".home-recognition__visual"
    );


  const content =
    section.querySelector(
      ".home-recognition__content"
    );


  if (visual) {
    gsap.fromTo(
      visual,
      {
        y: 32,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,

        duration: 0.85,

        ease:
          "power3.out",

        scrollTrigger: {
          trigger:
            section,

          start:
            "top 82%",

          once: true
        }
      }
    );
  }


  if (content) {
    gsap.fromTo(
      content,
      {
        y: 32,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,

        duration: 0.85,

        delay: 0.08,

        ease:
          "power3.out",

        scrollTrigger: {
          trigger:
            section,

          start:
            "top 82%",

          once: true
        }
      }
    );
  }
}


/* =========================================================
   FOOTER
========================================================= */

function initFooterYear() {
  const year =
    document.getElementById(
      "ape-footer-year"
    );

  if (!year) return;

  year.textContent =
    new Date()
      .getFullYear();
}