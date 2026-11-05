import gsap from "gsap";
import { initHeader } from "../header/header.js";

function initContactForm() {
  const form = document.getElementById("ape-contact-form");
  const submit = document.getElementById("contact-submit");
  const status = document.getElementById("contact-form-status");
  let frame = document.getElementById("contact-form-frame");

  if (!form || !submit || !status || !frame) return;

  let pending = false;
  let timeout = 0;
  let attempt = 0;

  function fillTrackingFields() {
    const params = new URLSearchParams(window.location.search);

    const tracking = {
      "contact-page-url": window.location.href,
      "contact-referrer": document.referrer,
      "contact-utm-source": params.get("utm_source") ?? "",
      "contact-utm-medium": params.get("utm_medium") ?? "",
      "contact-utm-campaign": params.get("utm_campaign") ?? "",
    };

    for (const [id, value] of Object.entries(tracking)) {
      const field = document.getElementById(id);
      if (field) field.value = value;
    }
  }

  function showStatus(message, isError = false) {
    status.classList.toggle("is-error", isError);
    status.textContent = message;
  }

  function finish(message, isError = false) {
    window.clearTimeout(timeout);
    pending = false;
    submit.disabled = false;
    showStatus(message, isError);
  }

  fillTrackingFields();

  form.addEventListener("submit", (event) => {
    if (pending) {
      event.preventDefault();
      return;
    }

    fillTrackingFields();

    // A fresh target prevents a late response from an earlier attempt
    // from clearing the current submission state.
    const nextFrame = frame.cloneNode(false);
    nextFrame.name = `contact-form-response-${++attempt}`;

    nextFrame.addEventListener("load", () => {
      if (!pending || frame !== nextFrame) return;

      try {
        if (!nextFrame.contentWindow ||
            nextFrame.contentWindow.location.href === "about:blank") {
          return;
        }
      } catch {
        // The Google response is cross-origin. Its contents can't be read here.
      }

      finish("We couldn’t confirm receipt. Your details are still here. You can reach us on WhatsApp for confirmation.");
    });

    frame.replaceWith(nextFrame);
    frame = nextFrame;
    form.target = nextFrame.name;

    pending = true;
    submit.disabled = true;
    showStatus("Sending your enquiry…");

    timeout = window.setTimeout(() => {
      finish("We didn’t receive a confirmation. Your details are still here. You can also reach us on WhatsApp.", true);
    }, 25000);
  });
}

function initContactMotion() {
  const parts = gsap.utils.toArray(
    ".contact-hero__headline, .contact-hero__details",
  );

  if (!parts.length) return;

  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(parts, {
      y: 10,
      duration: 0.5,
      stagger: 0.06,
      ease: "power3.out",
      clearProps: "transform",
    });
  });
}

function initContactPage() {
  initHeader();
  initContactForm();
  initContactMotion();

  const year = document.getElementById("ape-footer-year");
  if (year) year.textContent = String(new Date().getFullYear());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactPage, { once: true });
} else {
  initContactPage();
}