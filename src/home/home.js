import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/home-who.css";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   HOME
========================================================= */

export function initHome() {

  initFooterYear();

  cloneLogoRows();


  const reduced =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduced) {
    return;
  }


  initScenes();

  initWho();

  initServices();

  initWork();

  initClients();

  initRecognition();


  requestAnimationFrame(
    () => {

      ScrollTrigger.refresh();

    }
  );

}


/* =========================================================
   GENERIC HOME SCENE MOTION
========================================================= */

function initScenes() {

  const scenes =
    document.querySelectorAll(
      ".home-scene"
    );


  scenes.forEach(
    scene => {

      const stage =
        scene.querySelector(
          ".home-scene__stage"
        );


      if (!stage) {
        return;
      }


      gsap.fromTo(
        stage,
        {
          scale: 0.965,

          opacity: 0.62,

          y: 35
        },
        {
          scale: 1,

          opacity: 1,

          y: 0,

          ease: "none",

          scrollTrigger: {

            trigger: scene,

            start:
              "top 92%",

            end:
              "top 28%",

            scrub: 0.65

          }
        }
      );


      gsap.to(
        stage,
        {
          scale: 1.025,

          y: -28,

          ease: "none",

          scrollTrigger: {

            trigger: scene,

            start:
              "65% top",

            end:
              "bottom top",

            scrub: 0.7

          }
        }
      );

    }
  );

}


/* =========================================================
   WHO / ABOUT APE
========================================================= */

function initWho() {

  const section =
    document.getElementById(
      "home-who"
    );


  if (!section) {
    return;
  }


  const heading =
    section.querySelector(
      ".home-who__content h2"
    )
    ||
    section.querySelector(
      ".home-who__title"
    );


  const description =
    section.querySelector(
      ".home-who__description"
    )
    ||
    section.querySelector(
      ".home-who__body p"
    );


  const actions =
    section.querySelector(
      ".home-who__actions"
    )
    ||
    section.querySelector(
      ".home-who__button"
    )
    ||
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
    imageFrame
      ?.querySelector(
        "img"
      );


  const finePointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;


  const isMobile =
    () =>
      window.innerWidth < 768;


  /* =========================================================
     REMOVE OLD RECTANGLE / BALL
  ========================================================= */

  section
    .querySelectorAll(
      [
        ".home-who__rear",
        ".home-who__disc",
        ".home-who__visual-back"
      ].join(",")
    )
    .forEach(
      element => {

        element.remove();

      }
    );


  /* =========================================================
     HEADING PREP
  ========================================================= */

  const headingChars =
    prepareWhoHeading(
      heading
    );


  /* =========================================================
     PARAGRAPH PREP
  ========================================================= */

  const descriptionWords =
    prepareWhoDescription(
      description
    );


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
        Math.random()
        *
        glyphPool.length
      )
    ];

  }


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

      restoreWhoHeading(
        headingChars
      );

    }

  }


  function startScramble() {

    stopScramble(
      false
    );


    const probability =
      isMobile()
        ?
        0.21
        :
        0.28;


    const speed =
      isMobile()
        ?
        175
        :
        150;


    headingChars.forEach(
      char => {

        if (
          Math.random() <
          0.36
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


  if (
    headingChars.length
  ) {

    headingTimeline =
      gsap.timeline(
        {
          paused: true,

          repeat: -1
        }
      );


    headingTimeline.call(
      startScramble
    );


    headingTimeline.fromTo(
      headingChars,
      {
        x:
          () =>
            gsap.utils.random(
              isMobile()
                ?
                -5
                :
                -9,

              isMobile()
                ?
                5
                :
                9
            ),

        y:
          () =>
            gsap.utils.random(
              isMobile()
                ?
                -4
                :
                -7,

              isMobile()
                ?
                4
                :
                7
            ),

        rotation:
          () =>
            gsap.utils.random(
              isMobile()
                ?
                -3
                :
                -6,

              isMobile()
                ?
                3
                :
                6
            ),

        scale:
          () =>
            gsap.utils.random(
              0.96,
              1.045
            ),

        opacity:
          () =>
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
            ?
            2
            :
            1.85,

        stagger: {

          each:
            isMobile()
              ?
              0.011
              :
              0.013,

          from:
            "random"

        },

        ease:
          "power3.out"
      }
    );


    headingTimeline.call(
      () => {

        stopScramble(
          true
        );

      },
      null,
      isMobile()
        ?
        1.52
        :
        1.42
    );


    headingTimeline.to(
      headingChars,
      {
        x: 0,

        y: 0,

        rotation: 0,

        scale: 1,

        opacity: 1,

        filter:
          "blur(0px)",

        duration: 0.42
      }
    );


    headingTimeline.to(
      {},
      {
        duration: 5
      }
    );

  }


  /* =========================================================
     DESCRIPTION LOOP
  ========================================================= */

  const descriptionTimeline =
    createDescriptionLoop(
      descriptionWords,
      isMobile
    );


  /* =========================================================
     IMAGE REVEAL
  ========================================================= */

  if (
    visual
  ) {

    gsap.fromTo(
      visual,
      {
        y:
          isMobile()
            ?
            30
            :
            42,

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
     360 IMAGE
  ========================================================= */

  const image360 =
    setupWhoImage360(
      {
        section,
        visual,
        imageFrame,
        image,
        finePointer,
        isMobile
      }
    );


  /* =========================================================
     SECTION VISIBILITY
  ========================================================= */

  ScrollTrigger.create(
    {

      trigger:
        section,

      start:
        "top 82%",

      end:
        "bottom 10%",


      onEnter: () => {

        headingTimeline
          ?.restart();


        descriptionTimeline
          ?.restart();


        gsap.delayedCall(
          0.55,
          () => {

            image360
              ?.spin(
                1,
                1.65
              );

          }
        );

      },


      onEnterBack: () => {

        headingTimeline
          ?.play();


        descriptionTimeline
          ?.play();

      },


      onLeave: () => {

        headingTimeline
          ?.pause();


        descriptionTimeline
          ?.pause();


        stopScramble(
          true
        );

      },


      onLeaveBack: () => {

        headingTimeline
          ?.pause();


        descriptionTimeline
          ?.pause();


        stopScramble(
          true
        );

      }

    }
  );


  /* =========================================================
     CTA
  ========================================================= */

  if (
    actions
  ) {

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
   TRUE 360 IMAGE
========================================================= */

function setupWhoImage360(
  {
    section,
    visual,
    imageFrame,
    image,
    finePointer,
    isMobile
  }
) {

  if (
    !section ||
    !visual ||
    !imageFrame ||
    !image
  ) {
    return null;
  }


  image.classList.add(
    "home-who__image-front"
  );


  let backImage =
    imageFrame.querySelector(
      ".home-who__image-back"
    );


  if (
    !backImage
  ) {

    backImage =
      image.cloneNode(
        true
      );


    backImage.removeAttribute(
      "id"
    );


    backImage.classList.remove(
      "home-who__image-front"
    );


    backImage.classList.add(
      "home-who__image-back"
    );


    backImage.alt =
      "";


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


  const getRotation =
    () =>
      Number(
        gsap.getProperty(
          imageFrame,
          "rotationY"
        )
      )
      ||
      0;


  const nearestFullTurn =
    value =>
      Math.round(
        value / 360
      )
      *
      360;


  /* =========================================================
     AUTOMATIC 360
  ========================================================= */

  function spin(
    direction = 1,
    duration = 1.55
  ) {

    if (
      tracking
    ) {
      return;
    }


    spinTween
      ?.kill();


    const current =
      getRotation();


    const base =
      nearestFullTurn(
        current
      );


    const target =
      base
      +
      (
        direction >= 0
          ?
          360
          :
          -360
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

          y: 0,

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

      ease: "none",

      scrollTrigger: {

        trigger:
          section,

        start:
          "top bottom",

        end:
          "bottom top",

        scrub: 0.8

      }
    }
  );


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
     START DRAG
  ========================================================= */

  visual.addEventListener(
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


      spinTween
        ?.kill();


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


      lastX =
        event.clientX;


      startY =
        event.clientY;


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
     MOVE
  ========================================================= */

  visual.addEventListener(
    "pointermove",
    event => {

      if (
        !tracking
        &&
        finePointer
      ) {

        const rect =
          visual.getBoundingClientRect();


        const ny =
          (
            event.clientY
            -
            rect.top
          )
          /
          rect.height
          -
          0.5;


        gsap.to(
          imageFrame,
          {
            rotationX:
              ny * -4,

            z: 8,

            duration: 0.4,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );


        return;

      }


      if (
        !tracking
      ) {
        return;
      }


      const dx =
        event.clientX
        -
        startX;


      const dy =
        event.clientY
        -
        startY;


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


        if (
          Math.abs(dy)
          >
          Math.abs(dx)
          *
          1.15
        ) {

          tracking =
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

          visual.setPointerCapture
            ?.(
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


      const now =
        performance.now();


      const elapsed =
        Math.max(
          now
          -
          lastTime,
          1
        );


      velocityX =
        (
          event.clientX
          -
          lastX
        )
        /
        elapsed;


      lastX =
        event.clientX;


      lastTime =
        now;


      const sensitivity =
        isMobile()
          ?
          0.92
          :
          0.78;


      currentRotation =
        startRotation
        +
        dx
        *
        sensitivity;


      gsap.set(
        imageFrame,
        {
          rotationY:
            currentRotation,

          rotationX:
            gsap.utils.clamp(
              -5,
              5,
              -dy * 0.035
            ),

          z: 14,

          force3D: true
        }
      );

    },
    {
      passive: false
    }
  );


  /* =========================================================
     END DRAG
  ========================================================= */

  function finishRotation(
    event
  ) {

    if (
      !tracking
    ) {
      return;
    }


    tracking =
      false;


    visual.classList.remove(
      "is-dragging"
    );


    const dragDistance =
      event.clientX
      -
      startX;


    if (
      !horizontalDrag
    ) {
      return;
    }


    const momentum =
      velocityX
      *
      (
        isMobile()
          ?
          190
          :
          160
      );


    const predicted =
      currentRotation
      +
      momentum;


    let target =
      nearestFullTurn(
        predicted
      );


    const startClean =
      nearestFullTurn(
        startRotation
      );


    if (
      Math.abs(
        dragDistance
      )
      >
      34
      &&
      target ===
        startClean
    ) {

      target +=
        dragDistance > 0
          ?
          360
          :
          -360;

    }


    if (
      dragDistance > 0
      &&
      target <
        currentRotation
    ) {

      target +=
        360;

    }


    if (
      dragDistance < 0
      &&
      target >
        currentRotation
    ) {

      target -=
        360;

    }


    const duration =
      gsap.utils.clamp(
        0.5,
        1.2,
        Math.abs(
          target
          -
          currentRotation
        )
        /
        330
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
      pointerId !==
      null
    ) {

      try {

        visual.releasePointerCapture
          ?.(
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


  visual.addEventListener(
    "pointerup",
    finishRotation
  );


  visual.addEventListener(
    "pointercancel",
    () => {

      if (
        !tracking
      ) {
        return;
      }


      tracking =
        false;


      horizontalDrag =
        false;


      visual.classList.remove(
        "is-dragging"
      );


      gsap.to(
        imageFrame,
        {
          rotationY:
            nearestFullTurn(
              getRotation()
            ),

          rotationX: 0,

          z: 0,

          y: 0,

          duration: 0.6,

          ease:
            "power3.out"
        }
      );


      pointerId =
        null;

    }
  );


  /* =========================================================
     DESKTOP HOVER SPIN
  ========================================================= */

  if (
    finePointer
  ) {

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


        if (
          now
          -
          lastHoverSpin
          <
          900
        ) {
          return;
        }


        lastHoverSpin =
          now;


        const rect =
          visual.getBoundingClientRect();


        spin(
          event.clientX
          <
          rect.left
          +
          rect.width / 2
            ?
            -1
            :
            1,

          1.45
        );

      }
    );


    visual.addEventListener(
      "pointerleave",
      () => {

        if (
          tracking
        ) {
          return;
        }


        gsap.to(
          imageFrame,
          {
            rotationX: 0,

            z: 0,

            y: 0,

            duration: 0.5,

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
   WHO HEADING PREP
========================================================= */

function prepareWhoHeading(
  heading
) {

  if (
    !heading
  ) {
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


  const textNodes =
    [];


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
      node.textContent
        .trim()
    ) {

      textNodes.push(
        node
      );

    }

  }


  const characters =
    [];


  textNodes.forEach(
    textNode => {

      const words =
        textNode.textContent
          .trim()
          .replace(
            /\s+/g,
            " "
          )
          .split(
            " "
          );


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
            wordIndex
            <
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
   RESTORE WHO HEADING
========================================================= */

function restoreWhoHeading(
  characters
) {

  characters.forEach(
    char => {

      char.textContent =
        char.dataset.final
        ||
        "";

    }
  );

}


/* =========================================================
   WHO PARAGRAPH PREP
========================================================= */

function prepareWhoDescription(
  description
) {

  if (
    !description
  ) {
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


  const words =
    description.textContent
      .trim()
      .replace(
        /\s+/g,
        " "
      )
      .split(
        " "
      );


  description.textContent =
    "";


  const elements =
    [];


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
   WHO DESCRIPTION LOOP
========================================================= */

function createDescriptionLoop(
  words,
  isMobile
) {

  if (
    !words.length
  ) {
    return null;
  }


  const timeline =
    gsap.timeline(
      {
        paused: true,

        repeat: -1
      }
    );


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
          ?
          0.72
          :
          0.62,

      stagger:
        isMobile()
          ?
          0.035
          :
          0.028,

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
          ?
          0.018
          :
          0.014,

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
   SERVICES — RESTORED + IMPROVED
========================================================= */

function initServices() {

  const section =
    document.getElementById(
      "home-services"
    );


  if (!section) {
    return;
  }


  const rows =
    Array.from(
      section.querySelectorAll(
        ".home-service"
      )
    );


  const images =
    Array.from(
      section.querySelectorAll(
        ".home-service-image"
      )
    );


  const visual =
    section.querySelector(
      ".home-services__visual"
    );


  if (
    !rows.length ||
    !images.length ||
    !visual
  ) {
    return;
  }


  let current =
    rows.findIndex(
      row =>
        row.classList.contains(
          "is-active"
        )
    );


  if (
    current < 0
  ) {
    current = 0;
  }


  let changing =
    false;


  /* =========================================================
     INITIAL IMAGE STATE
  ========================================================= */

  images.forEach(
    (
      image,
      index
    ) => {

      gsap.set(
        image,
        {
          autoAlpha:
            index === current
              ?
              1
              :
              0,

          zIndex:
            index === current
              ?
              3
              :
              1,

          xPercent: 0,

          y: 0,

          scale: 1,

          rotation: 0,

          clipPath:
            "inset(0 0 0 0 round 26px)"
        }
      );

    }
  );


  rows.forEach(
    (
      row,
      index
    ) => {

      row.classList.toggle(
        "is-active",
        index === current
      );

    }
  );


  /* =========================================================
     ACTIVATE SERVICE
  ========================================================= */

  function activate(
    index,
    direction = 1
  ) {

    if (
      index < 0
      ||
      index >=
        rows.length
      ||
      index ===
        current
      ||
      changing
    ) {
      return;
    }


    const oldIndex =
      current;


    const oldImage =
      images[
        oldIndex
      ];


    const newImage =
      images[
        index
      ];


    if (
      !oldImage ||
      !newImage
    ) {
      return;
    }


    changing =
      true;


    current =
      index;


    rows.forEach(
      (
        row,
        rowIndex
      ) => {

        row.classList.toggle(
          "is-active",
          rowIndex ===
            index
        );

      }
    );


    gsap.killTweensOf(
      [
        oldImage,
        newImage
      ]
    );


    const inDirection =
      direction >= 0
        ?
        1
        :
        -1;


    const outDirection =
      -inDirection;


    /* NEW IMAGE */

    gsap.set(
      newImage,
      {
        autoAlpha: 1,

        zIndex: 3,

        xPercent:
          7
          *
          inDirection,

        y: 18,

        scale: 0.94,

        rotation:
          1.8
          *
          inDirection,

        clipPath:
          direction >= 0
            ?
            "inset(0 0 100% 0 round 26px)"
            :
            "inset(100% 0 0 0 round 26px)"
      }
    );


    /* OLD IMAGE */

    gsap.set(
      oldImage,
      {
        autoAlpha: 1,

        zIndex: 2
      }
    );


    /* HIDE OTHER IMAGES */

    images.forEach(
      (
        image,
        imageIndex
      ) => {

        if (
          imageIndex !==
            oldIndex
          &&
          imageIndex !==
            index
        ) {

          gsap.set(
            image,
            {
              autoAlpha: 0,

              zIndex: 1
            }
          );


          image.classList.remove(
            "is-active"
          );

        }

      }
    );


    const timeline =
      gsap.timeline(
        {
          defaults: {
            ease:
              "power4.inOut"
          },

          onComplete: () => {

            oldImage.classList.remove(
              "is-active"
            );


            newImage.classList.add(
              "is-active"
            );


            gsap.set(
              oldImage,
              {
                autoAlpha: 0,

                xPercent: 0,

                y: 0,

                scale: 1,

                rotation: 0,

                clipPath:
                  "inset(0 0 0 0 round 26px)"
              }
            );


            gsap.set(
              newImage,
              {
                autoAlpha: 1,

                xPercent: 0,

                y: 0,

                scale: 1,

                rotation: 0,

                clipPath:
                  "inset(0 0 0 0 round 26px)"
              }
            );


            changing =
              false;

          }
        }
      );


    timeline.to(
      oldImage,
      {
        autoAlpha: 0,

        xPercent:
          5
          *
          outDirection,

        scale: 0.96,

        rotation:
          -1.2
          *
          inDirection,

        duration: 0.48
      },
      0
    );


    timeline.to(
      newImage,
      {
        xPercent: 0,

        y: 0,

        scale: 1,

        rotation: 0,

        clipPath:
          "inset(0 0 0 0 round 26px)",

        duration: 0.72
      },
      0.04
    );

  }


  /* =========================================================
     DESKTOP HOVER
  ========================================================= */

  rows.forEach(
    (
      row,
      index
    ) => {

      row.addEventListener(
        "pointerenter",
        () => {

          activate(
            index,
            index >=
              current
              ?
              1
              :
              -1
          );

        }
      );


      row.addEventListener(
        "focus",
        () => {

          activate(
            index,
            index >=
              current
              ?
              1
              :
              -1
          );

        }
      );


      /*
       * Tablet/mobile tap.
       */

      row.addEventListener(
        "click",
        () => {

          activate(
            index,
            index >=
              current
              ?
              1
              :
              -1
          );

        }
      );

    }
  );


  /* =========================================================
     MOBILE / TOUCH SCROLL ACTIVATION
  ========================================================= */

  ScrollTrigger.create(
    {

      trigger:
        section,

      start:
        "top 82%",

      end:
        "bottom 18%",


      onUpdate(
        self
      ) {

        /*
         * Desktop already has hover.
         */

        if (
          window.matchMedia(
            "(hover: hover) and (pointer: fine)"
          ).matches
        ) {
          return;
        }


        const index =
          Math.min(
            rows.length - 1,

            Math.floor(
              self.progress
              *
              rows.length
            )
          );


        if (
          index !==
            current
          &&
          !changing
        ) {

          activate(
            index,
            index >=
              current
              ?
              1
              :
              -1
          );

        }

      }

    }
  );


  /* =========================================================
     VISUAL PARALLAX
  ========================================================= */

  gsap.fromTo(
    visual,
    {
      rotate: -4,

      scale: 0.88,

      y: 55
    },
    {
      rotate: 3,

      scale: 1.03,

      y: -30,

      ease: "none",

      scrollTrigger: {

        trigger:
          section,

        start:
          "top bottom",

        end:
          "bottom top",

        scrub: 0.9

      }
    }
  );


  initTilt(
    visual,
    5
  );

}


/* =========================================================
   WORK — ORIGINAL MOTION RESTORED
========================================================= */

function initWork() {

  const section =
    document.getElementById(
      "home-work"
    );


  if (!section) {
    return;
  }


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
    !viewport ||
    !track
  ) {
    return;
  }


  function distance() {

    return Math.max(
      0,

      track.scrollWidth
      -
      viewport.clientWidth
    );

  }


  gsap.fromTo(
    track,
    {
      x: 0
    },
    {
      x:
        () =>
          -distance(),

      ease: "none",

      scrollTrigger: {

        trigger:
          section,

        start:
          "top 86%",

        end:
          "bottom 14%",

        scrub: 0.85,

        invalidateOnRefresh:
          true

      }
    }
  );


  cards.forEach(
    (
      card,
      index
    ) => {

      const image =
        card.querySelector(
          "img"
        );


      gsap.fromTo(
        card,
        {
          rotate:
            index % 2 === 0
              ?
              -4
              :
              4,

          y:
            index % 2 === 0
              ?
              40
              :
              -20
        },
        {
          rotate:
            index % 2 === 0
              ?
              2
              :
              -2,

          y:
            index % 2 === 0
              ?
              -20
              :
              35,

          ease: "none",

          scrollTrigger: {

            trigger:
              section,

            start:
              "top bottom",

            end:
              "bottom top",

            scrub: 1

          }
        }
      );


      if (
        image
      ) {

        gsap.fromTo(
          image,
          {
            scale: 1.13
          },
          {
            scale: 1.02,

            ease: "none",

            scrollTrigger: {

              trigger:
                section,

              start:
                "top bottom",

              end:
                "bottom top",

              scrub: 1

            }
          }
        );

      }


      initTilt(
        card,
        3
      );

    }
  );

}


/* =========================================================
   CLIENT LOGO CLONING RESTORED
========================================================= */

function cloneLogoRows() {

  document
    .querySelectorAll(
      ".home-client-row__group"
    )
    .forEach(
      group => {

        const track =
          group.parentElement;


        if (
          !track
          ||
          track.querySelector(
            "[aria-hidden='true']"
          )
        ) {
          return;
        }


        const copy =
          group.cloneNode(
            true
          );


        copy.setAttribute(
          "aria-hidden",
          "true"
        );


        copy
          .querySelectorAll(
            "img"
          )
          .forEach(
            image => {

              image.alt =
                "";

            }
          );


        track.appendChild(
          copy
        );

      }
    );

}


/* =========================================================
   CLIENTS — ORIGINAL MOTION RESTORED
========================================================= */

function initClients() {

  const section =
    document.getElementById(
      "home-clients"
    );


  if (!section) {
    return;
  }


  const tracks =
    section.querySelectorAll(
      ".home-client-row__track"
    );


  tracks.forEach(
    (
      track,
      index
    ) => {

      gsap.fromTo(
        track,
        {
          xPercent:
            index === 0
              ?
              -2
              :
              -18
        },
        {
          xPercent:
            index === 0
              ?
              -18
              :
              -2,

          ease: "none",

          scrollTrigger: {

            trigger:
              section,

            start:
              "top bottom",

            end:
              "bottom top",

            scrub: 1

          }
        }
      );

    }
  );


  section
    .querySelectorAll(
      ".home-client-logo"
    )
    .forEach(
      logo => {

        initTilt(
          logo,
          4
        );

      }
    );

}


/* =========================================================
   RECOGNITION — ORIGINAL MOTION RESTORED
========================================================= */

function initRecognition() {

  const section =
    document.getElementById(
      "home-recognition"
    );


  if (!section) {
    return;
  }


  const visual =
    section.querySelector(
      ".home-recognition__visual"
    );


  const image =
    visual
      ?.querySelector(
        "img"
      );


  const content =
    section.querySelector(
      ".home-recognition__content"
    );


  if (
    visual
  ) {

    gsap.fromTo(
      visual,
      {
        clipPath:
          "inset(16% 15% 16% 15% round 44px)",

        rotate: -5,

        scale: 0.85
      },
      {
        clipPath:
          "inset(0% 0% 0% 0% round 28px)",

        rotate: 2,

        scale: 1,

        ease: "none",

        scrollTrigger: {

          trigger:
            section,

          start:
            "top bottom",

          end:
            "top 25%",

          scrub: 0.8

        }
      }
    );

  }


  if (
    image
  ) {

    gsap.fromTo(
      image,
      {
        scale: 1.15,

        yPercent: -7
      },
      {
        scale: 1.03,

        yPercent: 7,

        ease: "none",

        scrollTrigger: {

          trigger:
            section,

          start:
            "top bottom",

          end:
            "bottom top",

          scrub: 1

        }
      }
    );

  }


  if (
    content
  ) {

    gsap.fromTo(
      content,
      {
        x: 70,

        opacity: 0
      },
      {
        x: 0,

        opacity: 1,

        ease: "none",

        scrollTrigger: {

          trigger:
            section,

          start:
            "top 82%",

          end:
            "top 36%",

          scrub: 0.65

        }
      }
    );

  }


  initTilt(
    visual,
    3
  );

}


/* =========================================================
   POINTER DEPTH
========================================================= */

function initTilt(
  element,
  amount
) {

  if (
    !element
    ||
    !window.matchMedia(
      "(pointer: fine)"
    ).matches
  ) {
    return;
  }


  gsap.set(
    element,
    {
      transformPerspective:
        1200,

      transformStyle:
        "preserve-3d"
    }
  );


  const rotateX =
    gsap.quickTo(
      element,
      "rotationX",
      {
        duration: 0.45,

        ease:
          "power3.out"
      }
    );


  const rotateY =
    gsap.quickTo(
      element,
      "rotationY",
      {
        duration: 0.45,

        ease:
          "power3.out"
      }
    );


  element.addEventListener(
    "pointermove",
    event => {

      const rect =
        element.getBoundingClientRect();


      const x =
        (
          event.clientX
          -
          rect.left
        )
        /
        rect.width;


      const y =
        (
          event.clientY
          -
          rect.top
        )
        /
        rect.height;


      rotateY(
        (
          x - 0.5
        )
        *
        amount
        *
        2
      );


      rotateX(
        (
          0.5 - y
        )
        *
        amount
        *
        2
      );

    }
  );


  element.addEventListener(
    "pointerleave",
    () => {

      rotateX(
        0
      );


      rotateY(
        0
      );

    }
  );

}


/* =========================================================
   FOOTER
========================================================= */

function initFooterYear() {

  const year =
    document.getElementById(
      "ape-footer-year"
    );


  if (
    year
  ) {

    year.textContent =
      new Date()
        .getFullYear();

  }

}