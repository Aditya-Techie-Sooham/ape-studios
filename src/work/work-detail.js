/* =========================================================
   APE STUDIO — WORK DETAIL
========================================================= */

import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


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
   ENVIRONMENT
========================================================= */

const reduceMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


const finePointer =
  window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;


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
            aria-label="APE Studio home"
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

            <span aria-hidden="true">
              ↗
            </span>

          </a>


          <button
            id="site-menu-toggle"
            class="site-menu-toggle"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="site-mobile-menu"
          >

            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>

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


          <div class="site-mobile-menu__top">

            <span>
              NAVIGATION
            </span>

            <span>
              KOLKATA / INDIA
            </span>

          </div>


          <nav
            class="site-mobile-menu__links"
            aria-label="Mobile navigation"
          >

            <a href="/">
              <span>Home</span>
            </a>

            <a href="/about/">
              <span>About</span>
            </a>

            <a href="/services/">
              <span>Services</span>
            </a>

            <a
              href="/work/"
              class="is-active"
            >
              <span>Work</span>
            </a>

            <a href="/blog/">
              <span>Blog</span>
            </a>

            <a href="/faq/">
              <span>FAQ</span>
            </a>

            <a href="/contact/">
              <span>Contact</span>
            </a>

          </nav>


          <div class="site-mobile-menu__footer">

            <a href="/contact/">
              START A PROJECT ↗
            </a>

          </div>

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

              <i aria-hidden="true">
                ↗
              </i>

            </a>

          </div>



          <div class="site-footer__main">


            <div class="site-footer__brand-column">

              <a
                href="/"
                class="site-footer__logo"
                aria-label="APE Studio home"
              >

                <img
                  src="/ape-logo.png"
                  alt="APE Studio"
                >

              </a>


              <p>
                APE Studio is a performance-driven creative and
                digital marketing agency helping brands build stronger
                identities, sharper digital presence and meaningful
                connections with their audiences.
              </p>

            </div>



            <div class="site-footer__column">

              <p class="site-footer__column-title">
                PAGES
              </p>


              <nav aria-label="Footer pages">

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


              <nav aria-label="Footer explore navigation">

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
              class="site-footer__column site-footer__column--services"
            >

              <p class="site-footer__column-title">
                CAPABILITIES
              </p>


              <nav aria-label="APE Studio services">

                <a href="/services/digital-marketing/#social-media-marketing">
                  Social Media
                </a>

                <a href="/services/digital-marketing/#performance-marketing">
                  Performance Marketing
                </a>

                <a href="/services/digital-marketing/">
                  Digital Marketing
                </a>

                <a href="/services/digital-marketing/#website-development">
                  Website Development
                </a>

                <a href="/services/printables/#packaging">
                  Packaging
                </a>

                <a href="/services/branding/">
                  Branding
                </a>

                <a href="/services/influencer-marketing/">
                  Influencer Marketing
                </a>

                <a href="/services/visual-studio/#reels">
                  Reels & Motion
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
              href="#work-detail-page"
              class="site-footer__top-link"
            >

              BACK TO TOP

              <span aria-hidden="true">
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
========================================================= */

function createHero(
  project
) {

  const section =
    document.createElement(
      "section"
    );


  section.id =
    "work-detail-hero";


  section.className =
    "work-detail-hero";


  section.setAttribute(
    "aria-labelledby",
    "work-detail-title"
  );


  section.innerHTML =
    `

      <div
        class="
          work-detail-hero__glow
          work-detail-hero__glow--violet
        "
        aria-hidden="true"
      ></div>


      <div
        class="
          work-detail-hero__glow
          work-detail-hero__glow--lime
        "
        aria-hidden="true"
      ></div>


      <div class="work-detail-hero__inner">


        <div class="work-detail-hero__copy">


          <a
            href="/work/"
            class="work-detail__back"
          >
            ← All Work
          </a>


          <p class="work-detail__eyebrow">

            APE STUDIO

            <span aria-hidden="true"></span>

            ${project.categoryLabel}

          </p>


          <h1 id="work-detail-title">
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



        <button
          type="button"
          class="work-detail__ape"
          aria-label="Make the APE Studio mascot react"
        >

          <span
            class="work-detail__ape-aura"
            aria-hidden="true"
          ></span>


          <span class="work-detail__ape-world">

            <span class="work-detail__ape-rig">

              <span class="work-detail__ape-float">

                <img
                  src="/mascot/ape-camera.webp"
                  alt=""
                  draggable="false"
                >

              </span>

            </span>

          </span>

        </button>


      </div>

    `;


  return section;

}


/* =========================================================
   GALLERY
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


  section.setAttribute(
    "aria-label",
    `${project.name} project gallery`
  );


  const inner =
    document.createElement(
      "div"
    );


  inner.className =
    "work-gallery-section__inner";


  const header =
    document.createElement(
      "div"
    );


  header.className =
    "work-gallery__header";


  header.innerHTML =
    `

      <p
        role="heading"
        aria-level="2"
      >
        PROJECT VISUALS
      </p>

      <span>
        APE STUDIO
      </span>

    `;


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
        "div"
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
              alt="${project.name} ${project.categoryLabel.toLowerCase()} creative work by APE Studio"
              loading="lazy"
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


  inner.append(
    header,
    gallery
  );


  section.appendChild(
    inner
  );


  return section;

}


/* =========================================================
   CANONICAL FALLBACK

   Each project HTML owns its title, description,
   Open Graph metadata and breadcrumb markup.

   This function only creates a clean canonical URL
   if an older project HTML file does not have one yet.
========================================================= */

function ensureCanonical(
  project
) {

  const existing =
    document.querySelector(
      'link[rel="canonical"]'
    );


  if (existing) {

    return;

  }


  const canonical =
    document.createElement(
      "link"
    );


  canonical.rel =
    "canonical";


  canonical.href =
    `https://apeindia.in/work/${project.slug}/`;


  document.head.appendChild(
    canonical
  );

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

            <div class="work-detail-hero__copy">

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

          </div>

        </section>

      `;


    return;

  }


  ensureCanonical(
    project
  );


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
   HERO MOTION
========================================================= */

function initHeroMotion() {

  if (reduceMotion) {
    return;
  }


  const timeline =
    gsap.timeline({
      defaults: {
        ease:
          "power4.out"
      }
    });


  timeline

    .fromTo(
      ".work-detail__back",
      {
        autoAlpha:
          0,

        y:
          14
      },
      {
        autoAlpha:
          1,

        y:
          0,

        duration:
          0.4
      }
    )

    .fromTo(
      ".work-detail__eyebrow",
      {
        autoAlpha:
          0,

        y:
          15
      },
      {
        autoAlpha:
          1,

        y:
          0,

        duration:
          0.45
      },
      "-=0.2"
    )

    .fromTo(
      ".work-detail-hero h1",
      {
        autoAlpha:
          0,

        y:
          65,

        rotationX:
          -17
      },
      {
        autoAlpha:
          1,

        y:
          0,

        rotationX:
          0,

        duration:
          0.9
      },
      "-=0.2"
    )

    .fromTo(
      ".work-detail__intro",
      {
        autoAlpha:
          0,

        y:
          24
      },
      {
        autoAlpha:
          1,

        y:
          0,

        duration:
          0.6
      },
      "-=0.4"
    )

    .fromTo(
      ".work-detail__ape",
      {
        autoAlpha:
          0,

        x:
          90,

        y:
          65,

        scale:
          0.7,

        rotation:
          6
      },
      {
        autoAlpha:
          1,

        x:
          0,

        y:
          0,

        scale:
          1,

        rotation:
          0,

        duration:
          1,

        ease:
          "back.out(1.6)"
      },
      "-=0.68"
    );


  gsap.to(
    ".work-detail__ape",
    {
      yPercent:
        -7,

      ease:
        "none",

      scrollTrigger: {
        trigger:
          ".work-detail-hero",

        start:
          "top top",

        end:
          "bottom top",

        scrub:
          0.9
      }
    }
  );

}


/* =========================================================
   HERO APE
========================================================= */

function initHeroApe() {

  const ape =
    document.querySelector(
      ".work-detail__ape"
    );


  const world =
    document.querySelector(
      ".work-detail__ape-world"
    );


  const rig =
    document.querySelector(
      ".work-detail__ape-rig"
    );


  const float =
    document.querySelector(
      ".work-detail__ape-float"
    );


  const aura =
    document.querySelector(
      ".work-detail__ape-aura"
    );


  if (
    !ape ||
    !world ||
    !rig ||
    !float
  ) {
    return;
  }


  if (!reduceMotion) {

    gsap.to(
      float,
      {
        y:
          -7,

        rotation:
          1.5,

        duration:
          1.7,

        repeat:
          -1,

        yoyo:
          true,

        ease:
          "sine.inOut"
      }
    );

  }


  if (
    finePointer &&
    !reduceMotion
  ) {

    ape.addEventListener(
      "pointermove",
      function (
        event
      ) {

        const rect =
          ape.getBoundingClientRect();


        const x =
          (
            event.clientX -
            rect.left
          )
          /
          rect.width -
          0.5;


        const y =
          (
            event.clientY -
            rect.top
          )
          /
          rect.height -
          0.5;


        gsap.to(
          world,
          {
            x:
              x * 20,

            y:
              y * 12,

            duration:
              0.35,

            ease:
              "power3.out"
          }
        );


        gsap.to(
          rig,
          {
            rotationY:
              x * 11,

            rotationX:
              y * -7,

            scale:
              1.05,

            duration:
              0.32,

            ease:
              "power3.out"
          }
        );

      }
    );


    ape.addEventListener(
      "pointerleave",
      function () {

        gsap.to(
          world,
          {
            x:
              0,

            y:
              0,

            duration:
              0.55,

            ease:
              "elastic.out(1,0.5)"
          }
        );


        gsap.to(
          rig,
          {
            rotationX:
              0,

            rotationY:
              0,

            rotation:
              0,

            scale:
              1,

            duration:
              0.45,

            ease:
              "back.out(1.6)"
          }
        );

      }
    );

  }


  ape.addEventListener(
    "click",
    function () {

      if (reduceMotion) {
        return;
      }


      gsap.killTweensOf(
        rig
      );


      gsap.timeline()

        .to(
          rig,
          {
            y:
              -21,

            rotation:
              -6,

            scale:
              1.08,

            duration:
              0.16
          }
        )

        .to(
          rig,
          {
            rotation:
              6,

            duration:
              0.13
          }
        )

        .to(
          rig,
          {
            rotationY:
              "+=360",

            duration:
              0.48,

            ease:
              "power3.inOut"
          }
        )

        .to(
          rig,
          {
            y:
              0,

            rotation:
              0,

            rotationY:
              0,

            scale:
              1,

            duration:
              0.4,

            ease:
              "bounce.out"
          }
        );


      if (aura) {

        gsap.fromTo(
          aura,
          {
            scale:
              0.8
          },
          {
            scale:
              1.35,

            duration:
              0.55,

            ease:
              "power3.out"
          }
        );

      }

    }
  );

}


/* =========================================================
   GALLERY MOTION
========================================================= */

function initGalleryMotion() {

  if (reduceMotion) {
    return;
  }


  gsap.fromTo(
    ".work-gallery__header",
    {
      autoAlpha:
        0,

      y:
        25
    },
    {
      autoAlpha:
        1,

      y:
        0,

      duration:
        0.65,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger:
          ".work-gallery__header",

        start:
          "top 88%",

        once:
          true
      }
    }
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
            autoAlpha:
              0,

            y:
              35,

            scale:
              0.98
          },
          {
            autoAlpha:
              1,

            y:
              0,

            scale:
              1,

            duration:
              0.68,

            ease:
              "power3.out",

            scrollTrigger: {
              trigger:
                item,

              start:
                "top 91%",

              once:
                true
            }
          }
        );


        const image =
          item.querySelector(
            "img"
          );


        if (image) {

          gsap.fromTo(
            image,
            {
              yPercent:
                -2
            },
            {
              yPercent:
                2,

              ease:
                "none",

              scrollTrigger: {
                trigger:
                  item,

                start:
                  "top bottom",

                end:
                  "bottom top",

                scrub:
                  1
              }
            }
          );

        }

      }
    );

}


/* =========================================================
   GALLERY POINTER DEPTH
========================================================= */

function initGalleryPointerMotion() {

  if (
    !finePointer ||
    reduceMotion
  ) {
    return;
  }


  const images =
    document.querySelectorAll(
      ".work-gallery__image"
    );


  images.forEach(
    function (
      frame
    ) {

      frame.addEventListener(
        "pointermove",
        function (
          event
        ) {

          const rect =
            frame.getBoundingClientRect();


          const x =
            (
              event.clientX -
              rect.left
            )
            /
            rect.width -
            0.5;


          const y =
            (
              event.clientY -
              rect.top
            )
            /
            rect.height -
            0.5;


          gsap.to(
            frame,
            {
              rotationY:
                x * 2.5,

              rotationX:
                y * -2.5,

              y:
                -3,

              duration:
                0.3,

              ease:
                "power3.out"
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
              rotationX:
                0,

              rotationY:
                0,

              y:
                0,

              duration:
                0.45,

              ease:
                "back.out(1.5)"
            }
          );

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
        top:
          0,

        behavior:
          reduceMotion
            ? "auto"
            : "smooth"
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

        initHeroMotion();

        initHeroApe();

        initGalleryMotion();

        initGalleryPointerMotion();

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