import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/mascot.css";

gsap.registerPlugin(ScrollTrigger);

const ASSETS = {
  hero: "/mascot/ape-hero.webp",
  pointingRight: "/mascot/ape-pointing-right.webp",
  pointingLeft: "/mascot/ape-pointing-left.webp",
  thinking: "/mascot/ape-thinking.webp",
  camera: "/mascot/ape-camera.webp",
  laptop: "/mascot/ape-laptop.webp",
  headphones: "/mascot/ape-headphones.webp",
  approval: "/mascot/ape-approval.webp",
  trophy: "/mascot/ape-trophy.webp",
  celebrating: "/mascot/ape-celebrating.webp",
  waving: "/mascot/ape-waving.webp",
  sitting: "/mascot/ape-sitting.webp",
  phone: "/mascot/ape-phone.webp",
  idea: "/mascot/ape-idea.webp",
};

const SCENES = [
  {
    selector: "#hero, .hero, .home-hero, [data-hero]",
    key: "hero",
    src: ASSETS.hero,
    eyebrow: "HI! I'M APE.",
    title: "READY TO MAKE SOME NOISE?",
    cta: "MEET APE →",
    href: "/about/",
    personality: "hero",
  },
  {
    selector: "#home-who",
    key: "about",
    src: ASSETS.thinking,
    eyebrow: "HMM...",
    title: "BIG IDEAS START HERE.",
    cta: "WHO IS APE? →",
    href: "/about/",
    personality: "thinking",
  },
  {
    selector: "#home-services",
    key: "services",
    src: ASSETS.pointingRight,
    eyebrow: "LOOK HERE.",
    title: "THIS IS WHAT WE DO.",
    cta: "EXPLORE SERVICES →",
    href: "/services/",
    personality: "guide",
  },
  {
    selector: "#home-work",
    key: "work",
    src: ASSETS.camera,
    eyebrow: "ACTION!",
    title: "WANNA SEE THE GOOD STUFF?",
    cta: "VIEW OUR WORK →",
    href: "/work/",
    personality: "director",
  },
  {
    selector: "#home-clients",
    key: "clients",
    src: ASSETS.approval,
    eyebrow: "YEP.",
    title: "THEY TRUST THE APE.",
    cta: "SEE OUR WORK →",
    href: "/work/",
    personality: "approval",
  },
  {
    selector: "#home-recognition",
    key: "recognition",
    src: ASSETS.trophy,
    eyebrow: "NOT BAD, HUH?",
    title: "WE LIKE WINNING TOO.",
    cta: "KNOW APE BETTER →",
    href: "/about/",
    personality: "winner",
  },
];

/* =========================================================
   INITIALIZE
========================================================= */

export function initMascot() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const desktop = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  document.querySelectorAll(".ape-nav-character").forEach(
    (node) => node.remove()
  );

  SCENES.forEach((config) => {
    const section = document.querySelector(config.selector);
    if (!section) return;

    createMainCharacter({
      section,
      config,
      reducedMotion,
      desktop,
    });
  });

  createHeroIdea({ reducedMotion, desktop });

  /*
   * The Work headphones support mascot has been removed.
   * The main Work camera mascot is created through SCENES.
   */

  createFooter({ reducedMotion, desktop });

  setTimeout(() => ScrollTrigger.refresh(), 250);
}

/* =========================================================
   CHARACTER MARKUP
========================================================= */

function getCharacterMarkup(config) {
  return `
    <div class="ape-nav-character__world">
      <div class="ape-nav-character__aura"></div>
      <div class="ape-nav-character__impact"></div>

      <div class="ape-nav-character__speed-line ape-nav-character__speed-line--one"></div>
      <div class="ape-nav-character__speed-line ape-nav-character__speed-line--two"></div>
      <div class="ape-nav-character__speed-line ape-nav-character__speed-line--three"></div>

      <div class="ape-nav-character__trail ape-nav-character__trail--violet"></div>
      <div class="ape-nav-character__trail ape-nav-character__trail--lime"></div>

      <div class="ape-nav-character__rig">
        <div class="ape-nav-character__float">
          <img
            class="ape-nav-character__image"
            src="${config.src}"
            alt=""
            draggable="false"
          />
        </div>
      </div>

      <div class="ape-nav-character__speech">
        <span class="ape-nav-character__speech-eyebrow">
          ${config.eyebrow}
        </span>

        <strong class="ape-nav-character__speech-title">
          ${config.title}
        </strong>

        <a
          class="ape-nav-character__cta"
          href="${config.href}"
        >
          ${config.cta}
        </a>
      </div>
    </div>
  `;
}

/* =========================================================
   MAIN CHARACTER
========================================================= */

function createMainCharacter({
  section,
  config,
  reducedMotion,
  desktop,
}) {
  let mount = section;

  if (config.key === "services") {
    section.classList.remove("ape-character-zone");

    mount =
      section.querySelector(".home-services__stage") ||
      section;

    mount.classList.add("ape-services-character-host");
  } else {
    section.classList.add("ape-character-zone");
  }

  const character = document.createElement("div");

  character.className = `
    ape-nav-character
    ape-nav-character--${config.key}
    ape-personality--${config.personality}
  `;

  character.innerHTML = getCharacterMarkup(config);
  mount.appendChild(character);

  const item = collectElements(character);
  if (!item) return;

  if (reducedMotion) {
    gsap.set(character, { autoAlpha: 1 });
    return;
  }

  entrance(item, section, config.personality);
  idle(item, config.personality);

  if (config.key !== "services") {
    scrollFloat(item, section, config.personality);
  }

  setupCharacterInteraction({
    item,
    area: mount,
    personality: config.personality,
    desktop,
  });

  createAttentionLoop({
    item,
    section,
    personality: config.personality,
  });
}

function collectElements(character) {
  const item = {
    character,
    world: character.querySelector(".ape-nav-character__world"),
    rig: character.querySelector(".ape-nav-character__rig"),
    float: character.querySelector(".ape-nav-character__float"),
    image: character.querySelector(".ape-nav-character__image"),
    aura: character.querySelector(".ape-nav-character__aura"),
    impact: character.querySelector(".ape-nav-character__impact"),
    violetTrail: character.querySelector(
      ".ape-nav-character__trail--violet"
    ),
    limeTrail: character.querySelector(
      ".ape-nav-character__trail--lime"
    ),
    speedLines: [
      ...character.querySelectorAll(".ape-nav-character__speed-line"),
    ],
    speech: character.querySelector(".ape-nav-character__speech"),
    cta: character.querySelector(".ape-nav-character__cta"),
    following: false,
    roaming: false,
    dragging: false,
    didDrag: false,
    lastTap: 0,
    attentionTimer: null,
  };

  if (
    !item.world ||
    !item.rig ||
    !item.float ||
    !item.image ||
    !item.speech
  ) {
    return null;
  }

  return item;
}

/* =========================================================
   ENTRANCE AND IDLE
========================================================= */

function entrance(item, section, personality) {
  const directions = {
    hero: { x: 180, y: 100, rotation: 18 },
    thinking: { x: 100, y: 75, rotation: 10 },
    guide: { x: 90, y: 70, rotation: 12 },
    director: { x: -140, y: 100, rotation: -16 },
    approval: { x: 120, y: 70, rotation: 12 },
    winner: { x: 130, y: 110, rotation: 18 },
  };

  const from = directions[personality] || directions.hero;

  gsap.fromTo(
    item.character,
    {
      autoAlpha: 0,
      x: from.x,
      y: from.y,
      scale: 0.18,
      rotation: from.rotation,
    },
    {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 1.25,
      ease: "back.out(1.9)",
      scrollTrigger: {
        trigger: section,
        start: personality === "hero" ? "top 95%" : "top 80%",
        once: true,
      },
    }
  );
}

function idle(item, personality) {
  const target = item.float;

  if (personality === "thinking") {
    gsap.timeline({ repeat: -1, yoyo: true })
      .to(target, {
        y: -11,
        rotation: -2.5,
        scale: 1.025,
        duration: 2,
        ease: "sine.inOut",
      })
      .to(target, {
        y: -2,
        rotation: 2,
        duration: 1.8,
        ease: "sine.inOut",
      });
    return;
  }

  if (personality === "guide") {
    gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
      .to(target, {
        x: 10,
        scale: 1.04,
        duration: 0.25,
      })
      .to(target, {
        x: -5,
        rotation: -2,
        duration: 0.2,
      })
      .to(target, {
        x: 0,
        rotation: 0,
        scale: 1,
        duration: 0.36,
        ease: "back.out(2)",
      });
    return;
  }

  if (personality === "director") {
    gsap.timeline({ repeat: -1, repeatDelay: 1 })
      .to(target, {
        y: -14,
        x: -6,
        rotation: -4,
        duration: 0.3,
      })
      .to(target, {
        x: 7,
        rotation: 4,
        duration: 0.2,
      })
      .to(target, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.45,
        ease: "bounce.out",
      });
    return;
  }

  gsap.timeline({ repeat: -1, repeatDelay: 1.4 })
    .to(target, {
      y: -15,
      scale: 1.04,
      rotation: -2,
      duration: 0.42,
      ease: "power2.out",
    })
    .to(target, {
      y: 0,
      scale: 1,
      rotation: 2,
      duration: 0.55,
      ease: "bounce.out",
    })
    .to(target, {
      rotation: 0,
      duration: 0.25,
    });
}

function scrollFloat(item, section, personality) {
  gsap.to(item.character, {
    yPercent: personality === "hero" ? -10 : -7,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.8,
    },
  });
}

/* =========================================================
   INTERACTION
========================================================= */

function setupCharacterInteraction({
  item,
  area,
  personality,
  desktop,
}) {
  gsap.set(item.speech, {
    autoAlpha: 0,
    y: 18,
    scale: 0.78,
  });

  if (desktop) {
    setupDesktopChase({ item, area, personality });
  } else {
    setupMobileDrag({ item, area, personality });
  }

  item.character.addEventListener("click", (event) => {
    if (event.target.closest(".ape-nav-character__cta")) return;
    if (!desktop || item.roaming) return;

    runAroundSection({ item, area, personality });
  });

  if (item.cta) {
    item.cta.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });

    item.cta.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
}

function setupDesktopChase({ item, area, personality }) {
  let homeX = 0;
  let homeY = 0;
  let previousX = 0;
  let previousY = 0;
  let previousTime = 0;
  let trailCooldown = false;

  item.character.addEventListener("pointerenter", (event) => {
    if (item.roaming) return;

    item.following = true;

    const rect = item.character.getBoundingClientRect();

    homeX = rect.left + rect.width / 2;
    homeY = rect.top + rect.height / 2;

    previousX = event.clientX;
    previousY = event.clientY;
    previousTime = performance.now();

    item.character.classList.add("is-chasing");

    showSpeech(item);
    hoverReaction(item, personality);
    impact(item);
  });

  area.addEventListener("pointermove", (event) => {
    if (!item.following || item.roaming) return;

    const now = performance.now();
    const elapsed = Math.max(16, now - previousTime);

    const velocityX = (event.clientX - previousX) / elapsed;
    const velocityY = (event.clientY - previousY) / elapsed;

    const speed = Math.sqrt(
      velocityX * velocityX + velocityY * velocityY
    );

    previousX = event.clientX;
    previousY = event.clientY;
    previousTime = now;

    const dx = event.clientX - homeX;
    const dy = event.clientY - homeY;

    const maxX = Math.min(240, window.innerWidth * 0.19);
    const maxY = Math.min(170, window.innerHeight * 0.2);

    gsap.to(item.world, {
      x: gsap.utils.clamp(-maxX, maxX, dx * 0.58),
      y: gsap.utils.clamp(-maxY, maxY, dy * 0.5),
      duration: 0.46,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(item.rig, {
      rotationY: gsap.utils.clamp(-16, 16, dx * 0.045),
      rotationX: gsap.utils.clamp(-10, 10, dy * -0.03),
      rotation: gsap.utils.clamp(-5, 5, velocityX * 8),
      scale: 1.08 + Math.min(0.08, speed * 0.05),
      duration: 0.22,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (speed > 0.8 && !trailCooldown) {
      trailCooldown = true;
      speedLines(item, velocityX >= 0 ? 1 : -1);

      setTimeout(() => {
        trailCooldown = false;
      }, 220);
    }
  });

  area.addEventListener("pointerleave", () => {
    item.following = false;
    item.character.classList.remove("is-chasing");
    hideSpeech(item);
    returnHome(item);
  });
}

/* =========================================================
   MOBILE DRAG AND TAP
========================================================= */

function setupMobileDrag({ item, area, personality }) {
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let lastTime = 0;

  item.character.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    if (event.target.closest(".ape-nav-character__cta")) return;

    item.dragging = true;
    item.didDrag = false;

    startX = event.clientX;
    startY = event.clientY;
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = performance.now();

    item.character.classList.add("is-mobile-active");

    try {
      item.character.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture may be unavailable.
    }

    gsap.to(item.rig, {
      scale: 1.09,
      y: -8,
      duration: 0.18,
      ease: "power2.out",
    });

    impact(item);
  });

  item.character.addEventListener("pointermove", (event) => {
    if (!item.dragging) return;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (Math.abs(dx) > 7 || Math.abs(dy) > 7) {
      item.didDrag = true;
    }

    const now = performance.now();
    const elapsed = Math.max(16, now - lastTime);

    velocityX = (event.clientX - lastX) / elapsed;
    velocityY = (event.clientY - lastY) / elapsed;

    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = now;

    const maxX = Math.min(area.clientWidth * 0.34, 190);
    const maxY = Math.min(area.clientHeight * 0.24, 145);

    gsap.to(item.world, {
      x: gsap.utils.clamp(-maxX, maxX, dx),
      y: gsap.utils.clamp(-maxY, maxY, dy),
      duration: 0.12,
      ease: "power2.out",
      overwrite: true,
    });

    gsap.to(item.rig, {
      rotation: gsap.utils.clamp(-12, 12, velocityX * 18),
      rotationY: gsap.utils.clamp(-16, 16, dx * 0.05),
      scale: 1.1,
      duration: 0.1,
      overwrite: true,
    });
  });

  function release(event) {
    if (!item.dragging) return;

    item.dragging = false;
    item.character.classList.remove("is-mobile-active");

    try {
      item.character.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released.
    }

    if (item.didDrag) {
      mobileThrow({ item, velocityX, velocityY });
      return;
    }

    const now = performance.now();
    const doubleTap = now - item.lastTap < 340;

    item.lastTap = now;
    showSpeech(item);

    if (doubleTap) {
      mobileParty(item);
    } else {
      mobileTap(item, personality);
    }
  }

  item.character.addEventListener("pointerup", release);
  item.character.addEventListener("pointercancel", release);
}

function mobileThrow({ item, velocityX, velocityY }) {
  impact(item);
  energyTrail(item);

  const throwX = gsap.utils.clamp(-105, 105, velocityX * 75);
  const throwY = gsap.utils.clamp(-80, 80, velocityY * 60);

  gsap.timeline()
    .to(item.world, {
      x: `+=${throwX}`,
      y: `+=${throwY}`,
      duration: 0.28,
      ease: "power2.out",
    })
    .to(item.world, {
      x: 0,
      y: 0,
      duration: 0.75,
      ease: "elastic.out(1,0.4)",
    });

  gsap.to(item.rig, {
    rotation: 0,
    rotationY: 0,
    scale: 1,
    duration: 0.55,
    ease: "back.out(2)",
  });

  gsap.delayedCall(0.55, () => showSpeech(item));
}

function mobileTap(item, personality) {
  impact(item);
  energyTrail(item);
  gsap.killTweensOf(item.rig);

  gsap.timeline()
    .to(item.rig, {
      y: -28,
      scale: 1.16,
      rotation: -7,
      duration: 0.18,
    })
    .to(item.rig, {
      x: 12,
      rotation: 7,
      duration: 0.16,
    })
    .to(item.rig, {
      x: -10,
      rotation: -5,
      duration: 0.16,
    })
    .to(item.rig, {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.42,
      ease: "bounce.out",
    });
}

function mobileParty(item) {
  impact(item);
  energyTrail(item);
  speedLines(item, 1);
  gsap.killTweensOf(item.rig);

  gsap.timeline()
    .to(item.rig, {
      y: -38,
      scale: 1.2,
      rotation: -12,
      duration: 0.18,
    })
    .to(item.rig, {
      x: 17,
      rotation: 12,
      duration: 0.14,
    })
    .to(item.rig, {
      x: -17,
      rotation: -12,
      duration: 0.14,
    })
    .to(item.rig, {
      x: 14,
      rotation: 10,
      duration: 0.14,
    })
    .to(item.rig, {
      rotationY: "+=360",
      x: 0,
      duration: 0.52,
      ease: "power3.inOut",
    })
    .to(item.rig, {
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.5,
      ease: "bounce.out",
    });
}

/* =========================================================
   HOVER REACTION
========================================================= */

function hoverReaction(item, personality) {
  impact(item);
  energyTrail(item);
  gsap.killTweensOf(item.rig);

  if (personality === "thinking") {
    gsap.to(item.rig, {
      y: -16,
      scale: 1.15,
      rotation: -4,
      duration: 0.35,
      ease: "back.out(2)",
    });
    return;
  }

  if (personality === "guide") {
    gsap.timeline()
      .to(item.rig, {
        x: 17,
        y: -12,
        scale: 1.17,
        rotation: 5,
        duration: 0.18,
      })
      .to(item.rig, {
        x: -5,
        rotation: -3,
        duration: 0.16,
      })
      .to(item.rig, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1.1,
        duration: 0.3,
        ease: "back.out(2)",
      });
    return;
  }

  gsap.timeline()
    .to(item.rig, {
      y: -30,
      scale: 1.18,
      rotation: -7,
      duration: 0.2,
    })
    .to(item.rig, {
      rotation: 7,
      duration: 0.16,
    })
    .to(item.rig, {
      y: 0,
      rotation: 0,
      scale: 1.1,
      duration: 0.38,
      ease: "bounce.out",
    });
}

/* =========================================================
   RUN AROUND SECTION
========================================================= */

function runAroundSection({ item, area }) {
  item.following = false;
  item.roaming = true;
  item.character.classList.add("is-roaming");

  hideSpeech(item);
  impact(item);
  energyTrail(item);
  speedLines(item, 1);

  const areaRect = area.getBoundingClientRect();
  const charRect = item.character.getBoundingClientRect();

  const movementX = Math.max(
    120,
    Math.min(440, areaRect.width - charRect.width - 80)
  );

  const movementY = Math.max(
    70,
    Math.min(220, areaRect.height - charRect.height - 60)
  );

  const direction =
    charRect.left < areaRect.left + areaRect.width / 2
      ? 1
      : -1;

  gsap.set(item.character, { zIndex: 180 });

  const tl = gsap.timeline({
    onComplete() {
      item.roaming = false;
      item.character.classList.remove("is-roaming");
      gsap.set(item.character, { zIndex: 40 });
      showSpeech(item);
      impact(item);
    },
  });

  tl.to(item.rig, {
    y: -35,
    scale: 1.13,
    rotation: -10 * direction,
    duration: 0.18,
    ease: "power3.out",
  }, 0);

  tl.to(item.world, {
    x: movementX * direction * 0.75,
    y: -movementY * 0.35,
    duration: 0.55,
    ease: "power3.inOut",
  }, 0);

  tl.to(item.rig, {
    rotation: 13 * direction,
    rotationY: 18 * direction,
    duration: 0.28,
  }, 0.17);

  tl.to(item.world, {
    x: -movementX * direction * 0.58,
    y: movementY * 0.35,
    duration: 0.58,
    ease: "power3.inOut",
  });

  tl.to(item.rig, {
    rotation: -14 * direction,
    rotationY: -18 * direction,
    duration: 0.28,
  }, "<");

  tl.to(item.world, {
    x: movementX * direction * 0.32,
    y: -movementY * 0.55,
    duration: 0.42,
    ease: "power2.out",
  });

  tl.to(item.rig, {
    y: -25,
    scale: 1.18,
    rotationY: "+=360",
    duration: 0.6,
    ease: "power3.inOut",
  }, "<");

  tl.to(item.world, {
    x: 0,
    y: 0,
    duration: 0.8,
    ease: "elastic.out(1,0.45)",
  });

  tl.to(item.rig, {
    x: 0,
    y: 0,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    duration: 0.5,
    ease: "back.out(2)",
  }, "<0.08");
}

/* =========================================================
   ATTENTION LOOP
========================================================= */

function createAttentionLoop({ item, section }) {
  let active = false;
  let timer = null;

  function stopTimer() {
    if (timer) {
      timer.kill();
      timer = null;
    }
  }

  function schedule() {
    stopTimer();
    if (!active) return;

    timer = gsap.delayedCall(5.5, () => {
      if (
        active &&
        !item.following &&
        !item.roaming &&
        !item.dragging
      ) {
        attentionMove(item);
      }

      schedule();
    });
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top 85%",
    end: "bottom 15%",

    onEnter() {
      active = true;
      schedule();
    },

    onEnterBack() {
      active = true;
      schedule();
    },

    onLeave() {
      active = false;
      stopTimer();
    },

    onLeaveBack() {
      active = false;
      stopTimer();
    },
  });
}

function attentionMove(item) {
  impact(item);

  gsap.timeline()
    .to(item.rig, {
      y: -13,
      rotation: -4,
      scale: 1.05,
      duration: 0.22,
    })
    .to(item.rig, {
      x: 7,
      rotation: 4,
      duration: 0.18,
    })
    .to(item.rig, {
      x: -5,
      rotation: -3,
      duration: 0.18,
    })
    .to(item.rig, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.38,
      ease: "back.out(2)",
    });
}

/* =========================================================
   EFFECTS
========================================================= */

function impact(item) {
  if (!item.impact) return;

  gsap.killTweensOf(item.impact);

  gsap.fromTo(
    item.impact,
    {
      opacity: 0.9,
      scale: 0.4,
      rotation: -12,
    },
    {
      opacity: 0,
      scale: 1.4,
      rotation: 10,
      duration: 0.48,
      ease: "power3.out",
    }
  );
}

function speedLines(item, direction = 1) {
  if (!item.speedLines.length) return;

  item.speedLines.forEach((line, index) => {
    gsap.killTweensOf(line);

    gsap.fromTo(
      line,
      {
        opacity: 0.7 - index * 0.12,
        x: 10 * direction,
        scaleX: 0.25,
      },
      {
        opacity: 0,
        x: -55 * direction,
        scaleX: 1.15 + index * 0.15,
        duration: 0.38 + index * 0.08,
        delay: index * 0.025,
        ease: "power3.out",
      }
    );
  });
}

function energyTrail(item) {
  if (item.violetTrail) {
    gsap.fromTo(
      item.violetTrail,
      {
        opacity: 0.82,
        scaleX: 0.15,
        x: 22,
      },
      {
        opacity: 0,
        scaleX: 1.45,
        x: -46,
        duration: 0.5,
        ease: "power3.out",
      }
    );
  }

  if (item.limeTrail) {
    gsap.fromTo(
      item.limeTrail,
      {
        opacity: 0.72,
        scaleX: 0.15,
        x: -15,
      },
      {
        opacity: 0,
        scaleX: 1.35,
        x: 40,
        duration: 0.58,
        ease: "power3.out",
      }
    );
  }

  if (item.aura) {
    gsap.fromTo(
      item.aura,
      {
        scale: 0.8,
        opacity: 0.75,
      },
      {
        scale: 1.45,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete() {
          gsap.set(item.aura, {
            scale: 1,
            opacity: 0.85,
          });
        },
      }
    );
  }
}

/* =========================================================
   SPEECH AND RETURN
========================================================= */

function showSpeech(item) {
  item.character.classList.add("is-speaking");

  gsap.to(item.speech, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    rotation: 0,
    duration: 0.34,
    ease: "back.out(1.9)",
    overwrite: true,
  });
}

function hideSpeech(item) {
  item.character.classList.remove("is-speaking");

  gsap.to(item.speech, {
    autoAlpha: 0,
    y: 16,
    scale: 0.8,
    duration: 0.2,
    ease: "power2.in",
    overwrite: true,
  });
}

function returnHome(item) {
  gsap.to(item.world, {
    x: 0,
    y: 0,
    duration: 0.72,
    ease: "elastic.out(1,0.5)",
    overwrite: true,
  });

  gsap.to(item.rig, {
    x: 0,
    y: 0,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    duration: 0.58,
    ease: "back.out(1.8)",
    overwrite: true,
  });
}

/* =========================================================
   SUPPORT CHARACTER FACTORY
========================================================= */

function createSupportCharacter({
  section,
  className,
  config,
  reducedMotion,
  desktop,
  personality,
}) {
  section.classList.add("ape-character-zone");

  const character = document.createElement("div");

  character.className = `
    ape-nav-character
    ape-nav-character--support
    ${className}
  `;

  character.innerHTML = getCharacterMarkup(config);
  section.appendChild(character);

  const item = collectElements(character);
  if (!item) return;

  if (reducedMotion) {
    gsap.set(character, { autoAlpha: 1 });
    return;
  }

  gsap.fromTo(
    character,
    {
      autoAlpha: 0,
      y: 50,
      scale: 0.25,
      rotation: -15,
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        once: true,
      },
    }
  );

  gsap.to(item.float, {
    y: -11,
    rotation: 3,
    duration: 1.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  setupCharacterInteraction({
    item,
    area: section,
    personality,
    desktop,
  });

  createAttentionLoop({
    item,
    section,
    personality,
  });
}

/* =========================================================
   HERO IDEA
========================================================= */

function createHeroIdea({ reducedMotion, desktop }) {
  const hero = document.querySelector(
    "#hero, .hero, .home-hero, [data-hero]"
  );

  if (!hero) return;

  createSupportCharacter({
    section: hero,
    className: "ape-nav-character--hero-idea",
    config: {
      src: ASSETS.idea,
      eyebrow: "PING!",
      title: "GOT AN IDEA?",
      cta: "LET'S BUILD IT →",
      href: "/contact/",
    },
    reducedMotion,
    desktop,
    personality: "winner",
  });
}

/* =========================================================
   FOOTER
========================================================= */

function createFooter({ reducedMotion, desktop }) {
  const footer = document.querySelector(
    "footer, .ape-footer, .site-footer"
  );

  if (!footer) return;

  footer.classList.add("ape-character-zone");

  createSupportCharacter({
    section: footer,
    className: "ape-nav-character--footer",
    config: {
      src: ASSETS.waving,
      eyebrow: "HEY, WAIT!",
      title: "DON'T LEAVE WITHOUT SAYING HI.",
      cta: "START A PROJECT →",
      href: "/contact/",
    },
    reducedMotion,
    desktop,
    personality: "winner",
  });
}