/* =========================================================
   APE STUDIO — WORK INDEX
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/work-page.css";


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


  mount.innerHTML = "";


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

   IMPORTANT:
   NO PROJECT NUMBERS
   NO CATEGORY LABEL ABOVE EACH CARD
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
        aria-hidden="true"
      >

        <img
          src="${workImagePath(
            project.slug,
            1
          )}"
          alt=""
          loading="lazy"
          decoding="async"
        >

      </div>


      <div
        class="work-card__overlay"
        aria-hidden="true"
      ></div>


      <div class="work-card__bottom">

        <h2>
          ${project.name}
        </h2>


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
   PROJECTS
========================================================= */

function buildProjects() {

  const grid =
    document.getElementById(
      "work-grid"
    );


  if (!grid) {
    return;
  }


  grid.innerHTML = "";


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
    !buttons.length
    ||
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
                item ===
                button;


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
                category ===
                "all"

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


              gsap.fromTo(

                card,

                {
                  opacity: 0,
                  y: 18,
                  scale: 0.985
                },

                {
                  opacity: 1,
                  y: 0,
                  scale: 1,

                  duration: 0.42,

                  ease:
                    "power3.out"
                }

              );

            }
          );


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
   HERO
========================================================= */

function initHeroMotion() {

  const reduced =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduced) {
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

      ".work-hero__eyebrow",

      {
        opacity: 0,
        y: 18
      },

      {
        opacity: 1,
        y: 0,
        duration: 0.5
      }

    )

    .fromTo(

      ".work-hero h1",

      {
        opacity: 0,
        y: 60
      },

      {
        opacity: 1,
        y: 0,
        duration: 0.85
      },

      "-=0.25"

    )

    .fromTo(

      ".work-hero__bottom",

      {
        opacity: 0,
        y: 24
      },

      {
        opacity: 1,
        y: 0,
        duration: 0.6
      },

      "-=0.4"

    );

}



/* =========================================================
   PROJECT REVEALS
========================================================= */

function initProjectMotion() {

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
          y: 35
        },

        {
          opacity: 1,
          y: 0,

          duration: 0.65,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              card,

            start:
              "top 91%",

            once:
              true

          }

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
    !button
    ||
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
      new Date()
        .getFullYear();

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

        top: 0,

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

    buildFilters();

    buildProjects();

    initFiltering();

    initHeroCTA();

    initFooter();


    requestAnimationFrame(
      function () {

        initHeroMotion();

        initProjectMotion();

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