import "./style.css";
import "./styles/home-popup.css";

import { initHero } from "./hero/hero.js";
import { initHeader } from "./header/header.js";
import { initHome } from "./home/home.js";
import { initWorkCarousel } from "./home/work-carousel.js";
import { initHomeProjectPopup } from "./home/home-popup.js";


document.addEventListener(
  "DOMContentLoaded",
  function () {

    initHeader();

    initHero();

    /*
     * Existing homepage systems:
     * About, Services, Clients, Recognition.
     */
    initHome();


    /*
     * Work gets its own isolated
     * high-performance drag system.
     *
     * It runs AFTER initHome so it can
     * safely remove the old Work-only
     * ScrollTrigger logic.
     */
    initWorkCarousel();


    initHomeProjectPopup();

  }
);