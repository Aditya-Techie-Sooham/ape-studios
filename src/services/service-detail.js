/* =========================================================
   APE STUDIO — SERVICE DETAIL
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


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
   SERVICE MASCOTS
========================================================= */

const SERVICE_MASCOTS = {

  "digital-marketing":
    "/mascot/ape-laptop.webp",

  "printables":
    "/mascot/ape-idea.webp",

  "branding":
    "/mascot/ape-thinking.webp",

  "influencer-marketing":
    "/mascot/ape-phone.webp",

  "visual-studio":
    "/mascot/ape-camera.webp"

};


/* =========================================================
   GET SERVICE SLUG
========================================================= */

function getServiceSlug() {

  const bodySlug =
    document.body.dataset.service;


  if (bodySlug) {

    return bodySlug;

  }


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
   GET SERVICE DATA
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
   SAFE SECTION ID
========================================================= */

function createSectionId(
  title
) {

  return title
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-|-$/g,
      ""
    );

}


/* =========================================================
   HERO LINES
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
            class="
              service-detail-hero__title-line
              ${
                line.accent
                  ? "is-accent"
                  : ""
              }
            "
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
   H2 STRUCTURE
========================================================= */

function renderSubservices(
  service
) {

  return service.subservices
    .map(
      function (
        item,
        index
      ) {

        const id =
          createSectionId(
            item.title
          );


        const headingId =
          `${id}-title`;


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
            aria-labelledby="${headingId}"
          >


            <div class="service-subsection__inner">


              <div class="service-subsection__content">


                <p class="service-subsection__eyebrow">
                  ${service.navLabel}
                </p>


                <h2 id="${headingId}">
                  ${item.title}
                </h2>


                <p class="service-subsection__description">
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
                    alt="${item.title} creative example by APE Studio"
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


  const mascot =
    SERVICE_MASCOTS[
      service.slug
    ]
    ||
    "/mascot/ape-idea.webp";


  const heroTitleId =
    `${service.slug}-service-title`;


  root.innerHTML =
    `

      <!-- ===============================================
           HERO
      ================================================ -->

      <section
        id="service-detail-hero"
        class="service-detail-hero"
        aria-labelledby="${heroTitleId}"
      >


        <div
          class="service-detail-hero__glow service-detail-hero__glow--violet"
          aria-hidden="true"
        ></div>


        <div
          class="service-detail-hero__glow service-detail-hero__glow--lime"
          aria-hidden="true"
        ></div>



        <div class="service-detail-hero__inner">


          <!-- =============================================
               LEFT
          ============================================== -->

          <div class="service-detail-hero__content">


            <a
              href="/services/"
              class="service-detail-back"
            >
              ← ALL SERVICES
            </a>


            <p class="service-detail-hero__eyebrow">
              ${service.eyebrow}
            </p>


            <!--
              ONE H1 PER SERVICE DETAIL PAGE.

              SPANS ARE PRESENTATION / ANIMATION WRAPPERS ONLY.
            -->

            <h1 id="${heroTitleId}">

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

                EXPLORE

                <span aria-hidden="true">
                  ↓
                </span>

              </a>


              <a
                href="/contact/"
                class="service-detail-secondary"
              >

                START A PROJECT

                <span aria-hidden="true">
                  ↗
                </span>

              </a>


            </div>


          </div>



          <!-- =============================================
               DECORATIVE MASCOT
          ============================================== -->

          <div class="service-detail-hero__visual">


            <button
              type="button"
              class="service-detail-ape"
              aria-label="Make the APE Studio mascot react"
            >


              <span
                class="service-detail-ape__aura"
                aria-hidden="true"
              ></span>


              <span class="service-detail-ape__world">

                <span class="service-detail-ape__rig">

                  <span class="service-detail-ape__float">

                    <img
                      src="${mascot}"
                      alt=""
                      draggable="false"
                    >

                  </span>

                </span>

              </span>


            </button>


          </div>


        </div>


      </section>



      <!-- ===============================================
           SUB SERVICES
           H2 SECTIONS
      ================================================ -->

      <section
        id="service-subsections"
        class="service-subsections"
        aria-label="${service.navLabel} services"
      >

        ${renderSubservices(
          service
        )}

      </section>

    `;


  /*
   * IMPORTANT SEO RULE
   *
   * DO NOT overwrite:
   *
   * document.title
   * meta description
   * canonical
   * Open Graph
   *
   * Each HTML page owns its own unique SEO metadata.
   */

}


/* =========================================================
   HERO APE DANCE
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
        y: -26,
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

        duration: 0.55
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

        duration: 0.58
      }
    );

  }

}


/* =========================================================
   HERO APE INTERACTION
========================================================= */

function initHeroApe() {

  const ape =
    document.querySelector(
      ".service-detail-ape"
    );


  const world =
    document.querySelector(
      ".service-detail-ape__world"
    );


  const rig =
    document.querySelector(
      ".service-detail-ape__rig"
    );


  const float =
    document.querySelector(
      ".service-detail-ape__float"
    );


  const aura =
    document.querySelector(
      ".service-detail-ape__aura"
    );


  const pulse =
    document.querySelector(
      ".service-detail-ape__pulse"
    );


  if (
    !ape ||
    !world ||
    !rig ||
    !float
  ) {

    return;

  }


  if (!reduceMotion) {

    gsap.to(
      float,
      {
        y: -8,
        rotation: 1.4,

        duration: 1.7,

        repeat: -1,

        yoyo: true,

        ease:
          "sine.inOut"
      }
    );


    gsap.to(
      ".service-detail-hero__visual",
      {
        yPercent: -4,

        ease: "none",

        scrollTrigger: {

          trigger:
            ".service-detail-hero",

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
              x * 20,

            y:
              y * 11,

            duration: 0.34,

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

            scale: 1.045,

            duration: 0.32,

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
   HERO MOTION
========================================================= */

function initHeroMotion() {

  if (reduceMotion) {

    return;

  }


  gsap.timeline({

    defaults: {

      ease:
        "power4.out"

    }

  })

    .fromTo(
      ".service-detail-back",
      {
        opacity: 0,
        y: 12
      },
      {
        opacity: 1,
        y: 0,

        duration: 0.4
      }
    )


    .fromTo(
      ".service-detail-hero__eyebrow",
      {
        opacity: 0,
        y: 13
      },
      {
        opacity: 1,
        y: 0,

        duration: 0.42
      },
      "-=0.18"
    )


    .fromTo(
      ".service-detail-hero__title-line",
      {
        opacity: 0,
        y: 50,
        rotationX: -10
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,

        duration: 0.76,

        stagger: 0.08
      },
      "-=0.2"
    )


    .fromTo(
      ".service-detail-hero__lead",
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,

        duration: 0.55
      },
      "-=0.4"
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

        duration: 0.48
      },
      "-=0.32"
    )


    .fromTo(
      ".service-detail-ape",
      {
        opacity: 0,
        x: 65,
        y: 55,
        scale: 0.8,
        rotation: 5
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,

        duration: 1.05,

        ease:
          "back.out(1.5)"
      },
      "-=0.72"
    );

}


/* =========================================================
   SUBSERVICE MOTION
========================================================= */

function initSubserviceMotion() {

  if (reduceMotion) {

    return;

  }


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


      const figures =
        section.querySelectorAll(
          "figure"
        );


      const images =
        section.querySelectorAll(
          "figure img"
        );


      gsap.fromTo(
        content,
        {
          opacity: 0,
          y: 36
        },
        {
          opacity: 1,
          y: 0,

          duration: 0.72,

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
        figures,
        {
          opacity: 0,
          y: 40,
          scale: 0.965
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,

          duration: 0.78,

          stagger: 0.09,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              section,

            start:
              "top 80%",

            once:
              true

          }
        }
      );


      images.forEach(
        function (
          image
        ) {

          gsap.fromTo(
            image,
            {
              yPercent: -3,
              scale: 1.04
            },
            {
              yPercent: 3,
              scale: 1.04,

              ease: "none",

              scrollTrigger: {

                trigger:
                  image.closest(
                    "figure"
                  ),

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
      );

    }
  );

}


/* =========================================================
   EXPLORE CTA
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

    renderServicePage();

    initAnchor();

    initFooter();


    requestAnimationFrame(
      function () {

        initHeroApe();

        initHeroMotion();

        initSubserviceMotion();

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