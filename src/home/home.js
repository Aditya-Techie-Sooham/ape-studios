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

  initAbout();

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
      ".home-about__heading",
      ".home-about__content",
      ".home-work-new__header",
      ".home-work-new__project",
      ".home-clients__heading",
      ".home-client-logo",
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
   ABOUT
========================================================= */

function initAbout() {

  const section =
    document.getElementById(
      "home-about"
    );


  if (!section) {
    return;
  }


  const heading =
    section.querySelector(
      ".home-about__heading"
    );


  const content =
    section.querySelector(
      ".home-about__content"
    );


  if (heading) {

    gsap.fromTo(

      heading,

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

          trigger: section,

          start:
            "top 84%",

          once: true

        }

      }

    );

  }


  if (content) {

    gsap.fromTo(

      content,

      {
        y: 34,

        opacity: 0
      },

      {
        y: 0,

        opacity: 1,

        duration: 0.85,

        delay: 0.07,

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


  const heading =
    section.querySelector(
      ".home-clients__heading"
    );


  const logos =
    section.querySelectorAll(
      ".home-client-logo"
    );


  if (heading) {

    gsap.fromTo(

      heading,

      {
        y: 28,

        opacity: 0
      },

      {
        y: 0,

        opacity: 1,

        duration: 0.75,

        ease: "power3.out",

        scrollTrigger: {

          trigger: heading,

          start:
            "top 88%",

          once: true

        }

      }

    );

  }


  if (logos.length) {

    gsap.fromTo(

      logos,

      {
        y: 16,

        opacity: 0
      },

      {
        y: 0,

        opacity: 1,

        duration: 0.55,

        stagger: 0.035,

        ease: "power2.out",

        scrollTrigger: {

          trigger:
            ".home-clients__logos",

          start:
            "top 88%",

          once: true

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