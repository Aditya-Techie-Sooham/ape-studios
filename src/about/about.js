/* =========================================================
   APE STUDIO — ABOUT PAGE
========================================================= */


import gsap from "gsap";


import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import {
  initHeader
} from "../header/header.js";


import {
  team
} from "../team/team-data.js";


gsap.registerPlugin(
  ScrollTrigger
);



/* =========================================================
   HELPERS
========================================================= */

function reducedMotion() {

  return window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

}



/* =========================================================
   BUILD TEAM
========================================================= */

function buildTeam() {

  const track =
    document.getElementById(
      "about-team-track"
    );


  if (!track) {
    return;
  }


  track.innerHTML =
    "";


  const fragment =
    document.createDocumentFragment();



  team.forEach(
    function (
      member,
      index
    ) {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "about-team-card";


      card.dataset.index =
        String(index);


      card.innerHTML =
        `

          <div class="about-team-card__focus">


            <div class="about-team-card__surface">


              <figure class="about-team-card__portrait">

                <img
                  src="${member.image}"
                  alt="${member.name}"
                  loading="${index < 3 ? "eager" : "lazy"}"
                  decoding="async"
                  draggable="false"
                >

              </figure>



              <div class="about-team-card__meta">

                <p>
                  ${member.role}
                </p>

                <h3>
                  ${member.name}
                </h3>

              </div>


            </div>


          </div>

        `;


      const image =
        card.querySelector(
          "img"
        );


      if (image) {

        image.addEventListener(
          "error",
          function () {

            card.classList.add(
              "is-image-missing"
            );

          }
        );

      }


      fragment.appendChild(
        card
      );

    }
  );


  track.appendChild(
    fragment
  );

}



/* =========================================================
   HERO
========================================================= */

function initHero() {

  const hero =
    document.querySelector(
      ".about-hero"
    );


  if (
    !hero ||
    reducedMotion()
  ) {

    return;

  }



  gsap
    .timeline({

      defaults: {
        ease:
          "power4.out"
      }

    })


    .fromTo(

      ".about-hero__eyebrow",

      {
        opacity:
          0,

        y:
          12
      },

      {
        opacity:
          1,

        y:
          0,

        duration:
          0.4
      }

    )


    .fromTo(

      ".about-hero__title-line",

      {
        opacity:
          0,

        yPercent:
          105
      },

      {
        opacity:
          1,

        yPercent:
          0,

        duration:
          0.85,

        stagger:
          0.08
      },

      "-=0.14"

    )


    .fromTo(

      ".about-hero__lead",

      {
        opacity:
          0,

        x:
          -25
      },

      {
        opacity:
          1,

        x:
          0,

        duration:
          0.55
      },

      "-=0.4"

    )


    .fromTo(

      ".about-hero__actions",

      {
        opacity:
          0,

        x:
          -18
      },

      {
        opacity:
          1,

        x:
          0,

        duration:
          0.48
      },

      "-=0.32"

    )


    .fromTo(

      ".about-hero__visual",

      {
        opacity:
          0,

        x:
          75,

        scale:
          0.91
      },

      {
        opacity:
          1,

        x:
          0,

        scale:
          1,

        duration:
          0.95,

        ease:
          "back.out(1.16)"
      },

      "-=0.72"

    );



  /* =====================================================
     MASCOT IDLE
  ===================================================== */

  gsap.to(

    ".about-hero__ape",

    {
      y:
        -10,

      rotate:
        -1,

      duration:
        2.3,

      repeat:
        -1,

      yoyo:
        true,

      ease:
        "sine.inOut"

    }

  );


  gsap.to(

    ".about-hero__ape-aura",

    {
      scale:
        1.1,

      opacity:
        0.78,

      duration:
        2.5,

      repeat:
        -1,

      yoyo:
        true,

      ease:
        "sine.inOut"

    }

  );


  const ape =
    document.getElementById(
      "about-hero-ape"
    );


  if (!ape) {
    return;
  }


  ape.addEventListener(
    "click",
    function () {

      gsap.killTweensOf(
        ape
      );


      gsap
        .timeline()

        .to(
          ape,
          {
            y:
              -34,

            rotate:
              -6,

            scale:
              1.05,

            duration:
              0.2,

            ease:
              "power2.out"
          }
        )

        .to(
          ape,
          {
            y:
              0,

            rotate:
              5,

            duration:
              0.18
          }
        )

        .to(
          ape,
          {
            rotate:
              0,

            scale:
              1,

            duration:
              0.42,

            ease:
              "elastic.out(1, .45)"
          }
        );

    }
  );

}



/* =========================================================
   WHO WE ARE
========================================================= */

function initIntroReveal() {

  if (
    reducedMotion()
  ) {

    return;

  }


  const section =
    document.querySelector(
      ".about-intro"
    );


  if (!section) {
    return;
  }


  const eyebrow =
    section.querySelector(
      ".about-section-eyebrow"
    );


  const heading =
    section.querySelector(
      ".about-intro__heading"
    );


  const paragraphs =
    section.querySelectorAll(
      ".about-intro__copy p"
    );



  gsap
    .timeline({

      scrollTrigger: {

        trigger:
          section,

        start:
          "top 90%",

        toggleActions:
          "play none none reverse"

      }

    })


    .fromTo(

      eyebrow,

      {
        opacity:
          0,

        x:
          -24
      },

      {
        opacity:
          1,

        x:
          0,

        duration:
          0.36
      }

    )


    .fromTo(

      heading,

      {
        opacity:
          0,

        x:
          -60,

        clipPath:
          "inset(0 100% 0 0)"
      },

      {
        opacity:
          1,

        x:
          0,

        clipPath:
          "inset(0 0% 0 0)",

        duration:
          0.82,

        ease:
          "power4.out"
      },

      "-=0.12"

    )


    .fromTo(

      paragraphs,

      {
        opacity:
          0,

        x:
          42
      },

      {
        opacity:
          1,

        x:
          0,

        duration:
          0.62,

        stagger:
          0.1,

        ease:
          "power3.out"
      },

      "-=0.48"

    );

}



/* =========================================================
   TEAM
========================================================= */

function initTeam() {

  const section =
    document.getElementById(
      "about-team"
    );


  const viewport =
    document.getElementById(
      "about-team-viewport"
    );


  const cards =
    Array.from(
      document.querySelectorAll(
        ".about-team-card"
      )
    );


  const previous =
    document.getElementById(
      "about-team-prev"
    );


  const next =
    document.getElementById(
      "about-team-next"
    );


  const progress =
    document.getElementById(
      "about-team-progress"
    );


  if (
    !section ||
    !viewport ||
    !cards.length
  ) {

    return;

  }



  let activeIndex =
    0;


  let previousActiveIndex =
    -1;


  let animationFrame =
    null;


  let dragging =
    false;


  let dragStartX =
    0;


  let dragStartScroll =
    0;


  /*
   * Wheel is enabled ONLY while
   * a card itself is hovered.
  */

  let hoveredCard =
    null;



  /* =====================================================
     POSITION HELPERS
  ===================================================== */

  function getMemberLeft(
    index
  ) {

    const card =
      cards[index];


    if (!card) {
      return 0;
    }


    return (
      card.offsetLeft -
      (
        viewport.clientWidth -
        card.offsetWidth
      )
      /
      2
    );

  }



  function getMaximumScroll() {

    return Math.max(

      0,

      viewport.scrollWidth -
      viewport.clientWidth

    );

  }



  function scrollToMember(
    index,
    behavior = "smooth"
  ) {

    const safeIndex =
      Math.max(
        0,
        Math.min(
          cards.length - 1,
          index
        )
      );


    viewport.scrollTo({

      left:
        Math.max(
          0,
          Math.min(
            getMaximumScroll(),
            getMemberLeft(
              safeIndex
            )
          )
        ),

      behavior

    });

  }



  /* =====================================================
     ACTIVE MEMBER
  ===================================================== */

  function updateActive() {

    animationFrame =
      null;


    const viewportRect =
      viewport.getBoundingClientRect();


    const centre =
      viewportRect.left +
      viewportRect.width /
      2;


    let closestIndex =
      0;


    let closestDistance =
      Infinity;



    cards.forEach(
      function (
        card,
        index
      ) {

        const rect =
          card.getBoundingClientRect();


        const cardCentre =
          rect.left +
          rect.width /
          2;


        const distance =
          Math.abs(
            cardCentre -
            centre
          );


        if (
          distance <
          closestDistance
        ) {

          closestDistance =
            distance;


          closestIndex =
            index;

        }

      }
    );


    activeIndex =
      closestIndex;



    cards.forEach(
      function (
        card,
        index
      ) {

        card.classList.toggle(
          "is-active",
          index ===
          activeIndex
        );

      }
    );



    /* ===================================================
       ACTIVE CHANGE ANIMATION

       NO Y MOVEMENT.
       ONLY SCALE + META FADE.
    =================================================== */

    if (
      activeIndex !==
      previousActiveIndex
    ) {

      const activeCard =
        cards[
          activeIndex
        ];


      const focus =
        activeCard.querySelector(
          ".about-team-card__focus"
        );


      const meta =
        activeCard.querySelector(
          ".about-team-card__meta"
        );


      if (
        focus &&
        !reducedMotion()
      ) {

        gsap.fromTo(

          focus,

          {
            scale:
              0.96
          },

          {
            scale:
              1,

            duration:
              0.42,

            ease:
              "power3.out",

            overwrite:
              true
          }

        );

      }


      if (
        meta &&
        !reducedMotion()
      ) {

        gsap.fromTo(

          meta,

          {
            opacity:
              0.6
          },

          {
            opacity:
              1,

            duration:
              0.36,

            ease:
              "power2.out",

            overwrite:
              true
          }

        );

      }


      previousActiveIndex =
        activeIndex;

    }



    /* ===================================================
       PROGRESS
    =================================================== */

    if (progress) {

      const max =
        getMaximumScroll();


      const ratio =
        max > 0
          ?
          viewport.scrollLeft /
          max
          :
          0;


      gsap.set(
        progress,
        {

          scaleX:
            Math.max(
              0,
              Math.min(
                1,
                ratio
              )
            )

        }
      );

    }



    if (previous) {

      previous.disabled =
        activeIndex ===
        0;

    }


    if (next) {

      next.disabled =
        activeIndex ===
        cards.length -
        1;

    }

  }



  function requestUpdate() {

    if (
      animationFrame !==
      null
    ) {

      return;

    }


    animationFrame =
      requestAnimationFrame(
        updateActive
      );

  }



  /* =====================================================
     ANKIT STARTS CENTRED
  ===================================================== */

  function centreAnkit() {

    viewport.scrollLeft =
      Math.max(
        0,
        Math.min(
          getMaximumScroll(),
          getMemberLeft(
            0
          )
        )
      );


    activeIndex =
      0;


    previousActiveIndex =
      -1;


    requestUpdate();

  }


  requestAnimationFrame(
    centreAnkit
  );


  window.addEventListener(
    "load",
    centreAnkit,
    {
      once:
        true
    }
  );



  /* =====================================================
     NORMAL SCROLL UPDATE
  ===================================================== */

  viewport.addEventListener(
    "scroll",
    requestUpdate,
    {
      passive:
        true
    }
  );



  window.addEventListener(
    "resize",
    function () {

      scrollToMember(
        activeIndex,
        "auto"
      );


      requestUpdate();

    }
  );



  /* =====================================================
     ARROWS
  ===================================================== */

  if (previous) {

    previous.addEventListener(
      "click",
      function () {

        scrollToMember(
          activeIndex -
          1
        );

      }
    );

  }



  if (next) {

    next.addEventListener(
      "click",
      function () {

        scrollToMember(
          activeIndex +
          1
        );

      }
    );

  }



  /* =====================================================
     EXACT HOVER DETECTION

     ONLY THE CARDS ACTIVATE WHEEL SWIPE.
  ===================================================== */

  cards.forEach(
    function (
      card
    ) {

      card.addEventListener(
        "mouseenter",
        function () {

          hoveredCard =
            card;


          viewport.classList.add(
            "is-wheel-active"
          );

        }
      );


      card.addEventListener(
        "mouseleave",
        function () {

          if (
            hoveredCard ===
            card
          ) {

            hoveredCard =
              null;

          }


          viewport.classList.remove(
            "is-wheel-active"
          );

        }
      );

    }
  );



  /* =====================================================
     WHEEL → HORIZONTAL

     THIS IS THE BEHAVIOUR YOU ASKED FOR:

     Mouse NOT over a card:
     normal vertical scroll.

     Mouse OVER a card:
     prevent vertical page scroll,
     move carousel horizontally.

     At carousel boundaries:
     release page scroll again.
  ===================================================== */

  viewport.addEventListener(
    "wheel",
    function (
      event
    ) {

      if (
        !hoveredCard
      ) {

        return;

      }


      const maximum =
        getMaximumScroll();


      const current =
        viewport.scrollLeft;


      /*
       * Normal mouse:
       * deltaY positive = right
       * deltaY negative = left.
       *
       * Trackpad horizontal delta also works.
       */

      let movement =
        Math.abs(
          event.deltaX
        ) >
        Math.abs(
          event.deltaY
        )
          ?
          event.deltaX
          :
          event.deltaY;



      const goingLeft =
        movement <
        0;


      const goingRight =
        movement >
        0;


      const atBeginning =
        current <=
        1;


      const atEnd =
        current >=
        maximum -
        1;



      /*
       * If user is already at an edge
       * and continues scrolling outward,
       * release normal page scrolling.
       */

      if (
        (
          atBeginning &&
          goingLeft
        )
        ||
        (
          atEnd &&
          goingRight
        )
      ) {

        return;

      }



      /*
       * Pointer is over a card and
       * carousel can still move:
       * LOCK VERTICAL PAGE.
       */

      event.preventDefault();


      viewport.scrollLeft +=
        movement *
        2.15;


      requestUpdate();

    },
    {
      passive:
        false
    }
  );



  /* =====================================================
     DESKTOP DRAG
  ===================================================== */

  viewport.addEventListener(
    "pointerdown",
    function (
      event
    ) {

      if (
        event.pointerType ===
        "touch"
      ) {

        return;

      }


      dragging =
        true;


      dragStartX =
        event.clientX;


      dragStartScroll =
        viewport.scrollLeft;


      viewport.classList.add(
        "is-dragging"
      );


      viewport.setPointerCapture(
        event.pointerId
      );

    }
  );



  viewport.addEventListener(
    "pointermove",
    function (
      event
    ) {

      if (
        !dragging
      ) {

        return;

      }


      viewport.scrollLeft =
        dragStartScroll -
        (
          event.clientX -
          dragStartX
        );

    }
  );



  function finishDragging(
    event
  ) {

    if (
      !dragging
    ) {

      return;

    }


    dragging =
      false;


    viewport.classList.remove(
      "is-dragging"
    );


    if (
      event &&
      viewport.hasPointerCapture(
        event.pointerId
      )
    ) {

      viewport.releasePointerCapture(
        event.pointerId
      );

    }


    requestAnimationFrame(
      function () {

        scrollToMember(
          activeIndex
        );

      }
    );

  }


  viewport.addEventListener(
    "pointerup",
    finishDragging
  );


  viewport.addEventListener(
    "pointercancel",
    finishDragging
  );



  /* =====================================================
     TEAM ENTRANCE

     NO VERTICAL STAGGER.
     ALL CARDS STAY ON SAME BASELINE.
  ===================================================== */

  if (
    !reducedMotion()
  ) {

    gsap
      .timeline({

        scrollTrigger: {

          trigger:
            section,

          start:
            "top 88%",

          toggleActions:
            "play none none reverse"

        }

      })


      .fromTo(

        ".about-team__eyebrow",

        {
          opacity:
            0,

          x:
            -30
        },

        {
          opacity:
            1,

          x:
            0,

          duration:
            0.36
        }

      )


      .fromTo(

        ".about-team__header h2",

        {
          opacity:
            0,

          x:
            -70,

          clipPath:
            "inset(0 100% 0 0)"
        },

        {
          opacity:
            1,

          x:
            0,

          clipPath:
            "inset(0 0% 0 0)",

          duration:
            0.82,

          ease:
            "power4.out"
        },

        "-=0.15"

      )


      .fromTo(

        ".about-team__intro",

        {
          opacity:
            0,

          x:
            35
        },

        {
          opacity:
            1,

          x:
            0,

          duration:
            0.55,

          ease:
            "power3.out"
        },

        "-=0.42"

      )


      .fromTo(

        cards,

        {
          opacity:
            0,

          scale:
            0.93
        },

        {
          opacity:
            1,

          scale:
            1,

          duration:
            0.55,

          stagger:
            0.035,

          ease:
            "power3.out"
        },

        "-=0.28"

      );

  }



  /* =====================================================
     HOVER TILT
  ===================================================== */

  if (
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches
  ) {

    cards.forEach(
      function (
        card
      ) {

        const surface =
          card.querySelector(
            ".about-team-card__surface"
          );


        const image =
          card.querySelector(
            "img"
          );


        if (!surface) {
          return;
        }


        card.addEventListener(
          "pointermove",
          function (
            event
          ) {

            if (
              dragging
            ) {

              return;

            }


            const rect =
              card.getBoundingClientRect();


            const x =
              (
                event.clientX -
                rect.left
              )
              /
              rect.width;


            const y =
              (
                event.clientY -
                rect.top
              )
              /
              rect.height;


            gsap.to(
              surface,
              {

                rotateY:
                  (
                    x -
                    0.5
                  )
                  *
                  4,

                rotateX:
                  (
                    0.5 -
                    y
                  )
                  *
                  3,

                duration:
                  0.3,

                ease:
                  "power3.out",

                overwrite:
                  true

              }
            );


            if (image) {

              gsap.to(
                image,
                {

                  scale:
                    1.035,

                  duration:
                    0.4,

                  ease:
                    "power3.out",

                  overwrite:
                    true

                }
              );

            }

          }
        );


        card.addEventListener(
          "pointerleave",
          function () {

            gsap.to(
              surface,
              {

                rotateX:
                  0,

                rotateY:
                  0,

                duration:
                  0.42,

                ease:
                  "power3.out"

              }
            );


            if (image) {

              gsap.to(
                image,
                {

                  scale:
                    1,

                  duration:
                    0.45,

                  ease:
                    "power3.out"

                }
              );

            }

          }
        );

      }
    );

  }

}



/* =========================================================
   BELIEF
========================================================= */

function initBeliefReveals() {

  if (
    reducedMotion()
  ) {

    return;

  }


  const statements =
    gsap.utils.toArray(
      ".about-belief__statement"
    );


  statements.forEach(
    function (
      statement,
      index
    ) {

      const heading =
        statement.querySelector(
          "h2"
        );


      const paragraph =
        statement.querySelector(
          "p"
        );


      const direction =
        index % 2 === 0
          ?
          -55
          :
          55;


      gsap
        .timeline({

          scrollTrigger: {

            trigger:
              statement,

            start:
              "top 88%",

            toggleActions:
              "play none none reverse"

          }

        })

        .fromTo(

          heading,

          {
            opacity:
              0,

            x:
              direction,

            clipPath:
              index % 2 === 0
                ?
                "inset(0 100% 0 0)"
                :
                "inset(0 0 0 100%)"
          },

          {
            opacity:
              1,

            x:
              0,

            clipPath:
              "inset(0 0% 0 0)",

            duration:
              0.82,

            ease:
              "power4.out"
          }

        )

        .fromTo(

          paragraph,

          {
            opacity:
              0,

            x:
              index % 2 === 0
                ?
                35
                :
                -35
          },

          {
            opacity:
              1,

            x:
              0,

            duration:
              0.56,

            ease:
              "power3.out"
          },

          "-=0.42"

        );

    }
  );

}



/* =========================================================
   FOUR APPROVED FEATURE SECTIONS
========================================================= */

function initFeatureReveals() {

  if (
    reducedMotion()
  ) {

    return;

  }


  const sections =
    gsap.utils.toArray(
      ".about-feature"
    );


  sections.forEach(
    function (
      section,
      index
    ) {

      const eyebrow =
        section.querySelector(
          ".about-section-eyebrow"
        );


      const heading =
        section.querySelector(
          ".about-feature__copy h2"
        );


      const description =
        section.querySelector(
          ".about-feature__description"
        );


      const media =
        section.querySelector(
          ".about-feature__media"
        );


      const reveal =
        section.querySelector(
          ".about-feature__media-reveal"
        );


      const mediaElement =
        section.querySelector(
          ".about-feature__media img, .about-feature__media video"
        );


      const copyDirection =
        index % 2 === 0
          ?
          -42
          :
          42;


      const mediaDirection =
        index % 2 === 0
          ?
          60
          :
          -60;


      const timeline =
        gsap.timeline({

          scrollTrigger: {

            trigger:
              section,

            start:
              "top 88%",

            toggleActions:
              "play none none reverse"

          }

        });


      timeline

        .fromTo(

          eyebrow,

          {
            opacity:
              0,

            x:
              copyDirection
          },

          {
            opacity:
              1,

            x:
              0,

            duration:
              0.34
          }

        )


        .fromTo(

          heading,

          {
            opacity:
              0,

            x:
              copyDirection,

            clipPath:
              copyDirection < 0
                ?
                "inset(0 100% 0 0)"
                :
                "inset(0 0 0 100%)"
          },

          {
            opacity:
              1,

            x:
              0,

            clipPath:
              "inset(0 0% 0 0)",

            duration:
              0.78,

            ease:
              "power4.out"
          },

          "-=0.12"

        )


        .fromTo(

          description,

          {
            opacity:
              0,

            x:
              copyDirection * 0.7
          },

          {
            opacity:
              1,

            x:
              0,

            duration:
              0.5,

            ease:
              "power3.out"
          },

          "-=0.4"

        )


        .fromTo(

          media,

          {
            opacity:
              0,

            x:
              mediaDirection,

            scale:
              0.975
          },

          {
            opacity:
              1,

            x:
              0,

            scale:
              1,

            duration:
              0.82,

            ease:
              "power4.out"
          },

          "-=0.68"

        );


      if (reveal) {

        timeline.fromTo(

          reveal,

          {
            xPercent:
              0
          },

          {
            xPercent:
              102,

            duration:
              0.88,

            ease:
              "power4.inOut"
          },

          "-=0.78"

        );

      }


      if (mediaElement) {

        gsap.fromTo(

          mediaElement,

          {
            scale:
              1.055,

            yPercent:
              -2.5
          },

          {
            scale:
              1.055,

            yPercent:
              2.5,

            ease:
              "none",

            scrollTrigger: {

              trigger:
                media,

              start:
                "top bottom",

              end:
                "bottom top",

              scrub:
                1

            }

          }

        );

      }

    }
  );

}



/* =========================================================
   HERO CTA
========================================================= */

function initHeroCTA() {

  const button =
    document.querySelector(
      '.about-hero__primary[href="#about-team"]'
    );


  const target =
    document.getElementById(
      "about-team"
    );


  if (
    !button ||
    !target
  ) {

    return;

  }


  button.addEventListener(
    "click",
    function (
      event
    ) {

      event.preventDefault();


      target.scrollIntoView({

        behavior:
          "smooth",

        block:
          "start"

      });

    }
  );

}



/* =========================================================
   FOOTER
========================================================= */

function initFooter() {

  const year =
    document.getElementById(
      "ape-footer-year"
    );


  if (year) {

    year.textContent =
      String(
        new Date()
          .getFullYear()
      );

  }


  const top =
    document.querySelector(
      ".site-footer__top-link"
    );


  if (!top) {
    return;
  }


  top.addEventListener(
    "click",
    function (
      event
    ) {

      event.preventDefault();


      window.scrollTo({

        top:
          0,

        behavior:
          "smooth"

      });

    }
  );

}



/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    initHeader();

    buildTeam();

    initHero();

    initHeroCTA();

    initIntroReveal();

    initTeam();

    initBeliefReveals();

    initFeatureReveals();

    initFooter();


    requestAnimationFrame(
      function () {

        ScrollTrigger.refresh();

      }
    );

  }
);



window.addEventListener(
  "load",
  function () {

    ScrollTrigger.refresh();

  }
);