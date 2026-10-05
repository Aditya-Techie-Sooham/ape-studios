/* =========================================================
   APE STUDIO — FAQ PAGE
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/faq-page.css";


import {
  initHeader
} from "../header/header.js";


gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   FAQ ACCORDION
========================================================= */

function initFAQAccordion() {

  const items =
    document.querySelectorAll(
      ".faq-item"
    );


  if (
    !items.length
  ) {

    return;

  }


  items.forEach(
    function (
      item
    ) {

      const button =
        item.querySelector(
          ".faq-item__button"
        );


      const answer =
        item.querySelector(
          ".faq-item__answer"
        );


      if (
        !button
        ||
        !answer
      ) {

        return;

      }


      /*
       * All FAQs start closed.
       */

      gsap.set(
        answer,
        {
          height: 0
        }
      );


      button.addEventListener(
        "click",
        function () {

          const currentlyOpen =
            item.classList.contains(
              "is-open"
            );


          /* ===============================================
             CLOSE EVERY FAQ
          =============================================== */

          items.forEach(
            function (
              otherItem
            ) {

              const otherButton =
                otherItem.querySelector(
                  ".faq-item__button"
                );


              const otherAnswer =
                otherItem.querySelector(
                  ".faq-item__answer"
                );


              otherItem.classList.remove(
                "is-open"
              );


              if (
                otherButton
              ) {

                otherButton.setAttribute(
                  "aria-expanded",
                  "false"
                );

              }


              if (
                otherAnswer
              ) {

                gsap.killTweensOf(
                  otherAnswer
                );


                gsap.to(
                  otherAnswer,
                  {

                    height: 0,

                    duration:
                      0.42,

                    ease:
                      "power3.inOut",

                    overwrite:
                      true

                  }
                );

              }

            }
          );


          /* ===============================================
             IF CURRENT WAS ALREADY OPEN,
             LEAVE EVERYTHING CLOSED
          =============================================== */

          if (
            currentlyOpen
          ) {

            requestAnimationFrame(
              function () {

                ScrollTrigger.refresh();

              }
            );


            return;

          }


          /* ===============================================
             OPEN SELECTED FAQ
          =============================================== */

          item.classList.add(
            "is-open"
          );


          button.setAttribute(
            "aria-expanded",
            "true"
          );


          gsap.killTweensOf(
            answer
          );


          gsap.to(
            answer,
            {

              height:
                "auto",

              duration:
                0.55,

              ease:
                "power3.inOut",

              overwrite:
                true,

              onComplete:
                function () {

                  ScrollTrigger.refresh();

                }

            }
          );

        }
      );

    }
  );

}


/* =========================================================
   PAGE MOTION
========================================================= */

function initFAQMotion() {

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (
    reduceMotion
  ) {

    gsap.set(
      [
        ".faq-intro h1",
        ".faq-item"
      ],
      {
        opacity: 1,
        y: 0
      }
    );


    return;

  }


  /* =====================================================
     HERO H1
  ===================================================== */

  gsap.fromTo(

    ".faq-intro h1",

    {
      opacity: 0,
      y: 80
    },

    {
      opacity: 1,
      y: 0,

      duration:
        1,

      ease:
        "power4.out"
    }

  );


  /* =====================================================
     FAQ ITEMS
  ===================================================== */

  const items =
    gsap.utils.toArray(
      ".faq-item"
    );


  items.forEach(
    function (
      item
    ) {

      gsap.fromTo(

        item,

        {
          opacity: 0,
          y: 35
        },

        {
          opacity: 1,
          y: 0,

          duration:
            0.72,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              item,

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
   FOOTER
========================================================= */

function initFooter() {

  const year =
    document.getElementById(
      "ape-footer-year"
    );


  if (
    year
  ) {

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


  if (
    !topButton
  ) {

    return;

  }


  topButton.addEventListener(
    "click",
    function (
      event
    ) {

      event.preventDefault();


      window.scrollTo(
        {

          top: 0,

          behavior:
            "smooth"

        }
      );

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


    initFAQAccordion();


    initFooter();


    requestAnimationFrame(
      function () {

        initFAQMotion();


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