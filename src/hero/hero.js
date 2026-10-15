import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   APE HERO
   CLEAN 3-CARD KINETIC PROJECT DECK
========================================================= */

const PROJECTS = [
  {
    name: "Babumoshai",
    image: "/work/babumoshai/01.jpg",
    href: "/work/babumoshai/"
  },
  {
    name: "Grandly",
    image: "/work/grandly/01.jpg",
    href: "/work/grandly/"
  },
  {
    name: "Aditya Academy",
    image: "/work/aditya-academy/01.jpg",
    href: "/work/aditya-academy/"
  },
  {
    name: "Boho",
    image: "/work/boho/01.jpg",
    href: "/work/boho/"
  }
];

export function initHero() {
  const hero = document.getElementById("ape-hero");

  if (!hero) return;

  hero.innerHTML = `
    <div
      class="ape-hero__background"
      aria-hidden="true"
    >
      <div class="ape-hero__grid"></div>
    </div>

    <div class="ape-hero__copy">
      <h1 class="ape-hero__title">
        <span>IDEAS</span>
        <span class="is-violet">SHOULDN'T</span>
        <span>SIT STILL.</span>
      </h1>

      <a
        href="/work/"
        class="ape-hero__action"
      >
        EXPLORE WORK
        <i aria-hidden="true">↗</i>
      </a>
    </div>

    <div
      class="ape-hero__deck"
      aria-label="Selected APE Studio projects"
    >
      ${PROJECTS.map(
        (project, index) => `
          <a
            href="${project.href}"
            class="ape-hero-card"
            data-card-index="${index}"
            aria-label="View ${project.name}"
          >
            <img
              src="${project.image}"
              alt="${project.name} project by APE Studio"
              draggable="false"
            >

            <span class="ape-hero-card__name">
              ${project.name}
            </span>
          </a>
        `
      ).join("")}
    </div>

    <div
      class="ape-hero__dots"
      aria-hidden="true"
    >
      ${PROJECTS.map(
        (_, index) => `
          <span class="${index === 0 ? "is-active" : ""}"></span>
        `
      ).join("")}
    </div>
  `;

  const copy = hero.querySelector(".ape-hero__copy");
  const titleLines = Array.from(hero.querySelectorAll(".ape-hero__title > span"));
  const button = hero.querySelector(".ape-hero__action");
  const deck = hero.querySelector(".ape-hero__deck");
  const cards = Array.from(hero.querySelectorAll(".ape-hero-card"));
  const dots = Array.from(hero.querySelectorAll(".ape-hero__dots span"));

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let activeIndex = 1;
  let autoplay = null;

  function arrange(immediate = false) {
    if (!deck) return;

    const deckWidth = deck.clientWidth;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const spread = deckWidth * (mobile ? 0.295 : 0.305);

    const previousIndex =
      (activeIndex - 1 + cards.length) % cards.length;

    const nextIndex =
      (activeIndex + 1) % cards.length;

    cards.forEach((card, index) => {
      let state;

      if (index === activeIndex) {
        state = {
          x: 0,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          rotate: 0,
          opacity: 1,
          zIndex: 7
        };
      } else if (index === previousIndex) {
        state = {
          x: -spread,
          xPercent: -50,
          yPercent: -50,
          scale: mobile ? 0.68 : 0.76,
          rotate: mobile ? -5 : -7,
          opacity: 0.68,
          zIndex: 3
        };
      } else if (index === nextIndex) {
        state = {
          x: spread,
          xPercent: -50,
          yPercent: -50,
          scale: mobile ? 0.68 : 0.76,
          rotate: mobile ? 5 : 7,
          opacity: 0.68,
          zIndex: 3
        };
      } else {
        state = {
          x: 0,
          xPercent: -50,
          yPercent: -50,
          scale: 0.58,
          rotate: 0,
          opacity: 0,
          zIndex: 0
        };
      }

      card.classList.toggle("is-active", index === activeIndex);

      gsap.to(card, {
        ...state,
        duration: immediate ? 0 : 0.9,
        ease: "power4.inOut",
        overwrite: true
      });
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  }

  function next() {
    activeIndex = (activeIndex + 1) % cards.length;
    arrange();
  }

  function startAutoplay() {
    stopAutoplay();

    if (reduced) return;

    autoplay = window.setInterval(next, 3800);
  }

  function stopAutoplay() {
    if (!autoplay) return;

    window.clearInterval(autoplay);
    autoplay = null;
  }

  arrange(true);

  if (!reduced) {
    const intro = gsap.timeline({
      defaults: {
        ease: "power4.out"
      }
    });

    intro.fromTo(
      titleLines,
      {
        yPercent: 115,
        opacity: 0
      },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.07
      }
    );

    intro.fromTo(
      button,
      {
        y: 20,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.55
      },
      "-=.45"
    );

    intro.fromTo(
      deck,
      {
        scale: 0.86,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.15
      },
      "-=.85"
    );
  }

  cards.forEach((card, index) => {
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse") return;

      stopAutoplay();

      if (index !== activeIndex) {
        activeIndex = index;
        arrange();
      }
    });
  });

  deck.addEventListener("pointerleave", () => {
    startAutoplay();
  });

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer && deck) {
    const rotateX = gsap.quickTo(deck, "rotationX", {
      duration: 0.7,
      ease: "power3.out"
    });

    const rotateY = gsap.quickTo(deck, "rotationY", {
      duration: 0.7,
      ease: "power3.out"
    });

    const xTo = gsap.quickTo(deck, "x", {
      duration: 0.8,
      ease: "power3.out"
    });

    const yTo = gsap.quickTo(deck, "y", {
      duration: 0.8,
      ease: "power3.out"
    });

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      rotateY(x * 3.5);
      rotateX(y * -2.5);

      xTo(x * 10);
      yTo(y * 7);
    });

    hero.addEventListener("pointerleave", () => {
      rotateX(0);
      rotateY(0);
      xTo(0);
      yTo(0);
    });
  }

  if (!reduced) {
    const exit = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "58% top",
        end: "bottom top",
        scrub: 1
      }
    });

    exit.to(
      copy,
      {
        yPercent: -28,
        opacity: 0,
        scale: 0.95,
        ease: "none"
      },
      0
    );

    exit.to(
      deck,
      {
        yPercent: 14,
        scale: 1.08,
        opacity: 0.22,
        ease: "none"
      },
      0
    );
  }

  startAutoplay();

  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        arrange(true);
        ScrollTrigger.refresh();
      }, 100);
    },
    { passive: true }
  );
}