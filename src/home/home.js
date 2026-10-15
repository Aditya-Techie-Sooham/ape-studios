import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   APE HOME
   MOBILE-FIRST MOTION SYSTEM
========================================================= */

export function initHome() {

  setFooterYear();
  cloneClientRows();

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (reducedMotion) {
    return;
  }

  initWho();
  initServices();
  initWorkCarousel();
  initClients();
  initRecognition();

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

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
   FOOTER
========================================================= */

function setFooterYear() {

  const year =
    document.getElementById(
      "ape-footer-year"
    );

  if (!year) {
    return;
  }

  year.textContent =
    String(
      new Date().getFullYear()
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

  const titleLines =
    Array.from(
      section.querySelectorAll(
        ".home-who__title > span"
      )
    );

  const body =
    section.querySelector(
      ".home-who__body"
    );

  const visual =
    section.querySelector(
      ".home-who__visual"
    );

  const figure =
    section.querySelector(
      ".home-who__image"
    );

  const image =
    section.querySelector(
      ".home-who__image img"
    );

  const frame =
    section.querySelector(
      ".home-who__rear"
    );


  /* =======================================================
     TEXT
  ======================================================= */

  titleLines.forEach(
    (line, index) => {

      gsap.fromTo(
        line,
        {
          yPercent: 110,
          opacity: 0
        },
        {
          yPercent: 0,
          opacity: 1,

          duration: 0.9,

          delay:
            index * 0.055,

          ease:
            "power4.out",

          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            once: true
          }
        }
      );

    }
  );


  if (body) {

    gsap.fromTo(
      body,
      {
        y: 28,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,

        duration: 0.75,

        ease:
          "power3.out",

        scrollTrigger: {
          trigger: section,
          start: "top 62%",
          once: true
        }
      }
    );

  }


  /* =======================================================
     OUTER SCROLL REVEAL
     Does NOT control rotation.
  ======================================================= */

  if (visual) {

    gsap.fromTo(
      visual,
      {
        y: 55,
        scale: 0.91,
        opacity: 0
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,

        ease: "none",

        scrollTrigger: {
          trigger: section,

          start: "top 90%",
          end: "top 42%",

          scrub: 0.85
        }
      }
    );

  }


  /* =======================================================
     SCROLL PARALLAX
  ======================================================= */

  if (image) {

    gsap.fromTo(
      image,
      {
        scale: 1.12,
        yPercent: -4
      },
      {
        scale: 1.035,
        yPercent: 4,

        ease: "none",

        scrollTrigger: {
          trigger: section,

          start: "top bottom",
          end: "bottom top",

          scrub: 1
        }
      }
    );

  }


  initWho360Interaction(
    section,
    visual,
    figure,
    image,
    frame
  );

}


/* =========================================================
   WHO — MOBILE-FIRST 360 INTERACTION
========================================================= */

function initWho360Interaction(
  section,
  visual,
  figure,
  image,
  frame
) {

  if (
    !section ||
    !visual ||
    !figure ||
    !image
  ) {
    return;
  }


  /* =======================================================
     BASIC 3D SETUP
  ======================================================= */

  visual.style.perspective =
    "1600px";

  /*
   * Critical for phones:
   * vertical page scrolling remains native,
   * horizontal gestures belong to the card.
   */
  visual.style.touchAction =
    "pan-y";

  visual.style.webkitUserSelect =
    "none";

  visual.style.userSelect =
    "none";


  gsap.set(
    figure,
    {
      transformPerspective: 1600,
      transformStyle: "preserve-3d",

      transformOrigin:
        "50% 50%",

      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,

      force3D: true,

      willChange:
        "transform"
    }
  );


  image.style.backfaceVisibility =
    "hidden";

  image.style.webkitBackfaceVisibility =
    "hidden";


  /* =======================================================
     CREATE REAL BACK FACE
  ======================================================= */

  figure
    .querySelectorAll(
      "[data-ape-who-back]"
    )
    .forEach(
      element => {
        element.remove();
      }
    );


  const back =
    document.createElement(
      "div"
    );


  back.setAttribute(
    "data-ape-who-back",
    ""
  );


  Object.assign(
    back.style,
    {
      position: "absolute",

      inset: "0",

      zIndex: "4",

      overflow: "hidden",

      borderRadius: "inherit",

      background: "#000000",

      transform:
        "rotateY(180deg)",

      backfaceVisibility:
        "hidden",

      WebkitBackfaceVisibility:
        "hidden",

      pointerEvents:
        "none"
    }
  );


  const backImage =
    image.cloneNode(
      true
    );


  backImage.removeAttribute(
    "id"
  );


  backImage.alt =
    "";


  Object.assign(
    backImage.style,
    {
      position: "absolute",

      inset: "0",

      width: "100%",

      height: "100%",

      objectFit: "cover",

      transform:
        "scaleX(-1)",

      pointerEvents:
        "none"
    }
  );


  back.appendChild(
    backImage
  );


  figure.appendChild(
    back
  );


  /* =======================================================
     LIGHT SWEEP
  ======================================================= */

  const previousLight =
    figure.querySelector(
      "[data-ape-who-light]"
    );


  previousLight?.remove();


  const light =
    document.createElement(
      "div"
    );


  light.setAttribute(
    "data-ape-who-light",
    ""
  );


  Object.assign(
    light.style,
    {
      position: "absolute",

      zIndex: "12",

      top: "-40%",

      left: "-65%",

      width: "55%",

      height: "185%",

      opacity: "0",

      pointerEvents:
        "none",

      background:
        "linear-gradient(110deg, transparent 0%, rgba(255,255,255,.05) 28%, rgba(255,255,255,.35) 48%, rgba(198,255,51,.13) 55%, transparent 74%)",

      transform:
        "rotate(12deg)",

      mixBlendMode:
        "screen"
    }
  );


  figure.appendChild(
    light
  );


  /* =======================================================
     STATE
  ======================================================= */

  let rotation =
    0;

  let dragging =
    false;

  let horizontalGesture =
    false;

  let moved =
    false;

  let startX =
    0;

  let startY =
    0;

  let previousX =
    0;

  let previousTime =
    0;

  let velocity =
    0;

  let startRotation =
    0;

  let autoSpinPlayed =
    false;

  let desktopSpinning =
    false;


  /* =======================================================
     HELPERS
  ======================================================= */

  function setFrameDepth(
    amount
  ) {

    if (!frame) {
      return;
    }


    gsap.to(
      frame,
      {
        x:
          amount * -0.055,

        rotation:
          amount * -0.012,

        duration: 0.3,

        ease:
          "power2.out",

        overwrite:
          true
      }
    );

  }


  function spinBy(
    degrees = 360
  ) {

    const destination =
      rotation + degrees;


    gsap.to(
      figure,
      {
        rotationY:
          destination,

        rotationX:
          0,

        rotationZ:
          0,

        scale:
          1.035,

        z:
          45,

        duration:
          1.25,

        ease:
          "power3.inOut",

        overwrite:
          true,

        onUpdate() {

          const current =
            Number(
              gsap.getProperty(
                figure,
                "rotationY"
              )
            ) || 0;


          setFrameDepth(
            current
          );

        },

        onComplete() {

          rotation =
            destination;


          gsap.to(
            figure,
            {
              scale: 1,
              z: 0,

              duration: 0.55,

              ease:
                "back.out(1.7)"
            }
          );


          if (frame) {

            gsap.to(
              frame,
              {
                x: 0,

                rotation: 0,

                duration: 0.65,

                ease:
                  "power3.out"
              }
            );

          }

        }
      }
    );


    gsap.fromTo(
      light,
      {
        xPercent:
          -30,

        opacity: 0
      },
      {
        xPercent:
          300,

        opacity: 0.85,

        duration: 1,

        ease:
          "power2.inOut"
      }
    );


    gsap.to(
      light,
      {
        opacity: 0,

        delay: 0.9,

        duration: 0.25
      }
    );

  }


  /* =======================================================
     MOBILE + TABLET
     AUTO 360 ON ENTER
  ======================================================= */

  const touchDevice =
    window.matchMedia(
      "(hover: none), (pointer: coarse)"
    ).matches;


  if (touchDevice) {

    ScrollTrigger.create(
      {
        trigger: section,

        start:
          "top 72%",

        once:
          true,

        onEnter() {

          if (
            autoSpinPlayed
          ) {
            return;
          }


          autoSpinPlayed =
            true;


          /*
           * Small delay so the visual has
           * already entered the screen.
           */
          gsap.delayedCall(
            0.18,
            () => {

              spinBy(
                360
              );

            }
          );

        }
      }
    );

  }


  /* =======================================================
     TOUCH / POINTER DOWN
  ======================================================= */

  visual.addEventListener(
    "pointerdown",
    event => {

      /*
       * Desktop mouse interaction is handled separately.
       */
      if (
        event.pointerType ===
        "mouse"
      ) {
        return;
      }


      gsap.killTweensOf(
        figure
      );


      dragging =
        true;

      horizontalGesture =
        false;

      moved =
        false;


      startX =
        event.clientX;

      startY =
        event.clientY;

      previousX =
        event.clientX;

      previousTime =
        performance.now();

      velocity =
        0;


      startRotation =
        Number(
          gsap.getProperty(
            figure,
            "rotationY"
          )
        ) || rotation;


      visual.setPointerCapture?.(
        event.pointerId
      );


      gsap.to(
        figure,
        {
          scale: 1.025,

          z: 28,

          duration: 0.2,

          ease:
            "power2.out"
        }
      );

    },
    {
      passive: true
    }
  );


  /* =======================================================
     TOUCH / POINTER MOVE
  ======================================================= */

  visual.addEventListener(
    "pointermove",
    event => {

      if (!dragging) {
        return;
      }


      const dx =
        event.clientX
        -
        startX;


      const dy =
        event.clientY
        -
        startY;


      /*
       * Determine gesture direction first.
       */
      if (
        !horizontalGesture
      ) {

        if (
          Math.abs(dx) < 8
          &&
          Math.abs(dy) < 8
        ) {

          return;

        }


        if (
          Math.abs(dy)
          >
          Math.abs(dx)
        ) {

          /*
           * User wants to scroll vertically.
           */
          dragging =
            false;

          return;

        }


        horizontalGesture =
          true;

      }


      moved =
        true;


      const now =
        performance.now();


      const timeDelta =
        Math.max(
          now - previousTime,
          1
        );


      velocity =
        (
          event.clientX
          -
          previousX
        )
        /
        timeDelta;


      previousX =
        event.clientX;

      previousTime =
        now;


      /*
       * Roughly 1px = 0.7 degrees.
       * Strong enough to feel physical on phone.
       */
      const targetRotation =
        startRotation
        +
        dx * 0.72;


      rotation =
        targetRotation;


      gsap.set(
        figure,
        {
          rotationY:
            targetRotation,

          rotationX:
            dy * -0.035
        }
      );


      setFrameDepth(
        targetRotation
      );


      const imageShift =
        gsap.utils.clamp(
          -18,
          18,
          dx * 0.05
        );


      gsap.set(
        image,
        {
          x:
            imageShift
        }
      );

    }
  );


  /* =======================================================
     TOUCH RELEASE
  ======================================================= */

  function releaseTouch(
    event
  ) {

    if (!dragging) {

      visual.releasePointerCapture?.(
        event.pointerId
      );

      return;

    }


    dragging =
      false;


    visual.releasePointerCapture?.(
      event.pointerId
    );


    /*
     * A tap performs a complete 360.
     */
    if (!moved) {

      spinBy(
        360
      );

      return;

    }


    /*
     * Apply a little inertia.
     */
    const projectedRotation =
      rotation
      +
      velocity * 135;


    const snapRotation =
      Math.round(
        projectedRotation
        /
        360
      )
      *
      360;


    rotation =
      snapRotation;


    gsap.to(
      figure,
      {
        rotationY:
          snapRotation,

        rotationX: 0,

        scale: 1,

        z: 0,

        duration: 0.72,

        ease:
          "power3.out",

        overwrite:
          true
      }
    );


    gsap.to(
      image,
      {
        x: 0,

        duration: 0.6,

        ease:
          "power3.out"
      }
    );


    if (frame) {

      gsap.to(
        frame,
        {
          x: 0,

          rotation: 0,

          duration: 0.7,

          ease:
            "power3.out"
        }
      );

    }

  }


  visual.addEventListener(
    "pointerup",
    releaseTouch
  );


  visual.addEventListener(
    "pointercancel",
    releaseTouch
  );


  /* =======================================================
     DESKTOP ONLY
     HOVER → FULL 360
  ======================================================= */

  const desktopPointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;


  if (!desktopPointer) {
    return;
  }


  visual.addEventListener(
    "pointerenter",
    () => {

      if (
        desktopSpinning
      ) {
        return;
      }


      desktopSpinning =
        true;


      spinBy(
        360
      );


      gsap.delayedCall(
        1.35,
        () => {

          desktopSpinning =
            false;

        }
      );

    }
  );


  /* =======================================================
     DESKTOP LIVE TILT
  ======================================================= */

  visual.addEventListener(
    "pointermove",
    event => {

      if (
        desktopSpinning
      ) {
        return;
      }


      const rect =
        visual.getBoundingClientRect();


      const x =
        (
          event.clientX
          -
          rect.left
        )
        /
        rect.width
        -
        0.5;


      const y =
        (
          event.clientY
          -
          rect.top
        )
        /
        rect.height
        -
        0.5;


      gsap.to(
        figure,
        {
          rotationY:
            rotation
            +
            x * 17,

          rotationX:
            y * -11,

          rotationZ:
            x * 1.3,

          x:
            x * 10,

          y:
            y * 8,

          z: 30,

          scale:
            1.025,

          duration:
            0.45,

          ease:
            "power3.out",

          overwrite:
            true
        }
      );


      gsap.to(
        image,
        {
          x:
            x * 28,

          y:
            y * 18,

          duration:
            0.45,

          ease:
            "power3.out",

          overwrite:
            true
        }
      );


      if (frame) {

        gsap.to(
          frame,
          {
            x:
              x * -22,

            y:
              y * -15,

            rotation:
              x * -5,

            duration:
              0.55,

            ease:
              "power3.out",

            overwrite:
              true
          }
        );

      }

    }
  );


  visual.addEventListener(
    "pointerleave",
    () => {

      if (
        desktopSpinning
      ) {
        return;
      }


      gsap.to(
        figure,
        {
          rotationY:
            rotation,

          rotationX: 0,

          rotationZ: 0,

          x: 0,

          y: 0,

          z: 0,

          scale: 1,

          duration: 0.8,

          ease:
            "elastic.out(1,.6)"
        }
      );


      gsap.to(
        image,
        {
          x: 0,

          y: 0,

          duration: 0.65,

          ease:
            "power3.out"
        }
      );


      if (frame) {

        gsap.to(
          frame,
          {
            x: 0,

            y: 0,

            rotation: 0,

            duration: 0.7,

            ease:
              "power3.out"
          }
        );

      }

    }
  );

}


/* =========================================================
   SERVICES
========================================================= */

function initServices() {

  const section =
    document.getElementById(
      "home-services"
    );

  if (!section) {
    return;
  }


  const title =
    section.querySelector(
      ".home-services__title"
    );


  const rows =
    Array.from(
      section.querySelectorAll(
        ".home-service"
      )
    );


  const images =
    Array.from(
      section.querySelectorAll(
        ".home-service-image"
      )
    );


  const visual =
    section.querySelector(
      ".home-services__visual"
    );


  const shape =
    section.querySelector(
      ".home-services__back-shape"
    );


  let current =
    0;


  function activate(
    index
  ) {

    if (
      index === current
      ||
      index < 0
      ||
      index >= rows.length
    ) {
      return;
    }


    const oldImage =
      images[current];


    const newImage =
      images[index];


    rows.forEach(
      (
        row,
        rowIndex
      ) => {

        row.classList.toggle(
          "is-active",
          rowIndex === index
        );

      }
    );


    if (oldImage) {

      gsap.to(
        oldImage,
        {
          opacity: 0,

          scale: 1.07,

          xPercent: -3,

          duration: 0.38,

          ease:
            "power2.out",

          overwrite: true
        }
      );

    }


    if (newImage) {

      gsap.fromTo(
        newImage,
        {
          opacity: 0,

          scale: 0.92,

          xPercent: 5
        },
        {
          opacity: 1,

          scale: 1,

          xPercent: 0,

          duration: 0.68,

          ease:
            "power4.out",

          overwrite: true
        }
      );

    }


    current =
      index;

  }


  rows.forEach(
    (
      row,
      index
    ) => {

      row.addEventListener(
        "pointerenter",
        event => {

          if (
            event.pointerType ===
            "mouse"
          ) {

            activate(
              index
            );

          }

        }
      );


      row.addEventListener(
        "focus",
        () => {

          activate(
            index
          );

        }
      );

    }
  );


  if (title) {

    gsap.fromTo(
      title,
      {
        x: -60,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,

        duration: 0.9,

        ease:
          "power4.out",

        scrollTrigger: {
          trigger: section,
          start: "top 68%",
          once: true
        }
      }
    );

  }


  gsap.fromTo(
    rows,
    {
      x: -40,
      opacity: 0
    },
    {
      x: 0,
      opacity: 1,

      stagger: 0.065,

      duration: 0.72,

      ease:
        "power3.out",

      scrollTrigger: {
        trigger: section,
        start: "top 57%",
        once: true
      }
    }
  );


  if (visual) {

    gsap.fromTo(
      visual,
      {
        clipPath:
          "inset(16% 13% 16% 13% round 42px)",

        scale: 0.9
      },
      {
        clipPath:
          "inset(0% 0% 0% 0% round 25px)",

        scale: 1,

        ease: "none",

        scrollTrigger: {
          trigger: section,

          start: "top 84%",
          end: "top 22%",

          scrub: 0.9
        }
      }
    );


    initTilt(
      visual,
      2.8
    );

  }


  if (shape) {

    gsap.fromTo(
      shape,
      {
        rotate: 18,
        scale: 0.78
      },
      {
        rotate: -8,
        scale: 1.07,

        ease: "none",

        scrollTrigger: {
          trigger: section,

          start: "top bottom",
          end: "bottom top",

          scrub: 1
        }
      }
    );

  }


  /* =======================================================
     MOBILE/TABLET SERVICE ACTIVATION
  ======================================================= */

  gsap.matchMedia().add(
    "(max-width: 1199px)",
    () => {

      ScrollTrigger.create(
        {
          trigger: section,

          start: "top 70%",
          end: "bottom 30%",

          onUpdate:
            self => {

              const index =
                Math.min(
                  rows.length - 1,

                  Math.floor(
                    self.progress
                    *
                    rows.length
                  )
                );


              activate(
                index
              );

            }
        }
      );

    }
  );

}


/* =========================================================
   WORK
========================================================= */

function initWorkCarousel() {

  const section =
    document.getElementById(
      "home-work"
    );

  if (!section) {
    return;
  }


  const heading =
    section.querySelector(
      ".home-work__heading"
    );


  const viewport =
    section.querySelector(
      ".home-work__viewport"
    );


  const track =
    section.querySelector(
      ".home-work__track"
    );


  const cards =
    Array.from(
      section.querySelectorAll(
        ".home-work-card"
      )
    );


  if (
    !viewport
    ||
    !track
    ||
    !cards.length
  ) {
    return;
  }


  /* =======================================================
     REMOVE OLD HUD
  ======================================================= */

  viewport
    .querySelector(
      ".home-work__carousel-hud"
    )
    ?.remove();


  /* =======================================================
     PROGRESS BAR ONLY
     NO NUMBERING
  ======================================================= */

  const hud =
    document.createElement(
      "div"
    );


  hud.className =
    "home-work__carousel-hud";


  hud.innerHTML = `
    <div class="home-work__progress">
      <span></span>
    </div>
  `;


  viewport.appendChild(
    hud
  );


  const progressBar =
    hud.querySelector(
      ".home-work__progress span"
    );


  function updateActive(
    index,
    progress
  ) {

    cards.forEach(
      (
        card,
        cardIndex
      ) => {

        card.classList.toggle(
          "is-active",
          cardIndex === index
        );

      }
    );


    if (progressBar) {

      gsap.set(
        progressBar,
        {
          scaleX:
            Math.max(
              0.04,
              progress
            )
        }
      );

    }

  }


  updateActive(
    0,
    0.04
  );


  if (heading) {

    gsap.fromTo(
      heading,
      {
        y: 45,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,

        duration: 0.9,

        ease:
          "power4.out",

        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true
        }
      }
    );

  }


  cards.forEach(
    card => {

      const image =
        card.querySelector(
          "img"
        );


      if (image) {

        image.draggable =
          false;

      }

    }
  );


  const mm =
    gsap.matchMedia();


  /* =======================================================
     MOBILE / IPAD — NATIVE TOUCH CAROUSEL
  ======================================================= */

  mm.add(
    "(max-width: 1199px)",
    () => {

      viewport.style.touchAction =
        "pan-x pan-y";


      function updateFromScroll() {

        const maximum =
          viewport.scrollWidth
          -
          viewport.clientWidth;


        const progress =
          maximum > 0
            ?
            viewport.scrollLeft
            /
            maximum
            :
            0;


        const index =
          Math.round(
            progress
            *
            (
              cards.length - 1
            )
          );


        updateActive(
          index,
          progress
        );

      }


      viewport.addEventListener(
        "scroll",
        updateFromScroll,
        {
          passive: true
        }
      );


      return () => {

        viewport.removeEventListener(
          "scroll",
          updateFromScroll
        );

      };

    }
  );


  /* =======================================================
     DESKTOP
  ======================================================= */

  mm.add(
    "(min-width: 1200px)",
    () => {

      function distance() {

        return Math.max(
          0,

          track.scrollWidth
          -
          viewport.clientWidth
        );

      }


      gsap.set(
        track,
        {
          x: 0
        }
      );


      const horizontal =
        gsap.to(
          track,
          {
            x:
              () =>
                -distance(),

            ease: "none",

            scrollTrigger: {
              trigger: section,

              start:
                "top top",

              end:
                () =>
                  "+="
                  +
                  Math.max(
                    window.innerHeight * 1.9,

                    distance() * 1.35
                  ),

              scrub: 0.85,

              pin: true,

              anticipatePin: 1,

              invalidateOnRefresh:
                true,

              onUpdate:
                self => {

                  const index =
                    Math.round(
                      self.progress
                      *
                      (
                        cards.length - 1
                      )
                    );


                  updateActive(
                    index,
                    self.progress
                  );

                }
            }
          }
        );


      cards.forEach(
        card => {

          const image =
            card.querySelector(
              "img"
            );


          gsap.timeline(
            {
              scrollTrigger: {
                trigger: card,

                containerAnimation:
                  horizontal,

                start:
                  "left 88%",

                end:
                  "right 12%",

                scrub: true
              }
            }
          )

          .fromTo(
            card,
            {
              scale: 0.84,

              opacity: 0.5,

              rotationY: 7
            },
            {
              scale: 1,

              opacity: 1,

              rotationY: 0,

              duration: 0.5,

              ease: "none"
            }
          )

          .to(
            card,
            {
              scale: 0.84,

              opacity: 0.5,

              rotationY: -7,

              duration: 0.5,

              ease: "none"
            }
          );


          if (image) {

            gsap.timeline(
              {
                scrollTrigger: {
                  trigger: card,

                  containerAnimation:
                    horizontal,

                  start:
                    "left 88%",

                  end:
                    "right 12%",

                  scrub: true
                }
              }
            )

            .fromTo(
              image,
              {
                scale: 1.13
              },
              {
                scale: 1.02,

                duration: 0.5,

                ease: "none"
              }
            )

            .to(
              image,
              {
                scale: 1.11,

                duration: 0.5,

                ease: "none"
              }
            );

          }

        }
      );


      /* =====================================================
         DESKTOP DRAG
      ===================================================== */

      let dragging =
        false;

      let startX =
        0;

      let startScroll =
        0;

      let moved =
        false;


      function pointerDown(
        event
      ) {

        if (
          event.pointerType ===
          "touch"
        ) {
          return;
        }


        dragging =
          true;

        moved =
          false;

        startX =
          event.clientX;

        startScroll =
          window.scrollY;


        viewport.classList.add(
          "is-dragging"
        );


        viewport.setPointerCapture?.(
          event.pointerId
        );

      }


      function pointerMove(
        event
      ) {

        if (!dragging) {
          return;
        }


        const dx =
          event.clientX
          -
          startX;


        if (
          Math.abs(dx)
          >
          4
        ) {

          moved =
            true;

        }


        const horizontalDistance =
          Math.max(
            distance(),
            1
          );


        const verticalDistance =
          horizontal.scrollTrigger.end
          -
          horizontal.scrollTrigger.start;


        const multiplier =
          verticalDistance
          /
          horizontalDistance;


        const destination =
          gsap.utils.clamp(
            horizontal.scrollTrigger.start,

            horizontal.scrollTrigger.end,

            startScroll
            -
            dx
            *
            multiplier
          );


        window.scrollTo(
          0,
          destination
        );

      }


      function pointerUp(
        event
      ) {

        dragging =
          false;


        viewport.classList.remove(
          "is-dragging"
        );


        viewport.releasePointerCapture?.(
          event.pointerId
        );

      }


      function preventClick(
        event
      ) {

        if (!moved) {
          return;
        }


        event.preventDefault();

        event.stopPropagation();


        moved =
          false;

      }


      viewport.addEventListener(
        "pointerdown",
        pointerDown
      );


      viewport.addEventListener(
        "pointermove",
        pointerMove
      );


      viewport.addEventListener(
        "pointerup",
        pointerUp
      );


      viewport.addEventListener(
        "pointercancel",
        pointerUp
      );


      viewport.addEventListener(
        "click",
        preventClick,
        true
      );


      return () => {

        viewport.removeEventListener(
          "pointerdown",
          pointerDown
        );


        viewport.removeEventListener(
          "pointermove",
          pointerMove
        );


        viewport.removeEventListener(
          "pointerup",
          pointerUp
        );


        viewport.removeEventListener(
          "pointercancel",
          pointerUp
        );


        viewport.removeEventListener(
          "click",
          preventClick,
          true
        );

      };

    }
  );

}


/* =========================================================
   CLIENT CLONING
========================================================= */

function cloneClientRows() {

  document
    .querySelectorAll(
      ".home-client-row__group"
    )
    .forEach(
      group => {

        const track =
          group.parentElement;


        if (!track) {
          return;
        }


        if (
          track.querySelector(
            "[data-client-clone]"
          )
        ) {
          return;
        }


        const clone =
          group.cloneNode(
            true
          );


        clone.setAttribute(
          "aria-hidden",
          "true"
        );


        clone.setAttribute(
          "data-client-clone",
          ""
        );


        clone
          .querySelectorAll(
            "img"
          )
          .forEach(
            image => {

              image.alt =
                "";

            }
          );


        track.appendChild(
          clone
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


  const title =
    section.querySelector(
      ".home-clients__title"
    );


  const field =
    section.querySelector(
      ".home-clients__field"
    );


  const tracks =
    Array.from(
      section.querySelectorAll(
        ".home-client-row__track"
      )
    );


  const logos =
    Array.from(
      section.querySelectorAll(
        ".home-client-logo"
      )
    );


  if (title) {

    gsap.fromTo(
      title,
      {
        y: 60,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,

        duration: 1,

        ease:
          "power4.out",

        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true
        }
      }
    );

  }


  const railTweens =
    [];


  tracks.forEach(
    (
      track,
      index
    ) => {

      const tween =
        gsap.fromTo(
          track,
          {
            xPercent:
              index === 0
                ?
                0
                :
                -50
          },
          {
            xPercent:
              index === 0
                ?
                -50
                :
                0,

            duration:
              index === 0
                ?
                34
                :
                38,

            ease: "none",

            repeat: -1
          }
        );


      railTweens.push(
        tween
      );

    }
  );


  gsap.fromTo(
    tracks,
    {
      y:
        index =>
          index === 0
            ?
            50
            :
            -50,

      opacity: 0
    },
    {
      y: 0,
      opacity: 1,

      duration: 1,

      stagger: 0.12,

      ease:
        "power4.out",

      scrollTrigger: {
        trigger: section,
        start: "top 58%",
        once: true
      }
    }
  );


  ScrollTrigger.create(
    {
      trigger: section,

      start: "top bottom",
      end: "bottom top",

      onUpdate:
        self => {

          const speed =
            1
            +
            Math.min(
              Math.abs(
                self.getVelocity()
              )
              /
              4000,

              1.5
            );


          railTweens.forEach(
            tween => {

              gsap.to(
                tween,
                {
                  timeScale:
                    speed,

                  duration: 0.2,

                  overwrite:
                    true
                }
              );


              gsap.to(
                tween,
                {
                  timeScale: 1,

                  duration: 0.9,

                  delay: 0.1
                }
              );

            }
          );

        }
    }
  );


  const finePointer =
    window.matchMedia(
      "(min-width: 1200px) and (hover: hover) and (pointer: fine)"
    ).matches;


  if (
    !finePointer
    ||
    !field
  ) {
    return;
  }


  field.addEventListener(
    "pointermove",
    event => {

      logos.forEach(
        logo => {

          const rect =
            logo.getBoundingClientRect();


          const centerX =
            rect.left
            +
            rect.width / 2;


          const centerY =
            rect.top
            +
            rect.height / 2;


          const dx =
            event.clientX
            -
            centerX;


          const dy =
            event.clientY
            -
            centerY;


          const distance =
            Math.sqrt(
              dx * dx
              +
              dy * dy
            );


          const radius =
            260;


          if (
            distance <
            radius
          ) {

            const influence =
              1
              -
              distance
              /
              radius;


            gsap.to(
              logo,
              {
                y:
                  -18
                  *
                  influence,

                scale:
                  1
                  +
                  0.09
                  *
                  influence,

                rotate:
                  dx
                  *
                  0.006
                  *
                  influence,

                duration: 0.35,

                ease:
                  "power3.out",

                overwrite:
                  true
              }
            );

          }

          else {

            gsap.to(
              logo,
              {
                y: 0,

                scale: 1,

                rotate: 0,

                duration: 0.45,

                ease:
                  "power3.out",

                overwrite:
                  true
              }
            );

          }

        }
      );

    }
  );


  field.addEventListener(
    "pointerleave",
    () => {

      gsap.to(
        logos,
        {
          y: 0,

          scale: 1,

          rotate: 0,

          duration: 0.5,

          ease:
            "power3.out"
        }
      );

    }
  );

}


/* =========================================================
   RECOGNITION
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


  const image =
    visual?.querySelector(
      "img"
    );


  const content =
    section.querySelector(
      ".home-recognition__content"
    );


  if (visual) {

    gsap.fromTo(
      visual,
      {
        clipPath:
          "inset(18% 15% 18% 15% round 44px)",

        scale: 0.87,

        rotate: -4
      },
      {
        clipPath:
          "inset(0% 0% 0% 0% round 27px)",

        scale: 1,

        rotate: 0,

        ease: "none",

        scrollTrigger: {
          trigger: section,

          start: "top 86%",
          end: "top 20%",

          scrub: 0.95
        }
      }
    );


    initTilt(
      visual,
      2.5
    );

  }


  if (image) {

    gsap.fromTo(
      image,
      {
        scale: 1.18,
        yPercent: -8
      },
      {
        scale: 1.025,
        yPercent: 8,

        ease: "none",

        scrollTrigger: {
          trigger: section,

          start: "top bottom",
          end: "bottom top",

          scrub: 1.1
        }
      }
    );

  }


  if (content) {

    gsap.fromTo(
      content,
      {
        x: 70,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,

        duration: 0.95,

        ease:
          "power4.out",

        scrollTrigger: {
          trigger: section,
          start: "top 58%",
          once: true
        }
      }
    );

  }

}


/* =========================================================
   GENERIC DESKTOP TILT
========================================================= */

function initTilt(
  element,
  amount = 3
) {

  if (!element) {
    return;
  }


  const finePointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;


  if (!finePointer) {
    return;
  }


  const rotateX =
    gsap.quickTo(
      element,
      "rotationX",
      {
        duration: 0.65,

        ease:
          "power3.out"
      }
    );


  const rotateY =
    gsap.quickTo(
      element,
      "rotationY",
      {
        duration: 0.65,

        ease:
          "power3.out"
      }
    );


  element.addEventListener(
    "pointermove",
    event => {

      const rect =
        element.getBoundingClientRect();


      const x =
        (
          event.clientX
          -
          rect.left
        )
        /
        rect.width
        -
        0.5;


      const y =
        (
          event.clientY
          -
          rect.top
        )
        /
        rect.height
        -
        0.5;


      rotateY(
        x * amount
      );


      rotateX(
        y * -amount
      );

    }
  );


  element.addEventListener(
    "pointerleave",
    () => {

      rotateX(0);
      rotateY(0);

    }
  );

}