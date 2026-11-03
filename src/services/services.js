/* =========================================================
   APE STUDIO — SERVICES MAIN
========================================================= */


import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import {
  initHeader
} from "../header/header.js";


import {
  SERVICE_PAGES
} from "./services-data.js";


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
   SERVICE PREVIEW LABELS
========================================================= */

const PREVIEW_LABELS = {

  "digital-marketing":
    "DIGITAL / PERFORMANCE / CONTENT",

  "printables":
    "PRINT / PACKAGING / OFFLINE",

  "branding":
    "IDENTITY / POSITIONING / SYSTEMS",

  "influencer-marketing":
    "CREATORS / REACH / RELEVANCE",

  "visual-studio":
    "PHOTO / FILM / REELS"

};


/* =========================================================
   COVER IMAGE
========================================================= */

function getCoverImage(
  service
) {

  return (
    service?.subservices?.[0]?.images?.[0]
    ||
    "/ape-logo.png"
  );

}


/* =========================================================
   PRELOAD PREVIEW IMAGES
========================================================= */

function preloadImages() {

  Object
    .values(
      SERVICE_PAGES
    )
    .forEach(
      function (
        service
      ) {

        const src =
          getCoverImage(
            service
          );


        if (!src) {
          return;
        }


        const image =
          new Image();


        image.src =
          src;

      }
    );

}


/* =========================================================
   CAPABILITY PREVIEW
========================================================= */

function initCapabilities() {

  const rows =
    Array.from(
      document.querySelectorAll(
        ".capability-row"
      )
    );


  const image =
    document.getElementById(
      "service-preview-image"
    );


  const title =
    document.getElementById(
      "service-preview-title"
    );


  const eyebrow =
    document.getElementById(
      "service-preview-eyebrow"
    );


  const frame =
    document.getElementById(
      "capability-preview-frame"
    );


  if (
    !rows.length ||
    !image
  ) {

    return;

  }


  let activeSlug =
    "";


  let imageTimeline =
    null;


  function activate(
    row
  ) {

    const slug =
      row.dataset.service;


    const service =
      SERVICE_PAGES[slug];


    if (!service) {
      return;
    }


    rows.forEach(
      function (
        current
      ) {

        current.classList.toggle(
          "is-active",
          current === row
        );

      }
    );


    if (
      slug === activeSlug
    ) {

      return;

    }


    activeSlug =
      slug;


    if (
      title
    ) {

      title.textContent =
        service.navLabel;

    }


    if (
      eyebrow
    ) {

      eyebrow.textContent =
        PREVIEW_LABELS[slug]
        ||
        service.eyebrow
        ||
        service.navLabel;

    }


    const nextImage =
      getCoverImage(
        service
      );


    if (
      imageTimeline
    ) {

      imageTimeline.kill();

    }


    if (
      reduceMotion
    ) {

      image.src =
        nextImage;


      image.alt =
        `${service.navLabel} work by APE Studio`;


      return;

    }


    imageTimeline =
      gsap.timeline();


    imageTimeline

      .to(
        image,
        {
          opacity: 0,
          scale: 1.035,

          duration: 0.16,

          ease:
            "power2.in",

          onComplete:
            function () {

              image.src =
                nextImage;


              image.alt =
                `${service.navLabel} work by APE Studio`;

            }
        }
      )


      .fromTo(
        image,
        {
          opacity: 0,
          scale: 1.07
        },
        {
          opacity: 1,
          scale: 1,

          duration: 0.58,

          ease:
            "power3.out"
        }
      );

  }


  rows.forEach(
    function (
      row
    ) {

      row.addEventListener(
        "mouseenter",
        function () {

          if (
            finePointer
          ) {

            activate(
              row
            );

          }

        }
      );


      row.addEventListener(
        "focusin",
        function () {

          activate(
            row
          );

        }
      );


      row.addEventListener(
        "click",
        function (
          event
        ) {

          if (
            event.target.closest(
              "a"
            )
          ) {

            return;

          }


          activate(
            row
          );

        }
      );

    }
  );


  activate(
    rows[0]
  );


  /* =====================================================
     PREVIEW TILT
  ===================================================== */

  if (
    frame &&
    finePointer &&
    !reduceMotion
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
              x * 4,

            rotationX:
              y * -4,

            y: -3,

            duration:
              0.35,

            ease:
              "power3.out",

            overwrite:
              "auto"
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
            rotationX: 0,
            rotationY: 0,
            y: 0,

            duration:
              0.5,

            ease:
              "back.out(1.4)"
          }
        );

      }
    );

  }

}


/* =========================================================
   APE DANCE
========================================================= */

function danceApe(
  rig,
  aura,
  pulse
) {

  if (
    !rig ||
    reduceMotion
  ) {

    return;

  }


  gsap.killTweensOf(
    rig
  );


  gsap.timeline()

    .to(
      rig,
      {
        y: -27,
        x: -10,
        rotation: -7,
        scale: 1.08,

        duration: 0.15
      }
    )

    .to(
      rig,
      {
        x: 12,
        rotation: 8,

        duration: 0.13
      }
    )

    .to(
      rig,
      {
        x: -9,
        rotation: -6,

        duration: 0.13
      }
    )

    .to(
      rig,
      {
        x: 0,

        rotationY:
          "+=360",

        duration: 0.5,

        ease:
          "power3.inOut"
      }
    )

    .to(
      rig,
      {
        x: 0,
        y: 0,

        rotation: 0,
        rotationX: 0,
        rotationY: 0,

        scale: 1,

        duration: 0.38,

        ease:
          "bounce.out"
      }
    );


  if (
    aura
  ) {

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


  if (
    pulse
  ) {

    gsap.fromTo(
      pulse,
      {
        scale: 0.7,
        opacity: 0.7
      },
      {
        scale: 1.4,
        opacity: 0,

        duration: 0.58,

        ease:
          "power2.out"
      }
    );

  }

}


/* =========================================================
   HERO APE
========================================================= */

function initHeroApe() {

  const ape =
    document.querySelector(
      ".services-hero__ape"
    );


  const world =
    document.querySelector(
      ".services-hero__ape-world"
    );


  const rig =
    document.querySelector(
      ".services-hero__ape-rig"
    );


  const float =
    document.querySelector(
      ".services-hero__ape-float"
    );


  const aura =
    document.querySelector(
      ".services-hero__ape-aura"
    );


  const pulse =
    document.querySelector(
      ".services-hero__ape-pulse"
    );


  if (
    !ape ||
    !world ||
    !rig ||
    !float
  ) {

    return;

  }


  if (
    !reduceMotion
  ) {

    gsap.to(
      float,
      {
        y: -8,
        rotation: 1.4,

        duration: 1.7,

        repeat: -1,

        yoyo: true,

        ease:
          "sine.inOut"
      }
    );


    gsap.to(
      ".services-hero__visual",
      {
        yPercent: -4,

        ease: "none",

        scrollTrigger: {
          trigger:
            ".services-hero",

          start:
            "top top",

          end:
            "bottom top",

          scrub:
            0.8
        }
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
              x * 21,

            y:
              y * 12,

            duration: 0.34,

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
              x * 12,

            rotationX:
              y * -7,

            rotation:
              x * 2,

            scale: 1.045,

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

            duration: 0.55,

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

            duration: 0.48,

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

      danceApe(
        rig,
        aura,
        pulse
      );

    }
  );

}


/* =========================================================
   HERO BACKGROUND POINTER
========================================================= */

function initHeroPointer() {

  if (
    !finePointer ||
    reduceMotion
  ) {

    return;

  }


  const hero =
    document.querySelector(
      ".services-hero"
    );


  const violet =
    document.querySelector(
      ".services-hero__glow--violet"
    );


  const lime =
    document.querySelector(
      ".services-hero__glow--lime"
    );


  if (
    !hero
  ) {

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


      if (
        violet
      ) {

        gsap.to(
          violet,
          {
            x:
              x * -30,

            y:
              y * -20,

            duration: 1,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );

      }


      if (
        lime
      ) {

        gsap.to(
          lime,
          {
            x:
              x * 25,

            y:
              y * 16,

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
   HERO MOTION
========================================================= */

function initHeroMotion() {

  if (
    reduceMotion
  ) {

    return;

  }


  gsap.timeline({

    defaults: {
      ease:
        "power4.out"
    }

  })

    .fromTo(
      ".services-hero__eyebrow",
      {
        opacity: 0,
        y: 14
      },
      {
        opacity: 1,
        y: 0,

        duration: 0.45
      }
    )


    .fromTo(
      ".services-hero__title-line",
      {
        opacity: 0,
        y: 55,
        rotationX: -12
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,

        duration: 0.78,

        stagger: 0.08
      },
      "-=0.18"
    )


    .fromTo(
      ".services-hero__copy",
      {
        opacity: 0,
        y: 22
      },
      {
        opacity: 1,
        y: 0,

        duration: 0.58
      },
      "-=0.4"
    )


    .fromTo(
      ".services-hero__cta",
      {
        opacity: 0,
        y: 15
      },
      {
        opacity: 1,
        y: 0,

        duration: 0.5
      },
      "-=0.35"
    )


    .fromTo(
      ".services-hero__ape",
      {
        opacity: 0,
        x: 70,
        y: 60,
        scale: 0.8,
        rotation: 5
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,

        duration: 1.05,

        ease:
          "back.out(1.5)"
      },
      "-=0.72"
    );


  gsap.to(
    ".services-hero__title-line:nth-child(odd)",
    {
      xPercent: -2,

      ease: "none",

      scrollTrigger: {
        trigger:
          ".services-hero",

        start:
          "top top",

        end:
          "bottom top",

        scrub:
          1
      }
    }
  );


  gsap.to(
    ".services-hero__title-line:nth-child(even)",
    {
      xPercent: 2,

      ease: "none",

      scrollTrigger: {
        trigger:
          ".services-hero",

        start:
          "top top",

        end:
          "bottom top",

        scrub:
          1
      }
    }
  );

}


/* =========================================================
   CAPABILITY MOTION
========================================================= */

function initCapabilityMotion() {

  if (
    reduceMotion
  ) {

    return;

  }


  gsap.fromTo(
    ".capabilities__heading",
    {
      opacity: 0,
      y: 35
    },
    {
      opacity: 1,
      y: 0,

      duration: 0.72,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger:
          ".capabilities__header",

        start:
          "top 84%",

        once:
          true
      }
    }
  );


  gsap.fromTo(
    ".capabilities__intro",
    {
      opacity: 0,
      y: 28,
      scale: 0.97
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,

      duration: 0.68,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger:
          ".capabilities__header",

        start:
          "top 84%",

        once:
          true
      }
    }
  );


  gsap.fromTo(
    ".capability-row",
    {
      opacity: 0,
      x: -22
    },
    {
      opacity: 1,
      x: 0,

      duration: 0.55,

      stagger: 0.07,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger:
          ".capability-list",

        start:
          "top 88%",

        once:
          true
      }
    }
  );


  gsap.fromTo(
    ".capability-preview",
    {
      opacity: 0,
      x: 35,
      scale: 0.97
    },
    {
      opacity: 1,
      x: 0,
      scale: 1,

      duration: 0.8,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger:
          ".capabilities__layout",

        start:
          "top 84%",

        once:
          true
      }
    }
  );

}


/* =========================================================
   HERO CTA
========================================================= */

function initHeroCTA() {

  const button =
    document.querySelector(
      ".services-hero__cta"
    );


  const target =
    document.getElementById(
      "capabilities"
    );


  if (
    !button ||
    !target
  ) {

    return;

  }


  button.addEventListener(
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


  if (
    year
  ) {

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


  if (
    !top
  ) {

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

    preloadImages();

    initCapabilities();

    initHeroApe();

    initHeroPointer();

    initHeroCTA();

    initFooter();


    requestAnimationFrame(
      function () {

        initHeroMotion();

        initCapabilityMotion();

        ScrollTrigger.refresh();

      }
    );

  }
);


/* =========================================================
   FINAL REFRESH
========================================================= */

window.addEventListener(
  "load",
  function () {

    ScrollTrigger.refresh();

  }
);