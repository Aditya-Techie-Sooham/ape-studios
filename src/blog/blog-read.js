/* =========================================================
   APE STUDIO — FULL BLOG ARTICLE
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/blog-read.css";


import {
  initHeader
} from "../header/header.js";


import {
  BLOGS
} from "./blog-data.js";


gsap.registerPlugin(
  ScrollTrigger
);



/* =========================================================
   URL SLUG
========================================================= */

function getSlug() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  return params.get(
    "slug"
  );

}



/* =========================================================
   FIND BLOG
========================================================= */

function findBlog() {

  const slug =
    getSlug();


  if (
    !slug
  ) {

    return null;

  }


  return (
    BLOGS.find(
      function (
        blog
      ) {

        return (
          blog.slug === slug
        );

      }
    )
    ||
    null
  );

}



/* =========================================================
   GET COVER IMAGE
========================================================= */

function getCoverImage(
  blog
) {

  if (
    Array.isArray(
      blog.images
    )
    &&
    blog.images.length > 0
  ) {

    return blog.images[0];

  }


  return (
    blog.image
    ||
    ""
  );

}



/* =========================================================
   GET GALLERY IMAGES

   Everything after images[0].
========================================================= */

function getGalleryImages(
  blog
) {

  if (
    !Array.isArray(
      blog.images
    )
  ) {

    return [];

  }


  return blog.images.slice(
    1
  );

}



/* =========================================================
   ELEMENT HELPER
========================================================= */

function createElement(
  tag,
  className,
  text
) {

  const element =
    document.createElement(
      tag
    );


  if (
    className
  ) {

    element.className =
      className;

  }


  if (
    text !== undefined
  ) {

    element.textContent =
      text;

  }


  return element;

}



/* =========================================================
   META
========================================================= */

function updatePageMeta(
  blog
) {

  document.title =
    `${blog.heading} — APE Studio`;


  const description =
    document.querySelector(
      'meta[name="description"]'
    );


  if (
    description
  ) {

    description.setAttribute(
      "content",
      blog.subheading
    );

  }

}



/* =========================================================
   ARTICLE NOT FOUND
========================================================= */

function buildNotFound(
  container
) {

  container.classList.add(
    "blog-article--missing"
  );


  const inner =
    createElement(
      "div",
      "blog-missing"
    );


  const title =
    createElement(
      "h1",
      "",
      "Article Not Found."
    );


  const link =
    createElement(
      "a",
      "",
      "Back To Blog →"
    );


  link.href =
    "/blog/";


  inner.append(
    title,
    link
  );


  container.appendChild(
    inner
  );

}



/* =========================================================
   BUILD GALLERY
========================================================= */

function buildGallery(
  blog
) {

  const galleryImages =
    getGalleryImages(
      blog
    );


  if (
    galleryImages.length === 0
  ) {

    return null;

  }



  const section =
    createElement(
      "section",
      "blog-gallery-section"
    );



  const gallery =
    createElement(
      "div",
      "blog-article__gallery"
    );


  gallery.dataset.count =
    String(
      galleryImages.length
    );



  galleryImages.forEach(
    function (
      src,
      index
    ) {

      const figure =
        createElement(
          "figure",
          "blog-article__gallery-item"
        );



      const image =
        document.createElement(
          "img"
        );


      image.src =
        src;


      image.alt =
        `${blog.heading} — image ${index + 2}`;


      image.loading =
        "lazy";


      image.decoding =
        "async";


      figure.appendChild(
        image
      );


      gallery.appendChild(
        figure
      );

    }
  );



  section.appendChild(
    gallery
  );


  return section;

}



/* =========================================================
   BUILD ARTICLE
========================================================= */

function buildArticle() {

  const container =
    document.getElementById(
      "blog-article"
    );


  if (
    !container
  ) {

    return;

  }



  const blog =
    findBlog();


  if (
    !blog
  ) {

    buildNotFound(
      container
    );


    return;

  }



  updatePageMeta(
    blog
  );



  /* =====================================================
     ARTICLE HERO
  ===================================================== */

  const hero =
    createElement(
      "header",
      "blog-article__hero"
    );


  const heroInner =
    createElement(
      "div",
      "blog-article__hero-inner"
    );



  const heading =
    createElement(
      "h1",
      "",
      blog.heading
    );



  const subheading =
    createElement(
      "p",
      "blog-article__subheading",
      blog.subheading
    );


  heroInner.append(
    heading,
    subheading
  );


  hero.appendChild(
    heroInner
  );



  /* =====================================================
     COVER IMAGE
  ===================================================== */

  const visualSection =
    createElement(
      "section",
      "blog-article__visual-wrap"
    );


  const visual =
    createElement(
      "div",
      "blog-article__visual"
    );



  const image =
    document.createElement(
      "img"
    );


  image.src =
    getCoverImage(
      blog
    );


  image.alt =
    blog.heading;


  image.loading =
    "eager";


  image.decoding =
    "async";


  visual.appendChild(
    image
  );


  visualSection.appendChild(
    visual
  );



  /* =====================================================
     AUTOMATIC IMAGE GALLERY
  ===================================================== */

  const gallerySection =
    buildGallery(
      blog
    );



  /* =====================================================
     ARTICLE BODY
  ===================================================== */

  const body =
    createElement(
      "section",
      "blog-article__body"
    );


  const content =
    createElement(
      "div",
      "blog-article__content"
    );



  (
    blog.content
    ||
    []
  )
    .forEach(
      function (
        paragraph
      ) {

        const p =
          createElement(
            "p",
            "blog-article__paragraph",
            paragraph
          );


        content.appendChild(
          p
        );

      }
    );



  /* =====================================================
     BACK TO BLOG
  ===================================================== */

  const back =
    createElement(
      "a",
      "blog-article__back",
      "Back To Blog"
    );


  back.href =
    "/blog/";



  const arrow =
    createElement(
      "span",
      "",
      "←"
    );


  arrow.setAttribute(
    "aria-hidden",
    "true"
  );


  back.prepend(
    arrow
  );


  content.appendChild(
    back
  );


  body.appendChild(
    content
  );



  /* =====================================================
     FINAL ORDER

     Hero
     ↓
     Cover
     ↓
     Gallery
     ↓
     Blog content
  ===================================================== */

  container.appendChild(
    hero
  );


  container.appendChild(
    visualSection
  );


  if (
    gallerySection
  ) {

    container.appendChild(
      gallerySection
    );

  }


  container.appendChild(
    body
  );

}



/* =========================================================
   MOTION
========================================================= */

function initArticleMotion() {

  const article =
    document.querySelector(
      ".blog-article"
    );


  if (
    !article
    ||
    article.classList.contains(
      "blog-article--missing"
    )
  ) {

    return;

  }



  /* =====================================================
     HERO
  ===================================================== */

  gsap
    .timeline({

      defaults: {

        ease:
          "power4.out"

      }

    })

    .fromTo(
      ".blog-article__hero h1",

      {
        opacity: 0,
        y: 85
      },

      {
        opacity: 1,
        y: 0,

        duration: 1
      }
    )

    .fromTo(
      ".blog-article__subheading",

      {
        opacity: 0,
        y: 30
      },

      {
        opacity: 1,
        y: 0,

        duration: 0.7
      },

      "-=0.5"
    );



  /* =====================================================
     COVER IMAGE
  ===================================================== */

  gsap.fromTo(
    ".blog-article__visual",

    {
      opacity: 0,
      y: 65,
      scale: 0.97
    },

    {
      opacity: 1,
      y: 0,
      scale: 1,

      duration: 1,

      ease:
        "power3.out",

      scrollTrigger: {

        trigger:
          ".blog-article__visual-wrap",

        start:
          "top 83%"

      }

    }
  );



  /* =====================================================
     COVER PARALLAX
  ===================================================== */

  gsap.fromTo(
    ".blog-article__visual img",

    {
      scale: 1.06,
      yPercent: -3
    },

    {
      scale: 1.06,
      yPercent: 3,

      ease:
        "none",

      scrollTrigger: {

        trigger:
          ".blog-article__visual",

        start:
          "top bottom",

        end:
          "bottom top",

        scrub:
          1

      }

    }
  );



  /* =====================================================
     GALLERY ITEMS
  ===================================================== */

  const galleryItems =
    gsap.utils.toArray(
      ".blog-article__gallery-item"
    );


  galleryItems.forEach(
    function (
      item,
      index
    ) {

      gsap.fromTo(
        item,

        {
          opacity: 0,
          y: 45,
          scale: 0.97
        },

        {
          opacity: 1,
          y: 0,
          scale: 1,

          duration: 0.8,

          delay:
            (
              index %
              3
            )
            *
            0.06,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              item,

            start:
              "top 88%"

          }

        }
      );

    }
  );



  /* =====================================================
     PARAGRAPHS
  ===================================================== */

  const paragraphs =
    gsap.utils.toArray(
      ".blog-article__paragraph"
    );


  paragraphs.forEach(
    function (
      paragraph
    ) {

      gsap.fromTo(
        paragraph,

        {
          opacity: 0,
          y: 35
        },

        {
          opacity: 1,
          y: 0,

          duration:
            0.75,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              paragraph,

            start:
              "top 88%"

          }

        }
      );

    }
  );



  /* =====================================================
     BACK BUTTON
  ===================================================== */

  gsap.fromTo(
    ".blog-article__back",

    {
      opacity: 0,
      y: 20
    },

    {
      opacity: 1,
      y: 0,

      duration:
        0.7,

      scrollTrigger: {

        trigger:
          ".blog-article__back",

        start:
          "top 92%"

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


    buildArticle();


    initFooter();



    requestAnimationFrame(
      function () {

        initArticleMotion();


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