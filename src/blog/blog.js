/* =========================================================
   APE STUDIO — BLOG LISTING PAGE
========================================================= */

import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


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


  if (className) {

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
    `/blog/${encodeURIComponent(blog.slug)}/`
  );

}


/* =========================================================
   BUILD FEATURED BLOG
========================================================= */

function buildFeaturedBlog() {

  const container =
    document.getElementById(
      "blog-featured-content"
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


  imageLink.setAttribute(
    "aria-label",
    `Read ${blog.heading}`
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


  const label =
    createElement(
      "p",
      "blog-featured__label",
      "Featured insight"
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
      "h3",
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
      "Read Article"
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
    label,
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
   CREATE BLOG CARD
========================================================= */

function createBlogCard(
  blog
) {

  const article =
    createElement(
      "article",
      "blog-card"
    );


  const imageLink =
    createElement(
      "a",
      "blog-card__visual"
    );


  imageLink.href =
    getArticleURL(
      blog
    );


  imageLink.setAttribute(
    "aria-label",
    `Read ${blog.heading}`
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


  const content =
    createElement(
      "div",
      "blog-card__content"
    );


  const eyebrow =
    createElement(
      "p",
      "blog-card__eyebrow",
      "APE Journal"
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
      "h3",
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
      "Read Article"
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
    eyebrow,
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


  if (!grid) {
    return;
  }


  if (
    BLOGS.length <= 1
  ) {

    if (archive) {

      archive.hidden =
        true;

    }


    return;

  }


  BLOGS
    .slice(1)
    .forEach(
      function (
        blog
      ) {

        grid.appendChild(
          createBlogCard(
            blog
          )
        );

      }
    );

}


/* =========================================================
   HERO MOTION
========================================================= */

function initHeroMotion() {

  if (reduceMotion) {
    return;
  }


  const eyebrow =
    document.querySelector(
      ".blog-hero__eyebrow"
    );


  const titleLines =
    document.querySelectorAll(
      ".blog-hero h1 > *"
    );


  const lead =
    document.querySelector(
      ".blog-hero__lead"
    );


  const jump =
    document.querySelector(
      ".blog-hero__jump"
    );


  const ape =
    document.querySelector(
      ".blog-hero__ape"
    );


  const timeline =
    gsap.timeline({
      defaults: {
        ease:
          "power4.out"
      }
    });


  if (eyebrow) {

    timeline.fromTo(
      eyebrow,
      {
        autoAlpha: 0,
        y: 15
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5
      }
    );

  }


  if (titleLines.length) {

    timeline.fromTo(
      titleLines,
      {
        autoAlpha: 0,
        y: 70,
        rotationX: -18
      },
      {
        autoAlpha: 1,
        y: 0,
        rotationX: 0,
        duration: 0.92,
        stagger: 0.09
      },
      "-=0.2"
    );

  }


  if (lead) {

    timeline.fromTo(
      lead,
      {
        autoAlpha: 0,
        y: 20
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.62
      },
      "-=0.4"
    );

  }


  if (jump) {

    timeline.fromTo(
      jump,
      {
        autoAlpha: 0,
        y: 14
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55
      },
      "-=0.35"
    );

  }


  if (ape) {

    timeline.fromTo(
      ape,
      {
        autoAlpha: 0,
        x: 110,
        y: 80,
        rotation: 8,
        scale: 0.66
      },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 1.12,
        ease:
          "back.out(1.6)"
      },
      "-=0.72"
    );

  }


  gsap.to(
    ".blog-hero h1 span",
    {
      xPercent: -3,

      ease: "none",

      scrollTrigger: {
        trigger:
          ".blog-hero",

        start:
          "top top",

        end:
          "bottom top",

        scrub: 1
      }
    }
  );


  gsap.to(
    ".blog-hero h1 strong",
    {
      xPercent: 3,

      ease: "none",

      scrollTrigger: {
        trigger:
          ".blog-hero",

        start:
          "top top",

        end:
          "bottom top",

        scrub: 1
      }
    }
  );


  gsap.to(
    ".blog-hero__ape",
    {
      yPercent: -7,

      ease: "none",

      scrollTrigger: {
        trigger:
          ".blog-hero",

        start:
          "top top",

        end:
          "bottom top",

        scrub: 0.9
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
      ".blog-hero__ape"
    );


  const world =
    document.querySelector(
      ".blog-hero__ape-world"
    );


  const rig =
    document.querySelector(
      ".blog-hero__ape-rig"
    );


  const float =
    document.querySelector(
      ".blog-hero__ape-float"
    );


  const aura =
    document.querySelector(
      ".blog-hero__ape-aura"
    );


  const pulse =
    document.querySelector(
      ".blog-hero__ape-pulse"
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
        y: -8,
        rotation: 1.4,

        duration: 1.8,

        repeat: -1,

        yoyo: true,

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
              x * 24,

            y:
              y * 14,

            duration: 0.38,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );


        gsap.to(
          rig,
          {
            rotationY:
              x * 13,

            rotationX:
              y * -8,

            rotation:
              x * 3,

            scale: 1.06,

            duration: 0.32,

            ease:
              "power3.out",

            overwrite:
              "auto"
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
            x: 0,
            y: 0,

            duration: 0.6,

            ease:
              "elastic.out(1,0.45)"
          }
        );


        gsap.to(
          rig,
          {
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,

            duration: 0.5,

            ease:
              "back.out(1.7)"
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


      danceApe(
        rig,
        aura,
        pulse
      );

    }
  );

}


/* =========================================================
   SHARED APE DANCE
========================================================= */

function danceApe(
  rig,
  aura,
  pulse
) {

  if (!rig) {
    return;
  }


  gsap.killTweensOf(
    rig
  );


  gsap.timeline()

    .to(
      rig,
      {
        y: -26,
        x: -12,
        rotation: -8,
        scale: 1.1,

        duration: 0.16
      }
    )

    .to(
      rig,
      {
        x: 14,
        rotation: 8,

        duration: 0.13
      }
    )

    .to(
      rig,
      {
        x: -10,
        rotation: -6,

        duration: 0.13
      }
    )

    .to(
      rig,
      {
        x: 8,
        rotation: 5,

        duration: 0.12
      }
    )

    .to(
      rig,
      {
        x: 0,

        rotationY:
          "+=360",

        duration: 0.48,

        ease:
          "power3.inOut"
      }
    )

    .to(
      rig,
      {
        y: 0,

        rotation: 0,
        rotationX: 0,
        rotationY: 0,

        scale: 1,

        duration: 0.4,

        ease:
          "bounce.out"
      }
    );


  if (aura) {

    gsap.fromTo(
      aura,
      {
        scale: 0.78,
        opacity: 0.9
      },
      {
        scale: 1.35,
        opacity: 0.45,

        duration: 0.55,

        ease:
          "power2.out"
      }
    );

  }


  if (pulse) {

    gsap.fromTo(
      pulse,
      {
        scale: 0.65,
        opacity: 0.8
      },
      {
        scale: 1.42,
        opacity: 0,

        duration: 0.58,

        ease:
          "power2.out"
      }
    );

  }

}


/* =========================================================
   HERO BACKGROUND POINTER MOTION
========================================================= */

function initHeroPointerMotion() {

  if (
    !finePointer ||
    reduceMotion
  ) {
    return;
  }


  const hero =
    document.querySelector(
      ".blog-hero"
    );


  const violet =
    document.querySelector(
      ".blog-hero__glow--violet"
    );


  const lime =
    document.querySelector(
      ".blog-hero__glow--lime"
    );


  if (!hero) {
    return;
  }


  hero.addEventListener(
    "pointermove",
    function (
      event
    ) {

      const rect =
        hero.getBoundingClientRect();


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


      if (violet) {

        gsap.to(
          violet,
          {
            x:
              x * -36,

            y:
              y * -22,

            duration: 1,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );

      }


      if (lime) {

        gsap.to(
          lime,
          {
            x:
              x * 28,

            y:
              y * 18,

            duration: 1.1,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );

      }

    }
  );

}


/* =========================================================
   ARCHIVE APE
========================================================= */

function initArchiveApe() {

  const section =
    document.querySelector(
      ".blog-archive"
    );


  const ape =
    document.querySelector(
      ".blog-archive__ape"
    );


  const world =
    document.querySelector(
      ".blog-archive__ape-world"
    );


  const rig =
    document.querySelector(
      ".blog-archive__ape-rig"
    );


  const float =
    document.querySelector(
      ".blog-archive__ape-float"
    );


  const aura =
    document.querySelector(
      ".blog-archive__ape-aura"
    );


  const pulse =
    document.querySelector(
      ".blog-archive__ape-pulse"
    );


  if (
    !section ||
    !ape ||
    !world ||
    !rig ||
    !float
  ) {
    return;
  }


  if (!reduceMotion) {

    /* =====================================================
       ENTRANCE
    ===================================================== */

    gsap.fromTo(
      ape,
      {
        autoAlpha: 0,
        x: 55,
        y: 35,
        scale: 0.72,
        rotation: 6
      },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,

        duration: 0.85,

        ease:
          "back.out(1.8)",

        scrollTrigger: {
          trigger:
            section,

          start:
            "top 80%",

          once: true
        }
      }
    );


    /* =====================================================
       ALWAYS FLOAT
    ===================================================== */

    gsap.to(
      float,
      {
        y: -8,
        rotation: 1.8,

        duration: 1.55,

        repeat: -1,

        yoyo: true,

        ease:
          "sine.inOut"
      }
    );


    /* =====================================================
       SCROLL REACTION
    ===================================================== */

    ScrollTrigger.create({
      trigger:
        section,

      start:
        "top bottom",

      end:
        "bottom top",

      onUpdate(
        self
      ) {

        const speed =
          gsap.utils.clamp(
            -1,
            1,
            self.getVelocity() / 1800
          );


        gsap.to(
          world,
          {
            y:
              speed * 8,

            x:
              speed * 5,

            duration: 0.22,

            ease:
              "power2.out",

            overwrite:
              "auto"
          }
        );


        gsap.to(
          rig,
          {
            rotation:
              speed * 5,

            rotationY:
              speed * 8,

            scale:
              1 +
              Math.abs(speed) * 0.025,

            duration: 0.22,

            ease:
              "power2.out",

            overwrite:
              "auto"
          }
        );

      }
    });

  }


  /* =====================================================
     DESKTOP HOVER
  ===================================================== */

  if (
    finePointer &&
    !reduceMotion
  ) {

    ape.addEventListener(
      "pointerenter",
      function () {

        gsap.to(
          rig,
          {
            y: -9,
            scale: 1.07,

            duration: 0.28,

            ease:
              "back.out(1.7)"
          }
        );

      }
    );


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
              x * 16,

            y:
              y * 10,

            duration: 0.3,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );


        gsap.to(
          rig,
          {
            rotationY:
              x * 10,

            rotationX:
              y * -6,

            rotation:
              x * 3,

            scale: 1.07,

            duration: 0.3,

            ease:
              "power3.out",

            overwrite:
              "auto"
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
            x: 0,
            y: 0,

            duration: 0.5,

            ease:
              "elastic.out(1,0.5)"
          }
        );


        gsap.to(
          rig,
          {
            x: 0,
            y: 0,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,

            duration: 0.45,

            ease:
              "back.out(1.6)"
          }
        );

      }
    );

  }


  /* =====================================================
     CLICK / MOBILE TAP
  ===================================================== */

  ape.addEventListener(
    "click",
    function () {

      if (reduceMotion) {
        return;
      }


      danceApe(
        rig,
        aura,
        pulse
      );

    }
  );

}


/* =========================================================
   SECTION MOTION
========================================================= */

function initBlogMotion() {

  if (reduceMotion) {
    return;
  }


  gsap.fromTo(
    ".blog-featured__top",
    {
      autoAlpha: 0,
      y: 30
    },
    {
      autoAlpha: 1,
      y: 0,

      duration: 0.7,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger:
          ".blog-featured__top",

        start:
          "top 87%",

        once: true
      }
    }
  );


  gsap.fromTo(
    ".blog-featured__visual",
    {
      autoAlpha: 0,
      y: 55,
      scale: 0.97
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,

      duration: 0.9,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger:
          ".blog-featured",

        start:
          "top 77%",

        once: true
      }
    }
  );


  gsap.fromTo(
    ".blog-featured__content",
    {
      autoAlpha: 0,
      y: 42
    },
    {
      autoAlpha: 1,
      y: 0,

      duration: 0.85,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger:
          ".blog-featured",

        start:
          "top 73%",

        once: true
      }
    }
  );


  gsap.fromTo(
    ".blog-archive__top",
    {
      autoAlpha: 0,
      x: -25
    },
    {
      autoAlpha: 1,
      x: 0,

      duration: 0.7,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger:
          ".blog-archive__header",

        start:
          "top 86%",

        once: true
      }
    }
  );


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
          autoAlpha: 0,
          y: 55
        },
        {
          autoAlpha: 1,
          y: 0,

          duration: 0.82,

          ease:
            "power3.out",

          scrollTrigger: {
            trigger:
              card,

            start:
              "top 87%",

            once: true
          }
        }
      );


      const image =
        card.querySelector(
          ".blog-card__visual img"
        );


      if (image) {

        gsap.fromTo(
          image,
          {
            yPercent: -3,
            scale: 1.06
          },
          {
            yPercent: 3,
            scale: 1.06,

            ease: "none",

            scrollTrigger: {
              trigger:
                card,

              start:
                "top bottom",

              end:
                "bottom top",

              scrub: 1
            }
          }
        );

      }

    }
  );

}


/* =========================================================
   CARD POINTER MOTION
========================================================= */

function initCardPointerMotion() {

  if (
    !finePointer ||
    reduceMotion
  ) {
    return;
  }


  const visuals =
    document.querySelectorAll(
      ".blog-featured__visual, .blog-card__visual"
    );


  visuals.forEach(
    function (
      visual
    ) {

      visual.addEventListener(
        "pointermove",
        function (
          event
        ) {

          const rect =
            visual.getBoundingClientRect();


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
            visual,
            {
              rotationY:
                x * 4,

              rotationX:
                y * -4,

              y: -4,

              duration: 0.35,

              ease:
                "power3.out",

              overwrite:
                "auto"
            }
          );

        }
      );


      visual.addEventListener(
        "pointerleave",
        function () {

          gsap.to(
            visual,
            {
              rotationX: 0,
              rotationY: 0,
              y: 0,

              duration: 0.5,

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
   HERO JUMP
========================================================= */

function initHeroJump() {

  const link =
    document.querySelector(
      ".blog-hero__jump"
    );


  const target =
    document.getElementById(
      "blog-featured"
    );


  if (
    !link ||
    !target
  ) {
    return;
  }


  link.addEventListener(
    "click",
    function (
      event
    ) {

      event.preventDefault();


      target.scrollIntoView({
        behavior:
          reduceMotion
            ? "auto"
            : "smooth",

        block:
          "start"
      });

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


  const topButton =
    document.querySelector(
      ".site-footer__top-link"
    );


  if (!topButton) {
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

    initHeader();

    buildFeaturedBlog();

    buildBlogGrid();

    initFooter();

    initHeroJump();


    requestAnimationFrame(
      function () {

        initHeroMotion();

        initHeroApe();

        initHeroPointerMotion();

        initArchiveApe();

        initBlogMotion();

        initCardPointerMotion();

        ScrollTrigger.refresh();

      }
    );

  }
);


/* =========================================================
   LOAD
========================================================= */

window.addEventListener(
  "load",
  function () {

    ScrollTrigger.refresh();

  }
);