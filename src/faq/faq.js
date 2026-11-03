/* =========================================================
   APE STUDIO — FAQ PAGE
   FINAL INTERACTIVE VERSION
========================================================= */

import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import {
  initHeader
} from "../header/header.js";


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
   FAQ ACCORDION
========================================================= */

function initFAQAccordion() {

  const items =
    Array.from(
      document.querySelectorAll(
        ".faq-item"
      )
    );


  if (!items.length) {
    return;
  }


  items.forEach(
    function (
      item
    ) {

      const button =
        item.querySelector(
          ".faq-item__button"
        );


      const answer =
        item.querySelector(
          ".faq-item__answer"
        );


      const inner =
        item.querySelector(
          ".faq-item__answer-inner"
        );


      if (
        !button ||
        !answer ||
        !inner
      ) {
        return;
      }


      gsap.set(
        answer,
        {
          height: 0
        }
      );


      gsap.set(
        inner,
        {
          autoAlpha: 0,

          y: 15
        }
      );


      button.addEventListener(
        "click",
        function () {

          const currentlyOpen =
            item.classList.contains(
              "is-open"
            );


          items.forEach(
            function (
              otherItem
            ) {

              const otherButton =
                otherItem.querySelector(
                  ".faq-item__button"
                );


              const otherAnswer =
                otherItem.querySelector(
                  ".faq-item__answer"
                );


              const otherInner =
                otherItem.querySelector(
                  ".faq-item__answer-inner"
                );


              otherItem.classList.remove(
                "is-open"
              );


              if (otherButton) {

                otherButton.setAttribute(
                  "aria-expanded",
                  "false"
                );

              }


              if (otherInner) {

                gsap.killTweensOf(
                  otherInner
                );


                gsap.to(
                  otherInner,
                  {

                    autoAlpha: 0,

                    y: 12,

                    duration:
                      reduceMotion
                        ? 0
                        : 0.18,

                    overwrite: true

                  }
                );

              }


              if (otherAnswer) {

                gsap.killTweensOf(
                  otherAnswer
                );


                gsap.to(
                  otherAnswer,
                  {

                    height: 0,

                    duration:
                      reduceMotion
                        ? 0
                        : 0.42,

                    ease:
                      "power3.inOut",

                    overwrite: true

                  }
                );

              }

            }
          );


          if (currentlyOpen) {

            requestAnimationFrame(
              function () {

                ScrollTrigger.refresh();

                updateFloatingApe(
                  0,
                  true
                );

              }
            );


            return;

          }


          item.classList.add(
            "is-open"
          );


          button.setAttribute(
            "aria-expanded",
            "true"
          );


          gsap.killTweensOf(
            answer
          );


          gsap.to(
            answer,
            {

              height: "auto",

              duration:
                reduceMotion
                  ? 0
                  : 0.58,

              ease:
                "power4.inOut",

              overwrite: true,

              onComplete:
                function () {

                  ScrollTrigger.refresh();


                  requestAnimationFrame(
                    function () {

                      updateFloatingApe(
                        0,
                        true
                      );

                    }
                  );

                }

            }
          );


          gsap.fromTo(
            inner,
            {

              autoAlpha: 0,

              y: 18

            },
            {

              autoAlpha: 1,

              y: 0,

              duration:
                reduceMotion
                  ? 0
                  : 0.47,

              delay:
                reduceMotion
                  ? 0
                  : 0.11,

              ease:
                "power3.out",

              overwrite: true

            }
          );


          if (!reduceMotion) {

            animateFAQClick(
              item
            );


            reactFloatingApe(
              item
            );

          }

        }
      );

    }
  );

}


/* =========================================================
   FAQ CLICK REACTION
========================================================= */

function animateFAQClick(
  item
) {

  const question =
    item.querySelector(
      ".faq-item__question"
    );


  const icon =
    item.querySelector(
      ".faq-item__icon"
    );


  if (question) {

    gsap.timeline()

      .to(
        question,
        {

          x: 9,

          duration: 0.13,

          ease:
            "power2.out"

        }
      )

      .to(
        question,
        {

          x: 0,

          duration: 0.42,

          ease:
            "elastic.out(1,0.5)"

        }
      );

  }


  if (icon) {

    gsap.fromTo(
      icon,
      {

        scale: 0.82

      },
      {

        scale: 1,

        duration: 0.46,

        ease:
          "back.out(2.3)"

      }
    );

  }

}


/* =========================================================
   HERO ENTRANCE
========================================================= */

function initHeroMotion() {

  if (reduceMotion) {
    return;
  }


  const eyebrow =
    document.querySelector(
      ".faq-intro__eyebrow"
    );


  const titleLines =
    document.querySelectorAll(
      ".faq-intro h1 > *"
    );


  const lead =
    document.querySelector(
      ".faq-intro__lead"
    );


  const jump =
    document.querySelector(
      ".faq-intro__jump"
    );


  const ape =
    document.querySelector(
      ".faq-hero-ape"
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

        duration: 0.55

      }
    );

  }


  if (titleLines.length) {

    timeline.fromTo(
      titleLines,
      {

        autoAlpha: 0,

        y: 65,

        rotationX: -18

      },
      {

        autoAlpha: 1,

        y: 0,

        rotationX: 0,

        duration: 0.92,

        stagger: 0.08

      },
      "-=0.22"
    );

  }


  if (lead) {

    timeline.fromTo(
      lead,
      {

        autoAlpha: 0,

        y: 19

      },
      {

        autoAlpha: 1,

        y: 0,

        duration: 0.63

      },
      "-=0.42"
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
      "-=0.36"
    );

  }


  if (ape) {

    timeline.fromTo(
      ape,
      {

        autoAlpha: 0,

        x: 100,

        y: 75,

        rotation: 8,

        scale: 0.68

      },
      {

        autoAlpha: 1,

        x: 0,

        y: 0,

        rotation: 0,

        scale: 1,

        duration: 1.1,

        ease:
          "back.out(1.6)"

      },
      "-=0.72"
    );

  }


  gsap.to(
    ".faq-hero-ape",
    {

      yPercent: -7,

      ease: "none",

      scrollTrigger: {

        trigger:
          ".faq-intro",

        start:
          "top top",

        end:
          "bottom top",

        scrub: 0.9

      }

    }
  );


  gsap.to(
    ".faq-intro h1 span",
    {

      xPercent: -3,

      ease: "none",

      scrollTrigger: {

        trigger:
          ".faq-intro",

        start:
          "top top",

        end:
          "bottom top",

        scrub: 1

      }

    }
  );


  gsap.to(
    ".faq-intro h1 strong",
    {

      xPercent: 2.4,

      ease: "none",

      scrollTrigger: {

        trigger:
          ".faq-intro",

        start:
          "top top",

        end:
          "bottom top",

        scrub: 1

      }

    }
  );

}


/* =========================================================
   HERO APE INTERACTION
========================================================= */

function initHeroApe() {

  const ape =
    document.querySelector(
      ".faq-hero-ape"
    );


  const world =
    document.querySelector(
      ".faq-hero-ape__world"
    );


  const rig =
    document.querySelector(
      ".faq-hero-ape__rig"
    );


  const float =
    document.querySelector(
      ".faq-hero-ape__float"
    );


  const aura =
    document.querySelector(
      ".faq-hero-ape__aura"
    );


  const pulse =
    document.querySelector(
      ".faq-hero-ape__pulse"
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

        rotation: 1.25,

        duration: 1.85,

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
      "pointerenter",
      function () {

        if (aura) {

          gsap.to(
            aura,
            {

              scale: 1.12,

              opacity: 1,

              duration: 0.4

            }
          );

        }


        gsap.to(
          rig,
          {

            y: -9,

            scale: 1.055,

            duration: 0.3,

            ease:
              "back.out(1.6)"

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

            x: 0,

            y: 0,

            rotation: 0,

            rotationX: 0,

            rotationY: 0,

            scale: 1,

            duration: 0.5,

            ease:
              "back.out(1.7)"

          }
        );


        if (aura) {

          gsap.to(
            aura,
            {

              scale: 1,

              duration: 0.45

            }
          );

        }

      }
    );

  }


  ape.addEventListener(
    "click",
    function () {

      if (reduceMotion) {
        return;
      }


      danceHeroApe(
        rig,
        aura,
        pulse
      );

    }
  );

}


/* =========================================================
   HERO APE DANCE
========================================================= */

function danceHeroApe(
  rig,
  aura,
  pulse
) {

  gsap.killTweensOf(
    rig
  );


  gsap.timeline()

    .to(
      rig,
      {

        y: -32,

        x: -15,

        rotation: -8,

        scale: 1.11,

        duration: 0.16,

        ease:
          "power3.out"

      }
    )

    .to(
      rig,
      {

        x: 16,

        rotation: 8,

        duration: 0.14

      }
    )

    .to(
      rig,
      {

        x: -12,

        rotation: -7,

        duration: 0.14

      }
    )

    .to(
      rig,
      {

        x: 10,

        rotation: 6,

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

        y: 0,

        rotation: 0,

        rotationX: 0,

        rotationY: 0,

        scale: 1,

        duration: 0.42,

        ease:
          "bounce.out"

      }
    );


  if (aura) {

    gsap.fromTo(
      aura,
      {

        scale: 0.75,

        opacity: 1

      },
      {

        scale: 1.4,

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

        opacity: 0.9

      },
      {

        scale: 1.45,

        opacity: 0,

        duration: 0.6,

        ease:
          "power2.out"

      }
    );

  }

}


/* =========================================================
   HERO BACKGROUND POINTER DEPTH
========================================================= */

function initHeroBackgroundMotion() {

  if (
    !finePointer ||
    reduceMotion
  ) {
    return;
  }


  const hero =
    document.querySelector(
      ".faq-intro"
    );


  const violet =
    document.querySelector(
      ".faq-intro__glow--violet"
    );


  const lime =
    document.querySelector(
      ".faq-intro__glow--lime"
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
   FAQ ROW MOTION
========================================================= */

function initFAQRows() {

  const items =
    gsap.utils.toArray(
      ".faq-item"
    );


  items.forEach(
    function (
      item
    ) {

      const button =
        item.querySelector(
          ".faq-item__button"
        );


      const question =
        item.querySelector(
          ".faq-item__question"
        );


      const icon =
        item.querySelector(
          ".faq-item__icon"
        );


      if (!reduceMotion) {

        gsap.fromTo(
          item,
          {

            autoAlpha: 0,

            y: 34

          },
          {

            autoAlpha: 1,

            y: 0,

            duration: 0.68,

            ease:
              "power3.out",

            scrollTrigger: {

              trigger:
                item,

              start:
                "top 91%",

              once: true

            }

          }
        );

      }


      if (
        finePointer &&
        !reduceMotion &&
        button &&
        question &&
        icon
      ) {

        button.addEventListener(
          "pointermove",
          function (
            event
          ) {

            const rect =
              button.getBoundingClientRect();


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
              question,
              {

                x:
                  x * 8,

                duration: 0.3,

                ease:
                  "power3.out",

                overwrite:
                  "auto"

              }
            );


            gsap.to(
              icon,
              {

                x:
                  x * 7,

                y:
                  y * 7,

                scale: 1.06,

                duration: 0.3,

                ease:
                  "power3.out",

                overwrite:
                  "auto"

              }
            );

          }
        );


        button.addEventListener(
          "pointerleave",
          function () {

            gsap.to(
              question,
              {

                x: 0,

                duration: 0.42,

                ease:
                  "power3.out"

              }
            );


            gsap.to(
              icon,
              {

                x: 0,

                y: 0,

                scale: 1,

                duration: 0.42,

                ease:
                  "back.out(1.6)"

              }
            );

          }
        );

      }

    }
  );

}


/* =========================================================
   FLOATING FAQ APE
========================================================= */

let floatingGuide =
  null;


let activeFAQIndex =
  -1;


/* =========================================================
   INIT FLOATING FAQ APE
========================================================= */

function initFloatingFAQApe() {

  const guide =
    document.querySelector(
      ".faq-guide"
    );


  const copy =
    document.querySelector(
      ".faq-guide__copy"
    );


  const track =
    document.querySelector(
      ".faq-guide__track"
    );


  const character =
    document.querySelector(
      ".faq-guide__character"
    );


  const world =
    document.querySelector(
      ".faq-guide__world"
    );


  const rig =
    document.querySelector(
      ".faq-guide__rig"
    );


  const float =
    document.querySelector(
      ".faq-guide__float"
    );


  const aura =
    document.querySelector(
      ".faq-guide__aura"
    );


  const pulse =
    document.querySelector(
      ".faq-guide__pulse"
    );


  const list =
    document.querySelector(
      ".faq-list"
    );


  const items =
    Array.from(
      document.querySelectorAll(
        ".faq-item"
      )
    );


  if (
    !guide ||
    !track ||
    !character ||
    !world ||
    !rig ||
    !float ||
    !list ||
    !items.length
  ) {
    return;
  }


  floatingGuide = {
    guide,
    copy,
    track,
    character,
    world,
    rig,
    float,
    aura,
    pulse,
    list,
    items
  };


  if (!reduceMotion) {

    gsap.fromTo(
      character,
      {

        autoAlpha: 0,

        scale: 0.68,

        rotation: -7

      },
      {

        autoAlpha: 1,

        scale: 1,

        rotation: 0,

        duration: 0.85,

        ease:
          "back.out(1.7)",

        scrollTrigger: {

          trigger:
            list,

          start:
            "top 84%",

          once: true

        }

      }
    );


    gsap.to(
      float,
      {

        y: -7,

        rotation: 1.8,

        duration: 1.55,

        repeat: -1,

        yoyo: true,

        ease:
          "sine.inOut"

      }
    );

  }


  ScrollTrigger.create({

    trigger:
      list,

    start:
      "top bottom",

    end:
      "bottom top",

    onUpdate:
      function (
        self
      ) {

        updateFloatingApe(
          self.getVelocity(),
          false
        );

      },

    onEnter:
      function () {

        updateFloatingApe(
          0,
          true
        );

      },

    onEnterBack:
      function () {

        updateFloatingApe(
          0,
          true
        );

      }

  });


  window.addEventListener(
    "resize",
    function () {

      requestAnimationFrame(
        function () {

          updateFloatingApe(
            0,
            true
          );

        }
      );

    }
  );


  requestAnimationFrame(
    function () {

      updateFloatingApe(
        0,
        true
      );

    }
  );

}


/* =========================================================
   UPDATE FLOATING APE
========================================================= */

function updateFloatingApe(
  velocity = 0,
  immediate = false
) {

  if (!floatingGuide) {
    return;
  }


  const {
    guide,
    copy,
    character,
    world,
    rig,
    aura,
    items
  } =
    floatingGuide;


  const guideRect =
    guide.getBoundingClientRect();


  const characterHeight =
    character.offsetHeight;


  const viewportCenter =
    window.innerHeight * 0.5;


  let closestItem =
    items[0];


  let closestIndex =
    0;


  let closestDistance =
    Infinity;


  items.forEach(
    function (
      item,
      index
    ) {

      const rect =
        item.getBoundingClientRect();


      const centre =
        rect.top +
        rect.height / 2;


      const distance =
        Math.abs(
          centre -
          viewportCenter
        );


      if (
        distance <
        closestDistance
      ) {

        closestDistance =
          distance;


        closestItem =
          item;


        closestIndex =
          index;

      }

    }
  );


  items.forEach(
    function (
      item,
      index
    ) {

      item.classList.toggle(
        "is-current",
        index === closestIndex
      );

    }
  );


  const itemRect =
    closestItem.getBoundingClientRect();


  const itemCentre =
    itemRect.top +
    itemRect.height / 2;


  const itemTarget =
    itemCentre -
    guideRect.top -
    characterHeight / 2;


  const viewportTarget =
    viewportCenter -
    guideRect.top -
    characterHeight / 2;


  let targetY =
    itemTarget * 0.62 +
    viewportTarget * 0.38;


  let minimumY =
    0;


  const mobile =
    window.innerWidth <= 767;


  if (
    !mobile &&
    copy
  ) {

    minimumY =
      copy.offsetHeight +
      42;

  }


  const maximumY =
    Math.max(
      minimumY,
      guide.offsetHeight -
      characterHeight
    );


  targetY =
    gsap.utils.clamp(
      minimumY,
      maximumY,
      targetY
    );


  gsap.to(
    character,
    {

      y:
        targetY,

      duration:
        immediate
          ? 0.22
          : 0.36,

      ease:
        immediate
          ? "power2.out"
          : "power3.out",

      overwrite:
        "auto"

    }
  );


  if (!reduceMotion) {

    const speed =
      gsap.utils.clamp(
        -1,
        1,
        velocity / 1700
      );


    gsap.to(
      world,
      {

        x:
          speed * 8,

        rotation:
          speed * 2.5,

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
          speed * 6,

        rotationY:
          speed * 10,

        scale:
          1 +
          Math.abs(
            speed
          ) * 0.035,

        duration: 0.24,

        ease:
          "power2.out",

        overwrite:
          "auto"

      }
    );


    if (aura) {

      gsap.to(
        aura,
        {

          scale:
            1 +
            Math.abs(
              speed
            ) * 0.13,

          opacity:
            0.46 +
            Math.abs(
              speed
            ) * 0.24,

          duration: 0.24,

          overwrite: true

        }
      );

    }

  }


  if (
    closestIndex !==
    activeFAQIndex
  ) {

    activeFAQIndex =
      closestIndex;


    if (!reduceMotion) {

      reactFloatingApe(
        closestItem
      );

    }

  }

}


/* =========================================================
   FLOATING APE REACTION
========================================================= */

function reactFloatingApe(
  item
) {

  if (!floatingGuide) {
    return;
  }


  const {
    rig,
    aura,
    pulse,
    items
  } =
    floatingGuide;


  const index =
    items.indexOf(
      item
    );


  const direction =
    index % 2 === 0
      ? 1
      : -1;


  gsap.killTweensOf(
    rig
  );


  gsap.timeline()

    .to(
      rig,
      {

        y: -18,

        x:
          6 *
          direction,

        rotation:
          5 *
          direction,

        scale: 1.08,

        duration: 0.16,

        ease:
          "power3.out"

      }
    )

    .to(
      rig,
      {

        x:
          -5 *
          direction,

        rotation:
          -4 *
          direction,

        duration: 0.13

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

        duration: 0.42,

        ease:
          "bounce.out"

      }
    );


  if (aura) {

    gsap.fromTo(
      aura,
      {

        scale: 0.8,

        opacity: 0.72

      },
      {

        scale: 1.28,

        opacity: 0.44,

        duration: 0.52,

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

        scale: 1.35,

        opacity: 0,

        duration: 0.55,

        ease:
          "power2.out"

      }
    );

  }

}


/* =========================================================
   GUIDE COPY ENTRANCE
========================================================= */

function initGuideCopyMotion() {

  if (reduceMotion) {
    return;
  }


  gsap.fromTo(
    ".faq-guide__copy",
    {

      autoAlpha: 0,

      x: -30

    },
    {

      autoAlpha: 1,

      x: 0,

      duration: 0.75,

      ease:
        "power3.out",

      scrollTrigger: {

        trigger:
          ".faq-content",

        start:
          "top 80%",

        once: true

      }

    }
  );

}


/* =========================================================
   FINAL CTA
========================================================= */

function initFinalCTA() {

  const section =
    document.querySelector(
      ".faq-final"
    );


  const copy =
    document.querySelector(
      ".faq-final__copy"
    );


  const ape =
    document.querySelector(
      ".faq-final__ape"
    );


  const rig =
    document.querySelector(
      ".faq-final__ape-rig"
    );


  const float =
    document.querySelector(
      ".faq-final__ape-float"
    );


  const aura =
    document.querySelector(
      ".faq-final__ape-aura"
    );


  const button =
    document.querySelector(
      ".faq-final__button"
    );


  if (!section) {
    return;
  }


  if (!reduceMotion) {

    if (copy) {

      gsap.fromTo(
        copy,
        {

          autoAlpha: 0,

          y: 38

        },
        {

          autoAlpha: 1,

          y: 0,

          duration: 0.8,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              section,

            start:
              "top 80%",

            once: true

          }

        }
      );

    }


    if (ape) {

      gsap.fromTo(
        ape,
        {

          autoAlpha: 0,

          y: 100,

          scale: 0.62,

          rotation: 7

        },
        {

          autoAlpha: 1,

          y: 0,

          scale: 1,

          rotation: 0,

          duration: 1,

          ease:
            "back.out(1.7)",

          scrollTrigger: {

            trigger:
              section,

            start:
              "top 78%",

            once: true

          }

        }
      );

    }


    if (float) {

      gsap.to(
        float,
        {

          y: -8,

          rotation: 2,

          duration: 1.65,

          repeat: -1,

          yoyo: true,

          ease:
            "sine.inOut"

        }
      );

    }

  }


  if (
    ape &&
    rig &&
    !reduceMotion
  ) {

    const animateFinalApe =
      function () {

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

              duration: 0.16

            }
          )

          .to(
            rig,
            {

              rotation: 6,

              duration: 0.13

            }
          )

          .to(
            rig,
            {

              rotation: -5,

              duration: 0.13

            }
          )

          .to(
            rig,
            {

              y: 0,

              rotation: 0,

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

              scale: 0.8

            },
            {

              scale: 1.2,

              duration: 0.5,

              ease:
                "power3.out"

            }
          );

        }

      };


    if (finePointer) {

      ape.addEventListener(
        "pointerenter",
        animateFinalApe
      );

    }


    ape.addEventListener(
      "click",
      animateFinalApe
    );

  }


  if (
    button &&
    finePointer &&
    !reduceMotion
  ) {

    button.addEventListener(
      "pointermove",
      function (
        event
      ) {

        const rect =
          button.getBoundingClientRect();


        const x =
          (
            event.clientX -
            rect.left -
            rect.width / 2
          ) *
          0.14;


        const y =
          (
            event.clientY -
            rect.top -
            rect.height / 2
          ) *
          0.16;


        gsap.to(
          button,
          {

            x,

            y,

            duration: 0.28,

            ease:
              "power3.out"

          }
        );

      }
    );


    button.addEventListener(
      "pointerleave",
      function () {

        gsap.to(
          button,
          {

            x: 0,

            y: 0,

            duration: 0.48,

            ease:
              "elastic.out(1,0.48)"

          }
        );

      }
    );

  }

}


/* =========================================================
   HERO JUMP LINK
========================================================= */

function initHeroJump() {

  const link =
    document.querySelector(
      ".faq-intro__jump"
    );


  const target =
    document.getElementById(
      "faq-list"
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

        block: "start"
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

    initFAQAccordion();

    initFooter();

    initHeroJump();


    requestAnimationFrame(
      function () {

        initHeroMotion();

        initHeroApe();

        initHeroBackgroundMotion();

        initGuideCopyMotion();

        initFAQRows();

        initFloatingFAQApe();

        initFinalCTA();

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


    requestAnimationFrame(
      function () {

        updateFloatingApe(
          0,
          true
        );

      }
    );

  }
);