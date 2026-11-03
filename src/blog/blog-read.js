/* =========================================================
   APE STUDIO — FULL BLOG ARTICLE
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
   CONSTANTS
========================================================= */

const SITE_ORIGIN =
  "https://apeindia.in";


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
   URL / SLUG

   SUPPORTS BOTH:

   OLD:
   /blog/read/?slug=article-slug

   NEW:
   /blog/article-slug/
========================================================= */

function getSlug() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const querySlug =
    params.get(
      "slug"
    );


  if (querySlug) {

    return querySlug;

  }


  const parts =
    window.location.pathname
      .split("/")
      .filter(Boolean);


  if (
    parts[0] === "blog"
    &&
    parts[1]
    &&
    parts[1] !== "read"
  ) {

    return decodeURIComponent(
      parts[1]
    );

  }


  return null;

}


/* =========================================================
   CLEAN ARTICLE URL
========================================================= */

function getCleanArticleURL(
  blog
) {

  return (
    `${SITE_ORIGIN}/blog/${encodeURIComponent(blog.slug)}/`
  );

}


/* =========================================================
   FIND BLOG
========================================================= */

function findBlog() {

  const slug =
    getSlug();


  if (!slug) {

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
   GALLERY
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
   META HELPER
========================================================= */

function setMeta(
  selector,
  attribute,
  value
) {

  let element =
    document.querySelector(
      selector
    );


  if (!element) {

    element =
      document.createElement(
        "meta"
      );


    if (
      selector.includes(
        'property="'
      )
    ) {

      const propertyMatch =
        selector.match(
          /property="([^"]+)"/
        );


      if (propertyMatch) {

        element.setAttribute(
          "property",
          propertyMatch[1]
        );

      }

    }

    else {

      const nameMatch =
        selector.match(
          /name="([^"]+)"/
        );


      if (nameMatch) {

        element.setAttribute(
          "name",
          nameMatch[1]
        );

      }

    }


    document.head.appendChild(
      element
    );

  }


  element.setAttribute(
    attribute,
    value
  );

}


/* =========================================================
   CANONICAL
========================================================= */

function setCanonical(
  url
) {

  let canonical =
    document.querySelector(
      'link[rel="canonical"]'
    );


  if (!canonical) {

    canonical =
      document.createElement(
        "link"
      );


    canonical.rel =
      "canonical";


    document.head.appendChild(
      canonical
    );

  }


  canonical.href =
    url;

}


/* =========================================================
   STRUCTURED DATA HELPER
========================================================= */

function setStructuredData(
  id,
  data
) {

  let script =
    document.getElementById(
      id
    );


  if (!script) {

    script =
      document.createElement(
        "script"
      );


    script.type =
      "application/ld+json";


    script.id =
      id;


    document.head.appendChild(
      script
    );

  }


  script.textContent =
    JSON.stringify(
      data
    );

}


/* =========================================================
   UPDATE PAGE SEO
========================================================= */

function updatePageMeta(
  blog
) {

  const title =
    `${blog.heading} | APE Studio Journal`;


  const description =
    blog.subheading
    ||
    blog.content?.[0]
    ||
    "Read insights from APE Studio.";


  const cover =
    getCoverImage(
      blog
    );


  const canonicalURL =
    getCleanArticleURL(
      blog
    );


  const coverURL =
    cover
      ? new URL(
          cover,
          SITE_ORIGIN
        ).href
      : "";


  /* =====================================================
     TITLE
  ===================================================== */

  document.title =
    title;


  /* =====================================================
     PRIMARY META
  ===================================================== */

  setMeta(
    'meta[name="description"]',
    "content",
    description
  );


  setMeta(
    'meta[name="robots"]',
    "content",
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  );


  /* =====================================================
     OPEN GRAPH
  ===================================================== */

  setMeta(
    'meta[property="og:type"]',
    "content",
    "article"
  );


  setMeta(
    'meta[property="og:site_name"]',
    "content",
    "APE Studio"
  );


  setMeta(
    'meta[property="og:locale"]',
    "content",
    "en_IN"
  );


  setMeta(
    'meta[property="og:title"]',
    "content",
    title
  );


  setMeta(
    'meta[property="og:description"]',
    "content",
    description
  );


  setMeta(
    'meta[property="og:url"]',
    "content",
    canonicalURL
  );


  if (coverURL) {

    setMeta(
      'meta[property="og:image"]',
      "content",
      coverURL
    );


    setMeta(
      'meta[property="og:image:alt"]',
      "content",
      `${blog.heading} — APE Studio Journal`
    );

  }


  /* =====================================================
     X / TWITTER
  ===================================================== */

  setMeta(
    'meta[name="twitter:card"]',
    "content",
    "summary_large_image"
  );


  setMeta(
    'meta[name="twitter:title"]',
    "content",
    title
  );


  setMeta(
    'meta[name="twitter:description"]',
    "content",
    description
  );


  if (coverURL) {

    setMeta(
      'meta[name="twitter:image"]',
      "content",
      coverURL
    );


    setMeta(
      'meta[name="twitter:image:alt"]',
      "content",
      `${blog.heading} — APE Studio Journal`
    );

  }


  /* =====================================================
     CANONICAL

     IMPORTANT:
     OLD QUERY URLS CAN STILL LOAD,
     BUT CANONICAL POINTS TO THE CLEAN URL.
  ===================================================== */

  setCanonical(
    canonicalURL
  );


  /* =====================================================
     BLOG POST STRUCTURED DATA

     No fake:
     - author
     - datePublished
     - dateModified
     - reading time

     because those do not currently exist in blog-data.js.
  ===================================================== */

  setStructuredData(
    "blog-structured-data",
    {
      "@context":
        "https://schema.org",

      "@type":
        "BlogPosting",

      headline:
        blog.heading,

      description:
        description,

      image:
        coverURL
        ||
        undefined,

      publisher: {
        "@type":
          "Organization",

        name:
          "APE Studio",

        url:
          `${SITE_ORIGIN}/`
      },

      mainEntityOfPage: {
        "@type":
          "WebPage",

        "@id":
          canonicalURL
      }
    }
  );


  /* =====================================================
     BREADCRUMB STRUCTURED DATA

     If an article HTML page later contains this same ID,
     the script is simply updated rather than duplicated.
  ===================================================== */

  setStructuredData(
    "blog-breadcrumb-data",
    {
      "@context":
        "https://schema.org",

      "@type":
        "BreadcrumbList",

      "@id":
        `${canonicalURL}#breadcrumb`,

      itemListElement: [
        {
          "@type":
            "ListItem",

          position:
            1,

          name:
            "Home",

          item:
            `${SITE_ORIGIN}/`
        },
        {
          "@type":
            "ListItem",

          position:
            2,

          name:
            "Blog",

          item:
            `${SITE_ORIGIN}/blog/`
        },
        {
          "@type":
            "ListItem",

          position:
            3,

          name:
            blog.heading
        }
      ]
    }
  );

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


  document.title =
    "Article Not Found | APE Studio";


  setMeta(
    'meta[name="robots"]',
    "content",
    "noindex, follow"
  );


  setMeta(
    'meta[name="description"]',
    "content",
    "The requested APE Studio Journal article could not be found."
  );


  setCanonical(
    `${SITE_ORIGIN}/blog/`
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


  section.setAttribute(
    "aria-label",
    `${blog.heading} supporting visuals`
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
      src
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
        `${blog.heading} supporting visual`;


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
   BUILD ARTICLE HERO
========================================================= */

function buildArticleHero(
  blog
) {

  const hero =
    createElement(
      "header",
      "blog-article__hero"
    );


  const violetGlow =
    createElement(
      "div",
      "blog-article__glow blog-article__glow--violet"
    );


  violetGlow.setAttribute(
    "aria-hidden",
    "true"
  );


  const limeGlow =
    createElement(
      "div",
      "blog-article__glow blog-article__glow--lime"
    );


  limeGlow.setAttribute(
    "aria-hidden",
    "true"
  );


  const heroInner =
    createElement(
      "div",
      "blog-article__hero-inner"
    );


  const copy =
    createElement(
      "div",
      "blog-article__hero-copy"
    );


  const eyebrow =
    createElement(
      "p",
      "blog-article__eyebrow"
    );


  eyebrow.append(
    document.createTextNode(
      "APE JOURNAL"
    )
  );


  const diamond =
    createElement(
      "span",
      ""
    );


  diamond.setAttribute(
    "aria-hidden",
    "true"
  );


  eyebrow.appendChild(
    diamond
  );


  eyebrow.append(
    document.createTextNode(
      "IDEAS & OBSERVATIONS"
    )
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


  copy.append(
    eyebrow,
    heading,
    subheading
  );


  /* =====================================================
     HERO APE
  ===================================================== */

  const ape =
    createElement(
      "button",
      "blog-article__hero-ape"
    );


  ape.type =
    "button";


  ape.setAttribute(
    "aria-label",
    "Make the APE mascot react"
  );


  const aura =
    createElement(
      "span",
      "blog-article__hero-ape-aura"
    );


  aura.setAttribute(
    "aria-hidden",
    "true"
  );


  const world =
    createElement(
      "span",
      "blog-article__hero-ape-world"
    );


  const rig =
    createElement(
      "span",
      "blog-article__hero-ape-rig"
    );


  const float =
    createElement(
      "span",
      "blog-article__hero-ape-float"
    );


  const apeImage =
    document.createElement(
      "img"
    );


  apeImage.src =
    "/mascot/ape-laptop.webp";


  apeImage.alt =
    "";


  apeImage.draggable =
    false;


  float.appendChild(
    apeImage
  );


  rig.appendChild(
    float
  );


  world.appendChild(
    rig
  );


  ape.append(
    aura,
    world
  );


  heroInner.append(
    copy,
    ape
  );


  hero.append(
    violetGlow,
    limeGlow,
    heroInner
  );


  return hero;

}


/* =========================================================
   BUILD READING APE
========================================================= */

function buildReadingApe() {

  const side =
    createElement(
      "aside",
      "blog-article__side"
    );


  side.setAttribute(
    "aria-hidden",
    "true"
  );


  const ape =
    createElement(
      "div",
      "blog-reading-ape"
    );


  const aura =
    createElement(
      "div",
      "blog-reading-ape__aura"
    );


  const rig =
    createElement(
      "div",
      "blog-reading-ape__rig"
    );


  const float =
    createElement(
      "div",
      "blog-reading-ape__float"
    );


  const image =
    document.createElement(
      "img"
    );


  image.src =
    "/mascot/ape-sitting.webp";


  image.alt =
    "";


  image.draggable =
    false;


  float.appendChild(
    image
  );


  rig.appendChild(
    float
  );


  ape.append(
    aura,
    rig
  );


  side.appendChild(
    ape
  );


  return side;

}


/* =========================================================
   BUILD ARTICLE
========================================================= */

function buildArticle() {

  const container =
    document.getElementById(
      "blog-article"
    );


  if (!container) {

    return;

  }


  const blog =
    findBlog();


  if (!blog) {

    buildNotFound(
      container
    );


    return;

  }


  updatePageMeta(
    blog
  );


  /* =====================================================
     HERO
  ===================================================== */

  const hero =
    buildArticleHero(
      blog
    );


  /* =====================================================
     COVER IMAGE
  ===================================================== */

  const visualSection =
    createElement(
      "section",
      "blog-article__visual-wrap"
    );


  visualSection.setAttribute(
    "aria-label",
    `${blog.heading} featured visual`
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
     GALLERY
  ===================================================== */

  const gallerySection =
    buildGallery(
      blog
    );


  /* =====================================================
     BODY
  ===================================================== */

  const body =
    createElement(
      "section",
      "blog-article__body"
    );


  body.setAttribute(
    "aria-label",
    `${blog.heading} article`
  );


  const bodyInner =
    createElement(
      "div",
      "blog-article__body-inner"
    );


  const side =
    buildReadingApe();


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
      "blog-article__back"
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


  const text =
    document.createTextNode(
      "Back To Blog"
    );


  back.append(
    arrow,
    text
  );


  content.appendChild(
    back
  );


  bodyInner.append(
    side,
    content
  );


  body.appendChild(
    bodyInner
  );


  /* =====================================================
     FINAL ORDER
  ===================================================== */

  container.appendChild(
    hero
  );


  container.appendChild(
    visualSection
  );


  if (gallerySection) {

    container.appendChild(
      gallerySection
    );

  }


  container.appendChild(
    body
  );

}


/* =========================================================
   ARTICLE HERO MOTION
========================================================= */

function initArticleHero() {

  if (reduceMotion) {

    return;

  }


  const eyebrow =
    document.querySelector(
      ".blog-article__eyebrow"
    );


  const heading =
    document.querySelector(
      ".blog-article__hero h1"
    );


  const subheading =
    document.querySelector(
      ".blog-article__subheading"
    );


  const ape =
    document.querySelector(
      ".blog-article__hero-ape"
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


  if (heading) {

    timeline.fromTo(
      heading,
      {
        autoAlpha: 0,
        y: 72,
        rotationX: -16
      },
      {
        autoAlpha: 1,
        y: 0,
        rotationX: 0,
        duration: 0.95
      },
      "-=0.18"
    );

  }


  if (subheading) {

    timeline.fromTo(
      subheading,
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


  if (ape) {

    timeline.fromTo(
      ape,
      {
        autoAlpha: 0,
        x: 90,
        y: 65,
        scale: 0.7,
        rotation: 6
      },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1,

        ease:
          "back.out(1.6)"
      },
      "-=0.7"
    );


    gsap.to(
      ape,
      {
        yPercent: -7,

        ease:
          "none",

        scrollTrigger: {
          trigger:
            ".blog-article__hero",

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

}


/* =========================================================
   ARTICLE HERO APE
========================================================= */

function initArticleHeroApe() {

  const ape =
    document.querySelector(
      ".blog-article__hero-ape"
    );


  const world =
    document.querySelector(
      ".blog-article__hero-ape-world"
    );


  const rig =
    document.querySelector(
      ".blog-article__hero-ape-rig"
    );


  const float =
    document.querySelector(
      ".blog-article__hero-ape-float"
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
        y: -7,
        rotation: 1.4,

        duration: 1.75,

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
            x: 0,
            y: 0,

            duration:
              0.55,

            ease:
              "elastic.out(1,0.5)"
          }
        );


        gsap.to(
          rig,
          {
            rotationX: 0,
            rotationY: 0,
            rotation: 0,
            scale: 1,

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
            y: -20,
            rotation: -6,
            scale: 1.08,

            duration:
              0.16
          }
        )

        .to(
          rig,
          {
            rotation: 6,

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
            y: 0,
            rotation: 0,
            rotationY: 0,
            scale: 1,

            duration:
              0.4,

            ease:
              "bounce.out"
          }
        );

    }
  );

}


/* =========================================================
   ARTICLE MOTION
========================================================= */

function initArticleMotion() {

  const article =
    document.querySelector(
      ".blog-article"
    );


  if (
    !article ||
    article.classList.contains(
      "blog-article--missing"
    )
  ) {

    return;

  }


  if (reduceMotion) {

    return;

  }


  /* =====================================================
     COVER
  ===================================================== */

  gsap.fromTo(
    ".blog-article__visual",
    {
      autoAlpha: 0,
      y: 60,
      scale: 0.97
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,

      duration:
        0.95,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger:
          ".blog-article__visual-wrap",

        start:
          "top 83%",

        once:
          true
      }
    }
  );


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
     GALLERY
  ===================================================== */

  const galleryItems =
    gsap.utils.toArray(
      ".blog-article__gallery-item"
    );


  galleryItems.forEach(
    function (
      item
    ) {

      gsap.fromTo(
        item,
        {
          autoAlpha: 0,
          y: 42,
          scale: 0.97
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,

          duration:
            0.78,

          ease:
            "power3.out",

          scrollTrigger: {
            trigger:
              item,

            start:
              "top 88%",

            once:
              true
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
          autoAlpha: 0,
          y: 28
        },
        {
          autoAlpha: 1,
          y: 0,

          duration:
            0.72,

          ease:
            "power3.out",

          scrollTrigger: {
            trigger:
              paragraph,

            start:
              "top 89%",

            once:
              true
          }
        }
      );

    }
  );


  gsap.fromTo(
    ".blog-article__back",
    {
      autoAlpha: 0,
      y: 18
    },
    {
      autoAlpha: 1,
      y: 0,

      duration:
        0.65,

      scrollTrigger: {
        trigger:
          ".blog-article__back",

        start:
          "top 92%",

        once:
          true
      }
    }
  );

}


/* =========================================================
   READING APE MOTION
========================================================= */

function initReadingApe() {

  const ape =
    document.querySelector(
      ".blog-reading-ape"
    );


  const rig =
    document.querySelector(
      ".blog-reading-ape__rig"
    );


  const float =
    document.querySelector(
      ".blog-reading-ape__float"
    );


  if (
    !ape ||
    !rig ||
    !float ||
    reduceMotion
  ) {

    return;

  }


  gsap.to(
    float,
    {
      y: -6,
      rotation: 1.4,

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


  ScrollTrigger.create({
    trigger:
      ".blog-article__body",

    start:
      "top 60%",

    end:
      "bottom 40%",

    onUpdate(
      self
    ) {

      const speed =
        gsap.utils.clamp(
          -1,
          1,
          self.getVelocity() /
          1800
        );


      gsap.to(
        rig,
        {
          rotation:
            speed * 4,

          x:
            speed * 5,

          duration:
            0.25,

          ease:
            "power2.out",

          overwrite:
            "auto"
        }
      );

    }
  });

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

    buildArticle();

    initFooter();


    requestAnimationFrame(
      function () {

        initArticleHero();

        initArticleHeroApe();

        initArticleMotion();

        initReadingApe();

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