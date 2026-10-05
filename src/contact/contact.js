/* =========================================================
   APE STUDIO — CONTACT
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/contact-page.css";


import {
  initHeader
} from "../header/header.js";


gsap.registerPlugin(
  ScrollTrigger
);



/* =========================================================
   GOOGLE APPS SCRIPT URL

   REPLACE THIS AFTER DEPLOYING YOUR GOOGLE APPS SCRIPT.
========================================================= */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxa2g03RBbN0y8fMBVH56Pe-eYVn7XzHXmGUmu2IAkTF3Mxp0YA9rPT3vP70jJP0nOANw/exec";



/* =========================================================
   FORM
========================================================= */

function initContactForm() {

  const form =
    document.getElementById(
      "ape-contact-form"
    );


  const frame =
    document.getElementById(
      "contact-form-frame"
    );


  const submit =
    document.getElementById(
      "contact-submit"
    );


  const status =
    document.getElementById(
      "contact-form-status"
    );


  if (
    !form ||
    !frame ||
    !submit ||
    !status
  ) {

    return;

  }



  /* ===============================================
     GOOGLE ENDPOINT
  =============================================== */

  if (
    GOOGLE_SCRIPT_URL.startsWith(
      "https://script.google.com/"
    )
  ) {

    form.action =
      GOOGLE_SCRIPT_URL;

  }



  /* ===============================================
     TRACKING
  =============================================== */

  const params =
    new URLSearchParams(
      window.location.search
    );


  const pageUrl =
    document.getElementById(
      "contact-page-url"
    );


  const referrer =
    document.getElementById(
      "contact-referrer"
    );


  const utmSource =
    document.getElementById(
      "contact-utm-source"
    );


  const utmMedium =
    document.getElementById(
      "contact-utm-medium"
    );


  const utmCampaign =
    document.getElementById(
      "contact-utm-campaign"
    );


  if (pageUrl) {

    pageUrl.value =
      window.location.href;

  }


  if (referrer) {

    referrer.value =
      document.referrer || "";

  }


  if (utmSource) {

    utmSource.value =
      params.get(
        "utm_source"
      )
      ||
      "";

  }


  if (utmMedium) {

    utmMedium.value =
      params.get(
        "utm_medium"
      )
      ||
      "";

  }


  if (utmCampaign) {

    utmCampaign.value =
      params.get(
        "utm_campaign"
      )
      ||
      "";

  }



  let hasSubmitted =
    false;



  /* ===============================================
     SUBMIT
  =============================================== */

  form.addEventListener(
    "submit",
    function (
      event
    ) {

      if (
        !GOOGLE_SCRIPT_URL.startsWith(
          "https://script.google.com/"
        )
      ) {

        event.preventDefault();


        status.classList.add(
          "is-error"
        );


        status.textContent =
          "Google Sheet connection has not been configured yet.";


        return;

      }



      hasSubmitted =
        true;


      submit.disabled =
        true;


      status.classList.remove(
        "is-error"
      );


      status.textContent =
        "Sending your enquiry…";

    }
  );



  /* ===============================================
     SUCCESS AFTER GOOGLE RECEIVES THE FORM
  =============================================== */

  frame.addEventListener(
    "load",
    function () {

      if (
        !hasSubmitted
      ) {

        return;

      }


      hasSubmitted =
        false;


      submit.disabled =
        false;


      status.classList.remove(
        "is-error"
      );


      status.textContent =
        "Thank you. Your enquiry has been sent.";


      form.reset();


      /*
       * Restore hidden tracking fields
       * because form.reset() clears them.
       */

      if (pageUrl) {

        pageUrl.value =
          window.location.href;

      }


      if (referrer) {

        referrer.value =
          document.referrer || "";

      }


      if (utmSource) {

        utmSource.value =
          params.get(
            "utm_source"
          )
          ||
          "";

      }


      if (utmMedium) {

        utmMedium.value =
          params.get(
            "utm_medium"
          )
          ||
          "";

      }


      if (utmCampaign) {

        utmCampaign.value =
          params.get(
            "utm_campaign"
          )
          ||
          "";

      }

    }
  );

}



/* =========================================================
   MOTION
========================================================= */

function initContactMotion() {

  gsap
    .timeline({

      defaults: {

        ease:
          "power4.out"

      }

    })

    .fromTo(
      ".contact-hero h1",

      {
        opacity: 0,
        y: 80
      },

      {
        opacity: 1,
        y: 0,

        duration: 1
      }
    )

    .fromTo(
      ".contact-detail",

      {
        opacity: 0,
        y: 25
      },

      {
        opacity: 1,
        y: 0,

        duration: 0.7,

        stagger: 0.08
      },

      "-=0.45"
    );



  gsap.fromTo(
    ".contact-form-section__intro",

    {
      opacity: 0,
      y: 45
    },

    {
      opacity: 1,
      y: 0,

      duration: 0.9,

      ease:
        "power3.out",

      scrollTrigger: {

        trigger:
          ".contact-form-section",

        start:
          "top 75%"

      }

    }
  );



  gsap.fromTo(
    ".contact-form",

    {
      opacity: 0,
      y: 55
    },

    {
      opacity: 1,
      y: 0,

      duration: 0.95,

      ease:
        "power3.out",

      scrollTrigger: {

        trigger:
          ".contact-form-section",

        start:
          "top 70%"

      }

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


    initContactForm();


    initFooter();



    requestAnimationFrame(
      function () {

        initContactMotion();


        ScrollTrigger.refresh();

      }
    );

  }
);