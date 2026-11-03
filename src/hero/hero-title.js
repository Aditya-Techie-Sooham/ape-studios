/* =========================================================
   APE — ONE-TIME HERO HEADLINE SHUFFLE

   Starts only after:
   - Cross or Maybe Later dismisses the popup
   - The hero is visible
   - The popup has finished closing

   Runs once per page load.
========================================================= */

export function initHeroTitle() {
  const hero = document.getElementById("ape-hero");
  const popup = document.getElementById("home-project-popup");

  if (!hero || hero.dataset.titleReady === "true") return;

  const heading = hero.querySelector(".ape-hero__title");
  const lines = [
    ...hero.querySelectorAll(".ape-hero__title-line")
  ];

  if (!heading || !lines.length) return;

  hero.dataset.titleReady = "true";

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const originalLines = lines.map((line) =>
    line.textContent.replace(/\s+/g, " ").trim()
  );

  /*
   * Preserve the full heading for assistive technology.
   * Visible text always returns to its exact original wording.
   */
  heading.setAttribute("aria-label", originalLines.join(" "));

  const characters = [];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const SHUFFLE_DURATION = 800;
  const GLYPH_INTERVAL = 48;
  const CLOSE_SETTLE_DELAY = 450;

  let ready = false;
  let heroVisible = false;
  let popupDismissed = false;
  let dismissalSettled = false;
  let started = false;
  let finished = false;

  let animationFrame = null;
  let dismissTimer = null;
  let resizeTimer = null;

  lines.forEach((line, lineIndex) => {
    line.textContent = "";
    line.setAttribute("aria-hidden", "true");

    const words = originalLines[lineIndex].split(" ");

    words.forEach((word, wordIndex) => {
      const wrapper = document.createElement("span");

      wrapper.className = "ape-hero__kinetic-word";

      Object.assign(wrapper.style, {
        display: "inline-block",
        whiteSpace: "nowrap",
        verticalAlign: "baseline"
      });

      Array.from(word).forEach((letter) => {
        const element = document.createElement("span");

        element.className = "ape-hero__kinetic-char";
        element.textContent = letter;

        Object.assign(element.style, {
          display: "inline-block",
          position: "relative",
          verticalAlign: "baseline"
        });

        wrapper.appendChild(element);

        characters.push({
          element,
          letter,
          canShuffle: /^[a-z]$/i.test(letter),
          nextChange: 0
        });
      });

      line.appendChild(wrapper);

      if (wordIndex < words.length - 1) {
        line.appendChild(document.createTextNode(" "));
      }
    });
  });

  function restoreCharacters() {
    characters.forEach(({ element, letter }) => {
      element.textContent = letter;
      element.style.transform = "";
      element.style.opacity = "";
    });
  }

  function measureCharacters() {
    restoreCharacters();

    characters.forEach(({ element }) => {
      element.style.width = "";
      element.style.textAlign = "";
    });

    const widths = characters.map(({ element }) =>
      element.getBoundingClientRect().width
    );

    characters.forEach(({ element }, index) => {
      element.style.width = `${widths[index]}px`;
      element.style.textAlign = "center";
    });
  }

  function popupIsOpen() {
    return Boolean(
      popup &&
      (
        popup.classList.contains("is-open") ||
        popup.getAttribute("aria-hidden") === "false"
      )
    );
  }

  function finishAnimation() {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    restoreCharacters();
    finished = true;
  }

  function tryStart() {
    if (
      !ready ||
      !heroVisible ||
      !popupDismissed ||
      !dismissalSettled ||
      popupIsOpen() ||
      document.hidden ||
      started ||
      finished
    ) {
      return;
    }

    started = true;

    if (motionPreference.matches) {
      finishAnimation();
      return;
    }

    measureCharacters();

    const startedAt = performance.now();
    const count = Math.max(characters.length - 1, 1);

    characters.forEach((character) => {
      character.nextChange = 0;
    });

    function frame(now) {
      /*
       * If interrupted, leave the correct headline visible.
       * Never restart the shuffle.
       */
      if (
        document.hidden ||
        !heroVisible ||
        popupIsOpen() ||
        motionPreference.matches
      ) {
        finishAnimation();
        return;
      }

      const elapsed = now - startedAt;

      characters.forEach((character, index) => {
        const { element, letter, canShuffle } = character;

        if (!canShuffle) return;

        const settleAt =
          230 + (index / count) * (SHUFFLE_DURATION - 230);

        if (elapsed >= settleAt) {
          element.textContent = letter;
          element.style.transform = "";
          element.style.opacity = "";
          return;
        }

        if (elapsed >= character.nextChange) {
          const glyph = alphabet[
            Math.floor(Math.random() * alphabet.length)
          ];

          element.textContent =
            letter === letter.toLowerCase()
              ? glyph.toLowerCase()
              : glyph;

          const intensity = 1 - elapsed / settleAt;
          const offset =
            (Math.random() - 0.5) * 2 * intensity;

          element.style.transform =
            `translateY(${offset.toFixed(2)}px)`;

          element.style.opacity =
            String(0.8 + Math.random() * 0.2);

          character.nextChange =
            elapsed + GLYPH_INTERVAL;
        }
      });

      if (elapsed < SHUFFLE_DURATION) {
        animationFrame = requestAnimationFrame(frame);
      } else {
        finishAnimation();
      }
    }

    animationFrame = requestAnimationFrame(frame);
  }

  /*
   * Only the cross and Maybe Later unlock the animation.
   * Backdrop clicks do not unlock it.
   *
   * Capture phase detects the click before the popup's
   * existing close handler hides it.
   */
  function handleDismissClick(event) {
    if (!(event.target instanceof Element)) return;

    const closeControl = event.target.closest(
      "#home-project-popup-close, .home-project-popup__later"
    );

    if (
      !closeControl ||
      !popup?.contains(closeControl) ||
      !popupIsOpen() ||
      popupDismissed
    ) {
      return;
    }

    popupDismissed = true;

    dismissTimer = window.setTimeout(() => {
      dismissalSettled = true;
      tryStart();
    }, CLOSE_SETTLE_DELAY);
  }

  popup?.addEventListener("click", handleDismissClick, true);

  const observer = new IntersectionObserver(
    ([entry]) => {
      heroVisible = entry.isIntersecting;

      if (started && !finished && !heroVisible) {
        finishAnimation();
        return;
      }

      tryStart();
    },
    {
      threshold: 0.12
    }
  );

  observer.observe(hero);

  /*
   * Supports either popup implementation supplied earlier:
   * class-based closing or hidden/aria-hidden closing.
   */
  const popupObserver = popup
    ? new MutationObserver(() => {
        if (started && !finished && popupIsOpen()) {
          finishAnimation();
          return;
        }

        tryStart();
      })
    : null;

  popupObserver?.observe(popup, {
    attributes: true,
    attributeFilter: ["class", "hidden", "aria-hidden"]
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && started && !finished) {
      finishAnimation();
      return;
    }

    tryStart();
  });

  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches && started && !finished) {
      finishAnimation();
      return;
    }

    tryStart();
  });

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);

      if (started && !finished) {
        finishAnimation();
      }

      resizeTimer = window.setTimeout(() => {
        measureCharacters();
        tryStart();
      }, 160);
    },
    { passive: true }
  );

  window.addEventListener("pagehide", () => {
    if (started && !finished) {
      finishAnimation();
    }
  });

  async function prepare() {
    if (document.fonts) {
      await document.fonts.ready;
    }

    measureCharacters();
    ready = true;
    tryStart();
  }

  prepare();
}