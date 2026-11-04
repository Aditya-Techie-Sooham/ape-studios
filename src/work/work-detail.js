import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader } from "../header/header.js";

import {
  getWorkProject,
  workImagePath
} from "./work-data.js";

gsap.registerPlugin(ScrollTrigger);

const motionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const pageLinks = [
  ["/", "Home"],
  ["/about/", "About"],
  ["/services/", "Services"],
  ["/work/", "Work"],
  ["/blog/", "Blog"],
  ["/faq/", "FAQ"],
  ["/contact/", "Contact"]
];

const capabilityLinks = [
  ["/services/digital-marketing/#social-media-marketing", "Social Media"],
  ["/services/digital-marketing/#performance-marketing", "Performance Marketing"],
  ["/services/digital-marketing/", "Digital Marketing"],
  ["/services/digital-marketing/#website-development", "Website Development"],
  ["/services/printables/#packaging", "Packaging"],
  ["/services/branding/", "Branding"],
  ["/services/influencer-marketing/", "Influencer Marketing"],
  ["/services/visual-studio/#reels", "Reels & Motion"]
];

/* Helpers */

function escapeHTML(value) {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };

  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) => entities[character]
  );
}

function renderLinks(links, mobile = false, activeWork = false) {
  return links.map(([href, label]) => {
    const active = activeWork && href === "/work/"
      ? ' class="is-active"'
      : "";

    return `
      <a href="${href}"${active}>
        ${mobile ? `<span>${label}</span>` : label}
      </a>
    `;
  }).join("");
}

function isModifiedClick(event) {
  return (
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  );
}

function getCurrentSlug() {
  return (
    document.body.dataset.workProject ||
    window.location.pathname.split("/").filter(Boolean)[1] ||
    ""
  );
}

/* Global shell */

function renderShell() {
  const root = document.getElementById("work-detail-root");

  if (!root) return false;

  root.innerHTML = `
    <header id="site-header" class="site-header is-light">
      <div class="site-header__inner">
        <a
          href="/"
          class="site-header__brand"
          aria-label="APE Studio home"
        >
          <img
            src="/ape-logo.png"
            alt="APE Studio"
            class="site-header__logo"
          >
        </a>

        <nav
          class="site-header__nav"
          aria-label="Primary navigation"
        >
          ${renderLinks(pageLinks, false, true)}
        </nav>

        <a href="/contact/" class="site-header__cta">
          <span>Let's Talk</span>
          <span aria-hidden="true">↗</span>
        </a>

        <button
          id="site-menu-toggle"
          class="site-menu-toggle"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded="false"
          aria-controls="site-mobile-menu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div
        id="site-mobile-menu"
        class="site-mobile-menu"
        aria-hidden="true"
      >
        <div
          class="site-mobile-menu__background-word"
          aria-hidden="true"
        >
          APE
        </div>

        <div class="site-mobile-menu__top">
          <span>NAVIGATION</span>
          <span>KOLKATA / INDIA</span>
        </div>

        <nav
          class="site-mobile-menu__links"
          aria-label="Mobile navigation"
        >
          ${renderLinks(pageLinks, true, true)}
        </nav>

        <div class="site-mobile-menu__footer">
          <a href="/contact/">START A PROJECT ↗</a>
        </div>
      </div>
    </header>

    <main
      id="work-detail-page"
      class="work-detail-page"
    ></main>

    <footer id="site-footer" class="site-footer">
      <div class="site-footer__container">
        <div class="site-footer__cta">
          <div>
            <p class="site-footer__eyebrow">
              READY TO MAKE A MOVE?
            </p>

            <h2>
              LET'S BUILD
              <span>SOMETHING GOOD.</span>
            </h2>
          </div>

          <a href="/contact/" class="site-footer__cta-button">
            <span>LET'S TALK</span>
            <i aria-hidden="true">↗</i>
          </a>
        </div>

        <div class="site-footer__main">
          <div class="site-footer__brand-column">
            <a
              href="/"
              class="site-footer__logo"
              aria-label="APE Studio home"
            >
              <img src="/ape-logo.png" alt="APE Studio">
            </a>

            <p>
              APE Studio is a performance-driven creative and
              digital marketing agency helping brands build stronger
              identities, sharper digital presence and meaningful
              connections with their audiences.
            </p>
          </div>

          <div class="site-footer__column">
            <p class="site-footer__column-title">PAGES</p>
            <nav aria-label="Footer pages">
              ${renderLinks(pageLinks.slice(0, 4))}
            </nav>
          </div>

          <div class="site-footer__column">
            <p class="site-footer__column-title">EXPLORE</p>
            <nav aria-label="Footer explore navigation">
              ${renderLinks(pageLinks.slice(4))}
            </nav>
          </div>

          <div class="site-footer__column site-footer__column--services">
            <p class="site-footer__column-title">CAPABILITIES</p>
            <nav aria-label="APE Studio services">
              ${renderLinks(capabilityLinks)}
            </nav>
          </div>
        </div>

        <div class="site-footer__divider"></div>

        <div class="site-footer__bottom">
          <div class="site-footer__copyright">
            <span>
              © <span id="ape-footer-year"></span> APE STUDIO
            </span>
            <span>ALL RIGHTS RESERVED</span>
          </div>

          <div class="site-footer__bottom-nav">
            ${renderLinks(pageLinks.slice(1))}
          </div>

          <a
            href="#work-detail-hero"
            class="site-footer__top-link"
          >
            BACK TO TOP
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  `;

  return true;
}

/* Hero */

function createHero(project) {
  const section = document.createElement("section");

  section.id = "work-detail-hero";
  section.className = "work-detail-hero";
  section.setAttribute("aria-labelledby", "work-detail-title");

  section.innerHTML = `
    <div
      class="work-detail-hero__glow work-detail-hero__glow--violet"
      aria-hidden="true"
    ></div>

    <div
      class="work-detail-hero__glow work-detail-hero__glow--lime"
      aria-hidden="true"
    ></div>

    <div class="work-detail-hero__inner">
      <div class="work-detail-hero__copy">
        <nav class="work-detail-breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/work/">Work</a></li>
            <li>
              <span aria-current="page">
                ${escapeHTML(project.name)}
              </span>
            </li>
          </ol>
        </nav>

        <h1 id="work-detail-title">
          ${escapeHTML(project.name)}
        </h1>

        <div class="work-detail__intro">
          <p class="work-detail__lead">
            ${escapeHTML(project.intro)}
          </p>

          <p class="work-detail__description">
            ${escapeHTML(project.description)}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="work-detail__ape"
        aria-label="Activate the APE Studio mascot glow"
      >
        <span
          class="work-detail__ape-aura"
          aria-hidden="true"
        ></span>

        <img
          src="/mascot/ape-camera.webp"
          alt=""
          draggable="false"
          fetchpriority="high"
        >
      </button>
    </div>
  `;

  return section;
}

/* Gallery layout refresh */

let refreshFrame = null;

function requestRefresh() {
  if (refreshFrame !== null) return;

  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = null;
    ScrollTrigger.refresh();
  });
}

/* Gallery */

function createGallery(project) {
  const section = document.createElement("section");

  section.id = "work-project-gallery";
  section.className = "work-gallery-section";
  section.setAttribute("aria-labelledby", "work-gallery-title");

  const inner = document.createElement("div");
  inner.className = "work-gallery-section__inner";

  const header = document.createElement("div");
  header.className = "work-gallery__header";

  header.innerHTML = `
    <h2 id="work-gallery-title">PROJECT VISUALS</h2>
    <span>APE STUDIO</span>
  `;

  const gallery = document.createElement("div");
  gallery.className = "work-gallery";

  for (let index = 1; index <= 10; index += 1) {
    const item = document.createElement("div");
    item.className = "work-gallery__item";

    const figure = document.createElement("figure");
    const frame = document.createElement("div");
    const image = document.createElement("img");

    frame.className = "work-gallery__image";

    image.alt =
      `${project.name} ${project.categoryLabel.toLowerCase()} ` +
      "creative work by APE Studio";

    image.loading = index <= 3 ? "eager" : "lazy";
    image.decoding = "async";

    image.addEventListener("load", () => {
      item.dataset.loaded = "true";

      if (typeof item.revealWhenReady === "function") {
        item.revealWhenReady();
      }

      requestRefresh();
    }, { once: true });

    image.addEventListener("error", () => {
      item.classList.add("is-missing");
      requestRefresh();
    }, { once: true });

    image.src = workImagePath(project.slug, index);

    frame.append(image);
    figure.append(frame);
    item.append(figure);
    gallery.append(item);
  }

  inner.append(header, gallery);
  section.append(inner);

  return section;
}

/* Metadata */

function ensureCanonical(project) {
  if (document.querySelector('link[rel="canonical"]')) return;

  const canonical = document.createElement("link");

  canonical.rel = "canonical";
  canonical.href = `https://apeindia.in/work/${project.slug}/`;

  document.head.append(canonical);
}

/* Build page */

function buildProjectPage() {
  const main = document.getElementById("work-detail-page");

  if (!main) return false;

  const project = getWorkProject(getCurrentSlug());

  if (!project) {
    main.innerHTML = `
      <section class="work-detail-error">
        <h1>Project not found.</h1>
        <a href="/work/">Explore all work ↗</a>
      </section>
    `;

    return false;
  }

  ensureCanonical(project);

  main.replaceChildren(
    createHero(project),
    createGallery(project)
  );

  return true;
}

/* Hero motion */

function initHeroMotion() {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const copy = document.querySelector(".work-detail-hero__copy");
    const ape = document.querySelector(".work-detail__ape");

    if (copy) {
      gsap.fromTo(
        copy.children,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: .7,
          stagger: .09,
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
          duration: .85,
          delay: .15,
          ease: "power2.out"
        }
      );
    }
  });
}

/* Mascot interaction */

function initHeroApe() {
  const ape = document.querySelector(".work-detail__ape");
  const aura = ape?.querySelector(".work-detail__ape-aura");

  if (!ape || !aura) return;

  ape.addEventListener("click", () => {
    if (motionPreference.matches) return;

    gsap.fromTo(
      aura,
      { opacity: 1, scale: .9 },
      {
        opacity: .7,
        scale: 1.12,
        duration: .7,
        ease: "power2.out",
        overwrite: true
      }
    );
  });
}

/* Gallery entrance */

function initGalleryMotion() {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const header = document.querySelector(".work-gallery__header");
    const cleanups = [];

    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: .65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 92%",
            once: true
          }
        }
      );
    }

    document.querySelectorAll(".work-gallery__item").forEach((item) => {
      const image = item.querySelector("img");

      let tween = null;
      let trigger = null;
      let revealed = false;

      const reveal = () => {
        if (revealed || item.classList.contains("is-missing")) return;

        revealed = true;

        tween = gsap.fromTo(
          item,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: .65,
            ease: "power3.out",
            clearProps: "opacity,transform"
          }
        );
      };

      const prepare = () => {
        if (
          trigger ||
          revealed ||
          !image?.naturalWidth ||
          item.classList.contains("is-missing")
        ) {
          return;
        }

        trigger = ScrollTrigger.create({
          trigger: item,
          start: "top 96%",
          once: true,
          onEnter: reveal
        });
      };

      item.revealWhenReady = prepare;
      prepare();

      cleanups.push(() => {
        delete item.revealWhenReady;
        trigger?.kill();
        tween?.kill();

        gsap.set(item, {
          clearProps: "opacity,transform"
        });
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });
}

/* Gallery pointer depth */

function initGalleryPointerMotion() {
  const media = gsap.matchMedia();

  media.add(
    "(min-width: 1101px) and (hover: hover) and " +
    "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      const cleanups = [];

      document.querySelectorAll(".work-gallery__image").forEach((frame) => {
        function move(event) {
          if (event.pointerType === "touch") return;

          const rect = frame.getBoundingClientRect();

          if (!rect.width || !rect.height) return;

          const x = (event.clientX - rect.left) / rect.width - .5;
          const y = (event.clientY - rect.top) / rect.height - .5;

          gsap.to(frame, {
            rotationY: x * 2.5,
            rotationX: y * -2.5,
            y: -3,
            transformPerspective: 1000,
            duration: .3,
            ease: "power3.out",
            overwrite: "auto"
          });
        }

        function leave() {
          gsap.to(frame, {
            rotationX: 0,
            rotationY: 0,
            y: 0,
            duration: .45,
            ease: "power3.out",
            overwrite: "auto"
          });
        }

        frame.addEventListener("pointermove", move);
        frame.addEventListener("pointerleave", leave);

        cleanups.push(() => {
          frame.removeEventListener("pointermove", move);
          frame.removeEventListener("pointerleave", leave);

          gsap.killTweensOf(frame);
          gsap.set(frame, { clearProps: "transform" });
        });
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    }
  );
}

/* Footer */

function initFooter() {
  const year = document.getElementById("ape-footer-year");
  const top = document.querySelector(".site-footer__top-link");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  top?.addEventListener("click", (event) => {
    if (isModifiedClick(event)) return;

    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: motionPreference.matches ? "auto" : "smooth"
    });
  });
}

/* Start */

function start() {
  if (!renderShell()) return;

  initHeader();

  const projectReady = buildProjectPage();

  initFooter();

  if (projectReady) {
    initHeroApe();
    initHeroMotion();
    initGalleryMotion();
    initGalleryPointerMotion();
  }

  requestRefresh();

  document.fonts?.ready.then(requestRefresh);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

window.addEventListener("load", requestRefresh, { once: true });