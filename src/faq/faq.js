import gsap from "gsap";
import { initHeader } from "../header/header.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const wideGuide = window.matchMedia("(min-width: 900px)");

function initAccordion(onLayoutChange) {
  const entries = [...document.querySelectorAll(".faq-item")].flatMap((item) => {
    const button = item.querySelector(".faq-item__button");
    const answer = item.querySelector(".faq-item__answer");

    return button && answer ? [{ item, button, answer }] : [];
  });

  let current = null;

  function setExpanded(entry, expanded) {
    const { item, button, answer } = entry;

    gsap.killTweensOf(answer);

    // Preserve the current height if a visitor clicks during a transition.
    const from = answer.hidden ? 0 : answer.getBoundingClientRect().height;

    if (!expanded && answer.contains(document.activeElement)) {
      button.focus({ preventScroll: true });
    }

    button.setAttribute("aria-expanded", String(expanded));
    item.classList.toggle("is-open", expanded);
    answer.inert = !expanded;

    function finish() {
      answer.hidden = !expanded;
      gsap.set(answer, { clearProps: "height" });
      onLayoutChange();
    }

    if (reducedMotion.matches) {
      finish();
      return;
    }

    answer.hidden = false;
    const to = expanded ? answer.scrollHeight : 0;

    if (Math.abs(from - to) < 1) {
      finish();
      return;
    }

    gsap.fromTo(
      answer,
      { height: from },
      {
        height: to,
        duration: expanded ? 0.35 : 0.25,
        ease: "power2.out",
        onUpdate: onLayoutChange,
        onComplete: finish,
      },
    );
  }

  entries.forEach((entry) => {
    const { button, answer, item } = entry;

    button.setAttribute("aria-expanded", "false");
    item.classList.remove("is-open");
    answer.hidden = true;
    answer.inert = true;

    button.addEventListener("click", () => {
      const previous = current;
      current = previous === entry ? null : entry;

      if (previous) setExpanded(previous, false);
      if (current) setExpanded(current, true);
    });
  });
}

function initGuide() {
  const track = document.querySelector(".faq-guide__track");
  const character = document.querySelector(".faq-guide__character");
  const buttons = [...document.querySelectorAll(".faq-item__button")];

  if (!track || !character || !buttons.length) return () => {};

  let frame = 0;
  let active = null;
  let previousY = null;

  const moveTo = gsap.quickTo(character, "y", {
    duration: 0.32,
    ease: "power2.out",
  });

  function update() {
    frame = 0;

    if (!wideGuide.matches || reducedMotion.matches) {
      active?.classList.remove("is-current");
      active = null;
      if (previousY !== null) {
        moveTo.tween.pause();
        gsap.set(character, { clearProps: "transform" });
        previousY = null;
      }
      return;
    }

    const center = window.innerHeight * 0.5;
    let nearest = null;
    let nearestCenter = 0;
    let distance = Infinity;

    for (const button of buttons) {
      const rect = button.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const delta = Math.abs(midpoint - center);

      if (delta < distance) {
        nearest = button.closest(".faq-item");
        nearestCenter = midpoint;
        distance = delta;
      }
    }

    if (nearest !== active) {
      active?.classList.remove("is-current");
      nearest?.classList.add("is-current");
      active = nearest;
    }

    const rect = track.getBoundingClientRect();
    const height = character.offsetHeight;
    const maxY = Math.max(0, rect.height - height);
    const y = Math.round(
      Math.min(maxY, Math.max(0, nearestCenter - rect.top - height / 2)),
    );

    if (previousY === null) {
      gsap.set(character, { y });
    } else if (previousY !== y) {
      moveTo(y);
    }

    previousY = y;
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("load", schedule, { once: true });
  wideGuide.addEventListener("change", schedule);
  reducedMotion.addEventListener("change", schedule);
  document.fonts?.ready.then(schedule);
  schedule();

  return schedule;
}

function initMascot(selector, auraSelector) {
  const mascot = document.querySelector(selector);
  const image = mascot?.querySelector("img");
  const aura = mascot?.querySelector(auraSelector);

  if (!mascot || !image) return;

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "faq-mascot-trigger";
  trigger.setAttribute("aria-label", "Make the APE Studio mascot react");
  gsap.set(image, { transformOrigin: "50% 100%" });

  let timeline;
  let direction = 1;

  function syncMotionPreference() {
    if (reducedMotion.matches) {
      timeline?.kill();
      gsap.killTweensOf(image);
      gsap.set(image, { clearProps: "transform,transformOrigin" });
      if (aura) gsap.set(aura, { clearProps: "opacity,transform" });
      mascot.setAttribute("aria-hidden", "true");
      trigger.remove();
      return;
    }

    gsap.set(image, { transformOrigin: "50% 100%" });
    mascot.removeAttribute("aria-hidden");
    if (!trigger.isConnected) mascot.append(trigger);
  }

  trigger.addEventListener("pointermove", (event) => {
    if (
      !finePointer.matches ||
      event.pointerType === "touch" ||
      timeline?.isActive()
    ) return;

    const rect = trigger.getBoundingClientRect();
    if (!rect.width) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;

    gsap.to(image, {
      rotation: x * 2.4,
      scaleX: 1.012,
      scaleY: 1.012,
      duration: 0.35,
      ease: "power3.out",
      overwrite: true,
    });
  });

  trigger.addEventListener("pointerleave", () => {
    if (timeline?.isActive()) return;

    gsap.to(image, {
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });
  });

  trigger.addEventListener("click", () => {
    if (reducedMotion.matches || timeline?.isActive()) return;

    gsap.killTweensOf(image);

    const side = direction;
    direction *= -1;

    timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    // A quick anticipation, a double take, and a soft landing.
    // All movement pivots from the bottom of the image.
    timeline
      .to(image, {
        rotation: -1.4 * side,
        scaleX: 1.035,
        scaleY: 0.965,
        duration: 0.14,
      })
      .to(image, {
        rotation: 4 * side,
        skewX: -1 * side,
        scaleX: 0.988,
        scaleY: 1.035,
        duration: 0.22,
        ease: "power3.out",
      })
      .to(image, {
        rotation: -3 * side,
        skewX: 0.8 * side,
        scaleX: 1.024,
        scaleY: 0.99,
        duration: 0.19,
      })
      .to(image, {
        rotation: 1.65 * side,
        skewX: -0.4 * side,
        scaleX: 0.996,
        scaleY: 1.012,
        duration: 0.2,
      })
      .to(image, {
        rotation: 0,
        skewX: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.45,
        ease: "power3.out",
      });

    if (aura) {
      timeline
        .to(aura, { opacity: 1, scale: 1.06, duration: 0.24 }, 0.1)
        .to(aura, {
          opacity: 0.7,
          scale: 1,
          duration: 0.55,
          ease: "power3.out",
        }, 0.34);
    }
  });

  reducedMotion.addEventListener("change", syncMotionPreference);
  syncMotionPreference();
}

function initHeroEntrance() {
  if (reducedMotion.matches) return;

  const copy = document.querySelector(".faq-intro__copy");
  const mascot = document.querySelector(".faq-hero-ape");

  if (copy) {
    gsap.from(copy, {
      opacity: 0,
      y: 14,
      duration: 0.55,
      ease: "power3.out",
      clearProps: "opacity,transform",
    });
  }

  if (mascot) {
    gsap.from(mascot, {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      clearProps: "opacity",
    });
  }
}

function initPageLinks() {
  const year = document.getElementById("ape-footer-year");
  if (year) year.textContent = String(new Date().getFullYear());

  const jump = document.querySelector(".faq-intro__jump");
  const faq = document.getElementById("faq-list");

  if (jump && faq) {
    jump.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      event.preventDefault();

      if (window.location.hash !== "#faq-list") {
        window.history.pushState(null, "", "#faq-list");
      }

      faq.tabIndex = -1;
      faq.focus({ preventScroll: true });
      faq.scrollIntoView({
        behavior: reducedMotion.matches ? "instant" : "smooth",
        block: "start",
      });
    });
  }

  const topLink = document.querySelector(".site-footer__top-link");
  topLink?.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? "instant" : "smooth",
    });
  });
}

function initFAQPage() {
  initHeader();

  const updateGuide = initGuide();
  initAccordion(updateGuide);
  initPageLinks();

  initMascot(".faq-hero-ape", ".faq-hero-ape__aura");
  initMascot(".faq-final__ape", ".faq-final__ape-aura");
  initHeroEntrance();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFAQPage, { once: true });
} else {
  initFAQPage();
}