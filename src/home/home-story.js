const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileLayout = window.matchMedia("(width < 760px)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const SVG_NS = "http://www.w3.org/2000/svg";
const clamp = (value) => Math.max(0, Math.min(1, value));

function initCapabilityTree() {
  const tree = document.querySelector("[data-capability-tree]");
  if (!tree) return;

  const rows = [...tree.querySelectorAll(".capability-tree__node")];
  const cards = rows.map((row) => row.querySelector(".capability-tree__card"));
  if (!rows.length || cards.some((card) => !card)) return;

  tree.querySelectorAll(".capability-tree__limb, .capability-tree__art")
    .forEach((element) => element.remove());

  // Keep the SVG outside the list so it cannot affect card placement.
  const stage = document.createElement("div");
  Object.assign(stage.style, {
    position: "relative",
    isolation: "isolate"
  });
  tree.before(stage);
  stage.append(tree);

  const art = document.createElementNS(SVG_NS, "svg");
  art.setAttribute("aria-hidden", "true");
  art.setAttribute("focusable", "false");

  // Put the artwork above the list background, with no hit area.
  // The branches end at the cards' edges, so they don't cover their text.
  Object.assign(art.style, {
    position: "absolute",
    display: "block",
    zIndex: "2",
    maxWidth: "none",
    maxHeight: "none",
    overflow: "visible",
    pointerEvents: "none"
  });
  stage.append(art);

  let geometry;
  let frame = 0;
  let needsLayout = true;

  function draw(d, color, width) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("pathLength", "1");
    path.style.fill = "none";
    path.style.stroke = color;
    path.style.strokeWidth = String(width);
    path.style.strokeLinecap = "round";
    path.style.strokeLinejoin = "round";
    art.append(path);
    return path;
  }

  function paint(path, amount) {
    const progress = clamp(amount);
    path.style.strokeDasharray = progress === 1 ? "none" : "1 1";
    path.style.strokeDashoffset = String(1 - progress);
    path.style.visibility = progress > 0 ? "visible" : "hidden";
  }

  function measure() {
    // Measure the cards in their resting position, before applying the reveal.
    tree.classList.remove("is-scrubbing");

    const bounds = tree.getBoundingClientRect();
    const wrapper = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;

    const isMobile = mobileLayout.matches;
    const center = isMobile ? 15 : bounds.width / 2;
    const points = cards.map((card, index) => {
      const rect = card.getBoundingClientRect();
      const left = !isMobile && rect.right - bounds.left < center;

      return {
        x: center + (index % 2 ? 4 : -4),
        y: rect.top - bounds.top + rect.height / 2,
        edge: (left ? rect.right : rect.left) - bounds.left,
        direction: left ? -1 : 1
      };
    });

    art.setAttribute("viewBox", ["0", "0", bounds.width, bounds.height].join(" "));
    Object.assign(art.style, {
      top: (bounds.top - wrapper.top) + "px",
      left: (bounds.left - wrapper.left) + "px",
      width: bounds.width + "px",
      height: bounds.height + "px"
    });
    art.replaceChildren();

    const bottom = Math.max(points[points.length - 1].y + 16, bounds.height - 22);
    const anchors = [{ x: center, y: 4 }, ...points, { x: center, y: bottom }];

    const trunk = anchors.slice(1).map((end, index) => {
      const start = anchors[index];
      const bend = (end.y - start.y) * 0.42;
      const d = [
        "M", start.x, start.y,
        "C", start.x, start.y + bend, end.x, end.y - bend, end.x, end.y
      ].join(" ");

      return {
        start: start.y,
        end: end.y,
        bark: draw(d, "#8950d5", isMobile ? 5 : 8),
        grain: draw(d, "#dab5ff", 1)
      };
    });

    const branches = points.map(({ x, y, edge, direction }) => {
      const span = edge - x;
      const joint = x + span * 0.48;
      const lift = Math.min(15, Math.abs(span) * 0.35);

      return {
        y,
        direction,
        branch: draw([
          "M", x, y,
          "C", x + span * 0.3, y - 3, x + span * 0.7, y + 2, edge, y
        ].join(" "), "#c6ff33", 2),
        twig: draw([
          "M", joint, y,
          "Q", joint + span * 0.12, y - lift * 0.4,
          joint + span * 0.24, y - lift
        ].join(" "), "#a7c771", 1)
      };
    });

    const spread = isMobile ? 12 : 30;
    const roots = [-1, 1].map((direction) => draw([
      "M", center, bottom,
      "Q", center + direction * 7, bottom + 3,
      center + direction * spread, bottom + 15
    ].join(" "), "#a06ed9", 1.6));

    return { trunk, branches, roots, bottom, isMobile };
  }

  function update() {
    frame = 0;

    if (needsLayout) {
      geometry = measure();
      needsLayout = false;
    }
    if (!geometry) return;

    const { trunk, branches, roots, bottom, isMobile } = geometry;
    const still = reducedMotion.matches;
    const frontier = window.innerHeight * (isMobile ? 0.67 : 0.79)
      - tree.getBoundingClientRect().top;

    trunk.forEach(({ start, end, bark, grain }) => {
      const progress = still ? 1 : (frontier - start) / Math.max(1, end - start);
      paint(bark, progress);
      paint(grain, progress);
    });

    branches.forEach(({ y, direction, branch, twig }, index) => {
      const card = cards[index];
      const immediate = still || document.activeElement === card;
      const drawDistance = isMobile ? 24 : 30;
      const travel = frontier - y;
      const branchProgress = immediate ? 1 : travel / drawDistance;
      const reveal = immediate ? 1 : clamp((travel - drawDistance) / 22);
      const opacity = 1 - (1 - reveal) ** 2;

      paint(branch, branchProgress);
      paint(twig, (branchProgress - 0.35) / 0.65);

      card.style.setProperty("--card-opacity", String(opacity));
      card.style.setProperty("--card-shift", (-direction * (1 - opacity) * 13) + "px");
      card.toggleAttribute("data-waiting", !immediate && reveal === 0);
    });

    roots.forEach((root) => paint(root, still ? 1 : (frontier - bottom) / 18));
    tree.classList.toggle("is-scrubbing", !still);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function relayout() {
    needsLayout = true;
    schedule();
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", relayout, { passive: true });
  window.addEventListener("pageshow", relayout);
  tree.addEventListener("focusin", schedule);
  tree.addEventListener("focusout", schedule);
  mobileLayout.addEventListener("change", relayout);
  reducedMotion.addEventListener("change", schedule);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(relayout);
    observer.observe(tree);
    rows.forEach((row) => observer.observe(row));
  }

  document.fonts?.ready.then(relayout);
  update();
}

function initWorkReels() {
  const reels = document.querySelector("[data-work-reels]");
  const toggle = document.querySelector("[data-reel-toggle]");
  if (!reels || !toggle) return;

  reels.querySelectorAll(".work-reel__set").forEach((set) => {
    const duplicate = set.cloneNode(true);
    duplicate.setAttribute("aria-hidden", "true");
    set.after(duplicate);
  });

  const videos = [...reels.querySelectorAll("video[data-src]")];
  let userPaused = false;
  let visible = !("IntersectionObserver" in window);
  let wasPlaying;

  reels.classList.add("is-ready");

  function sync() {
    const canAnimate = !reducedMotion.matches;
    const playing = canAnimate && !userPaused && visible && !document.hidden;

    toggle.hidden = !canAnimate;
    toggle.textContent = userPaused ? "Play motion" : "Pause motion";

    if (playing === wasPlaying) return;
    wasPlaying = playing;
    reels.classList.toggle("is-playing", playing);

    videos.forEach((video) => {
      if (!playing) {
        video.pause();
        return;
      }
      if (!video.hasAttribute("src")) video.src = video.dataset.src;
      video.muted = true;
      video.play().catch(() => {});
    });
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.08 }).observe(reels);
  }

  toggle.addEventListener("click", () => {
    userPaused = !userPaused;
    sync();
  });

  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", sync);
  sync();
}

function initProjectPreviews() {
  const projects = [...document.querySelectorAll("[data-project]")];
  const gallery = document.querySelector(".featured-work__grid");

  document.querySelectorAll(".featured-project__toggle")
    .forEach((button) => button.remove());

  if (gallery) {
    const syncGallery = () => {
      if (mobileLayout.matches) {
        gallery.tabIndex = 0;
        gallery.setAttribute("role", "region");
        gallery.setAttribute("aria-label", "Selected projects");
      } else {
        ["tabindex", "role", "aria-label"].forEach((name) => gallery.removeAttribute(name));
      }
    };

    mobileLayout.addEventListener("change", syncGallery);
    syncGallery();
  }

  function prepare(project) {
    const image = project.querySelector("[data-alternate]");
    const link = project.querySelector(".featured-project__link");
    if (!image?.dataset.alternate || !link) return;

    let hovered = finePointer.matches && link.matches(":hover");

    function sync() {
      const active = (finePointer.matches && hovered) || link.matches(":focus-visible");
      project.classList.toggle("is-previewing", project.classList.contains("has-alternate") && active);
    }

    link.addEventListener("pointerenter", (event) => {
      hovered = event.pointerType === "mouse";
      sync();
    });

    link.addEventListener("pointerleave", () => {
      hovered = false;
      sync();
    });

    link.addEventListener("focus", () => requestAnimationFrame(sync));
    link.addEventListener("blur", () => requestAnimationFrame(sync));
    finePointer.addEventListener("change", sync);

    image.addEventListener("load", () => {
      project.classList.add("has-alternate");
      sync();
    }, { once: true });

    image.addEventListener("error", () => image.remove(), { once: true });
    image.src = image.dataset.alternate;
  }

  if (!("IntersectionObserver" in window)) {
    projects.forEach(prepare);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      prepare(target);
    });
  }, { rootMargin: "240px 0px" });

  projects.forEach((project) => observer.observe(project));
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeStoryLink(url, label) {
  const link = makeElement("a", "story-button");
  const arrow = makeElement("span", "", "↗");
  link.href = url;
  arrow.setAttribute("aria-hidden", "true");
  link.append(label + " ", arrow);
  return link;
}

function updateStudioAndClients() {
  document.querySelector(".studio-profile__mascot")?.remove();

  const head = document.querySelector(".client-stories .story-section-head");
  if (!head) return;

  head.querySelector(":scope > p")?.remove();

  if (!head.querySelector('a[href="/work/"]')) {
    head.append(makeStoryLink("/work/", "See Our Work"));
  }
}

function initStudioInterview() {
  const faq = document.querySelector("#home-faq.home-faq");
  if (!faq) return;

  const scenes = [...faq.querySelectorAll(".home-faq__item")]
    .map((item) => ({
      question: item.querySelector(".home-faq__question")?.textContent.trim(),
      answer: item.querySelector(".home-faq__answer")?.textContent.trim()
    }))
    .filter(({ question, answer }) => question && answer);

  if (!scenes.length) return;

  const faqUrl = faq.querySelector(".home-faq__all")?.getAttribute("href") || "/faq/";
  const section = makeElement("section", "studio-interview");
  section.id = faq.id;
  section.setAttribute("aria-labelledby", "home-faq-title");

  const layout = makeElement("div", "story-shell studio-interview__layout");
  const intro = makeElement("div", "studio-interview__intro");
  const title = makeElement("h2", "story-title");
  title.id = "home-faq-title";
  title.append("On the record.", document.createElement("br"), makeElement("em", "", "Ask APE."));

  intro.append(
    makeElement("p", "story-kicker", "Frequently asked questions"),
    title,
    makeElement("p", "", "Questions we hear before the first brief."),
    makeStoryLink(faqUrl, "View All FAQs")
  );

  const screen = makeElement("div", "studio-interview__screen");
  const slate = makeElement("div", "studio-interview__slate");
  slate.setAttribute("aria-hidden", "true");
  slate.append(makeElement("span", "", "APE Studio / Q&A"), makeElement("span", "", "Interview cut"));
  screen.append(slate);

  scenes.forEach(({ question, answer }) => {
    const scene = makeElement("details", "studio-interview__scene");
    scene.setAttribute("name", "ape-home-interview");

    const summary = document.createElement("summary");
    const prompt = document.createElement("span");
    const cue = makeElement("span", "studio-interview__cue");
    cue.setAttribute("aria-hidden", "true");

    prompt.append(
      makeElement("span", "studio-interview__speaker", "You ask"),
      makeElement("span", "studio-interview__question", question)
    );
    summary.append(prompt, cue);

    const response = makeElement("div", "studio-interview__answer");
    response.append(
      makeElement("span", "studio-interview__speaker", "APE answers"),
      makeElement("p", "", answer)
    );

    scene.append(summary, response);
    screen.append(scene);
  });

  layout.append(intro, screen);
  section.append(layout);
  faq.replaceWith(section);
}

updateStudioAndClients();
initStudioInterview();
initCapabilityTree();
initWorkReels();
initProjectPreviews();