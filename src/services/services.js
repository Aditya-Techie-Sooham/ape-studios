import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/services-page.css";


import {
  initHeader
} from "../header/header.js";


gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   SERVICES PAGE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initHeader();

    initServicesHero();
    initServiceScenes();

    refreshAfterMedia();

  }
);


/* =========================================================
   HELPERS
========================================================= */

function refreshAfterMedia() {

  requestAnimationFrame(
    () => {

      ScrollTrigger.refresh();

    }
  );


  const images =
    document.querySelectorAll(
      ".services-page img"
    );


  images.forEach(
    (image) => {

      if (image.complete) {
        return;
      }


      image.addEventListener(
        "load",
        () => {

          ScrollTrigger.refresh();

        },
        {
          once: true
        }
      );

    }
  );


  window.addEventListener(
    "load",
    () => {

      ScrollTrigger.refresh();

    },
    {
      once: true
    }
  );

}


/* =========================================================
   HERO
========================================================= */

function initServicesHero() {

  const hero =
    document.getElementById(
      "services-hero"
    );


  if (!hero) {
    return;
  }


  const titleLines =
    hero.querySelectorAll(
      ".services-hero__title-wrap h1 span"
    );


  const bottomCopy =
    hero.querySelector(
      ".services-hero__bottom > p"
    );


  const explore =
    hero.querySelector(
      ".services-hero__explore"
    );


  const ape =
    hero.querySelector(
      ".services-hero__ape"
    );


  const mm =
    gsap.matchMedia();



  /* =====================================================
     DESKTOP
  ===================================================== */

  mm.add(
    "(min-width: 1200px)",
    () => {

      const timeline =
        gsap.timeline({
          defaults: {
            ease: "power4.out"
          }
        });


      if (titleLines.length) {

        timeline.fromTo(
          titleLines,
          {
            y: 90,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,

            duration: 1.05,

            stagger: 0.11
          },
          0.12
        );

      }


      if (bottomCopy) {

        timeline.fromTo(
          bottomCopy,
          {
            y: 28,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,

            duration: 0.7
          },
          0.48
        );

      }


      if (explore) {

        timeline.fromTo(
          explore,
          {
            y: 22,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,

            duration: 0.7
          },
          0.58
        );

      }


      if (ape) {

        gsap.fromTo(
          ape,
          {
            xPercent: 0,
            yPercent: 0
          },
          {
            xPercent: 5,
            yPercent: -4,

            ease: "none",

            scrollTrigger: {
              trigger: hero,

              start: "top top",
              end: "bottom top",

              scrub: 1
            }
          }
        );

      }


      if (titleLines.length) {

        gsap.to(
          titleLines,
          {
            yPercent: -7,

            ease: "none",

            scrollTrigger: {
              trigger: hero,

              start: "top top",
              end: "bottom top",

              scrub: 1
            }
          }
        );

      }


      return () => {

        timeline.kill();

      };

    }
  );



  /* =====================================================
     TABLET
  ===================================================== */

  mm.add(
    "(min-width: 768px) and (max-width: 1199px)",
    () => {

      const timeline =
        gsap.timeline();


      if (titleLines.length) {

        timeline.fromTo(
          titleLines,
          {
            y: 55,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,

            duration: 0.85,

            stagger: 0.08,

            ease: "power3.out"
          },
          0.08
        );

      }


      if (bottomCopy) {

        timeline.fromTo(
          bottomCopy,
          {
            y: 22,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,

            duration: 0.65,

            ease: "power3.out"
          },
          0.32
        );

      }


      if (explore) {

        timeline.fromTo(
          explore,
          {
            y: 18,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,

            duration: 0.6,

            ease: "power3.out"
          },
          0.42
        );

      }


      if (ape) {

        gsap.to(
          ape,
          {
            yPercent: -2.5,

            ease: "none",

            scrollTrigger: {
              trigger: hero,

              start: "top top",
              end: "bottom top",

              scrub: 1
            }
          }
        );

      }


      return () => {

        timeline.kill();

      };

    }
  );



  /* =====================================================
     MOBILE
     NO HEAVY SCRUB / NO BIG PARALLAX
  ===================================================== */

  mm.add(
    "(max-width: 767px)",
    () => {

      const timeline =
        gsap.timeline({
          defaults: {
            ease: "power3.out"
          }
        });


      if (titleLines.length) {

        timeline.fromTo(
          titleLines,
          {
            y: 38,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,

            duration: 0.72,

            stagger: 0.08
          },
          0.05
        );

      }


      if (bottomCopy) {

        timeline.fromTo(
          bottomCopy,
          {
            y: 20,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,

            duration: 0.55
          },
          0.28
        );

      }


      if (explore) {

        timeline.fromTo(
          explore,
          {
            y: 15,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,

            duration: 0.5
          },
          0.38
        );

      }


      /*
       * Mobile intentionally has no
       * scrubbed title/parallax movement.
       */


      return () => {

        timeline.kill();

      };

    }
  );

}


/* =========================================================
   SERVICE SCENES
========================================================= */

function initServiceScenes() {

  const showcase =
    document.getElementById(
      "services-showcase"
    );


  if (!showcase) {
    return;
  }


  const scenes =
    Array.from(
      showcase.querySelectorAll(
        ".service-scene"
      )
    );


  if (!scenes.length) {
    return;
  }


  const mm =
    gsap.matchMedia();



  /* =====================================================
     DESKTOP
  ===================================================== */

  mm.add(
    "(min-width: 1200px)",
    () => {

      scenes.forEach(
        (
          scene,
          index
        ) => {

          const number =
            scene.querySelector(
              ".service-scene__meta span:first-child"
            );


          const serviceName =
            scene.querySelector(
              ".service-scene__meta span:last-child"
            );


          const headline =
            scene.querySelector(
              ".service-scene__content h2"
            );


          const copy =
            scene.querySelector(
              ".service-scene__copy"
            );


          const tags =
            scene.querySelectorAll(
              ".service-scene__tags span"
            );


          const media =
            scene.querySelector(
              ".service-scene__media"
            );


          const image =
            scene.querySelector(
              ".service-scene__media img"
            );


          const isRight =
            scene.classList.contains(
              "service-scene--right"
            );



          /* =============================================
             SERVICE NUMBER
          ============================================== */

          if (number) {

            gsap.fromTo(
              number,
              {
                y: 12,
                opacity: 0
              },
              {
                y: 0,
                opacity: 1,

                ease: "none",

                scrollTrigger: {
                  trigger: scene,

                  start: "top 86%",
                  end: "top 72%",

                  scrub: 0.5
                }
              }
            );

          }



          /* =============================================
             ACTUAL SERVICE NAME
             PRIMARY REVEAL
          ============================================== */

          if (serviceName) {

            gsap.fromTo(
              serviceName,
              {
                x:
                  isRight
                    ? 42
                    : -42,

                opacity: 0
              },
              {
                x: 0,
                opacity: 1,

                ease: "none",

                scrollTrigger: {
                  trigger: scene,

                  start: "top 84%",
                  end: "top 56%",

                  scrub: 0.7
                }
              }
            );

          }



          /* =============================================
             SUPPORTING HEADLINE
          ============================================== */

          if (headline) {

            gsap.fromTo(
              headline,
              {
                y: 32,
                opacity: 0
              },
              {
                y: 0,
                opacity: 1,

                ease: "none",

                scrollTrigger: {
                  trigger: scene,

                  start: "top 76%",
                  end: "top 50%",

                  scrub: 0.65
                }
              }
            );

          }



          /* =============================================
             COPY
          ============================================== */

          if (copy) {

            gsap.fromTo(
              copy,
              {
                y: 24,
                opacity: 0
              },
              {
                y: 0,
                opacity: 1,

                ease: "none",

                scrollTrigger: {
                  trigger: scene,

                  start: "top 70%",
                  end: "top 44%",

                  scrub: 0.6
                }
              }
            );

          }



          /* =============================================
             TAGS
          ============================================== */

          if (tags.length) {

            gsap.fromTo(
              tags,
              {
                y: 12,
                opacity: 0
              },
              {
                y: 0,
                opacity: 1,

                stagger: 0.04,

                ease: "none",

                scrollTrigger: {
                  trigger: scene,

                  start: "top 65%",
                  end: "top 39%",

                  scrub: 0.55
                }
              }
            );

          }



          /* =============================================
             MEDIA
          ============================================== */

          if (media) {

            gsap.fromTo(
              media,
              {
                x:
                  isRight
                    ? -38
                    : 38,

                y: 20,

                scale: 0.975,

                opacity: 0
              },
              {
                x: 0,
                y: 0,

                scale: 1,

                opacity: 1,

                ease: "none",

                scrollTrigger: {
                  trigger: scene,

                  start: "top 88%",
                  end: "top 48%",

                  scrub: 0.8
                }
              }
            );

          }



          /* =============================================
             LIGHT IMAGE PARALLAX
          ============================================== */

          if (image) {

            gsap.fromTo(
              image,
              {
                yPercent: -3,

                scale: 1.055
              },
              {
                yPercent: 3,

                scale: 1.02,

                ease: "none",

                scrollTrigger: {
                  trigger: scene,

                  start: "top bottom",
                  end: "bottom top",

                  scrub: 1
                }
              }
            );

          }



          /* =============================================
             TINY VISUAL DRIFT
             DESKTOP ONLY
          ============================================== */

          if (media) {

            gsap.fromTo(
              media,
              {
                rotation:
                  index % 2 === 0
                    ? -0.25
                    : 0.25
              },
              {
                rotation:
                  index % 2 === 0
                    ? 0.25
                    : -0.25,

                ease: "none",

                scrollTrigger: {
                  trigger: scene,

                  start: "top bottom",
                  end: "bottom top",

                  scrub: 1.3
                }
              }
            );

          }

        }
      );

    }
  );



  /* =====================================================
     TABLET
     MUCH LIGHTER THAN DESKTOP
  ===================================================== */

  mm.add(
    "(min-width: 768px) and (max-width: 1199px)",
    () => {

      scenes.forEach(
        (scene) => {

          const number =
            scene.querySelector(
              ".service-scene__meta span:first-child"
            );


          const serviceName =
            scene.querySelector(
              ".service-scene__meta span:last-child"
            );


          const headline =
            scene.querySelector(
              ".service-scene__content h2"
            );


          const copy =
            scene.querySelector(
              ".service-scene__copy"
            );


          const tags =
            scene.querySelectorAll(
              ".service-scene__tags span"
            );


          const media =
            scene.querySelector(
              ".service-scene__media"
            );


          const image =
            scene.querySelector(
              ".service-scene__media img"
            );



          /* =============================================
             NUMBER + SERVICE NAME
          ============================================== */

          if (number) {

            gsap.fromTo(
              number,
              {
                opacity: 0,
                y: 10
              },
              {
                opacity: 1,
                y: 0,

                scrollTrigger: {
                  trigger: scene,

                  start: "top 88%",
                  end: "top 72%",

                  scrub: 0.45
                }
              }
            );

          }


          if (serviceName) {

            gsap.fromTo(
              serviceName,
              {
                opacity: 0,
                y: 24
              },
              {
                opacity: 1,
                y: 0,

                scrollTrigger: {
                  trigger: scene,

                  start: "top 84%",
                  end: "top 59%",

                  scrub: 0.55
                }
              }
            );

          }



          /* =============================================
             MEDIA
          ============================================== */

          if (media) {

            gsap.fromTo(
              media,
              {
                opacity: 0,

                y: 28,

                scale: 0.985
              },
              {
                opacity: 1,

                y: 0,

                scale: 1,

                scrollTrigger: {
                  trigger: scene,

                  start: "top 84%",
                  end: "top 48%",

                  scrub: 0.7
                }
              }
            );

          }



          /* =============================================
             LIGHT PARALLAX
          ============================================== */

          if (image) {

            gsap.fromTo(
              image,
              {
                yPercent: -2,

                scale: 1.04
              },
              {
                yPercent: 2,

                scale: 1.02,

                ease: "none",

                scrollTrigger: {
                  trigger: scene,

                  start: "top bottom",
                  end: "bottom top",

                  scrub: 1.1
                }
              }
            );

          }



          /* =============================================
             TEXT
          ============================================== */

          const textElements =
            [
              headline,
              copy
            ].filter(Boolean);


          if (textElements.length) {

            gsap.fromTo(
              textElements,
              {
                opacity: 0,

                y: 22
              },
              {
                opacity: 1,

                y: 0,

                stagger: 0.06,

                scrollTrigger: {
                  trigger: scene,

                  start: "top 72%",
                  end: "top 43%",

                  scrub: 0.55
                }
              }
            );

          }


          if (tags.length) {

            gsap.fromTo(
              tags,
              {
                opacity: 0,

                y: 9
              },
              {
                opacity: 1,

                y: 0,

                stagger: 0.03,

                scrollTrigger: {
                  trigger: scene,

                  start: "top 63%",
                  end: "top 39%",

                  scrub: 0.45
                }
              }
            );

          }

        }
      );

    }
  );



  /* =====================================================
     MOBILE
     DIFFERENT EXPERIENCE
  ===================================================== */

  mm.add(
    "(max-width: 767px)",
    () => {

      scenes.forEach(
        (scene) => {

          const number =
            scene.querySelector(
              ".service-scene__meta span:first-child"
            );


          const serviceName =
            scene.querySelector(
              ".service-scene__meta span:last-child"
            );


          const headline =
            scene.querySelector(
              ".service-scene__content h2"
            );


          const copyParagraphs =
            scene.querySelectorAll(
              ".service-scene__copy p"
            );


          const tags =
            scene.querySelectorAll(
              ".service-scene__tags span"
            );


          const media =
            scene.querySelector(
              ".service-scene__media"
            );


          /*
           * MOBILE DOES NOT USE SCRUBBED
           * TEXT TRANSLATIONS.
           *
           * Each scene simply enters cleanly.
           */


          const timeline =
            gsap.timeline({
              scrollTrigger: {
                trigger: scene,

                start: "top 82%",

                toggleActions:
                  "play none none reverse"
              }
            });


          if (number) {

            timeline.fromTo(
              number,
              {
                opacity: 0,

                y: 8
              },
              {
                opacity: 1,

                y: 0,

                duration: 0.35,

                ease: "power2.out"
              },
              0
            );

          }


          if (serviceName) {

            timeline.fromTo(
              serviceName,
              {
                opacity: 0,

                y: 24
              },
              {
                opacity: 1,

                y: 0,

                duration: 0.55,

                ease: "power3.out"
              },
              0.06
            );

          }


          if (headline) {

            timeline.fromTo(
              headline,
              {
                opacity: 0,

                y: 18
              },
              {
                opacity: 1,

                y: 0,

                duration: 0.45,

                ease: "power2.out"
              },
              0.18
            );

          }


          if (copyParagraphs.length) {

            timeline.fromTo(
              copyParagraphs,
              {
                opacity: 0,

                y: 14
              },
              {
                opacity: 1,

                y: 0,

                duration: 0.4,

                stagger: 0.06,

                ease: "power2.out"
              },
              0.24
            );

          }


          if (tags.length) {

            timeline.fromTo(
              tags,
              {
                opacity: 0,

                y: 10
              },
              {
                opacity: 1,

                y: 0,

                duration: 0.32,

                stagger: 0.035,

                ease: "power2.out"
              },
              0.32
            );

          }


          if (media) {

            timeline.fromTo(
              media,
              {
                opacity: 0,

                y: 22,

                scale: 0.985
              },
              {
                opacity: 1,

                y: 0,

                scale: 1,

                duration: 0.6,

                ease: "power3.out"
              },
              0.18
            );

          }

        }
      );

    }
  );


  initWebScene();

  initMotionScene();

}


/* =========================================================
   WEBSITE SCENE DETAILS
========================================================= */

function initWebScene() {

  const browser =
    document.querySelector(
      ".service-scene__browser"
    );


  if (!browser) {
    return;
  }


  const dots =
    browser.querySelectorAll(
      "span"
    );


  if (!dots.length) {
    return;
  }


  const mm =
    gsap.matchMedia();



  /* DESKTOP */

  mm.add(
    "(min-width: 1200px)",
    () => {

      const tween =
        gsap.to(
          dots,
          {
            y: -3,

            scale: 1.16,

            duration: 0.75,

            repeat: -1,

            yoyo: true,

            stagger: 0.12,

            ease: "sine.inOut"
          }
        );


      return () => {

        tween.kill();

      };

    }
  );



  /* TABLET */

  mm.add(
    "(min-width: 768px) and (max-width: 1199px)",
    () => {

      const tween =
        gsap.to(
          dots,
          {
            y: -2,

            duration: 0.9,

            repeat: -1,

            yoyo: true,

            stagger: 0.12,

            ease: "sine.inOut"
          }
        );


      return () => {

        tween.kill();

      };

    }
  );


  /*
   * MOBILE:
   * STATIC DOTS.
   * No pointless infinite animation.
   */

}


/* =========================================================
   MOTION SERVICE DETAILS
========================================================= */

function initMotionScene() {

  const scene =
    document.getElementById(
      "service-motion"
    );


  if (!scene) {
    return;
  }


  const lines =
    scene.querySelectorAll(
      ".service-scene__motion-lines i"
    );


  if (!lines.length) {
    return;
  }


  const mm =
    gsap.matchMedia();



  /* =====================================================
     DESKTOP
  ===================================================== */

  mm.add(
    "(min-width: 1200px)",
    () => {

      const tweens = [];


      lines.forEach(
        (
          line,
          index
        ) => {

          const tween =
            gsap.fromTo(
              line,
              {
                xPercent:
                  index % 2 === 0
                    ? -12
                    : 12
              },
              {
                xPercent:
                  index % 2 === 0
                    ? 12
                    : -12,

                duration:
                  2.8 +
                  index * 0.3,

                repeat: -1,

                yoyo: true,

                ease: "sine.inOut"
              }
            );


          tweens.push(
            tween
          );

        }
      );


      return () => {

        tweens.forEach(
          tween => tween.kill()
        );

      };

    }
  );



  /* =====================================================
     TABLET
  ===================================================== */

  mm.add(
    "(min-width: 768px) and (max-width: 1199px)",
    () => {

      const tweens = [];


      lines.forEach(
        (
          line,
          index
        ) => {

          const tween =
            gsap.fromTo(
              line,
              {
                xPercent:
                  index % 2 === 0
                    ? -6
                    : 6
              },
              {
                xPercent:
                  index % 2 === 0
                    ? 6
                    : -6,

                duration:
                  3.2 +
                  index * 0.25,

                repeat: -1,

                yoyo: true,

                ease: "sine.inOut"
              }
            );


          tweens.push(
            tween
          );

        }
      );


      return () => {

        tweens.forEach(
          tween => tween.kill()
        );

      };

    }
  );


  /*
   * MOBILE:
   * LINES STAY STATIC.
   */

}