import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


/* =========================================================
   CSS
========================================================= */

import "../styles/variables.css";
import "../styles/reset.css";

import "../styles/header.css";

import "../styles/experience.css";
import "../styles/team.css";
import "../styles/story.css";

/*
 * IMPORTANT:
 * About-specific CSS MUST be loaded last.
 */

import "../styles/footer.css";
import "../styles/about-page.css";


/* =========================================================
   JS
========================================================= */

import {
  initHeader
} from "../header/header.js";


import {
  initExperience
} from "../experience/experience.js";


gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   ABOUT PAGE MOTION
========================================================= */

function initAboutMotion() {

  const hero =
    document.querySelector(
      ".about-hero"
    );


  if (!hero) {
    return;
  }


  const titleLines =
    hero.querySelectorAll(
      ".about-hero__headline h1 span"
    );


  const lead =
    hero.querySelector(
      ".about-hero__lead"
    );


  const body =
    hero.querySelectorAll(
      ".about-hero__body p"
    );


  const positioning =
    hero.querySelectorAll(
      ".about-hero__positioning span"
    );


  const backgroundWord =
    hero.querySelector(
      ".about-hero__ape"
    );


  /* =====================================================
     INITIAL HERO REVEAL
  ===================================================== */

  const introTimeline =
    gsap.timeline({
      defaults: {
        ease: "power4.out"
      }
    });


  introTimeline
    .fromTo(
      titleLines,
      {
        opacity: 0,
        y: 90
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.10
      }
    )

    .fromTo(
      lead,
      {
        opacity: 0,
        y: 45
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.75
      },
      "-=0.55"
    )

    .fromTo(
      body,
      {
        opacity: 0,
        y: 35
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.10
      },
      "-=0.55"
    )

    .fromTo(
      positioning,
      {
        opacity: 0,
        y: 22
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08
      },
      "-=0.40"
    );


  /* =====================================================
     HERO EXIT
     SCRUB = AUTOMATICALLY REVERSIBLE
  ===================================================== */

  gsap.to(
    ".about-hero__headline",
    {
      yPercent: -12,

      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    }
  );


  gsap.to(
    ".about-hero__content",
    {
      yPercent: -6,

      scrollTrigger: {
        trigger: hero,
        start: "20% top",
        end: "bottom top",
        scrub: 0.8
      }
    }
  );


  if (backgroundWord) {

    gsap.fromTo(
      backgroundWord,
      {
        xPercent: 0
      },
      {
        xPercent: -12,

        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      }
    );

  }


  ScrollTrigger.refresh();

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    initHeader();

    initExperience();

    initAboutMotion();

  }
);