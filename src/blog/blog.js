import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader } from "../header/header.js";
import { BLOGS } from "./blog-data.js";

gsap.registerPlugin(ScrollTrigger);

const motionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

/* Helpers */

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className || "";

  if (text !== undefined) node.textContent = text;

  return node;
}

function coverImage(blog) {
  return blog.images?.[0] || blog.image || "";
}

function articleURL(blog) {
  return `/blog/${encodeURIComponent(blog.slug)}/`;
}

function excerpt(blog, length = 175) {
  const text = blog.excerpt || blog.content?.[0] || "";

  return text.length <= length
    ? text
    : `${text.slice(0, length).trimEnd()}…`;
}

function modifiedClick(event) {
  return event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey;
}

let refreshFrame = null;

function refreshLayout() {
  if (refreshFrame !== null) return;

  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = null;
    ScrollTrigger.refresh();
  });
}

/* Breadcrumb */

function initBreadcrumb() {
  const copy = document.querySelector(".blog-hero__copy");

  if (!copy) return;

  copy.querySelector(".blog-hero__eyebrow")?.remove();

  if (copy.querySelector(".blog-breadcrumb")) return;

  const nav = element("nav", "blog-breadcrumb");
  nav.setAttribute("aria-label", "Breadcrumb");

  nav.innerHTML = `
    <ol>
      <li><a href="/">Home</a></li>
      <li><span aria-current="page">Blog</span></li>
    </ol>
  `;

  copy.prepend(nav);
}

/* Post content */

function createImageLink(blog, className, eager = false) {
  const link = element("a", className);
  const image = document.createElement("img");

  link.href = articleURL(blog);
  link.setAttribute("aria-label", `Read ${blog.heading}`);

  image.alt = blog.heading;
  image.loading = eager ? "eager" : "lazy";
  image.decoding = "async";
  image.addEventListener("load", refreshLayout, { once: true });
  image.addEventListener("error", refreshLayout, { once: true });
  image.src = coverImage(blog);

  link.append(image);

  return link;
}

function createPostContent(blog, featured = false) {
  const prefix = featured ? "blog-featured" : "blog-card";
  const content = element("div", `${prefix}__content`);

  const label = element(
    "p",
    featured ? "blog-featured__label" : "blog-card__eyebrow",
    featured ? "Featured insight" : "APE Journal"
  );

  const headingLink = element("a", `${prefix}__heading-link`);
  headingLink.href = articleURL(blog);
  headingLink.append(element("h3", "", blog.heading));

  const subheading = element(
    "p",
    `${prefix}__subheading`,
    blog.subheading
  );

  const summary = element(
    "p",
    `${prefix}__excerpt`,
    excerpt(blog, featured ? 220 : 175)
  );

  const readMore = element("a", "blog-read-more", "Read Article");
  readMore.href = articleURL(blog);

  const arrow = element("span", "", "→");
  arrow.setAttribute("aria-hidden", "true");
  readMore.append(arrow);

  content.append(label, headingLink);

  if (blog.subheading) content.append(subheading);
  if (summary.textContent) content.append(summary);

  content.append(readMore);

  return content;
}

function buildPosts() {
  const featured = document.getElementById("blog-featured-content");
  const featuredSection = document.getElementById("blog-featured");
  const grid = document.getElementById("blog-grid");
  const archive = document.querySelector(".blog-archive");

  if (featured && BLOGS[0]) {
    const inner = element("div", "blog-featured__inner");

    inner.append(
      createImageLink(BLOGS[0], "blog-featured__visual", true),
      createPostContent(BLOGS[0], true)
    );

    featured.replaceChildren(inner);
  }

  if (featuredSection) featuredSection.hidden = !BLOGS.length;
  if (archive) archive.hidden = BLOGS.length <= 1;

  if (!grid) return;

  const fragment = document.createDocumentFragment();

  BLOGS.slice(1).forEach((blog) => {
    const card = element("article", "blog-card");

    card.append(
      createImageLink(blog, "blog-card__visual"),
      createPostContent(blog)
    );

    fragment.append(card);
  });

  grid.replaceChildren(fragment);
}

/* Mascots */

function initMascot(selector, prefix) {
  const button = document.querySelector(selector);

  if (!button) return;

  button.setAttribute("aria-label", "Activate the APE Studio mascot glow");

  button.addEventListener("click", () => {
    if (motionPreference.matches) return;

    const aura = button.querySelector(`.${prefix}-aura`);
    const pulse = button.querySelector(`.${prefix}-pulse`);

    if (aura) {
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
    }

    if (pulse) {
      gsap.fromTo(
        pulse,
        { opacity: .6, scale: .75 },
        {
          opacity: 0,
          scale: 1.35,
          duration: .7,
          ease: "power2.out",
          overwrite: true
        }
      );
    }
  });
}

/* Motion */

function initMotion() {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const copy = document.querySelector(".blog-hero__copy");
    const ape = document.querySelector(".blog-hero__ape");

    if (copy) {
      gsap.fromTo(
        copy.children,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: .65,
          stagger: .09,
          ease: "power3.out"
        }
      );
    }

    if (ape) {
      gsap.fromTo(
        ape,
        { opacity: 0 },
        { opacity: 1, duration: .85, delay: .15 }
      );
    }

    document.querySelectorAll(
      ".blog-featured__top, .blog-featured__inner, " +
      ".blog-archive__header, .blog-card"
    ).forEach((target) => {
      gsap.fromTo(
        target,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: .7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target,
            start: "top 94%",
            once: true
          }
        }
      );
    });
  });

  media.add(
    "(min-width:1101px) and (hover:hover) and " +
    "(pointer:fine) and (prefers-reduced-motion:no-preference)",
    () => {
      const cleanups = [];

      document.querySelectorAll(
        ".blog-featured__visual, .blog-card__visual"
      ).forEach((visual) => {
        function move(event) {
          if (event.pointerType === "touch") return;

          const rect = visual.getBoundingClientRect();

          if (!rect.width || !rect.height) return;

          gsap.to(visual, {
            rotationY: ((event.clientX - rect.left) / rect.width - .5) * 4,
            rotationX: ((event.clientY - rect.top) / rect.height - .5) * -4,
            transformPerspective: 1000,
            y: -3,
            duration: .35,
            overwrite: "auto"
          });
        }

        function leave() {
          gsap.to(visual, {
            rotationX: 0,
            rotationY: 0,
            y: 0,
            duration: .45,
            overwrite: "auto"
          });
        }

        visual.addEventListener("pointermove", move);
        visual.addEventListener("pointerleave", leave);

        cleanups.push(() => {
          visual.removeEventListener("pointermove", move);
          visual.removeEventListener("pointerleave", leave);
          gsap.killTweensOf(visual);
          gsap.set(visual, { clearProps: "transform" });
        });
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    }
  );
}

/* Navigation */

function initNavigation() {
  const jump = document.querySelector(".blog-hero__jump");
  const target = document.getElementById("blog-featured");
  const top = document.querySelector(".site-footer__top-link");
  const year = document.getElementById("ape-footer-year");

  if (year) year.textContent = String(new Date().getFullYear());

  if (jump && target) {
    jump.addEventListener("click", (event) => {
      if (modifiedClick(event)) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: motionPreference.matches ? "auto" : "smooth",
        block: "start"
      });
    });
  }

  top?.addEventListener("click", (event) => {
    if (modifiedClick(event)) return;

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
  buildPosts();
  initMascot(".blog-hero__ape", "blog-hero__ape");
  initMascot(".blog-archive__ape", "blog-archive__ape");
  initNavigation();
  initMotion();
  refreshLayout();
  document.fonts?.ready.then(refreshLayout);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

window.addEventListener("load", refreshLayout, { once: true });