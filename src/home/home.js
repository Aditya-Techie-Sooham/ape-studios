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


  requestAnimationFrame(
    () => {

      ScrollTrigger.refresh();

    }
  );

}


/* =========================================================
   REDUCED MOTION FALLBACK
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
   WHO / ABOUT APE SECTION
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
      ?
      imageFrame.querySelector(
        "img"
      )
      :
      null;


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
     REMOVE OLD DECORATIVE SHAPES
  ========================================================= */

  const unwantedShapes =
    section.querySelectorAll(
      [
        ".home-who__rear",
        ".home-who__disc",
        ".home-who__visual-back"
      ].join(",")
    );


  unwantedShapes.forEach(
    shape => {

      shape.remove();

    }
  );


  /* =========================================================
     HEADING — PRESERVE EXISTING STYLING / LINE STRUCTURE
  ========================================================= */

  const headingChars =
    prepareWhoHeading(
      heading
    );


  /* =========================================================
     DESCRIPTION
  ========================================================= */

  const descriptionWords =
    prepareWhoDescription(
      description
    );


  if (
    reduceMotion
  ) {

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
     H1-STYLE KINETIC HEADING
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


  function stopHeadingScramble(
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


    if (
      restore
    ) {

      restoreWhoHeading(
        headingChars
      );

    }

  }


  function startHeadingScramble() {

    stopHeadingScramble(
      false
    );


    /*
     * Mobile remains calmer.
     */

    const changeChance =
      isMobile()
        ?
        0.22
        :
        0.29;


    const interval =
      isMobile()
        ?
        170
        :
        145;


    headingChars.forEach(
      char => {

        if (
          Math.random() <
          0.38
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
                changeChance
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


  function createHeadingLoop() {

    if (
      !headingChars.length
    ) {
      return null;
    }


    stopHeadingScramble(
      true
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


    const timeline =
      gsap.timeline(
        {
          paused: true,

          repeat: -1,

          repeatRefresh: true
        }
      );


    timeline.call(
      startHeadingScramble
    );


    timeline.fromTo(
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
              0.68,
              0.94
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
            1.95
            :
            1.8,

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


    timeline.call(
      () => {

        stopHeadingScramble(
          true
        );

      },
      null,
      isMobile()
        ?
        1.5
        :
        1.4
    );


    /*
     * Final clean text stays visible.
     */

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

        duration: 0.4
      }
    );


    /*
     * Same rhythm as Hero:
     * wait before shuffling again.
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
     DESCRIPTION WORD LOOP
  ========================================================= */

  const descriptionTimeline =
    createDescriptionLoop(
      descriptionWords,
      isMobile
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
        "bottom 12%",


      onEnter: () => {

        headingTimeline?.restart();

        descriptionTimeline?.restart();

      },


      onEnterBack: () => {

        headingTimeline?.play();

        descriptionTimeline?.play();

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
    }
  );


  /* =========================================================
     ACTION BUTTON
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

          once:
            true
        }
      }
    );

  }


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
            32
            :
            42,

        opacity: 0,

        scale:
          0.94
      },
      {
        y: 0,

        opacity: 1,

        scale: 1,

        duration:
          1.05,

        ease:
          "power4.out",

        scrollTrigger: {
          trigger:
            visual,

          start:
            "top 86%",

          once:
            true
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
        scale: 1.1,

        yPercent: 4
      },
      {
        scale: 1.02,

        yPercent: 0,

        duration: 1.3,

        ease:
          "power4.out",

        scrollTrigger: {
          trigger:
            visual,

          start:
            "top 86%",

          once:
            true
        }
      }
    );


    /*
     * Very light scroll parallax.
     * Works on mobile as well.
     */

    gsap.to(
      image,
      {
        yPercent: -5,

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

  }


  /* =========================================================
     DESKTOP IMAGE DEPTH
  ========================================================= */

  if (
    finePointer
    &&
    visual
    &&
    imageFrame
  ) {

    const rotateX =
      gsap.quickTo(
        imageFrame,
        "rotationX",
        {
          duration: 0.55,

          ease:
            "power3.out"
        }
      );


    const rotateY =
      gsap.quickTo(
        imageFrame,
        "rotationY",
        {
          duration: 0.55,

          ease:
            "power3.out"
        }
      );


    const moveX =
      gsap.quickTo(
        imageFrame,
        "x",
        {
          duration: 0.6,

          ease:
            "power3.out"
        }
      );


    const moveY =
      gsap.quickTo(
        imageFrame,
        "y",
        {
          duration: 0.6,

          ease:
            "power3.out"
        }
      );


    visual.addEventListener(
      "pointermove",
      event => {

        const rect =
          visual.getBoundingClientRect();


        const nx =
          (
            event.clientX
            -
            rect.left
          )
          /
          rect.width
          -
          0.5;


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


        rotateY(
          nx * 8
        );


        rotateX(
          ny * -6
        );


        moveX(
          nx * 8
        );


        moveY(
          ny * 6
        );


        if (
          image
        ) {

          gsap.to(
            image,
            {
              scale: 1.055,

              duration: 0.55,

              ease:
                "power3.out",

              overwrite:
                true
            }
          );

        }

      }
    );


    visual.addEventListener(
      "pointerleave",
      () => {

        rotateX(0);

        rotateY(0);

        moveX(0);

        moveY(0);


        if (
          image
        ) {

          gsap.to(
            image,
            {
              scale: 1.02,

              duration: 0.7,

              ease:
                "power3.out",

              overwrite:
                true
            }
          );

        }

      }
    );

  }

}


/* =========================================================
   PREPARE WHO HEADING
========================================================= */

function prepareWhoHeading(
  heading
) {

  if (!heading) {
    return [];
  }


  if (
    heading.dataset.kineticReady ===
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

      const text =
        textNode.textContent
          .trim()
          .replace(
            /\s+/g,
            " "
          );


      const words =
        text.split(
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


      textNode.parentNode.replaceChild(
        fragment,
        textNode
      );

    }
  );


  heading.dataset.kineticReady =
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
   PREPARE DESCRIPTION
========================================================= */

function prepareWhoDescription(
  description
) {

  if (!description) {
    return [];
  }


  if (
    description.dataset.wordsReady ===
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
    text.split(
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


  description.dataset.wordsReady =
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


  /*
   * Clean reading time.
   */

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


  /*
   * Small empty pause.
   */

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


  if (
    heading
  ) {

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

          once:
            true
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

          once:
            true
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


  if (
    header
  ) {

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

          once:
            true
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

            once:
              true
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


  if (
    heading
  ) {

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

          once:
            true
        }
      }
    );

  }


  if (
    logos.length
  ) {

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

          once:
            true
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


  if (
    visual
  ) {

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

          once:
            true
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

          once:
            true
        }
      }
    );

  }

}


/* =========================================================
   FOOTER YEAR
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