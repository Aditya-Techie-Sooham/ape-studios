import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/home-clients.css";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   APE — CLIENT LOGO CAROUSEL
========================================================= */

export function initClientsCarousel() {
  const section =
    document.getElementById(
      "home-clients"
    );

  if (!section) return;


  const stage =
    section.querySelector(
      ".home-clients__stage"
    )
    ||
    section.querySelector(
      ".home-clients__inner"
    )
    ||
    section;


  const heading =
    section.querySelector(
      ".home-clients__title"
    )
    ||
    section.querySelector(
      ".home-clients__heading"
    );


  /* =========================================================
     COLLECT EXISTING LOGOS

     This works with your current two-row HTML.
     Duplicate cloned rows are automatically ignored.
  ========================================================= */

  const logoImages =
    Array.from(
      section.querySelectorAll(
        ".home-client-logo img"
      )
    );


  const seen =
    new Set();


  const logos =
    [];


  logoImages.forEach(
    image => {
      const src =
        image.getAttribute("src");


      if (
        !src ||
        seen.has(src)
      ) {
        return;
      }


      seen.add(src);


      logos.push({
        src,

        alt:
          image.getAttribute("alt")
          ||
          "APE Studio client"
      });
    }
  );


  if (
    logos.length < 2
  ) {
    return;
  }


  /* =========================================================
     REMOVE OLD CLIENT SCROLLTRIGGERS ONLY
  ========================================================= */

  ScrollTrigger
    .getAll()
    .forEach(
      trigger => {
        const triggerElement =
          trigger.trigger
          ||
          trigger.vars?.trigger;


        if (
          triggerElement === section
          ||
          (
            triggerElement instanceof Element
            &&
            section.contains(
              triggerElement
            )
          )
        ) {
          trigger.kill(true);
        }
      }
    );


  /* =========================================================
     REMOVE OLD BACKGROUND WORD ELEMENTS
  ========================================================= */

  section
    .querySelectorAll(
      [
        ".home-clients__background",
        ".home-clients__background-word",
        ".home-clients__word",
        ".home-clients__giant-word",
        ".home-clients__decor",
        ".home-clients__outline-word"
      ].join(",")
    )
    .forEach(
      element => {
        element.remove();
      }
    );


  /* =========================================================
     REMOVE OLD TWO-ROW / GRID LOGO STRUCTURE
  ========================================================= */

  section
    .querySelectorAll(
      [
        ".home-clients__field",
        ".home-clients__rows",
        ".home-clients__logos",
        ".home-client-row"
      ].join(",")
    )
    .forEach(
      element => {
        element.remove();
      }
    );


  /* =========================================================
     BUILD NEW SINGLE-STRIP CAROUSEL
  ========================================================= */

  const carousel =
    document.createElement(
      "div"
    );


  carousel.className =
    "home-clients-carousel";


  carousel.setAttribute(
    "aria-label",
    "APE Studio client brands"
  );


  carousel.tabIndex = 0;


  const viewport =
    document.createElement(
      "div"
    );


  viewport.className =
    "home-clients-carousel__viewport";


  const track =
    document.createElement(
      "div"
    );


  track.className =
    "home-clients-carousel__track";


  viewport.appendChild(
    track
  );


  carousel.appendChild(
    viewport
  );


  /* =========================================================
     PROGRESS
  ========================================================= */

  const footer =
    document.createElement(
      "div"
    );


  footer.className =
    "home-clients-carousel__footer";


  const progress =
    document.createElement(
      "div"
    );


  progress.className =
    "home-clients-carousel__progress";


  const progressFill =
    document.createElement(
      "span"
    );


  progress.appendChild(
    progressFill
  );


  /* =========================================================
     ARROWS
  ========================================================= */

  const controls =
    document.createElement(
      "div"
    );


  controls.className =
    "home-clients-carousel__controls";


  const prevButton =
    document.createElement(
      "button"
    );


  prevButton.type =
    "button";


  prevButton.className =
    "home-clients-carousel__button";


  prevButton.setAttribute(
    "aria-label",
    "Previous client"
  );


  prevButton.innerHTML =
    "←";


  const nextButton =
    document.createElement(
      "button"
    );


  nextButton.type =
    "button";


  nextButton.className =
    "home-clients-carousel__button";


  nextButton.setAttribute(
    "aria-label",
    "Next client"
  );


  nextButton.innerHTML =
    "→";


  controls.append(
    prevButton,
    nextButton
  );


  footer.append(
    progress,
    controls
  );


  carousel.appendChild(
    footer
  );


  stage.appendChild(
    carousel
  );


  /* =========================================================
     INFINITE LOOP CLONES
  ========================================================= */

  const cloneCount =
    Math.min(
      5,
      logos.length
    );


  const before =
    logos.slice(
      logos.length -
      cloneCount
    );


  const after =
    logos.slice(
      0,
      cloneCount
    );


  const allItems =
    [
      ...before,
      ...logos,
      ...after
    ];


  allItems.forEach(
    (
      logo,
      index
    ) => {
      const card =
        document.createElement(
          "div"
        );


      card.className =
        "home-client-logo home-client-logo--carousel";


      const realIndex =
        (
          index
          -
          cloneCount
          +
          logos.length
        )
        %
        logos.length;


      card.dataset.clientIndex =
        String(
          realIndex
        );


      const image =
        document.createElement(
          "img"
        );


      image.src =
        logo.src;


      image.alt =
        index >= cloneCount
        &&
        index <
          cloneCount +
          logos.length
          ?
          logo.alt
          :
          "";


      image.loading =
        "lazy";


      image.decoding =
        "async";


      if (
        image.alt === ""
      ) {
        image.setAttribute(
          "aria-hidden",
          "true"
        );
      }


      card.appendChild(
        image
      );


      track.appendChild(
        card
      );
    }
  );


  const slides =
    Array.from(
      track.children
    );


  /* =========================================================
     STATE
  ========================================================= */

  let virtualIndex =
    cloneCount;


  let currentX =
    0;


  let moving =
    false;


  let moveTween =
    null;


  let autoplayCall =
    null;


  let hoverPaused =
    false;


  /* =========================================================
     POINTER STATE
  ========================================================= */

  let dragging =
    false;


  let horizontalDrag =
    false;


  let pointerId =
    null;


  let startX =
    0;


  let startY =
    0;


  let startTrackX =
    0;


  let lastX =
    0;


  let lastTime =
    0;


  let velocityX =
    0;


  /* =========================================================
     SNAP POSITION

     Active logo is centred inside viewport.
  ========================================================= */

  function snapFor(
    index
  ) {
    const slide =
      slides[
        index
      ];


    if (!slide) {
      return currentX;
    }


    return (
      viewport.clientWidth / 2
      -
      (
        slide.offsetLeft
        +
        slide.offsetWidth / 2
      )
    );
  }


  /* =========================================================
     CURRENT REAL LOGO INDEX
  ========================================================= */

  function getRealIndex() {
    return (
      (
        virtualIndex
        -
        cloneCount
      )
      %
      logos.length
      +
      logos.length
    )
    %
    logos.length;
  }


  /* =========================================================
     DEPTH / PREMIUM CARD EFFECT
  ========================================================= */

  function renderDepth() {
    const center =
      viewport.clientWidth / 2;


    let closestSlide =
      null;


    let closestDistance =
      Infinity;


    slides.forEach(
      slide => {
        const slideCenter =
          slide.offsetLeft
          +
          currentX
          +
          slide.offsetWidth / 2;


        const distance =
          slideCenter -
          center;


        const absoluteDistance =
          Math.abs(
            distance
          );


        const normalized =
          Math.min(
            absoluteDistance /
            Math.max(
              viewport.clientWidth *
              0.55,
              1
            ),
            1
          );


        const closeness =
          1 -
          normalized;


        if (
          absoluteDistance <
          closestDistance
        ) {
          closestDistance =
            absoluteDistance;


          closestSlide =
            slide;
        }


        gsap.set(
          slide,
          {
            scale:
              0.92
              +
              closeness *
              0.08,

            y:
              normalized *
              10,

            opacity:
              0.54
              +
              closeness *
              0.46,

            rotationY:
              gsap.utils.clamp(
                -5,
                5,
                distance /
                90
              ),

            force3D:
              true
          }
        );
      }
    );


    slides.forEach(
      slide => {
        slide.classList.toggle(
          "is-current",
          slide ===
            closestSlide
        );
      }
    );


    /* =====================================================
       PROGRESS
    ===================================================== */

    gsap.set(
      progressFill,
      {
        scaleX:
          (
            getRealIndex() +
            1
          )
          /
          logos.length,

        transformOrigin:
          "left center"
      }
    );
  }


  /* =========================================================
     SET TRACK POSITION
  ========================================================= */

  function setTrackX(
    value
  ) {
    currentX =
      value;


    gsap.set(
      track,
      {
        x:
          currentX,

        force3D:
          true
      }
    );


    renderDepth();
  }


  /* =========================================================
     NORMALIZE INFINITE LOOP
  ========================================================= */

  function normalizeLoop() {
    if (
      virtualIndex >=
      cloneCount +
      logos.length
    ) {
      virtualIndex -=
        logos.length;


      currentX =
        snapFor(
          virtualIndex
        );


      gsap.set(
        track,
        {
          x:
            currentX
        }
      );
    }


    else if (
      virtualIndex <
      cloneCount
    ) {
      virtualIndex +=
        logos.length;


      currentX =
        snapFor(
          virtualIndex
        );


      gsap.set(
        track,
        {
          x:
            currentX
        }
      );
    }


    renderDepth();
  }


  /* =========================================================
     AUTOPLAY
  ========================================================= */

  function stopAutoplay() {
    autoplayCall?.kill();

    autoplayCall = null;
  }


  function startAutoplay(
    delay = 2.8
  ) {
    stopAutoplay();


    if (
      dragging ||
      hoverPaused ||
      document.hidden
    ) {
      return;
    }


    autoplayCall =
      gsap.delayedCall(
        delay,
        () => {
          moveOne(1);
        }
      );
  }


  /* =========================================================
     MOVE ONE LOGO

     direction:
      1 = next
     -1 = previous
  ========================================================= */

  function moveOne(
    direction
  ) {
    if (
      moving ||
      dragging
    ) {
      return;
    }


    stopAutoplay();


    moving =
      true;


    virtualIndex +=
      direction;


    const target =
      snapFor(
        virtualIndex
      );


    moveTween?.kill();


    moveTween =
      gsap.to(
        track,
        {
          x:
            target,

          duration: 0.72,

          ease:
            "power4.inOut",

          overwrite:
            true,


          onUpdate() {
            currentX =
              Number(
                gsap.getProperty(
                  track,
                  "x"
                )
              )
              ||
              0;


            renderDepth();
          },


          onComplete() {
            currentX =
              target;


            moving =
              false;


            moveTween =
              null;


            normalizeLoop();


            startAutoplay(
              2.8
            );
          }
        }
      );
  }


  /* =========================================================
     SNAP BACK TO CURRENT LOGO
  ========================================================= */

  function snapBack() {
    const target =
      snapFor(
        virtualIndex
      );


    moveTween?.kill();


    moveTween =
      gsap.to(
        track,
        {
          x:
            target,

          duration: 0.45,

          ease:
            "power3.out",

          overwrite:
            true,


          onUpdate() {
            currentX =
              Number(
                gsap.getProperty(
                  track,
                  "x"
                )
              )
              ||
              0;


            renderDepth();
          },


          onComplete() {
            currentX =
              target;


            moveTween =
              null;


            startAutoplay(
              2.4
            );
          }
        }
      );
  }


  /* =========================================================
     POINTER / TOUCH SETUP
  ========================================================= */

  viewport.style.touchAction =
    "pan-y";


  viewport.style.userSelect =
    "none";


  viewport.style.webkitUserSelect =
    "none";


  viewport.addEventListener(
    "dragstart",
    event => {
      event.preventDefault();
    }
  );


  /* =========================================================
     START DRAG
  ========================================================= */

  viewport.addEventListener(
    "pointerdown",
    event => {
      if (
        event.button !==
          undefined
        &&
        event.button !==
          0
      ) {
        return;
      }


      stopAutoplay();


      moveTween?.kill();


      moveTween =
        null;


      moving =
        false;


      dragging =
        true;


      horizontalDrag =
        false;


      pointerId =
        event.pointerId;


      startX =
        event.clientX;


      startY =
        event.clientY;


      startTrackX =
        currentX;


      lastX =
        event.clientX;


      lastTime =
        performance.now();


      velocityX =
        0;


      viewport.classList.add(
        "is-dragging"
      );
    }
  );


  /* =========================================================
     DRAG
  ========================================================= */

  viewport.addEventListener(
    "pointermove",
    event => {
      if (!dragging) {
        return;
      }


      const dx =
        event.clientX -
        startX;


      const dy =
        event.clientY -
        startY;


      if (!horizontalDrag) {
        if (
          Math.abs(dx) < 6
          &&
          Math.abs(dy) < 6
        ) {
          return;
        }


        /*
         * Vertical movement keeps
         * normal page scrolling.
         */

        if (
          Math.abs(dy)
          >
          Math.abs(dx) *
          1.12
        ) {
          dragging =
            false;


          viewport.classList.remove(
            "is-dragging"
          );


          startAutoplay(
            2.3
          );


          return;
        }


        horizontalDrag =
          true;


        try {
          viewport.setPointerCapture?.(
            event.pointerId
          );
        }

        catch {}
      }


      if (
        event.cancelable
      ) {
        event.preventDefault();
      }


      const now =
        performance.now();


      const elapsed =
        Math.max(
          now -
          lastTime,
          1
        );


      velocityX =
        (
          event.clientX -
          lastX
        )
        /
        elapsed;


      lastX =
        event.clientX;


      lastTime =
        now;


      /*
       * 1:1 drag.
       */

      setTrackX(
        startTrackX +
        dx
      );
    },
    {
      passive: false
    }
  );


  /* =========================================================
     END DRAG

     One gesture = one card.
  ========================================================= */

  function finishDrag(
    event
  ) {
    if (!dragging) {
      return;
    }


    dragging =
      false;


    viewport.classList.remove(
      "is-dragging"
    );


    const dx =
      event.clientX -
      startX;


    const distanceThreshold =
      Math.min(
        72,
        viewport.clientWidth *
        0.12
      );


    const velocityThreshold =
      0.17;


    if (
      horizontalDrag
      &&
      (
        Math.abs(dx) >
          distanceThreshold
        ||
        Math.abs(velocityX) >
          velocityThreshold
      )
    ) {
      /*
       * Swipe LEFT = next.
       * Swipe RIGHT = previous.
       */

      moveOne(
        dx < 0
        ||
        velocityX < 0
          ? 1
          : -1
      );
    }


    else {
      snapBack();
    }


    if (
      pointerId !==
      null
    ) {
      try {
        viewport.releasePointerCapture?.(
          pointerId
        );
      }

      catch {}
    }


    pointerId =
      null;


    horizontalDrag =
      false;
  }


  viewport.addEventListener(
    "pointerup",
    finishDrag
  );


  viewport.addEventListener(
    "pointercancel",
    () => {
      if (!dragging) {
        return;
      }


      dragging =
        false;


      horizontalDrag =
        false;


      viewport.classList.remove(
        "is-dragging"
      );


      pointerId =
        null;


      snapBack();
    }
  );


  /* =========================================================
     LAPTOP TRACKPAD

     Horizontal gesture = move ONE logo.
  ========================================================= */

  let wheelAccumulator =
    0;


  let wheelTimer =
    null;


  viewport.addEventListener(
    "wheel",
    event => {
      if (
        Math.abs(
          event.deltaX
        )
        <=
        Math.abs(
          event.deltaY
        )
      ) {
        return;
      }


      event.preventDefault();


      wheelAccumulator +=
        event.deltaX;


      window.clearTimeout(
        wheelTimer
      );


      if (
        Math.abs(
          wheelAccumulator
        )
        >
        38
        &&
        !moving
      ) {
        moveOne(
          wheelAccumulator > 0
            ? 1
            : -1
        );


        wheelAccumulator =
          0;
      }


      wheelTimer =
        window.setTimeout(
          () => {
            wheelAccumulator =
              0;
          },
          100
        );
    },
    {
      passive: false
    }
  );


  /* =========================================================
     BUTTONS
  ========================================================= */

  prevButton.addEventListener(
    "click",
    () => {
      moveOne(-1);
    }
  );


  nextButton.addEventListener(
    "click",
    () => {
      moveOne(1);
    }
  );


  /* =========================================================
     KEYBOARD
  ========================================================= */

  carousel.addEventListener(
    "keydown",
    event => {
      if (
        event.key ===
        "ArrowRight"
      ) {
        event.preventDefault();

        moveOne(1);
      }


      if (
        event.key ===
        "ArrowLeft"
      ) {
        event.preventDefault();

        moveOne(-1);
      }
    }
  );


  /* =========================================================
     PAUSE AUTOPLAY WHEN DESKTOP USER IS INTERACTING
  ========================================================= */

  if (
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches
  ) {
    viewport.addEventListener(
      "pointerenter",
      () => {
        hoverPaused =
          true;

        stopAutoplay();
      }
    );


    viewport.addEventListener(
      "pointerleave",
      () => {
        hoverPaused =
          false;

        startAutoplay(
          1.5
        );
      }
    );
  }


  /* =========================================================
     SECTION ENTRANCE
  ========================================================= */

  if (heading) {
    gsap.fromTo(
      heading,
      {
        y: 26,

        opacity: 0
      },
      {
        y: 0,

        opacity: 1,

        duration: 0.8,

        ease:
          "power3.out",

        scrollTrigger: {
          trigger:
            section,

          start:
            "top 84%",

          once:
            true
        }
      }
    );
  }


  gsap.fromTo(
    carousel,
    {
      y: 35,

      opacity: 0
    },
    {
      y: 0,

      opacity: 1,

      duration: 0.9,

      ease:
        "power4.out",

      scrollTrigger: {
        trigger:
          carousel,

        start:
          "top 90%",

        once:
          true
      }
    }
  );


  /* =========================================================
     TAB VISIBILITY
  ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.hidden
      ) {
        stopAutoplay();
      }

      else {
        startAutoplay(
          1.8
        );
      }
    }
  );


  /* =========================================================
     RESIZE
  ========================================================= */

  let resizeTimer =
    null;


  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(
        resizeTimer
      );


      resizeTimer =
        window.setTimeout(
          () => {
            moveTween?.kill();

            moving =
              false;


            currentX =
              snapFor(
                virtualIndex
              );


            gsap.set(
              track,
              {
                x:
                  currentX
              }
            );


            renderDepth();


            ScrollTrigger.refresh();
          },
          140
        );
    },
    {
      passive: true
    }
  );


  /* =========================================================
     INITIAL POSITION
  ========================================================= */

  requestAnimationFrame(
    () => {
      currentX =
        snapFor(
          virtualIndex
        );


      gsap.set(
        track,
        {
          x:
            currentX
        }
      );


      renderDepth();


      startAutoplay(
        2.4
      );
    }
  );
}