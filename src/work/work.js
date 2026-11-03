/* =========================================================
   APE STUDIO — WORK PAGE
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import {
  initHeader
} from "../header/header.js";


import {
  WORK_CATEGORIES,
  WORK_PROJECTS,
  workImagePath
} from "./work-data.js";


gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   ENVIRONMENT
========================================================= */

const reduceMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


const finePointer =
  window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;


/* =========================================================
   FILTERS
========================================================= */

function buildFilters() {

  const mount =
    document.getElementById(
      "work-filters"
    );


  if (!mount) {
    return;
  }


  mount.innerHTML =
    "";


  WORK_CATEGORIES.forEach(
    function (
      category,
      index
    ) {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "work-filter";


      button.dataset.filter =
        category.id;


      button.textContent =
        category.label;


      button.setAttribute(
        "aria-pressed",
        index === 0
          ? "true"
          : "false"
      );


      if (
        index === 0
      ) {

        button.classList.add(
          "is-active"
        );

      }


      mount.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   PROJECT CARD
========================================================= */

function createProjectCard(
  project
) {

  const article =
    document.createElement(
      "article"
    );


  article.className =
    `
      work-card
      work-card--${project.tone}
      work-card--${project.size}
    `;


  article.dataset.category =
    project.category;


  article.style.setProperty(
    "--card-span",
    project.span
  );


  const titleId =
    `work-project-${project.slug}-title`;


  article.setAttribute(
    "aria-labelledby",
    titleId
  );


  const link =
    document.createElement(
      "a"
    );


  link.className =
    "work-card__link";


  link.href =
    `/work/${project.slug}/`;


  link.setAttribute(
    "aria-label",
    `View ${project.name} project`
  );


  link.innerHTML =
    `

      <div
        class="work-card__image"
      >

        <img
          src="${workImagePath(
            project.slug,
            1
          )}"
          alt="Selected creative work for ${project.name} by APE Studio"
          loading="lazy"
          decoding="async"
        >

      </div>


      <div
        class="work-card__overlay"
        aria-hidden="true"
      ></div>


      <div class="work-card__bottom">

        <h3 id="${titleId}">
          ${project.name}
        </h3>


        <span
          class="work-card__arrow"
          aria-hidden="true"
        >
          ↗
        </span>

      </div>


      <span class="work-card__view">
        View Project
      </span>

    `;


  article.appendChild(
    link
  );


  return article;

}


/* =========================================================
   BUILD PROJECTS
========================================================= */

function buildProjects() {

  const grid =
    document.getElementById(
      "work-grid"
    );


  if (!grid) {
    return;
  }


  grid.innerHTML =
    "";


  const fragment =
    document.createDocumentFragment();


  WORK_PROJECTS.forEach(
    function (
      project
    ) {

      fragment.appendChild(
        createProjectCard(
          project
        )
      );

    }
  );


  grid.appendChild(
    fragment
  );

}


/* =========================================================
   FILTERING
========================================================= */

function initFiltering() {

  const buttons =
    document.querySelectorAll(
      ".work-filter"
    );


  const cards =
    document.querySelectorAll(
      ".work-card"
    );


  if (
    !buttons.length ||
    !cards.length
  ) {
    return;
  }


  buttons.forEach(
    function (
      button
    ) {

      button.addEventListener(
        "click",
        function () {

          const category =
            button.dataset.filter;


          buttons.forEach(
            function (
              item
            ) {

              const active =
                item === button;


              item.classList.toggle(
                "is-active",
                active
              );


              item.setAttribute(
                "aria-pressed",
                active
                  ? "true"
                  : "false"
              );

            }
          );


          cards.forEach(
            function (
              card
            ) {

              const visible =
                category === "all"
                ||
                card.dataset.category ===
                category;


              if (!visible) {

                card.hidden =
                  true;

                return;

              }


              card.hidden =
                false;


              if (!reduceMotion) {

                gsap.fromTo(
                  card,
                  {
                    opacity: 0,
                    y: 25,
                    scale: 0.98
                  },
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,

                    duration:
                      0.48,

                    ease:
                      "power3.out",

                    overwrite:
                      true
                  }
                );

              }

            }
          );


          reactProjectApe();


          requestAnimationFrame(
            function () {

              ScrollTrigger.refresh();

            }
          );

        }
      );

    }
  );

}


/* =========================================================
   HERO ENTRANCE
========================================================= */

function initHeroMotion() {

  if (reduceMotion) {
    return;
  }


  const timeline =
    gsap.timeline({
      defaults: {
        ease:
          "power4.out"
      }
    });


  timeline

    .fromTo(
      ".work-hero__eyebrow",
      {
        opacity: 0,
        y: 14
      },
      {
        opacity: 1,
        y: 0,

        duration:
          0.45
      }
    )


    .fromTo(
      ".work-hero__title-line",
      {
        opacity: 0,
        y: 55,
        rotationX: -12
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,

        duration:
          0.78,

        stagger:
          0.07
      },
      "-=0.18"
    )


    .fromTo(
      ".work-hero__copy",
      {
        opacity: 0,
        y: 22
      },
      {
        opacity: 1,
        y: 0,

        duration:
          0.58
      },
      "-=0.4"
    )


    .fromTo(
      ".work-hero__cta",
      {
        opacity: 0,
        y: 15
      },
      {
        opacity: 1,
        y: 0,

        duration:
          0.5
      },
      "-=0.35"
    )


    .fromTo(
      ".work-hero__ape",
      {
        opacity: 0,
        x: 75,
        y: 65,
        scale: 0.78,
        rotation: 5
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,

        duration:
          1.05,

        ease:
          "back.out(1.5)"
      },
      "-=0.75"
    );


  /* =====================================================
     TITLE SCROLL DRIFT
  ===================================================== */

  gsap.to(
    ".work-hero__title-line:nth-child(odd)",
    {
      xPercent: -2,

      ease: "none",

      scrollTrigger: {
        trigger:
          ".work-hero",

        start:
          "top top",

        end:
          "bottom top",

        scrub:
          1
      }
    }
  );


  gsap.to(
    ".work-hero__title-line:nth-child(even)",
    {
      xPercent: 2,

      ease: "none",

      scrollTrigger: {
        trigger:
          ".work-hero",

        start:
          "top top",

        end:
          "bottom top",

        scrub:
          1
      }
    }
  );

}


/* =========================================================
   DANCE HELPER
========================================================= */

function danceApe(
  rig,
  aura,
  pulse
) {

  if (
    !rig ||
    reduceMotion
  ) {
    return;
  }


  gsap.killTweensOf(
    rig
  );


  gsap.timeline()

    .to(
      rig,
      {
        y: -25,
        x: -10,
        rotation: -7,
        scale: 1.08,

        duration: 0.15
      }
    )

    .to(
      rig,
      {
        x: 12,
        rotation: 8,

        duration: 0.13
      }
    )

    .to(
      rig,
      {
        x: -9,
        rotation: -6,

        duration: 0.13
      }
    )

    .to(
      rig,
      {
        x: 0,

        rotationY:
          "+=360",

        duration: 0.5,

        ease:
          "power3.inOut"
      }
    )

    .to(
      rig,
      {
        x: 0,
        y: 0,

        rotation: 0,
        rotationX: 0,
        rotationY: 0,

        scale: 1,

        duration: 0.38,

        ease:
          "bounce.out"
      }
    );


  if (aura) {

    gsap.fromTo(
      aura,
      {
        scale: 0.78,
        opacity: 0.9
      },
      {
        scale: 1.35,
        opacity: 0.45,

        duration: 0.55,

        ease:
          "power2.out"
      }
    );

  }


  if (pulse) {

    gsap.fromTo(
      pulse,
      {
        scale: 0.7,
        opacity: 0.7
      },
      {
        scale: 1.4,
        opacity: 0,

        duration: 0.58,

        ease:
          "power2.out"
      }
    );

  }

}


/* =========================================================
   HERO APE
========================================================= */

function initHeroApe() {

  const ape =
    document.querySelector(
      ".work-hero__ape"
    );


  const world =
    document.querySelector(
      ".work-hero__ape-world"
    );


  const rig =
    document.querySelector(
      ".work-hero__ape-rig"
    );


  const float =
    document.querySelector(
      ".work-hero__ape-float"
    );


  const aura =
    document.querySelector(
      ".work-hero__ape-aura"
    );


  const pulse =
    document.querySelector(
      ".work-hero__ape-pulse"
    );


  if (
    !ape ||
    !world ||
    !rig ||
    !float
  ) {
    return;
  }


  /* =====================================================
     IDLE
  ===================================================== */

  if (!reduceMotion) {

    gsap.to(
      float,
      {
        y: -8,
        rotation: 1.3,

        duration: 1.75,

        repeat: -1,

        yoyo: true,

        ease:
          "sine.inOut"
      }
    );


    gsap.to(
      ".work-hero__visual",
      {
        yPercent: -4,

        ease: "none",

        scrollTrigger: {
          trigger:
            ".work-hero",

          start:
            "top top",

          end:
            "bottom top",

          scrub:
            0.8
        }
      }
    );

  }


  /* =====================================================
     DESKTOP HOVER
  ===================================================== */

  if (
    finePointer &&
    !reduceMotion
  ) {

    ape.addEventListener(
      "pointermove",
      function (
        event
      ) {

        const rect =
          ape.getBoundingClientRect();


        const x =
          (
            event.clientX -
            rect.left
          )
          /
          rect.width -
          0.5;


        const y =
          (
            event.clientY -
            rect.top
          )
          /
          rect.height -
          0.5;


        gsap.to(
          world,
          {
            x:
              x * 21,

            y:
              y * 12,

            duration:
              0.34,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );


        gsap.to(
          rig,
          {
            rotationY:
              x * 12,

            rotationX:
              y * -7,

            rotation:
              x * 2,

            scale:
              1.045,

            duration:
              0.32,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );

      }
    );


    ape.addEventListener(
      "pointerleave",
      function () {

        gsap.to(
          world,
          {
            x: 0,
            y: 0,

            duration: 0.55,

            ease:
              "elastic.out(1,0.45)"
          }
        );


        gsap.to(
          rig,
          {
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,

            duration: 0.48,

            ease:
              "back.out(1.6)"
          }
        );

      }
    );

  }


  /* =====================================================
     CLICK / TAP
  ===================================================== */

  ape.addEventListener(
    "click",
    function () {

      danceApe(
        rig,
        aura,
        pulse
      );

    }
  );

}


/* =========================================================
   HERO BACKGROUND POINTER MOTION
========================================================= */

function initHeroPointerMotion() {

  if (
    !finePointer ||
    reduceMotion
  ) {
    return;
  }


  const hero =
    document.querySelector(
      ".work-hero"
    );


  const violet =
    document.querySelector(
      ".work-hero__glow--violet"
    );


  const lime =
    document.querySelector(
      ".work-hero__glow--lime"
    );


  if (!hero) {
    return;
  }


  hero.addEventListener(
    "pointermove",
    function (
      event
    ) {

      const rect =
        hero.getBoundingClientRect();


      const x =
        (
          event.clientX -
          rect.left
        )
        /
        rect.width -
        0.5;


      const y =
        (
          event.clientY -
          rect.top
        )
        /
        rect.height -
        0.5;


      if (violet) {

        gsap.to(
          violet,
          {
            x:
              x * -32,

            y:
              y * -20,

            duration:
              1,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );

      }


      if (lime) {

        gsap.to(
          lime,
          {
            x:
              x * 25,

            y:
              y * 16,

            duration:
              1.1,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );

      }

    }
  );

}


/* =========================================================
   PROJECT HEADER
========================================================= */

function initProjectHeaderMotion() {

  if (reduceMotion) {
    return;
  }


  gsap.fromTo(
    ".work-projects__top",
    {
      opacity: 0,
      y: 35
    },
    {
      opacity: 1,
      y: 0,

      duration: 0.75,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger:
          ".work-projects__header",

        start:
          "top 84%",

        once:
          true
      }
    }
  );

}


/* =========================================================
   PROJECT APE
========================================================= */

let projectApeParts =
  null;


function initProjectApe() {

  const ape =
    document.querySelector(
      ".work-projects__ape"
    );


  const world =
    document.querySelector(
      ".work-projects__ape-world"
    );


  const rig =
    document.querySelector(
      ".work-projects__ape-rig"
    );


  const float =
    document.querySelector(
      ".work-projects__ape-float"
    );


  const aura =
    document.querySelector(
      ".work-projects__ape-aura"
    );


  const pulse =
    document.querySelector(
      ".work-projects__ape-pulse"
    );


  if (
    !ape ||
    !world ||
    !rig ||
    !float
  ) {
    return;
  }


  projectApeParts = {
    ape,
    world,
    rig,
    float,
    aura,
    pulse
  };


  if (!reduceMotion) {

    gsap.fromTo(
      ape,
      {
        opacity: 0,
        x: 50,
        y: 25,
        scale: 0.75,
        rotation: 5
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,

        duration: 0.85,

        ease:
          "back.out(1.7)",

        scrollTrigger: {
          trigger:
            ".work-projects__header",

          start:
            "top 82%",

          once:
            true
        }
      }
    );


    gsap.to(
      float,
      {
        y: -7,
        rotation: 1.7,

        duration: 1.55,

        repeat: -1,

        yoyo: true,

        ease:
          "sine.inOut"
      }
    );


    ScrollTrigger.create({
      trigger:
        ".work-projects",

      start:
        "top bottom",

      end:
        "bottom top",

      onUpdate(
        self
      ) {

        const velocity =
          gsap.utils.clamp(
            -1,
            1,
            self.getVelocity() /
            1800
          );


        gsap.to(
          world,
          {
            y:
              velocity * 7,

            x:
              velocity * 4,

            duration: 0.2,

            ease:
              "power2.out",

            overwrite:
              "auto"
          }
        );


        gsap.to(
          rig,
          {
            rotation:
              velocity * 4,

            rotationY:
              velocity * 7,

            duration: 0.2,

            ease:
              "power2.out",

            overwrite:
              "auto"
          }
        );

      }
    });

  }


  if (
    finePointer &&
    !reduceMotion
  ) {

    ape.addEventListener(
      "pointermove",
      function (
        event
      ) {

        const rect =
          ape.getBoundingClientRect();


        const x =
          (
            event.clientX -
            rect.left
          )
          /
          rect.width -
          0.5;


        const y =
          (
            event.clientY -
            rect.top
          )
          /
          rect.height -
          0.5;


        gsap.to(
          world,
          {
            x:
              x * 15,

            y:
              y * 9,

            duration: 0.3,

            ease:
              "power3.out"
          }
        );


        gsap.to(
          rig,
          {
            rotationY:
              x * 10,

            rotationX:
              y * -6,

            scale:
              1.06,

            duration: 0.3,

            ease:
              "power3.out"
          }
        );

      }
    );


    ape.addEventListener(
      "pointerleave",
      function () {

        gsap.to(
          world,
          {
            x: 0,
            y: 0,

            duration: 0.5,

            ease:
              "elastic.out(1,0.5)"
          }
        );


        gsap.to(
          rig,
          {
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,

            duration: 0.45,

            ease:
              "back.out(1.6)"
          }
        );

      }
    );

  }


  ape.addEventListener(
    "click",
    function () {

      danceApe(
        rig,
        aura,
        pulse
      );

    }
  );

}


/* =========================================================
   FILTER REACTION
========================================================= */

function reactProjectApe() {

  if (
    !projectApeParts ||
    reduceMotion
  ) {
    return;
  }


  const {
    rig,
    aura,
    pulse
  } =
    projectApeParts;


  gsap.killTweensOf(
    rig
  );


  gsap.timeline()

    .to(
      rig,
      {
        x: 8,
        y: -13,
        rotation: 5,
        scale: 1.06,

        duration: 0.15
      }
    )

    .to(
      rig,
      {
        x: -6,
        rotation: -4,

        duration: 0.12
      }
    )

    .to(
      rig,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,

        duration: 0.34,

        ease:
          "bounce.out"
      }
    );


  if (aura) {

    gsap.fromTo(
      aura,
      {
        scale: 0.82
      },
      {
        scale: 1.23,

        duration: 0.45,

        ease:
          "power3.out"
      }
    );

  }


  if (pulse) {

    gsap.fromTo(
      pulse,
      {
        scale: 0.7,
        opacity: 0.65
      },
      {
        scale: 1.3,
        opacity: 0,

        duration: 0.5
      }
    );

  }

}


/* =========================================================
   PROJECT CARD REVEALS
========================================================= */

function initProjectMotion() {

  if (reduceMotion) {
    return;
  }


  const cards =
    gsap.utils.toArray(
      ".work-card"
    );


  cards.forEach(
    function (
      card
    ) {

      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 38,
          scale: 0.98
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,

          duration: 0.7,

          ease:
            "power3.out",

          scrollTrigger: {
            trigger:
              card,

            start:
              "top 90%",

            once:
              true
          }
        }
      );


      const image =
        card.querySelector(
          ".work-card__image img"
        );


      if (image) {

        gsap.fromTo(
          image,
          {
            yPercent: -3
          },
          {
            yPercent: 3,

            ease: "none",

            scrollTrigger: {
              trigger:
                card,

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
   PROJECT CARD POINTER DEPTH
========================================================= */

function initCardPointerMotion() {

  if (
    !finePointer ||
    reduceMotion
  ) {
    return;
  }


  const cards =
    document.querySelectorAll(
      ".work-card__link"
    );


  cards.forEach(
    function (
      card
    ) {

      card.addEventListener(
        "pointermove",
        function (
          event
        ) {

          const rect =
            card.getBoundingClientRect();


          const x =
            (
              event.clientX -
              rect.left
            )
            /
            rect.width -
            0.5;


          const y =
            (
              event.clientY -
              rect.top
            )
            /
            rect.height -
            0.5;


          gsap.to(
            card,
            {
              rotationY:
                x * 3,

              rotationX:
                y * -3,

              y: -4,

              duration: 0.3,

              ease:
                "power3.out",

              overwrite:
                "auto"
            }
          );

        }
      );


      card.addEventListener(
        "pointerleave",
        function () {

          gsap.to(
            card,
            {
              rotationX: 0,
              rotationY: 0,
              y: 0,

              duration: 0.5,

              ease:
                "back.out(1.5)"
            }
          );

        }
      );

    }
  );

}


/* =========================================================
   HERO CTA
========================================================= */

function initHeroCTA() {

  const button =
    document.querySelector(
      ".work-hero__cta"
    );


  const target =
    document.getElementById(
      "work-projects"
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
          reduceMotion
            ? "auto"
            : "smooth",

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


  const topButton =
    document.querySelector(
      ".site-footer__top-link"
    );


  if (!topButton) {
    return;
  }


  topButton.addEventListener(
    "click",
    function (
      event
    ) {

      event.preventDefault();


      window.scrollTo({
        top: 0,

        behavior:
          reduceMotion
            ? "auto"
            : "smooth"
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

    buildFilters();

    buildProjects();

    initFiltering();

    initHeroCTA();

    initFooter();


    requestAnimationFrame(
      function () {

        initHeroMotion();

        initHeroApe();

        initHeroPointerMotion();

        initProjectHeaderMotion();

        initProjectApe();

        initProjectMotion();

        initCardPointerMotion();

        ScrollTrigger.refresh();

      }
    );

  }
);


/* =========================================================
   FINAL REFRESH
========================================================= */

window.addEventListener(
  "load",
  function () {

    ScrollTrigger.refresh();

  }
);