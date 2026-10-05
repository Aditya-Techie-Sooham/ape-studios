import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   INIT
========================================================= */

export function initHome() {

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  initFooterYear();


  if (reduceMotion) {

    showHomeContent();

    return;

  }


  initWho();

  initWork();

  initClients();

  initRecognition();


  requestAnimationFrame(
    () => {

      ScrollTrigger.refresh();

    }
  );

}


/* =========================================================
   REDUCED MOTION
========================================================= */

function showHomeContent() {

  gsap.set(
    [
      ".home-who__content",
      ".home-who__visual",
      ".home-work-new__header",
      ".home-work-new__project",
      ".home-clients__heading",
      ".home-clients__marquee",
      ".home-recognition__visual",
      ".home-recognition__content"
    ],
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1
    }
  );

}


/* =========================================================
   WHO
========================================================= */

function initWho() {

  const section =
    document.getElementById(
      "home-who"
    );


  if (!section) {
    return;
  }


  const content =
    section.querySelector(
      ".home-who__content"
    );


  const visual =
    section.querySelector(
      ".home-who__visual"
    );


  if (content) {

    gsap.fromTo(

      content,

      {
        y: 35,
        opacity: 0
      },

      {
        y: 0,
        opacity: 1,

        duration: 0.8,

        ease: "power3.out",

        scrollTrigger: {

          trigger: section,

          start:
            "top 84%",

          once: true

        }

      }

    );

  }


  if (visual) {

    gsap.fromTo(

      visual,

      {
        y: 35,
        opacity: 0
      },

      {
        y: 0,
        opacity: 1,

        duration: 0.85,

        delay: 0.08,

        ease: "power3.out",

        scrollTrigger: {

          trigger: section,

          start:
            "top 84%",

          once: true

        }

      }

    );

  }

}




/* =========================================================
   WORK
========================================================= */

function initWork() {

  const section =
    document.getElementById(
      "home-work"
    );


  if (!section) {
    return;
  }


  const header =
    section.querySelector(
      ".home-work-new__header"
    );


  const projects =
    section.querySelectorAll(
      ".home-work-new__project"
    );


  if (header) {

    gsap.fromTo(

      header,

      {
        y: 30,

        opacity: 0
      },

      {
        y: 0,

        opacity: 1,

        duration: 0.8,

        ease: "power3.out",

        scrollTrigger: {

          trigger: header,

          start:
            "top 88%",

          once: true

        }

      }

    );

  }


  projects.forEach(
    (
      project,
      index
    ) => {

      gsap.fromTo(

        project,

        {
          y: 30,

          opacity: 0
        },

        {
          y: 0,

          opacity: 1,

          duration: 0.75,

          delay:
            index * 0.06,

          ease: "power3.out",

          scrollTrigger: {

            trigger: project,

            start:
              "top 90%",

            once: true

          }

        }

      );

    }
  );

}


/* =========================================================
   CLIENTS
========================================================= */

function initClients() {

  const section =
    document.getElementById(
      "home-clients"
    );


  if (!section) {
    return;
  }



  /* =====================================================
     BUILD SEAMLESS MARQUEE COPIES
  ===================================================== */

  const tracks =
    section.querySelectorAll(
      ".home-clients__track"
    );


  tracks.forEach(
    function (
      track
    ) {

      const originalGroup =
        track.querySelector(
          ".home-clients__group"
        );


      if (
        !originalGroup
      ) {

        return;

      }



      /*
       * Prevent duplicate cloning if initHome()
       * is ever triggered more than once.
       */

      if (
        track.querySelector(
          ".home-clients__group[aria-hidden='true']"
        )
      ) {

        return;

      }



      const clone =
        originalGroup.cloneNode(
          true
        );


      clone.setAttribute(
        "aria-hidden",
        "true"
      );


      /*
       * Images inside the duplicate are decorative.
       */

      clone
        .querySelectorAll(
          "img"
        )
        .forEach(
          function (
            image
          ) {

            image.alt =
              "";

          }
        );


      track.appendChild(
        clone
      );

  });



  /* =====================================================
     HEADING REVEAL
  ===================================================== */

  const heading =
    section.querySelector(
      ".home-clients__heading"
    );


  if (
    heading
  ) {

    gsap.fromTo(

      heading,

      {
        y: 28,
        opacity: 0
      },

      {
        y: 0,
        opacity: 1,

        duration:
          0.75,

        ease:
          "power3.out",

        scrollTrigger: {

          trigger:
            heading,

          start:
            "top 88%",

          once:
            true

        }

      }

    );

  }



  /* =====================================================
     MARQUEE REVEAL
  ===================================================== */

  const marquees =
    section.querySelectorAll(
      ".home-clients__marquee"
    );


  if (
    marquees.length
  ) {

    gsap.fromTo(

      marquees,

      {
        y: 25,
        opacity: 0
      },

      {
        y: 0,
        opacity: 1,

        duration:
          0.8,

        stagger:
          0.10,

        ease:
          "power3.out",

        scrollTrigger: {

          trigger:
            ".home-clients__logos",

          start:
            "top 88%",

          once:
            true

        }

      }

    );

  }

}


/* =========================================================
   AWARD
========================================================= */

function initRecognition() {

  const section =
    document.getElementById(
      "home-recognition"
    );


  if (!section) {
    return;
  }


  const visual =
    section.querySelector(
      ".home-recognition__visual"
    );


  const content =
    section.querySelector(
      ".home-recognition__content"
    );


  if (visual) {

    gsap.fromTo(

      visual,

      {
        y: 32,

        opacity: 0
      },

      {
        y: 0,

        opacity: 1,

        duration: 0.85,

        ease: "power3.out",

        scrollTrigger: {

          trigger: section,

          start:
            "top 82%",

          once: true

        }

      }

    );

  }


  if (content) {

    gsap.fromTo(

      content,

      {
        y: 32,

        opacity: 0
      },

      {
        y: 0,

        opacity: 1,

        duration: 0.85,

        delay: 0.08,

        ease: "power3.out",

        scrollTrigger: {

          trigger: section,

          start:
            "top 82%",

          once: true

        }

      }

    );

  }

}


/* =========================================================
   FOOTER YEAR
========================================================= */

function initFooterYear() {

  const year =
    document.getElementById(
      "ape-footer-year"
    );


  if (!year) {
    return;
  }


  year.textContent =
    new Date().getFullYear();

}