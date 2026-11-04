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

const desktopDirectory = window.matchMedia(
  "(min-width: 1101px)"
);

const PREVIEW_LABELS = {
  "digital-marketing": "DIGITAL / PERFORMANCE / CONTENT",
  printables: "PRINT / PACKAGING / OFFLINE",
  branding: "IDENTITY / POSITIONING / SYSTEMS",
  "influencer-marketing": "CREATORS / REACH / RELEVANCE",
  "visual-studio": "PHOTO / FILM / REELS"
};

/* Images */

function getCoverImage(service) {
  return service?.subservices?.[0]?.images?.[0] || "";
}

function prepareCardImages(rows) {
  rows.forEach((row) => {
    const service = SERVICE_PAGES[row.dataset.service];
    const image = row.querySelector(".capability-row__media img");
    const source = getCoverImage(service);

    if (image && source) {
      image.src = source;
    }
  });
}

/* Directory */

function initCapabilities() {
  const rows = [...document.querySelectorAll(".capability-row")];
  const image = document.getElementById("service-preview-image");
  const title = document.getElementById("service-preview-title");
  const eyebrow = document.getElementById("service-preview-eyebrow");
  const frame = document.getElementById("capability-preview-frame");

  if (!rows.length || !image || !frame) {
    return;
  }

  prepareCardImages(rows);

  const imageCache = new Map();

  let activeRow = rows.find((row) => row.classList.contains("is-active"));
  let requestId = 0;
  let imageTimeline = null;

  function loadImage(source) {
    if (!imageCache.has(source)) {
      const promise = new Promise((resolve) => {
        const asset = new Image();

        asset.onload = () => resolve(true);
        asset.onerror = () => resolve(false);
        asset.src = source;
      });

      imageCache.set(source, promise);
    }

    return imageCache.get(source);
  }

  function getDetails(row) {
    const service = SERVICE_PAGES[row.dataset.service];
    const link = row.querySelector(".capability-row__arrow");
    const cardImage = row.querySelector(".capability-row__media img");

    return {
      label:
        service?.navLabel ||
        row.querySelector("h3")?.textContent.trim() ||
        "APE Studio service",

      eyebrow:
        PREVIEW_LABELS[row.dataset.service] ||
        service?.eyebrow ||
        "",

      source:
        getCoverImage(service) ||
        cardImage?.getAttribute("src") ||
        "/ape-logo.png",

      href: link?.getAttribute("href") || "/services/"
    };
  }

  function updatePreview(details, source) {
    image.src = source;
    image.alt = `${details.label} work by APE Studio`;

    frame.setAttribute("href", details.href);
    frame.setAttribute(
      "aria-label",
      `Explore ${details.label} services`
    );

    if (title) {
      title.textContent = details.label;
    }

    if (eyebrow) {
      eyebrow.textContent = details.eyebrow;
    }
  }

  async function activate(row, animate = true, force = false) {
    if (!row || (row === activeRow && !force)) {
      return;
    }

    activeRow = row;
    const currentRequest = ++requestId;
    const details = getDetails(row);

    rows.forEach((current) => {
      current.classList.toggle("is-active", current === row);
    });

    if (imageTimeline) {
      imageTimeline.kill();
      imageTimeline = null;
    }

    gsap.killTweensOf(image);
    gsap.set(image, { opacity: 1, scale: 1 });

    const loaded = await loadImage(details.source);

    if (currentRequest !== requestId) {
      return;
    }

    const source = loaded ? details.source : "/ape-logo.png";

    if (
      !animate ||
      motionPreference.matches ||
      !desktopDirectory.matches
    ) {
      updatePreview(details, source);
      return;
    }

    imageTimeline = gsap.timeline();

    imageTimeline
      .to(image, {
        opacity: 0,
        scale: 1.025,
        duration: 0.14,
        ease: "power2.in",
        onComplete: () => {
          updatePreview(details, source);
        }
      })
      .fromTo(
        image,
        { opacity: 0, scale: 1.055 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power3.out"
        }
      );
  }

  rows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      if (desktopDirectory.matches) {
        activate(row);
      }
    });

    row.addEventListener("focusin", () => {
      if (desktopDirectory.matches) {
        activate(row);
      }
    });

    row.addEventListener("click", (event) => {
      if (
        desktopDirectory.matches &&
        !event.target.closest("a")
      ) {
        activate(row);
      }
    });

    row.addEventListener("keydown", (event) => {
      if (
        desktopDirectory.matches &&
        event.target === row &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        activate(row);
      }
    });
  });

  function updateDirectoryMode() {
    rows.forEach((row) => {
      if (desktopDirectory.matches) {
        row.setAttribute("tabindex", "0");
      } else {
        row.removeAttribute("tabindex");
      }
    });

    if (desktopDirectory.matches) {
      rows.forEach((row) => {
        loadImage(getDetails(row).source);
      });
    }

    activate(activeRow || rows[0], false, true);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }

  desktopDirectory.addEventListener("change", updateDirectoryMode);
  updateDirectoryMode();

  initPreviewTilt(frame);
}

/* Preview tilt */

function initPreviewTilt(frame) {
  const media = gsap.matchMedia();

  media.add(
    "(min-width: 1101px) and (prefers-reduced-motion: no-preference)",
    () => {
      function movePreview(event) {
        if (event.pointerType === "touch") {
          return;
        }

        const rect = frame.getBoundingClientRect();

        if (!rect.width || !rect.height) {
          return;
        }

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(frame, {
          rotationY: x * 4,
          rotationX: y * -4,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto"
        });
      }

      function resetPreview() {
        gsap.to(frame, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto"
        });
      }

      frame.addEventListener("pointermove", movePreview);
      frame.addEventListener("pointerleave", resetPreview);
      frame.addEventListener("blur", resetPreview);

      return () => {
        frame.removeEventListener("pointermove", movePreview);
        frame.removeEventListener("pointerleave", resetPreview);
        frame.removeEventListener("blur", resetPreview);

        gsap.killTweensOf(frame);
        gsap.set(frame, { clearProps: "transform" });
      };
    }
  );
}

/* Mascot */

function initHeroApe() {
  const ape = document.querySelector(".services-hero__ape");
  const aura = ape?.querySelector(".services-hero__ape-aura");

  if (!ape || !aura) {
    return;
  }

  ape.addEventListener("click", () => {
    if (motionPreference.matches) {
      return;
    }

    gsap.fromTo(
      aura,
      { opacity: 1, scale: 1.12 },
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

/* Entrance motion */

function initMotion() {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const lines = gsap.utils.toArray(".services-hero__title-line");
    const copy = document.querySelector(".services-hero__copy");
    const cta = document.querySelector(".services-hero__cta");
    const ape = document.querySelector(".services-hero__ape");

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    if (lines.length) {
      timeline.from(lines, {
        opacity: 0,
        y: 24,
        duration: 0.65,
        stagger: 0.07
      });
    }

    if (copy) {
      timeline.from(
        copy,
        { opacity: 0, y: 14, duration: 0.5 },
        "-=0.35"
      );
    }

    if (cta) {
      timeline.from(
        cta,
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

    const targets = document.querySelectorAll(
      ".capabilities__heading, .capabilities__intro, .capability-row"
    );

    targets.forEach((target) => {
      gsap.from(target, {
        opacity: 0,
        y: 22,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: target,
          start: "top 94%",
          once: true
        }
      });
    });
  });
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

function initPageNavigation() {
  const cta = document.querySelector(".services-hero__cta");
  const capabilities = document.getElementById("capabilities");
  const topLink = document.querySelector(".site-footer__top-link");

  if (cta && capabilities) {
    cta.addEventListener("click", (event) => {
      if (isModifiedClick(event)) {
        return;
      }

      event.preventDefault();

      capabilities.scrollIntoView({
        behavior: motionPreference.matches ? "auto" : "smooth",
        block: "start"
      });
    });
  }

  if (topLink) {
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

/* Start */

function start() {
  initHeader();
  initCapabilities();
  initHeroApe();
  initPageNavigation();
  initFooter();
  initMotion();

  if (document.fonts) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

window.addEventListener(
  "load",
  () => ScrollTrigger.refresh(),
  { once: true }
);