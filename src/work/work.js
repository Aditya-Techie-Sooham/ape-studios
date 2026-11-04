import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader } from "../header/header.js";

import {
  WORK_CATEGORIES,
  WORK_PROJECTS,
  workImagePath
} from "./work-data.js";

gsap.registerPlugin(ScrollTrigger);

const motionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const pointerPreference = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
);

const desktopPreference = window.matchMedia(
  "(min-width: 1101px)"
);

const cardReveals = new Map();

let guideReaction = null;

/* Breadcrumb */

function initBreadcrumb() {
  const content = document.querySelector(".work-hero__content");

  if (!content) return;

  content.querySelector(".work-hero__eyebrow")?.remove();

  if (content.querySelector(".work-breadcrumb")) return;

  const breadcrumb = document.createElement("nav");

  breadcrumb.className = "work-breadcrumb";
  breadcrumb.setAttribute("aria-label", "Breadcrumb");

  breadcrumb.innerHTML = `
    <ol>
      <li><a href="/">Home</a></li>
      <li><span aria-current="page">Work</span></li>
    </ol>
  `;

  content.prepend(breadcrumb);
}

/* Filters */

function buildFilters() {
  const mount = document.getElementById("work-filters");

  if (!mount) return;

  const fragment = document.createDocumentFragment();

  WORK_CATEGORIES.forEach((category, index) => {
    const button = document.createElement("button");
    const active = index === 0;

    button.type = "button";
    button.className = `work-filter${active ? " is-active" : ""}`;
    button.dataset.filter = category.id;
    button.textContent = category.label;
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-controls", "work-grid");

    fragment.append(button);
  });

  mount.replaceChildren(fragment);
}

/* Project cards */

function createProjectCard(project) {
  const article = document.createElement("article");
  const titleId = `work-project-${project.slug}-title`;

  article.className = [
    "work-card",
    `work-card--${project.tone}`,
    `work-card--${project.size}`
  ].join(" ");

  article.dataset.category = project.category;
  article.style.setProperty("--card-span", project.span);
  article.setAttribute("aria-labelledby", titleId);

  const link = document.createElement("a");

  link.className = "work-card__link";
  link.href = `/work/${project.slug}/`;

  const imageWrap = document.createElement("div");
  imageWrap.className = "work-card__image";

  const image = document.createElement("img");

  image.src = workImagePath(project.slug, 1);
  image.alt = `Selected creative work for ${project.name} by APE Studio`;
  image.loading = "lazy";
  image.decoding = "async";

  image.addEventListener(
    "load",
    () => ScrollTrigger.refresh(),
    { once: true }
  );

  imageWrap.append(image);

  const overlay = document.createElement("div");

  overlay.className = "work-card__overlay";
  overlay.setAttribute("aria-hidden", "true");

  const bottom = document.createElement("div");
  bottom.className = "work-card__bottom";

  const heading = document.createElement("h3");

  heading.id = titleId;
  heading.textContent = project.name;

  const arrow = document.createElement("span");

  arrow.className = "work-card__arrow";
  arrow.textContent = "↗";
  arrow.setAttribute("aria-hidden", "true");

  bottom.append(heading, arrow);

  const view = document.createElement("span");

  view.className = "work-card__view";
  view.textContent = "View Project";
  view.setAttribute("aria-hidden", "true");

  link.append(imageWrap, overlay, bottom, view);
  article.append(link);

  return article;
}

function buildProjects() {
  const grid = document.getElementById("work-grid");

  if (!grid) return;

  const fragment = document.createDocumentFragment();

  WORK_PROJECTS.forEach((project) => {
    fragment.append(createProjectCard(project));
  });

  grid.replaceChildren(fragment);
}

/* Filtering */

function initFiltering() {
  const mount = document.getElementById("work-filters");
  const cards = [...document.querySelectorAll(".work-card")];

  if (!mount || !cards.length) return;

  let activeCategory = "all";

  mount.addEventListener("click", (event) => {
    const button = event.target.closest(".work-filter");

    if (!button || !mount.contains(button)) return;

    const category = button.dataset.filter;

    if (category === activeCategory) return;

    activeCategory = category;

    mount.querySelectorAll(".work-filter").forEach((item) => {
      const active = item === button;

      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    const visibleCards = [];

    cards.forEach((card) => {
      const reveal = cardReveals.get(card);

      if (reveal) {
        reveal.scrollTrigger?.kill();
        reveal.kill();
        cardReveals.delete(card);
      }

      gsap.killTweensOf(card);

      card.hidden = !(
        category === "all" ||
        card.dataset.category === category
      );

      if (!card.hidden) visibleCards.push(card);
    });

    if (motionPreference.matches) {
      gsap.set(visibleCards, {
        opacity: 1,
        y: 0,
        scale: 1
      });
    } else {
      gsap.fromTo(
        visibleCards,
        {
          opacity: 0,
          y: 22,
          scale: 0.985
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.045,
          ease: "power3.out",
          overwrite: true
        }
      );
    }

    guideReaction?.();

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  });
}

/* Hero entrance */

function initHeroMotion() {
  if (motionPreference.matches) return;

  const content = document.querySelector(".work-hero__content");
  const ape = document.querySelector(".work-hero__ape");

  if (content) {
    gsap.fromTo(
      content.children,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: "power3.out"
      }
    );
  }

  if (ape) {
    gsap.fromTo(
      ape,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        delay: 0.15,
        ease: "power2.out"
      }
    );
  }
}

/* Mascot glow */

function pulseMascot(button, prefix) {
  if (!button || motionPreference.matches) return;

  const aura = button.querySelector(`.${prefix}-aura`);
  const pulse = button.querySelector(`.${prefix}-pulse`);

  if (aura) {
    gsap.fromTo(
      aura,
      { opacity: 1, scale: 0.9 },
      {
        opacity: 0.65,
        scale: 1.15,
        duration: 0.65,
        ease: "power2.out",
        overwrite: true
      }
    );
  }

  if (pulse) {
    gsap.fromTo(
      pulse,
      { opacity: 0.65, scale: 0.75 },
      {
        opacity: 0,
        scale: 1.35,
        duration: 0.65,
        ease: "power2.out",
        overwrite: true
      }
    );
  }
}

function initHeroApe() {
  const ape = document.querySelector(".work-hero__ape");

  if (!ape) return;

  ape.setAttribute(
    "aria-label",
    "Activate the APE Studio mascot glow"
  );

  ape.addEventListener("click", () => {
    pulseMascot(ape, "work-hero__ape");
  });
}

/* Project guide */

function initProjectApe() {
  const ape = document.querySelector(".work-projects__ape");
  const rig = ape?.querySelector(".work-projects__ape-rig");

  if (!ape || !rig) return;

  let reactionTimeline;

  const react = () => {
    if (motionPreference.matches) return;

    reactionTimeline?.kill();
    gsap.killTweensOf(rig);

    reactionTimeline = gsap.timeline()
      .to(rig, {
        rotation: -5,
        scale: 1.04,
        duration: 0.15,
        ease: "power2.out"
      })
      .to(rig, {
        rotation: 5,
        duration: 0.18
      })
      .to(rig, {
        rotation: 0,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.5)"
      });

    pulseMascot(ape, "work-projects__ape");
  };

  guideReaction = react;
  ape.addEventListener("click", react);
}

/* Project entrance */

function initProjectMotion() {
  if (motionPreference.matches) return;

  const header = document.querySelector(".work-projects__header");

  if (header) {
    gsap.fromTo(
      header,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: header,
          start: "top 88%",
          once: true
        }
      }
    );
  }

  document.querySelectorAll(".work-card").forEach((card) => {
    const reveal = gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 94%",
          once: true
        }
      }
    );

    cardReveals.set(card, reveal);
  });
}

/* Desktop card tilt */

function initCardPointerMotion() {
  const media = gsap.matchMedia();

  media.add(
    "(min-width: 1101px) and (hover: hover) and " +
    "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      const cleanups = [];

      document.querySelectorAll(".work-card__link").forEach((link) => {
        const move = (event) => {
          const rect = link.getBoundingClientRect();

          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(link, {
            rotationY: x * 3,
            rotationX: y * -3,
            y: -4,
            transformPerspective: 900,
            duration: 0.3,
            ease: "power3.out",
            overwrite: "auto"
          });
        };

        const leave = () => {
          gsap.to(link, {
            rotationX: 0,
            rotationY: 0,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto"
          });
        };

        link.addEventListener("pointermove", move);
        link.addEventListener("pointerleave", leave);

        cleanups.push(() => {
          link.removeEventListener("pointermove", move);
          link.removeEventListener("pointerleave", leave);

          gsap.killTweensOf(link);
          gsap.set(link, { clearProps: "transform" });
        });
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    }
  );
}

/* Navigation */

function initHeroCTA() {
  const button = document.querySelector(".work-hero__cta");
  const target = document.getElementById("work-projects");

  if (!button || !target) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();

    target.scrollIntoView({
      behavior: motionPreference.matches ? "auto" : "smooth",
      block: "start"
    });
  });
}

function initFooter() {
  const year = document.getElementById("ape-footer-year");
  const top = document.querySelector(".site-footer__top-link");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  top?.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: motionPreference.matches ? "auto" : "smooth"
    });
  });
}

/* Start */

function start() {
  initHeader();
  initBreadcrumb();
  buildFilters();
  buildProjects();

  initHeroApe();
  initProjectApe();
  initFiltering();
  initHeroCTA();
  initFooter();

  requestAnimationFrame(() => {
    initHeroMotion();
    initProjectMotion();
    initCardPointerMotion();
    ScrollTrigger.refresh();
  });

  document.fonts?.ready.then(() => {
    ScrollTrigger.refresh();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
}, { once: true });