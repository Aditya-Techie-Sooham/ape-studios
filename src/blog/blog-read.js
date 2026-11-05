import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeader } from "../header/header.js";
import { BLOGS } from "./blog-data.js";
import { initHeroMascotInteraction } from "../shared/hero-mascot.js";

gsap.registerPlugin(ScrollTrigger);

const SITE_ORIGIN = "https://apeindia.in";

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
  return `${SITE_ORIGIN}/blog/${encodeURIComponent(blog.slug)}/`;
}

function getSlug() {
  const query = new URLSearchParams(location.search).get("slug");

  if (query) return query;

  const parts = location.pathname.split("/").filter(Boolean);

  if (parts[0] !== "blog" || !parts[1] || parts[1] === "read") {
    return null;
  }

  try {
    return decodeURIComponent(parts[1]);
  } catch {
    return null;
  }
}

let refreshFrame = null;

function refreshLayout() {
  if (refreshFrame !== null) return;

  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = null;
    ScrollTrigger.refresh();
  });
}

/* Metadata */

function setMeta(key, value, property = false) {
  const attribute = property ? "property" : "name";

  let node = document.head.querySelector(
    `meta[${attribute}="${key}"]`
  );

  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.append(node);
  }

  node.content = value;
}

function setCanonical(url) {
  let node = document.head.querySelector('link[rel="canonical"]');

  if (!node) {
    node = document.createElement("link");
    node.rel = "canonical";
    document.head.append(node);
  }

  node.href = url;
}

function setStructuredData(id, data) {
  let node = document.getElementById(id);

  if (!node) {
    node = document.createElement("script");
    node.id = id;
    node.type = "application/ld+json";
    document.head.append(node);
  }

  node.textContent = JSON.stringify(data);
}

function updateMetadata(blog) {
  const title = `${blog.heading} | APE Studio Journal`;

  const description = blog.subheading ||
    blog.content?.[0] ||
    "Read insights from APE Studio.";

  const url = articleURL(blog);
  const source = coverImage(blog);
  const image = source ? new URL(source, SITE_ORIGIN).href : "";

  document.title = title;

  setCanonical(url);
  setMeta("description", description);

  setMeta(
    "robots",
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  );

  Object.entries({
    "og:type": "article",
    "og:site_name": "APE Studio",
    "og:locale": "en_IN",
    "og:title": title,
    "og:description": description,
    "og:url": url
  }).forEach(([key, value]) => {
    setMeta(key, value, true);
  });

  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", title);
  setMeta("twitter:description", description);

  if (image) {
    setMeta("og:image", image, true);
    setMeta("og:image:alt", blog.heading, true);
    setMeta("twitter:image", image);
    setMeta("twitter:image:alt", blog.heading);
  }

  setStructuredData("blog-structured-data", {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.heading,
    description,
    image: image || undefined,
    publisher: {
      "@type": "Organization",
      name: "APE Studio",
      url: `${SITE_ORIGIN}/`
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    }
  });

  setStructuredData("blog-breadcrumb-data", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_ORIGIN}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_ORIGIN}/blog/`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.heading,
        item: url
      }
    ]
  });
}

/* Images */

function createImage(source, alt, eager = false) {
  const image = document.createElement("img");

  image.alt = alt;
  image.loading = eager ? "eager" : "lazy";
  image.decoding = "async";
  image.addEventListener("load", refreshLayout, { once: true });
  image.addEventListener("error", refreshLayout, { once: true });
  image.src = source;

  return image;
}

/* Breadcrumb */

function buildBreadcrumb(blog) {
  const nav = element("nav", "blog-read-breadcrumb");
  nav.setAttribute("aria-label", "Breadcrumb");

  const list = document.createElement("ol");

  [
    ["/", "Home"],
    ["/blog/", "Blog"],
    [null, blog.heading]
  ].forEach(([href, label]) => {
    const item = document.createElement("li");
    const text = element(href ? "a" : "span", "", label);

    if (href) text.href = href;
    else text.setAttribute("aria-current", "page");

    item.append(text);
    list.append(item);
  });

  nav.append(list);

  return nav;
}

/* Hero */

function buildHero(blog) {
  const hero = element("header", "blog-article__hero");

  hero.id = "blog-article-hero";
  hero.setAttribute("aria-labelledby", "blog-article-title");

  ["violet", "lime"].forEach((tone) => {
    const glow = element(
      "div",
      `blog-article__glow blog-article__glow--${tone}`
    );

    glow.setAttribute("aria-hidden", "true");
    hero.append(glow);
  });

  const inner = element("div", "blog-article__hero-inner");
  const copy = element("div", "blog-article__hero-copy");
  const heading = element("h1", "", blog.heading);

  heading.id = "blog-article-title";

  copy.append(buildBreadcrumb(blog), heading);

  if (blog.subheading) {
    copy.append(element(
      "p",
      "blog-article__subheading",
      blog.subheading
    ));
  }

  const ape = element("button", "blog-article__hero-ape");

  ape.type = "button";
  ape.setAttribute(
    "aria-label",
    "Activate the APE Studio mascot glow"
  );

  const aura = element("span", "blog-article__hero-ape-aura");
  aura.setAttribute("aria-hidden", "true");

  const image = createImage("/mascot/ape-laptop.webp", "", true);
  image.draggable = false;

  ape.append(aura, image);
  inner.append(copy, ape);
  hero.append(inner);

  return hero;
}

/* Supporting image carousel */

function buildGallery(blog) {
  const images = (blog.images || []).slice(1).filter(Boolean);

  if (!images.length) return null;

  const section = element("section", "blog-gallery-section");

  section.setAttribute(
    "aria-label",
    `${blog.heading} supporting visuals`
  );

  const carousel = element("div", "blog-carousel");
  const track = element("div", "blog-article__gallery");

  track.id = "blog-supporting-images";
  track.tabIndex = 0;
  track.setAttribute("role", "region");
  track.setAttribute("aria-roledescription", "carousel");
  track.setAttribute("aria-label", "Supporting images");

  images.forEach((source) => {
    const figure = element("figure", "blog-article__gallery-item");

    const image = createImage(
      source,
      `${blog.heading} supporting visual`
    );

    image.draggable = false;

    image.addEventListener("error", () => {
      figure.hidden = true;

      track.dispatchEvent(new Event("gallerychange"));
      refreshLayout();
    }, { once: true });

    figure.append(image);
    track.append(figure);
  });

  const controls = element("div", "blog-carousel__controls");

  const previous = element(
    "button",
    "blog-carousel__button",
    "←"
  );

  const next = element(
    "button",
    "blog-carousel__button",
    "→"
  );

  previous.type = "button";
  next.type = "button";

  previous.dataset.direction = "previous";
  next.dataset.direction = "next";

  previous.setAttribute("aria-label", "Previous supporting image");
  next.setAttribute("aria-label", "Next supporting image");

  previous.setAttribute("aria-controls", track.id);
  next.setAttribute("aria-controls", track.id);

  controls.append(previous, next);
  carousel.append(track, controls);
  section.append(carousel);

  return section;
}

function initCarousel() {
  const track = document.querySelector(".blog-article__gallery");

  if (!track) return;

  const carousel = track.closest(".blog-carousel");
  const controls = carousel.querySelector(".blog-carousel__controls");
  const previous = controls.querySelector('[data-direction="previous"]');
  const next = controls.querySelector('[data-direction="next"]');

  let dragging = false;
  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let updateFrame = null;

  function slides() {
    return [...track.querySelectorAll(
      ".blog-article__gallery-item:not([hidden])"
    )];
  }

  function maximum() {
    return Math.max(0, track.scrollWidth - track.clientWidth);
  }

  function step() {
    const first = slides()[0];

    if (!first) return track.clientWidth;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;

    return first.getBoundingClientRect().width + gap;
  }

  function update() {
    updateFrame = null;

    const max = maximum();

    controls.hidden = max <= 2;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  }

  function requestUpdate() {
    if (updateFrame !== null) return;

    updateFrame = requestAnimationFrame(update);
  }

  function move(direction) {
    track.scrollTo({
      left: Math.max(
        0,
        Math.min(maximum(), track.scrollLeft + direction * step())
      ),
      behavior: motionPreference.matches ? "auto" : "smooth"
    });
  }

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));

  track.addEventListener("scroll", requestUpdate, { passive: true });
  track.addEventListener("gallerychange", requestUpdate);

  track.addEventListener("keydown", (event) => {
    if (event.target !== track) return;

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();

      track.scrollTo({
        left: event.key === "Home" ? 0 : maximum(),
        behavior: motionPreference.matches ? "auto" : "smooth"
      });
    }
  });

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" || event.button !== 0) return;
    if (maximum() <= 2) return;

    dragging = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = track.scrollLeft;

    track.classList.add("is-dragging");
    track.setPointerCapture(pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) return;

    track.scrollLeft = startScroll - (event.clientX - startX);
  });

  function finish(event) {
    if (!dragging || event.pointerId !== pointerId) return;

    dragging = false;

    if (track.hasPointerCapture(pointerId)) {
      track.releasePointerCapture(pointerId);
    }

    pointerId = null;
    track.classList.remove("is-dragging");

    const distance = step();

    track.scrollTo({
      left: Math.max(
        0,
        Math.min(
          maximum(),
          Math.round(track.scrollLeft / distance) * distance
        )
      ),
      behavior: motionPreference.matches ? "auto" : "smooth"
    });

    requestUpdate();
  }

  track.addEventListener("pointerup", finish);
  track.addEventListener("pointercancel", finish);

  const resizeObserver = new ResizeObserver(requestUpdate);
  resizeObserver.observe(track);

  update();
}

/* Reading mascot */

function buildReadingApe() {
  const side = element("aside", "blog-article__side");
  side.setAttribute("aria-hidden", "true");

  const ape = element("div", "blog-reading-ape");
  const aura = element("div", "blog-reading-ape__aura");
  const rig = element("div", "blog-reading-ape__rig");
  const float = element("div", "blog-reading-ape__float");

  const image = createImage("/mascot/ape-sitting.webp", "");
  image.draggable = false;

  float.append(image);
  rig.append(float);
  ape.append(aura, rig);
  side.append(ape);

  return side;
}

/* Article */

function buildArticle() {
  const container = document.getElementById("blog-article");

  if (!container) return false;

  container.classList.add("blog-article");

  const slug = getSlug();
  const blog = BLOGS.find((item) => item.slug === slug);

  if (!blog) {
    container.classList.add("blog-article--missing");

    const inner = element("div", "blog-missing");
    const link = element("a", "", "Back To Blog →");

    link.href = "/blog/";

    inner.append(element("h1", "", "Article Not Found."), link);
    container.replaceChildren(inner);

    document.title = "Article Not Found | APE Studio";

    setMeta("robots", "noindex, follow");
    setMeta("description", "The requested article could not be found.");
    setCanonical(`${SITE_ORIGIN}/blog/`);

    return false;
  }

  updateMetadata(blog);

  const nodes = [buildHero(blog)];
  const cover = coverImage(blog);

  if (cover) {
    const wrap = element("section", "blog-article__visual-wrap");

    wrap.setAttribute(
      "aria-label",
      `${blog.heading} featured visual`
    );

    const frame = element("div", "blog-article__visual");

    frame.append(createImage(cover, blog.heading, true));
    wrap.append(frame);
    nodes.push(wrap);
  }

  const gallery = buildGallery(blog);

  if (gallery) nodes.push(gallery);

  const body = element("section", "blog-article__body");
  body.setAttribute("aria-label", `${blog.heading} article`);

  const inner = element("div", "blog-article__body-inner");
  const content = element("div", "blog-article__content");

  (blog.content || [])
    .filter((paragraph) => String(paragraph).trim())
    .forEach((paragraph) => {
      content.append(element(
        "p",
        "blog-article__paragraph",
        String(paragraph).trim()
      ));
    });

  const back = element("a", "blog-article__back");
  back.href = "/blog/";

  const arrow = element("span", "", "←");
  arrow.setAttribute("aria-hidden", "true");

  back.append(arrow, document.createTextNode("Back To Blog"));
  content.append(back);

  inner.append(buildReadingApe(), content);
  body.append(inner);
  nodes.push(body);

  container.replaceChildren(...nodes);

  return true;
}

/* Motion */

function initMotion() {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const copy = document.querySelector(".blog-article__hero-copy");
    const ape = document.querySelector(".blog-article__hero-ape");

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
      ".blog-article__visual, .blog-carousel, " +
      ".blog-article__paragraph, .blog-article__back"
    ).forEach((target) => {
      gsap.fromTo(
        target,
        { opacity: 0, y: 24 },
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

  const ape = document.querySelector(".blog-article__hero-ape");
  const aura = ape?.querySelector(".blog-article__hero-ape-aura");

  ape?.addEventListener("click", () => {
    if (motionPreference.matches || !aura) return;

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

/* Footer */

function initFooter() {
  const year = document.getElementById("ape-footer-year");
  const top = document.querySelector(".site-footer__top-link");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  top?.addEventListener("click", (event) => {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

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
  initHeroMascotInteraction();

  if (buildArticle()) {
    initCarousel();
    initMotion();
  }

  initFooter();
  refreshLayout();
  document.fonts?.ready.then(refreshLayout);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

window.addEventListener("load", refreshLayout, { once: true });