import { initHero } from "./hero/hero.js";

import { initHeroTitle } from "./hero/hero-title.js";

import { initHeader } from "./header/header.js";

import { initHome } from "./home/home.js";

import { initWorkCarousel } from "./home/work-carousel.js";

import { initClientsCarousel } from "./home/clients-carousel.js";

import { initMascot } from "./mascot/mascot.js";

import { initHomeProjectPopup } from "./home/home-popup.js";


function initApp() {
  /* =====================================================
     HEADER
  ===================================================== */

  initHeader();


  /* =====================================================
     HEADLINE ANIMATION OWNERSHIP

     Temporarily exclude the headline from the two older
     shuffle systems during their initialization.
  ===================================================== */

  const titleLines = Array.from(
    document.querySelectorAll(
      "#ape-hero .ape-hero__title-line"
    )
  );

  titleLines.forEach((line) => {
    line.classList.remove("ape-hero__title-line");
  });


  /* =====================================================
     EXISTING HERO AND HOMEPAGE
  ===================================================== */

  try {
    initHero();
    initHome();
  } finally {
    titleLines.forEach((line) => {
      line.classList.add("ape-hero__title-line");
    });
  }


  /* =====================================================
     ONE-TIME HEADLINE SHUFFLE

     Runs after popup dismissal when the hero is visible.
  ===================================================== */

  initHeroTitle();


  /* =====================================================
     WORK CAROUSEL
  ===================================================== */

  initWorkCarousel();


  /* =====================================================
     CLIENTS CAROUSEL
  ===================================================== */

  initClientsCarousel();


  /* =====================================================
     MASCOT
  ===================================================== */

  initMascot();


  /* =====================================================
     PROJECT POPUP
  ===================================================== */

  initHomeProjectPopup();
}


/* =====================================================
   START APP
===================================================== */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp, {
    once: true
  });
} else {
  initApp();
}