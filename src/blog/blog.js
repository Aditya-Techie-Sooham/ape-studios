/* =========================================================
   APE STUDIO — BLOG LISTING PAGE
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/blog-page.css";


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
   GET COVER IMAGE

   images[0] is always the cover.
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


  /*
   * Small fallback in case an older blog
   * still uses the old "image" property.
   */

  return (
    blog.image
    ||
    ""
  );

}



/* =========================================================
   EXCERPT
========================================================= */

function createExcerpt(
  blog,
  length = 175
) {

  const source =
    blog.excerpt
    ||
    blog.content?.[0]
    ||
    "";


  if (
    source.length <= length
  ) {

    return source;

  }


  return (
    source
      .slice(
        0,
        length
      )
      .trimEnd()
    +
    "…"
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
   ARTICLE URL
========================================================= */

function getArticleURL(
  blog
) {

  return (
    `/blog/read/?slug=${encodeURIComponent(blog.slug)}`
  );

}



/* =========================================================
   BUILD FEATURED BLOG
========================================================= */

function buildFeaturedBlog() {

  const container =
    document.getElementById(
      "blog-featured"
    );


  const blog =
    BLOGS[0];


  if (
    !container
    ||
    !blog
  ) {

    return;

  }



  const inner =
    createElement(
      "div",
      "blog-featured__inner"
    );



  /* =====================================================
     IMAGE
  ===================================================== */

  const imageLink =
    createElement(
      "a",
      "blog-featured__visual"
    );


  imageLink.href =
    getArticleURL(
      blog
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


  imageLink.appendChild(
    image
  );



  /* =====================================================
     CONTENT
  ===================================================== */

  const content =
    createElement(
      "div",
      "blog-featured__content"
    );



  const headingLink =
    createElement(
      "a",
      "blog-featured__heading-link"
    );


  headingLink.href =
    getArticleURL(
      blog
    );



  const heading =
    createElement(
      "h2",
      "",
      blog.heading
    );


  headingLink.appendChild(
    heading
  );



  const subheading =
    createElement(
      "p",
      "blog-featured__subheading",
      blog.subheading
    );



  const excerpt =
    createElement(
      "p",
      "blog-featured__excerpt",
      createExcerpt(
        blog,
        220
      )
    );



  const readMore =
    createElement(
      "a",
      "blog-read-more",
      "Read More"
    );


  readMore.href =
    getArticleURL(
      blog
    );



  const arrow =
    createElement(
      "span",
      "",
      "→"
    );


  arrow.setAttribute(
    "aria-hidden",
    "true"
  );


  readMore.appendChild(
    arrow
  );



  content.append(
    headingLink,
    subheading,
    excerpt,
    readMore
  );


  inner.append(
    imageLink,
    content
  );


  container.appendChild(
    inner
  );

}



/* =========================================================
   CREATE NORMAL BLOG CARD
========================================================= */

function createBlogCard(
  blog,
  index
) {

  const article =
    createElement(
      "article",
      "blog-card"
    );


  article.dataset.blogIndex =
    String(
      index
    );



  /* =====================================================
     IMAGE
  ===================================================== */

  const imageLink =
    createElement(
      "a",
      "blog-card__visual"
    );


  imageLink.href =
    getArticleURL(
      blog
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
    "lazy";


  image.decoding =
    "async";


  imageLink.appendChild(
    image
  );



  /* =====================================================
     CONTENT
  ===================================================== */

  const content =
    createElement(
      "div",
      "blog-card__content"
    );



  const headingLink =
    createElement(
      "a",
      "blog-card__heading-link"
    );


  headingLink.href =
    getArticleURL(
      blog
    );



  const heading =
    createElement(
      "h2",
      "",
      blog.heading
    );


  headingLink.appendChild(
    heading
  );



  const subheading =
    createElement(
      "p",
      "blog-card__subheading",
      blog.subheading
    );



  const excerpt =
    createElement(
      "p",
      "blog-card__excerpt",
      createExcerpt(
        blog
      )
    );



  const readMore =
    createElement(
      "a",
      "blog-read-more",
      "Read More"
    );


  readMore.href =
    getArticleURL(
      blog
    );



  const arrow =
    createElement(
      "span",
      "",
      "→"
    );


  arrow.setAttribute(
    "aria-hidden",
    "true"
  );


  readMore.appendChild(
    arrow
  );



  content.append(
    headingLink,
    subheading,
    excerpt,
    readMore
  );


  article.append(
    imageLink,
    content
  );


  return article;

}



/* =========================================================
   BUILD BLOG GRID
========================================================= */

function buildBlogGrid() {

  const grid =
    document.getElementById(
      "blog-grid"
    );


  const archive =
    document.querySelector(
      ".blog-archive"
    );


  if (
    !grid
  ) {

    return;

  }



  /*
   * If there is only one article,
   * hide the archive completely.
   */

  if (
    BLOGS.length <= 1
  ) {

    if (
      archive
    ) {

      archive.hidden =
        true;

    }


    return;

  }



  /*
   * BLOGS[0] is featured.
   * Everything else enters the grid.
   */

  BLOGS
    .slice(
      1
    )
    .forEach(
      function (
        blog,
        index
      ) {

        grid.appendChild(
          createBlogCard(
            blog,
            index
          )
        );

      }
    );

}



/* =========================================================
   PAGE MOTION
========================================================= */

function initBlogMotion() {

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
      ".blog-hero h1",

      {
        opacity: 0,
        y: 80
      },

      {
        opacity: 1,
        y: 0,

        duration: 1
      }
    )

    .fromTo(
      ".blog-hero__inner > p",

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
     FEATURED
  ===================================================== */

  gsap.fromTo(
    ".blog-featured__visual",

    {
      opacity: 0,
      y: 60
    },

    {
      opacity: 1,
      y: 0,

      duration: 1,

      ease:
        "power3.out",

      scrollTrigger: {

        trigger:
          ".blog-featured",

        start:
          "top 78%"

      }

    }
  );


  gsap.fromTo(
    ".blog-featured__content",

    {
      opacity: 0,
      y: 45
    },

    {
      opacity: 1,
      y: 0,

      duration: 0.9,

      ease:
        "power3.out",

      scrollTrigger: {

        trigger:
          ".blog-featured",

        start:
          "top 72%"

      }

    }
  );



  /* =====================================================
     CARDS
  ===================================================== */

  const cards =
    gsap.utils.toArray(
      ".blog-card"
    );


  cards.forEach(
    function (
      card
    ) {

      gsap.fromTo(
        card,

        {
          opacity: 0,
          y: 60
        },

        {
          opacity: 1,
          y: 0,

          duration: 0.85,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              card,

            start:
              "top 86%"

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


    buildFeaturedBlog();


    buildBlogGrid();


    initFooter();



    requestAnimationFrame(
      function () {

        initBlogMotion();


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