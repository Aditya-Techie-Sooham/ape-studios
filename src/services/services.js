/* =========================================================
   APE STUDIO — SERVICES MAIN
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/services-page.css";


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
   ORDER
========================================================= */

const SERVICE_ORDER = [

  "digital-marketing",

  "printables",

  "branding",

  "influencer-marketing",

  "visual-studio"

];



/* =========================================================
   GET COVER IMAGE
========================================================= */

function getCoverImage(
  service
) {

  return (
    service?.subservices?.[0]?.images?.[0]
    ||
    "/ape-logo.png"
  );

}



/* =========================================================
   BUILD 5 SERVICE ROWS

   IMPORTANT:
   NO SUB SERVICES
   NO DESCRIPTION
   NO NUMBERS
========================================================= */

function buildServiceDirectory() {

  const list =
    document.querySelector(
      ".capability-list"
    );


  if (!list) {
    return;
  }


  list.innerHTML =
    "";



  SERVICE_ORDER.forEach(
    function (
      slug,
      index
    ) {

      const service =
        SERVICE_PAGES[slug];


      if (!service) {
        return;
      }



      const article =
        document.createElement(
          "article"
        );


      article.className =
        `
          capability-row
          ${
            index === 0
              ? "is-active"
              : ""
          }
        `;


      article.dataset.service =
        slug;


      article.tabIndex =
        0;



      article.innerHTML =
        `

          <div class="capability-row__top">


            <h3>
              ${service.navLabel}
            </h3>


            <a
              href="/services/${service.slug}/"
              class="capability-row__arrow"
              aria-label="View ${service.navLabel}"
            >
              ↗
            </a>


          </div>

        `;



      list.appendChild(
        article
      );

    }
  );

}



/* =========================================================
   INITIAL PREVIEW
========================================================= */

function initialisePreview() {

  const service =
    SERVICE_PAGES[
      SERVICE_ORDER[0]
    ];


  const image =
    document.getElementById(
      "service-preview-image"
    );


  if (
    !service
    ||
    !image
  ) {

    return;

  }


  image.src =
    getCoverImage(
      service
    );


  image.alt =
    `${service.navLabel} work by APE Studio`;

}



/* =========================================================
   DESKTOP INTERACTION
========================================================= */

function initCapabilities() {

  const rows =
    Array.from(
      document.querySelectorAll(
        ".capability-row"
      )
    );


  const image =
    document.getElementById(
      "service-preview-image"
    );


  const frame =
    document.getElementById(
      "capability-preview-frame"
    );


  if (!rows.length) {
    return;
  }



  let activeSlug =
    SERVICE_ORDER[0];


  let timeline =
    null;



  function activate(
    row
  ) {

    const slug =
      row.dataset.service;


    const service =
      SERVICE_PAGES[slug];


    if (!service) {
      return;
    }



    rows.forEach(
      function (
        current
      ) {

        current.classList.toggle(
          "is-active",
          current === row
        );

      }
    );



    /*
     * MOBILE
     * only visual active state.
     * Arrow handles navigation.
    */

    if (
      window.innerWidth <=
      767
    ) {

      activeSlug =
        slug;

      return;

    }



    if (
      !image
      ||
      slug === activeSlug
    ) {

      return;

    }


    activeSlug =
      slug;



    if (timeline) {

      timeline.kill();

    }



    timeline =
      gsap.timeline();



    timeline.to(

      image,

      {
        opacity:
          0,

        scale:
          1.04,

        duration:
          0.18,

        ease:
          "power2.in",

        onComplete:
          function () {

            image.src =
              getCoverImage(
                service
              );


            image.alt =
              `${service.navLabel} work by APE Studio`;

          }

      }

    );



    timeline.fromTo(

      image,

      {
        opacity:
          0,

        scale:
          1.055
      },

      {
        opacity:
          1,

        scale:
          1,

        duration:
          0.55,

        ease:
          "power3.out"
      }

    );

  }



  rows.forEach(
    function (
      row
    ) {

      row.addEventListener(
        "mouseenter",
        function () {

          if (
            window.matchMedia(
              "(hover: hover) and (pointer: fine)"
            ).matches
          ) {

            activate(
              row
            );

          }

        }
      );



      row.addEventListener(
        "focusin",
        function () {

          activate(
            row
          );

        }
      );



      row.addEventListener(
        "click",
        function (
          event
        ) {

          /*
           * If arrow clicked,
           * do not interfere.
          */

          if (
            event.target.closest(
              "a"
            )
          ) {

            return;

          }


          if (
            window.innerWidth <=
            767
          ) {

            activate(
              row
            );

          }

        }
      );

    }
  );



  /* =====================================================
     IMAGE TILT
  ===================================================== */

  if (frame) {

    frame.addEventListener(
      "pointermove",
      function (
        event
      ) {

        if (
          window.innerWidth <=
          767
        ) {

          return;

        }


        const rect =
          frame.getBoundingClientRect();


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

          frame,

          {
            rotateY:
              (
                x -
                0.5
              )
              *
              2.5,

            rotateX:
              (
                0.5 -
                y
              )
              *
              2.5,

            duration:
              0.4,

            ease:
              "power3.out",

            overwrite:
              true
          }

        );

      }
    );



    frame.addEventListener(
      "pointerleave",
      function () {

        gsap.to(

          frame,

          {
            rotateX: 0,
            rotateY: 0,

            duration:
              0.45,

            ease:
              "power3.out"
          }

        );

      }
    );

  }

}



/* =========================================================
   HERO MOTION
========================================================= */

function initHero() {

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

      ".services-hero__eyebrow",

      {
        opacity:
          0,

        y:
          14
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

      ".services-hero h1",

      {
        opacity:
          0,

        y:
          48
      },

      {
        opacity:
          1,

        y:
          0,

        duration:
          0.8
      },

      "-=0.18"

    )

    .fromTo(

      ".services-hero__bottom",

      {
        opacity:
          0,

        y:
          20
      },

      {
        opacity:
          1,

        y:
          0,

        duration:
          0.55
      },

      "-=0.38"

    );

}



/* =========================================================
   CAPABILITY REVEAL
========================================================= */

function initCapabilityMotion() {

  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    return;

  }



  gsap.fromTo(

    ".capabilities__header",

    {
      opacity:
        0,

      y:
        20
    },

    {
      opacity:
        1,

      y:
        0,

      duration:
        0.6,

      ease:
        "power3.out",

      scrollTrigger: {

        trigger:
          ".capabilities",

        start:
          "top 84%",

        once:
          true

      }

    }

  );



  gsap.fromTo(

    ".capability-row",

    {
      opacity:
        0,

      x:
        -16
    },

    {
      opacity:
        1,

      x:
        0,

      duration:
        0.48,

      stagger:
        0.05,

      ease:
        "power3.out",

      scrollTrigger: {

        trigger:
          ".capability-list",

        start:
          "top 88%",

        once:
          true

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
      ".services-hero__cta"
    );


  const target =
    document.getElementById(
      "capabilities"
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

    buildServiceDirectory();

    initialisePreview();

    initCapabilities();

    initHero();

    initCapabilityMotion();

    initHeroCTA();

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