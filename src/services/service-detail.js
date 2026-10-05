/* =========================================================
   APE STUDIO — SERVICE DETAIL
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/service-detail.css";


import {
  initHeader
} from "../header/header.js";


import {
  SERVICE_PAGES
} from "./services-data.js";


gsap.registerPlugin(
  ScrollTrigger
);



/* =========================================================
   SLUG
========================================================= */

function getServiceSlug() {

  const parts =
    window.location.pathname
      .split("/")
      .filter(Boolean);


  return (
    parts[1]
    ||
    "digital-marketing"
  );

}



/* =========================================================
   DATA
========================================================= */

function getServiceData() {

  const slug =
    getServiceSlug();


  return (
    SERVICE_PAGES[slug]
    ||
    SERVICE_PAGES[
      "digital-marketing"
    ]
  );

}



/* =========================================================
   HERO TITLE
========================================================= */

function renderHeroLines(
  lines
) {

  return lines
    .map(
      function (
        line
      ) {

        return `

          <span
            class="${
              line.accent
                ? "is-accent"
                : ""
            }"
          >
            ${line.text}
          </span>

        `;

      }
    )
    .join("");

}



/* =========================================================
   SUB SERVICES

   ONLY:
   H2
   SHORT DESCRIPTION
   TWO IMAGES
========================================================= */

function renderSubservices(
  items
) {

  return items
    .map(
      function (
        item,
        index
      ) {

        const id =
          item.title
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              "-"
            )
            .replace(
              /^-|-$/g,
              ""
            );


        return `

          <article
            id="${id}"
            class="
              service-subsection
              ${
                index % 2
                  ? "is-reversed"
                  : ""
              }
            "
          >


            <div class="service-subsection__inner">


              <div class="service-subsection__content">


                <h2>
                  ${item.title}
                </h2>


                <p>
                  ${item.description}
                </p>


              </div>



              <div class="service-subsection__images">


                <figure>

                  <img
                    src="${item.images[0]}"
                    alt="${item.title} work by APE Studio"
                    loading="lazy"
                    decoding="async"
                  >

                </figure>


                <figure>

                  <img
                    src="${item.images[1]}"
                    alt="${item.title} work by APE Studio"
                    loading="lazy"
                    decoding="async"
                  >

                </figure>


              </div>


            </div>


          </article>

        `;

      }
    )
    .join("");

}



/* =========================================================
   BUILD PAGE
========================================================= */

function renderServicePage() {

  const root =
    document.getElementById(
      "service-detail-root"
    );


  if (!root) {
    return;
  }


  const service =
    getServiceData();



  /*
   * No separate hero image.
   * Keeps hero cleaner + one screen.
  */


  root.innerHTML =
    `

      <!-- ===============================================
           HERO
      ================================================ -->

      <section class="service-detail-hero">


        <div class="service-detail-hero__inner">


          <a
            href="/services/"
            class="service-detail-back"
          >
            ← All Services
          </a>


          <p class="service-detail-hero__eyebrow">
            ${service.navLabel}
          </p>


          <h1>

            ${renderHeroLines(
              service.heroLines
            )}

          </h1>


          <p class="service-detail-hero__lead">

            ${service.intro}

          </p>


          <div class="service-detail-hero__actions">


            <a
              href="#service-subsections"
              class="service-detail-primary"
            >

              Explore

              <span>
                ↓
              </span>

            </a>


            <a
              href="/contact/"
              class="service-detail-secondary"
            >

              Start A Project

              <span>
                ↗
              </span>

            </a>


          </div>


        </div>


      </section>



      <!-- ===============================================
           SUB SERVICES
      ================================================ -->

      <section
        id="service-subsections"
        class="service-subsections"
      >

        ${renderSubservices(
          service.subservices
        )}

      </section>

    `;



  document.title =
    `${service.navLabel} | APE Studio`;

}



/* =========================================================
   MOTION
========================================================= */

function initMotion() {

  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
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

      ".service-detail-back",

      {
        opacity: 0,
        y: 10
      },

      {
        opacity: 1,
        y: 0,

        duration:
          .35
      }

    )

    .fromTo(

      ".service-detail-hero__eyebrow",

      {
        opacity: 0,
        y: 12
      },

      {
        opacity: 1,
        y: 0,

        duration:
          .4
      },

      "-=.15"

    )

    .fromTo(

      ".service-detail-hero h1",

      {
        opacity: 0,
        y: 45
      },

      {
        opacity: 1,
        y: 0,

        duration:
          .78
      },

      "-=.18"

    )

    .fromTo(

      ".service-detail-hero__lead",

      {
        opacity: 0,
        y: 18
      },

      {
        opacity: 1,
        y: 0,

        duration:
          .5
      },

      "-=.35"

    )

    .fromTo(

      ".service-detail-hero__actions",

      {
        opacity: 0,
        y: 16
      },

      {
        opacity: 1,
        y: 0,

        duration:
          .45
      },

      "-=.3"

    );



  const sections =
    gsap.utils.toArray(
      ".service-subsection"
    );


  sections.forEach(
    function (
      section
    ) {

      const content =
        section.querySelector(
          ".service-subsection__content"
        );


      const images =
        section.querySelectorAll(
          "figure"
        );



      gsap.fromTo(

        content,

        {
          opacity: 0,
          y: 22
        },

        {
          opacity: 1,
          y: 0,

          duration:
            .6,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              section,

            start:
              "top 78%",

            once:
              true

          }

        }

      );



      gsap.fromTo(

        images,

        {
          opacity: 0,
          y: 25,
          scale: .98
        },

        {
          opacity: 1,
          y: 0,
          scale: 1,

          duration:
            .65,

          stagger:
            .08,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              section,

            start:
              "top 78%",

            once:
              true

          }

        }

      );

    }
  );

}



/* =========================================================
   SMOOTH CTA
========================================================= */

function initAnchor() {

  const button =
    document.querySelector(
      ".service-detail-primary"
    );


  const target =
    document.getElementById(
      "service-subsections"
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

    renderServicePage();

    initAnchor();

    initFooter();


    requestAnimationFrame(
      function () {

        initMotion();

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