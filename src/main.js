import "./style.css";
import "./styles/home-popup.css";

import { initHero } from "./hero/hero.js";
import { initHeader } from "./header/header.js";

import { initHome } from "./home/home.js";
import { initWorkCarousel } from "./home/work-carousel.js";
import { initClientsCarousel } from "./home/clients-carousel.js";

import { initHomeProjectPopup } from "./home/home-popup.js";


document.addEventListener(
  "DOMContentLoaded",
  function () {

    initHeader();

    initHero();


    /*
     * Existing homepage:
     * About / Services / Recognition etc.
     */
    initHome();


    /*
     * Premium isolated Work carousel.
     */
    initWorkCarousel();


    /*
     * Single-strip Clients carousel.
     *
     * This automatically removes the
     * old two-row client layout.
     */
    initClientsCarousel();


    initHomeProjectPopup();

  }
);