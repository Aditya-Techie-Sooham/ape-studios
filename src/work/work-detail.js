/* =========================================================
   APE STUDIO — WORK DETAIL
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/work-detail.css";


import {
  initHeader
} from "../header/header.js";


import {
  getWorkProject,
  workImagePath
} from "./work-data.js";


gsap.registerPlugin(
  ScrollTrigger
);



/* =========================================================
   GLOBAL SHELL
========================================================= */

function renderShell() {

  const root =
    document.getElementById(
      "work-detail-root"
    );


  if (!root) {
    return;
  }


  root.innerHTML =
    `

      <header
        id="site-header"
        class="site-header is-light"
      >

        <div class="site-header__inner">


          <a
            href="/"
            class="site-header__brand"
            aria-label="APE Studio Home"
          >

            <img
              src="/ape-logo.png"
              alt="APE Studio"
              class="site-header__logo"
            >

          </a>


          <nav
            class="site-header__nav"
            aria-label="Primary navigation"
          >

            <a href="/">
              Home
            </a>

            <a href="/about/">
              About
            </a>

            <a href="/services/">
              Services
            </a>

            <a
              href="/work/"
              class="is-active"
            >
              Work
            </a>

            <a href="/blog/">
              Blog
            </a>

            <a href="/faq/">
              FAQ
            </a>

            <a href="/contact/">
              Contact
            </a>

          </nav>


          <a
            href="/contact/"
            class="site-header__cta"
          >

            <span>
              Let's Talk
            </span>

            <span>
              ↗
            </span>

          </a>


          <button
            id="site-menu-toggle"
            class="site-menu-toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
          >

            <span></span>
            <span></span>

          </button>

        </div>


        <div
          id="site-mobile-menu"
          class="site-mobile-menu"
          aria-hidden="true"
        >

          <div
            class="site-mobile-menu__background-word"
            aria-hidden="true"
          >
            APE
          </div>


          <nav class="site-mobile-menu__links">

            <a href="/">
              <small>01</small>
              <span>Home</span>
            </a>

            <a href="/about/">
              <small>02</small>
              <span>About</span>
            </a>

            <a href="/services/">
              <small>03</small>
              <span>Services</span>
            </a>

            <a
              href="/work/"
              class="is-active"
            >
              <small>04</small>
              <span>Work</span>
            </a>

            <a href="/blog/">
              <small>05</small>
              <span>Blog</span>
            </a>

            <a href="/faq/">
              <small>06</small>
              <span>FAQ</span>
            </a>

            <a href="/contact/">
              <small>07</small>
              <span>Contact</span>
            </a>

          </nav>

        </div>

      </header>


      <main
        id="work-detail-page"
        class="work-detail-page"
      ></main>


      <footer
        id="site-footer"
        class="site-footer"
      >

        <div class="site-footer__container">


          <div class="site-footer__cta">

            <div>

              <p class="site-footer__eyebrow">
                READY TO MAKE A MOVE?
              </p>

              <h2>

                LET'S BUILD

                <span>
                  SOMETHING GOOD.
                </span>

              </h2>

            </div>


            <a
              href="/contact/"
              class="site-footer__cta-button"
            >

              <span>
                LET'S TALK
              </span>

              <i>
                ↗
              </i>

            </a>

          </div>


          <div class="site-footer__main">


            <div class="site-footer__brand-column">

              <a
                href="/"
                class="site-footer__logo"
              >

                <img
                  src="/ape-logo.png"
                  alt="APE Studio"
                >

              </a>

              <p>
                Strategy, creativity, digital and production
                brought together to build brands that get noticed,
                remembered and chosen.
              </p>

            </div>


            <div class="site-footer__column">

              <p class="site-footer__column-title">
                PAGES
              </p>

              <nav>

                <a href="/">
                  Home
                </a>

                <a href="/about/">
                  About
                </a>

                <a href="/services/">
                  Services
                </a>

                <a href="/work/">
                  Work
                </a>

              </nav>

            </div>


            <div class="site-footer__column">

              <p class="site-footer__column-title">
                EXPLORE
              </p>

              <nav>

                <a href="/blog/">
                  Blog
                </a>

                <a href="/faq/">
                  FAQ
                </a>

                <a href="/contact/">
                  Contact
                </a>

              </nav>

            </div>


            <div
              class="
                site-footer__column
                site-footer__column--services
              "
            >

              <p class="site-footer__column-title">
                CAPABILITIES
              </p>

              <nav>

                <a href="/services/">
                  Social Media
                </a>

                <a href="/services/">
                  Performance Marketing
                </a>

                <a href="/services/">
                  Branding
                </a>

                <a href="/services/">
                  Website Development
                </a>

              </nav>

            </div>


          </div>


          <div class="site-footer__divider"></div>


          <div class="site-footer__bottom">


            <div class="site-footer__copyright">

              <span>
                ©
                <span id="ape-footer-year"></span>
                APE STUDIO
              </span>

              <span>
                ALL RIGHTS RESERVED
              </span>

            </div>


            <div class="site-footer__bottom-nav">

              <a href="/about/">
                ABOUT
              </a>

              <a href="/services/">
                SERVICES
              </a>

              <a href="/work/">
                WORK
              </a>

              <a href="/blog/">
                BLOG
              </a>

              <a href="/faq/">
                FAQ
              </a>

              <a href="/contact/">
                CONTACT
              </a>

            </div>


            <a
              href="#"
              class="site-footer__top-link"
            >

              BACK TO TOP

              <span>
                ↑
              </span>

            </a>


          </div>


        </div>

      </footer>

    `;

}



/* =========================================================
   CURRENT SLUG
========================================================= */

function getCurrentSlug() {

  if (
    document.body.dataset.workProject
  ) {

    return (
      document.body.dataset.workProject
    );

  }


  const parts =
    window.location.pathname
      .split("/")
      .filter(Boolean);


  return (
    parts[1]
    ||
    ""
  );

}



/* =========================================================
   HERO
   NO PROJECT NUMBER / CATEGORY META
========================================================= */

function createHero(
  project
) {

  const section =
    document.createElement(
      "section"
    );


  section.className =
    "work-detail-hero";


  section.innerHTML =
    `

      <div class="work-detail-hero__inner">


        <a
          href="/work/"
          class="work-detail__back"
        >
          ← All Work
        </a>


        <h1>
          ${project.name}
        </h1>


        <div class="work-detail__intro">


          <p class="work-detail__lead">
            ${project.intro}
          </p>


          <p class="work-detail__description">
            ${project.description}
          </p>


        </div>


      </div>

    `;


  return section;

}



/* =========================================================
   GALLERY

   NO 01
   NO BRAND NAME CAPTION
   JUST THE WORK.
========================================================= */

function createGallery(
  project
) {

  const section =
    document.createElement(
      "section"
    );


  section.className =
    "work-gallery-section";


  const inner =
    document.createElement(
      "div"
    );


  inner.className =
    "work-gallery-section__inner";



  const gallery =
    document.createElement(
      "div"
    );


  gallery.className =
    "work-gallery";



  for (
    let index = 1;
    index <= 10;
    index += 1
  ) {

    const item =
      document.createElement(
        "article"
      );


    item.className =
      "work-gallery__item";


    item.innerHTML =
      `

        <figure>

          <div class="work-gallery__image">

            <img
              src="${workImagePath(
                project.slug,
                index
              )}"
              alt="${project.name} project visual"
              loading="${
                index <= 3
                  ? "eager"
                  : "lazy"
              }"
              decoding="async"
            >

          </div>

        </figure>

      `;


    const image =
      item.querySelector(
        "img"
      );


    image.addEventListener(
      "error",
      function () {

        item.classList.add(
          "is-missing"
        );

      }
    );


    gallery.appendChild(
      item
    );

  }


  inner.appendChild(
    gallery
  );


  section.appendChild(
    inner
  );


  return section;

}



/* =========================================================
   PAGE
========================================================= */

function buildProjectPage() {

  const main =
    document.getElementById(
      "work-detail-page"
    );


  if (!main) {
    return;
  }


  const project =
    getWorkProject(
      getCurrentSlug()
    );


  if (!project) {

    main.innerHTML =
      `

        <section class="work-detail-hero">

          <div class="work-detail-hero__inner">

            <a
              href="/work/"
              class="work-detail__back"
            >
              ← All Work
            </a>

            <h1>
              Project Not Found.
            </h1>

          </div>

        </section>

      `;


    return;

  }


  document.title =
    `${project.name} | Work | APE Studio`;


  const description =
    document.querySelector(
      'meta[name="description"]'
    );


  if (description) {

    description.setAttribute(
      "content",
      project.intro
    );

  }


  main.append(

    createHero(
      project
    ),

    createGallery(
      project
    )

  );

}



/* =========================================================
   MOTION
========================================================= */

function initMotion() {

  const reduced =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduced) {
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

      ".work-detail__back",

      {
        opacity: 0,
        y: 16
      },

      {
        opacity: 1,
        y: 0,
        duration: .4
      }

    )

    .fromTo(

      ".work-detail-hero h1",

      {
        opacity: 0,
        y: 60
      },

      {
        opacity: 1,
        y: 0,
        duration: .8
      },

      "-=.2"

    )

    .fromTo(

      ".work-detail__intro",

      {
        opacity: 0,
        y: 25
      },

      {
        opacity: 1,
        y: 0,
        duration: .6
      },

      "-=.38"

    );



  gsap.utils
    .toArray(
      ".work-gallery__item"
    )
    .forEach(
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

            duration: .65,

            ease:
              "power3.out",

            scrollTrigger: {

              trigger:
                item,

              start:
                "top 92%",

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

    renderShell();

    initHeader();

    buildProjectPage();

    initFooter();


    requestAnimationFrame(
      function () {

        initMotion();

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