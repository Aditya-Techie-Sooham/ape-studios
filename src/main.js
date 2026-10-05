import "./style.css";

import "./styles/home-popup.css";


import {
  initHero
} from "./hero/hero.js";


import {
  initHeader
} from "./header/header.js";


import {
  initHome
} from "./home/home.js";


import {
  initHomeProjectPopup
} from "./home/home-popup.js";


document.addEventListener(
  "DOMContentLoaded",
  function () {

    initHeader();


    initHero();


    initHome();


    initHomeProjectPopup();

  }
);