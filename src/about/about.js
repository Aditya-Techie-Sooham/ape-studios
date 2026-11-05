import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader } from "../header/header.js";
import { team } from "../team/team-data.js";
import { initHeroMascotInteraction } from "../shared/hero-mascot.js";


gsap.registerPlugin(ScrollTrigger);

const motionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const reducedMotion = () => motionPreference.matches;

const scrollBehavior = () => (
  reducedMotion() ? "auto" : "smooth"
);

/* Build team */

function buildTeam() {
  const track = document.getElementById("about-team-track");

  if (!track) return;

  const fragment = document.createDocumentFragment();

  team.forEach((member, index) => {
    const card = document.createElement("article");

    card.className = "about-team-card";
    card.dataset.index = String(index);

    card.innerHTML = `
      <div class="about-team-card__focus">
        <div class="about-team-card__surface">
          <figure class="about-team-card__portrait">
            <img
              loading="${index < 3 ? "eager" : "lazy"}"
              decoding="async"
              draggable="false"
            >
          </figure>

          <div class="about-team-card__meta">
            <p></p>
            <h3></h3>
          </div>
        </div>
      </div>
    `;

    const image = card.querySelector("img");

    image.alt = member.name;
    image.addEventListener("error", () => {
      card.classList.add("is-image-missing");
    }, { once: true });
    image.src = member.image;

    card.querySelector(".about-team-card__meta p").textContent =
      member.role;

    card.querySelector("h3").textContent = member.name;

    fragment.append(card);
  });

  track.replaceChildren(fragment);
}

/* Hero */

function initHero() {
  const hero = document.querySelector(".about-hero");

  if (!hero) return;

  const content = hero.querySelector(".about-hero__content");
  const visual = hero.querySelector(".about-hero__visual");
  const ape = hero.querySelector(".about-hero__ape");
  const aura = hero.querySelector(".about-hero__ape-aura");

  if (!reducedMotion()) {
    if (content) {
      const targets = [
        content.querySelector(".about-breadcrumb"),
        ...content.querySelectorAll(".about-hero__title-line"),
        content.querySelector(".about-hero__lead"),
        content.querySelector(".about-hero__actions")
      ].filter(Boolean);

      gsap.fromTo(
        targets,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out"
        }
      );
    }

    if (visual) {
      gsap.fromTo(
        visual,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.85,
          delay: 0.15,
          ease: "power2.out"
        }
      );
    }
  }

  if (!ape) return;

  ape.setAttribute(
    "aria-label",
    "Activate the APE Studio mascot glow"
  );

  ape.addEventListener("click", () => {
    if (!aura || reducedMotion()) return;

    gsap.fromTo(
      aura,
      { opacity: 1, scale: 0.92 },
      {
        opacity: 0.62,
        scale: 1.12,
        duration: 0.75,
        ease: "power2.out",
        overwrite: true
      }
    );
  });
}

/* Introduction */

function initIntroReveal() {
  const section = document.querySelector(".about-intro");

  if (!section || reducedMotion()) return;

  const eyebrow = section.querySelector(".about-section-eyebrow");
  const heading = section.querySelector(".about-intro__heading");
  const paragraphs = section.querySelectorAll(".about-intro__copy p");

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 90%",
      toggleActions: "play none none reverse"
    }
  });

  if (eyebrow) {
    timeline.fromTo(
      eyebrow,
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, duration: 0.36 }
    );
  }

  if (heading) {
    timeline.fromTo(
      heading,
      {
        opacity: 0,
        x: -60,
        clipPath: "inset(0 100% 0 0)"
      },
      {
        opacity: 1,
        x: 0,
        clipPath: "inset(0 0% 0 0)",
        duration: 0.82,
        ease: "power4.out"
      },
      "-=0.12"
    );
  }

  if (paragraphs.length) {
    timeline.fromTo(
      paragraphs,
      { opacity: 0, x: 42 },
      {
        opacity: 1,
        x: 0,
        duration: 0.62,
        stagger: 0.1,
        ease: "power3.out"
      },
      "-=0.48"
    );
  }
}

/* Team carousel */

function initTeam() {
  const section = document.getElementById("about-team");
  const viewport = document.getElementById("about-team-viewport");
  const cards = [...document.querySelectorAll(".about-team-card")];
  const previous = document.getElementById("about-team-prev");
  const next = document.getElementById("about-team-next");
  const progress = document.getElementById("about-team-progress");

  if (!section || !viewport || !cards.length) return;

  let activeIndex = 0;
  let previousActiveIndex = -1;
  let animationFrame = null;
  let dragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let hoveredCard = null;

  function getMaximumScroll() {
    return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  }

  function getMemberLeft(index) {
    const card = cards[index];

    if (!card) return 0;

    const viewportRect = viewport.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    return (
      viewport.scrollLeft +
      cardRect.left -
      viewportRect.left -
      (viewport.clientWidth - cardRect.width) / 2
    );
  }

  function scrollToMember(index, behavior = scrollBehavior()) {
    const safeIndex = Math.max(
      0,
      Math.min(cards.length - 1, index)
    );

    viewport.scrollTo({
      left: Math.max(
        0,
        Math.min(getMaximumScroll(), getMemberLeft(safeIndex))
      ),
      behavior
    });
  }

  function updateActive() {
    animationFrame = null;

    const viewportRect = viewport.getBoundingClientRect();
    const centre = viewportRect.left + viewportRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - centre);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    activeIndex = closestIndex;

    cards.forEach((card, index) => {
      card.classList.toggle("is-active", index === activeIndex);
    });

    if (activeIndex !== previousActiveIndex) {
      const activeCard = cards[activeIndex];
      const focus = activeCard.querySelector(".about-team-card__focus");
      const meta = activeCard.querySelector(".about-team-card__meta");

      if (!reducedMotion()) {
        if (focus) {
          gsap.fromTo(
            focus,
            { scale: 0.96 },
            {
              scale: 1,
              duration: 0.42,
              ease: "power3.out",
              overwrite: true
            }
          );
        }

        if (meta) {
          gsap.fromTo(
            meta,
            { opacity: 0.6 },
            {
              opacity: 1,
              duration: 0.36,
              ease: "power2.out",
              overwrite: true
            }
          );
        }
      }

      previousActiveIndex = activeIndex;
    }

    if (progress) {
      const maximum = getMaximumScroll();
      const ratio = maximum > 0 ? viewport.scrollLeft / maximum : 0;

      gsap.set(progress, {
        scaleX: Math.max(0, Math.min(1, ratio))
      });
    }

    if (previous) previous.disabled = activeIndex === 0;
    if (next) next.disabled = activeIndex === cards.length - 1;
  }

  function requestUpdate() {
    if (animationFrame !== null) return;

    animationFrame = requestAnimationFrame(updateActive);
  }

  function centreFirstMember() {
    scrollToMember(0, "auto");
    activeIndex = 0;
    previousActiveIndex = -1;
    requestUpdate();
  }

  requestAnimationFrame(centreFirstMember);

  window.addEventListener("load", centreFirstMember, { once: true });

  viewport.addEventListener("scroll", requestUpdate, { passive: true });

  window.addEventListener("resize", () => {
    scrollToMember(activeIndex, "auto");
    requestUpdate();
  });

  previous?.addEventListener("click", () => {
    scrollToMember(activeIndex - 1);
  });

  next?.addEventListener("click", () => {
    scrollToMember(activeIndex + 1);
  });

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      hoveredCard = card;
      viewport.classList.add("is-wheel-active");
    });

    card.addEventListener("mouseleave", () => {
      if (hoveredCard === card) hoveredCard = null;
      viewport.classList.remove("is-wheel-active");
    });
  });

  viewport.addEventListener("wheel", (event) => {
    if (!hoveredCard || event.ctrlKey) return;

    const maximum = getMaximumScroll();
    const current = viewport.scrollLeft;

    let movement = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

    if (event.deltaMode === 1) movement *= 16;
    if (event.deltaMode === 2) movement *= viewport.clientWidth;

    if (
      maximum <= 1 ||
      (current <= 1 && movement < 0) ||
      (current >= maximum - 1 && movement > 0)
    ) {
      return;
    }

    event.preventDefault();
    viewport.scrollLeft += movement * 2.15;
    requestUpdate();
  }, { passive: false });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" || event.button !== 0) return;

    dragging = true;
    dragStartX = event.clientX;
    dragStartScroll = viewport.scrollLeft;

    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    viewport.scrollLeft =
      dragStartScroll - (event.clientX - dragStartX);
  });

  function finishDragging(event) {
    if (!dragging) return;

    dragging = false;
    viewport.classList.remove("is-dragging");

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }

    updateActive();
    scrollToMember(activeIndex);
  }

  viewport.addEventListener("pointerup", finishDragging);
  viewport.addEventListener("pointercancel", finishDragging);

  /* Team entrance */

  if (!reducedMotion()) {
    const eyebrow = section.querySelector(".about-team__eyebrow");
    const heading = section.querySelector(".about-team__header h2");
    const intro = section.querySelector(".about-team__intro");

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 88%",
        toggleActions: "play none none reverse"
      }
    });

    if (eyebrow) {
      timeline.fromTo(
        eyebrow,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.36 }
      );
    }

    if (heading) {
      timeline.fromTo(
        heading,
        {
          opacity: 0,
          x: -70,
          clipPath: "inset(0 100% 0 0)"
        },
        {
          opacity: 1,
          x: 0,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.82,
          ease: "power4.out"
        },
        "-=0.15"
      );
    }

    if (intro) {
      timeline.fromTo(
        intro,
        { opacity: 0, x: 35 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: "power3.out"
        },
        "-=0.42"
      );
    }

    timeline.fromTo(
      cards,
      { opacity: 0, scale: 0.93 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.035,
        ease: "power3.out"
      },
      "-=0.28"
    );
  }

  /* Team hover */

  const media = gsap.matchMedia();

  media.add(
    "(hover: hover) and (pointer: fine) and " +
    "(prefers-reduced-motion: no-preference)",
    () => {
      const cleanups = [];

      cards.forEach((card) => {
        const surface = card.querySelector(".about-team-card__surface");
        const image = card.querySelector("img");

        if (!surface) return;

        function move(event) {
          if (dragging) return;

          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;

          gsap.to(surface, {
            rotateY: (x - 0.5) * 4,
            rotateX: (0.5 - y) * 3,
            duration: 0.3,
            ease: "power3.out",
            overwrite: true
          });

          if (image) {
            gsap.to(image, {
              scale: 1.035,
              duration: 0.4,
              ease: "power3.out",
              overwrite: true
            });
          }
        }

        function leave() {
          gsap.to(surface, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.42,
            ease: "power3.out",
            overwrite: true
          });

          if (image) {
            gsap.to(image, {
              scale: 1,
              duration: 0.45,
              ease: "power3.out",
              overwrite: true
            });
          }
        }

        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);

        cleanups.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);

          gsap.killTweensOf(surface);
          gsap.set(surface, { clearProps: "transform" });

          if (image) {
            gsap.killTweensOf(image);
            gsap.set(image, { clearProps: "transform" });
          }
        });
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    }
  );
}

/* Beliefs */

function initBeliefReveals() {
  if (reducedMotion()) return;

  document.querySelectorAll(".about-belief__statement")
    .forEach((statement, index) => {
      const heading = statement.querySelector("h2");
      const paragraph = statement.querySelector("p");
      const direction = index % 2 === 0 ? -55 : 55;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: statement,
          start: "top 88%",
          toggleActions: "play none none reverse"
        }
      });

      if (heading) {
        timeline.fromTo(
          heading,
          {
            opacity: 0,
            x: direction,
            clipPath: direction < 0
              ? "inset(0 100% 0 0)"
              : "inset(0 0 0 100%)"
          },
          {
            opacity: 1,
            x: 0,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.82,
            ease: "power4.out"
          }
        );
      }

      if (paragraph) {
        timeline.fromTo(
          paragraph,
          { opacity: 0, x: index % 2 === 0 ? 35 : -35 },
          {
            opacity: 1,
            x: 0,
            duration: 0.56,
            ease: "power3.out"
          },
          "-=0.42"
        );
      }
    });
}

/* Features */

function initFeatureReveals() {
  if (reducedMotion()) return;

  document.querySelectorAll(".about-feature").forEach((section, index) => {
    const eyebrow = section.querySelector(".about-section-eyebrow");
    const heading = section.querySelector(".about-feature__copy h2");
    const description = section.querySelector(".about-feature__description");
    const media = section.querySelector(".about-feature__media");
    const reveal = section.querySelector(".about-feature__media-reveal");

    const mediaElement = section.querySelector(
      ".about-feature__media img, .about-feature__media video"
    );

    const copyDirection = index % 2 === 0 ? -42 : 42;
    const mediaDirection = index % 2 === 0 ? 60 : -60;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 88%",
        toggleActions: "play none none reverse"
      }
    });

    if (eyebrow) {
      timeline.fromTo(
        eyebrow,
        { opacity: 0, x: copyDirection },
        { opacity: 1, x: 0, duration: 0.34 }
      );
    }

    if (heading) {
      timeline.fromTo(
        heading,
        {
          opacity: 0,
          x: copyDirection,
          clipPath: copyDirection < 0
            ? "inset(0 100% 0 0)"
            : "inset(0 0 0 100%)"
        },
        {
          opacity: 1,
          x: 0,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.78,
          ease: "power4.out"
        },
        "-=0.12"
      );
    }

    if (description) {
      timeline.fromTo(
        description,
        { opacity: 0, x: copyDirection * 0.7 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power3.out"
        },
        "-=0.4"
      );
    }

    if (media) {
      timeline.fromTo(
        media,
        { opacity: 0, x: mediaDirection, scale: 0.975 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.82,
          ease: "power4.out"
        },
        "-=0.68"
      );
    }

    if (reveal) {
      timeline.fromTo(
        reveal,
        { xPercent: 0 },
        {
          xPercent: 102,
          duration: 0.88,
          ease: "power4.inOut"
        },
        "-=0.78"
      );
    }

    if (media && mediaElement) {
      gsap.fromTo(
        mediaElement,
        { scale: 1.055, yPercent: -2.5 },
        {
          scale: 1.055,
          yPercent: 2.5,
          ease: "none",
          scrollTrigger: {
            trigger: media,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        }
      );
    }
  });
}

/* Navigation */

function initHeroCTA() {
  const button = document.querySelector(
    '.about-hero__primary[href="#about-team"]'
  );

  const target = document.getElementById("about-team");

  if (!button || !target) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();

    target.scrollIntoView({
      behavior: scrollBehavior(),
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
      behavior: scrollBehavior()
    });
  });
}

/* Start */

function start() {
  initHeader();
  buildTeam();
  initHero();
  initHeroCTA();
  initHeroMascotInteraction();
  initIntroReveal();
  initTeam();
  initBeliefReveals();
  initFeatureReveals();
  initFooter();

  requestAnimationFrame(() => ScrollTrigger.refresh());

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