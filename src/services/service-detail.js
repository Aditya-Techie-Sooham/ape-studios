/* Imports */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader } from "../header/header.js";
import { SERVICE_PAGES } from "./services-data.js";

gsap.registerPlugin(ScrollTrigger);

/* Environment */

const motionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const SERVICE_MASCOTS = {
  "digital-marketing": "/mascot/ape-laptop.webp",
  printables: "/mascot/ape-idea.webp",
  branding: "/mascot/ape-thinking.webp",
  "influencer-marketing": "/mascot/ape-phone.webp",
  "visual-studio": "/mascot/ape-camera.webp"
};

/* Content helpers */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function getServiceSlug() {
  const parts = window.location.pathname.split("/").filter(Boolean);

  return document.body.dataset.service || parts[1] || "";
}

function createSectionId(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderHeroLines(lines) {
  return lines
    .map((line) => {
      const accent = line.accent ? " is-accent" : "";

      return `
        <span class="service-detail-hero__title-line${accent}">
          ${escapeHTML(line.text)}
        </span>
      `;
    })
    .join("");
}

/* Breadcrumb */

function renderBreadcrumb(service) {
  return `
    <nav class="service-breadcrumb" aria-label="Breadcrumb">
      <ol class="service-breadcrumb__list" role="list">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <span class="service-breadcrumb__separator" aria-hidden="true">
            ›
          </span>
          <a href="/services/">Services</a>
        </li>
        <li>
          <span class="service-breadcrumb__separator" aria-hidden="true">
            ›
          </span>
          <span aria-current="page">
            ${escapeHTML(service.navLabel)}
          </span>
        </li>
      </ol>
    </nav>
  `;
}

/* Subservices */

function renderSubservices(service) {
  return service.subservices
    .map((item, index) => {
      const id = createSectionId(item.title);
      const headingId = `${id}-title`;
      const reversed = index % 2 ? " is-reversed" : "";

      const images = (item.images || [])
        .filter(Boolean)
        .map((source, imageIndex) => {
          const description = imageIndex
            ? `${item.title} creative example by APE Studio`
            : `${item.title} work by APE Studio`;

          return `
            <figure>
              <img
                src="${escapeHTML(source)}"
                alt="${escapeHTML(description)}"
                loading="lazy"
                decoding="async"
              >
            </figure>
          `;
        })
        .join("");

      return `
        <article
          id="${escapeHTML(id)}"
          class="service-subsection${reversed}"
          aria-labelledby="${escapeHTML(headingId)}"
        >
          <div class="service-subsection__inner">
            <div class="service-subsection__content">
              <p class="service-subsection__eyebrow">
                ${escapeHTML(service.navLabel)}
              </p>

              <h2 id="${escapeHTML(headingId)}">
                ${escapeHTML(item.title)}
              </h2>

              <p class="service-subsection__description">
                ${escapeHTML(item.description)}
              </p>
            </div>

            <div class="service-subsection__images">
              ${images}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

/* Page */

function renderServicePage() {
  const root = document.getElementById("service-detail-root");
  const slug = getServiceSlug();
  const service = SERVICE_PAGES[slug];

  if (!root) {
    return false;
  }

  if (!service) {
    root.innerHTML = `
      <section class="service-detail-error">
        <h1>Service not found</h1>
        <a href="/services/">Explore all services</a>
      </section>
    `;

    return false;
  }

  const mascot = SERVICE_MASCOTS[slug] || "/mascot/ape-idea.webp";
  const titleId = `${slug}-service-title`;

  root.innerHTML = `
    <section
      id="service-detail-hero"
      class="service-detail-hero"
      aria-labelledby="${escapeHTML(titleId)}"
    >
      <div
        class="service-detail-hero__glow service-detail-hero__glow--violet"
        aria-hidden="true"
      ></div>

      <div
        class="service-detail-hero__glow service-detail-hero__glow--lime"
        aria-hidden="true"
      ></div>

      <div class="service-detail-hero__inner">
        <div class="service-detail-hero__content">
          ${renderBreadcrumb(service)}

          <h1 id="${escapeHTML(titleId)}">
            ${renderHeroLines(service.heroLines)}
          </h1>

          <p class="service-detail-hero__lead">
            ${escapeHTML(service.intro)}
          </p>

          <div class="service-detail-hero__actions">
            <a
              href="#service-subsections"
              class="service-detail-primary"
            >
              EXPLORE
              <span aria-hidden="true">↓</span>
            </a>

            <a
              href="/contact/"
              class="service-detail-secondary"
            >
              START A PROJECT
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div class="service-detail-hero__visual">
          <button
            type="button"
            class="service-detail-ape"
            aria-label="Highlight the APE Studio mascot"
          >
            <span
              class="service-detail-ape__aura"
              aria-hidden="true"
            ></span>

            <img
              src="${escapeHTML(mascot)}"
              alt=""
              draggable="false"
            >
          </button>
        </div>
      </div>
    </section>

    <section
      id="service-subsections"
      class="service-subsections"
      aria-label="${escapeHTML(service.navLabel)} services"
    >
      ${renderSubservices(service)}
    </section>
  `;

  return true;
}

/* Mascot */

function initHeroApe() {
  const button = document.querySelector(".service-detail-ape");
  const aura = button?.querySelector(".service-detail-ape__aura");

  if (!button || !aura) {
    return;
  }

  button.addEventListener("click", () => {
    if (motionPreference.matches) {
      return;
    }

    gsap.fromTo(
      aura,
      { opacity: 1, scale: 1.1 },
      {
        opacity: 0.7,
        scale: 1,
        duration: 0.65,
        ease: "power2.out",
        overwrite: true
      }
    );
  });
}

/* Motion */

function initMotion() {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const lines = gsap.utils.toArray(
      ".service-detail-hero__title-line"
    );

    const lead = document.querySelector(
      ".service-detail-hero__lead"
    );

    const actions = document.querySelector(
      ".service-detail-hero__actions"
    );

    const ape = document.querySelector(".service-detail-ape");

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    if (lines.length) {
      timeline.from(lines, {
        opacity: 0,
        y: 22,
        duration: 0.65,
        stagger: 0.07
      });
    }

    if (lead) {
      timeline.from(
        lead,
        { opacity: 0, y: 14, duration: 0.5 },
        "-=0.35"
      );
    }

    if (actions) {
      timeline.from(
        actions,
        { opacity: 0, y: 10, duration: 0.45 },
        "-=0.3"
      );
    }

    if (ape) {
      timeline.from(
        ape,
        { opacity: 0, duration: 0.7 },
        0.15
      );
    }

    document.querySelectorAll(".service-subsection").forEach((section) => {
      const content = section.querySelector(
        ".service-subsection__content"
      );

      const figures = section.querySelectorAll("figure");

      if (content) {
        gsap.from(content, {
          opacity: 0,
          y: 26,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: content,
            start: "top 92%",
            once: true
          }
        });
      }

      figures.forEach((figure) => {
        gsap.from(figure, {
          opacity: 0,
          y: 28,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: figure,
            start: "top 94%",
            once: true
          }
        });
      });
    });
  });

  media.add(
    "(min-width: 1101px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      document
        .querySelectorAll(".service-subsection__images img")
        .forEach((image) => {
          gsap.fromTo(
            image,
            { yPercent: -3 },
            {
              yPercent: 3,
              ease: "none",
              scrollTrigger: {
                trigger: image.closest("figure"),
                start: "top bottom",
                end: "bottom top",
                scrub: 1
              }
            }
          );
        });
    }
  );
}

/* Navigation */

function isModifiedClick(event) {
  return (
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  );
}

function initNavigation() {
  const explore = document.querySelector(".service-detail-primary");
  const target = document.getElementById("service-subsections");
  const topLink = document.querySelector(".site-footer__top-link");

  if (explore && target) {
    explore.addEventListener("click", (event) => {
      if (isModifiedClick(event)) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: motionPreference.matches ? "auto" : "smooth",
        block: "start"
      });
    });
  }

  if (topLink) {
    topLink.setAttribute("href", "#service-detail-hero");

    topLink.addEventListener("click", (event) => {
      if (isModifiedClick(event)) {
        return;
      }

      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: motionPreference.matches ? "auto" : "smooth"
      });
    });
  }
}

/* Footer */

function initFooter() {
  const year = document.getElementById("ape-footer-year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

/* Layout */

function refreshLayout() {
  ScrollTrigger.refresh();
}

function initImageRefresh() {
  document.querySelectorAll("#service-detail-root img").forEach((image) => {
    if (!image.complete) {
      image.addEventListener("load", refreshLayout, { once: true });
      image.addEventListener("error", refreshLayout, { once: true });
    }
  });
}

function restoreSectionLink() {
  if (!window.location.hash) {
    return;
  }

  let id;

  try {
    id = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return;
  }

  const target = document.getElementById(id);

  if (target) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  }
}

/* Start */

function start() {
  initHeader();
  initFooter();

  if (!renderServicePage()) {
    return;
  }

  initHeroApe();
  initNavigation();
  initMotion();
  initImageRefresh();

  requestAnimationFrame(() => {
    refreshLayout();
    restoreSectionLink();
  });

  if (document.fonts) {
    document.fonts.ready.then(refreshLayout);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

window.addEventListener("load", refreshLayout, { once: true });