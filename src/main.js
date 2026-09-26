import "./style.css";

import {
  initHero
} from "./hero/hero.js";

import {
  initHeader
} from "./header/header.js";

import {
  initHome
} from "./home/home.js";


document.addEventListener(
  "DOMContentLoaded",
  function () {

    initHeader();

    initHero();

    initHome();

  }
);