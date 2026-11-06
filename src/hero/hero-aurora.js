/* APE Studio — live aurora footage + interactive particles */

(() => {
  const VIDEO_URL = "/videos/aurora-fjord.mp4";
  const COLORS = ["#C6FF33", "#7D35EB", "#FFFFFF"];

  function init() {
    const hero = document.getElementById("ape-hero");
    if (!hero || hero.querySelector(".ape-aurora-video")) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layer = document.createElement("div");
    const video = document.createElement("video");
    const shade = document.createElement("div");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    layer.className = "ape-aurora-video";
    layer.setAttribute("aria-hidden", "true");

    Object.assign(layer.style, {
      position: "absolute",
      inset: "0",
      zIndex: "1",
      overflow: "hidden",
      pointerEvents: "none",
      opacity: "0",
    });

    const fill = {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    };

    Object.assign(video.style, fill, {
      objectFit: "cover",
      objectPosition: "center",
    });
    Object.assign(shade.style, fill);
    Object.assign(canvas.style, fill);

    video.defaultMuted = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.tabIndex = -1;

    layer.append(video, shade, canvas);
    hero.prepend(layer);

    let width = 0;
    let height = 0;
    let visible = true;
    let ready = false;
    let frame = 0;
    let pointerId = null;
    let lastBurst = -Infinity;
    const particles = [];

    function resize() {
      width = layer.clientWidth;
      height = layer.clientHeight;
      if (!width || !height) return;

      const stacked = width < 800 || (width < 1100 && height > width);

      video.style.objectPosition = stacked ? "57% 50%" : "center";
      shade.style.background = stacked
        ? "linear-gradient(180deg, #0009, #0007 42%, #0001 75%, #0005)"
        : "linear-gradient(90deg, #000b, #0008 33%, #0002 68%, #0001)";

      if (!ctx) return;

      const ratio = Math.min(
        window.devicePixelRatio || 1,
        1.5,
        Math.sqrt(2200000 / (width * height)),
      );

      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    }

    function clearParticles() {
      cancelAnimationFrame(frame);
      frame = 0;
      particles.length = 0;
      ctx?.clearRect(0, 0, width, height);
    }

    function sync() {
      if (!ready) return;

      if (!visible || document.hidden || motion.matches) {
        video.pause();
        clearParticles();
        return;
      }

      // If autoplay is blocked, keep the loaded frame visible.
      video.play().catch(() => {});
    }

    function draw(now) {
      frame = 0;
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const life = (now - p.start) / p.duration;

        if (life >= 1) {
          particles[i] = particles[particles.length - 1];
          particles.pop();
          continue;
        }

        const spread = Math.sin(Math.PI * life) * p.travel;
        ctx.globalAlpha = p.alpha * (1 - life) ** 1.35;
        ctx.fillStyle = p.color;
        ctx.fillRect(
          p.x + Math.cos(p.angle) * spread,
          p.y + Math.sin(p.angle) * spread - 18 * life,
          p.size,
          p.size,
        );
      }

      ctx.globalAlpha = 1;
      if (particles.length) frame = requestAnimationFrame(draw);
    }

    function burst(event, trail = false) {
      if (!ctx || !ready || !visible || document.hidden || motion.matches) return;

      const now = performance.now();
      if (trail && now - lastBurst < 90) return;

      const bounds = layer.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      // Keep the effect in the sky, above the shoreline.
      if (x < 0 || x > width || y < 0 || y > height * 0.65) return;
      lastBurst = now;

      const count = trail ? 28 : width < 800 ? 280 : 580;
      const overflow = particles.length + count - 950;
      if (overflow > 0) particles.splice(0, overflow);

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * (trail ? 12 : 34);
        const tint = Math.random();

        particles.push({
          x: x + Math.cos(angle) * radius,
          y: y + Math.sin(angle) * radius,
          angle,
          travel: 12 + Math.random() * (trail ? 40 : 115),
          size: 0.6 + Math.random() * 1.2,
          alpha: 0.25 + Math.random() * 0.65,
          color: tint < 0.64 ? COLORS[0] : tint < 0.91 ? COLORS[1] : COLORS[2],
          start: now,
          duration: 500 + Math.random() * 720,
        });
      }

      if (!frame) frame = requestAnimationFrame(draw);
    }

    const passive = { passive: true, capture: true };

    hero.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      pointerId = event.pointerId;
      burst(event);
      if (ready && video.paused) sync();
    }, passive);

    hero.addEventListener("pointermove", (event) => {
      if (event.pointerId === pointerId) burst(event, true);
    }, passive);

    function release(event) {
      if (event.pointerId === pointerId) pointerId = null;
    }

    window.addEventListener("pointerup", release, passive);
    window.addEventListener("pointercancel", release, passive);
    window.addEventListener("blur", () => { pointerId = null; });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);

    if ("ResizeObserver" in window) {
      new ResizeObserver(resize).observe(hero);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      }).observe(hero);
    }

    video.addEventListener("loadeddata", () => {
      ready = true;
      resize();
      layer.style.opacity = "1";
      sync();
    }, { once: true });

    video.addEventListener("error", () => {
      ready = false;
      clearParticles();
      layer.style.opacity = "0";
      console.warn(`[APE Aurora] Could not load ${VIDEO_URL}`);
    });

    resize();
    video.src = VIDEO_URL;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();