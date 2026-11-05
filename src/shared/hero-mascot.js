import gsap from "gsap";

const mascotSelector = [
  ".about-hero__ape",
  ".services-hero__ape",
  ".service-detail-ape",
  ".work-hero__ape",
  ".work-detail__ape",
  ".blog-hero__ape",
  ".blog-article__hero-ape"
].join(", ");

export function initHeroMascotInteraction() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const hoverPointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  document.querySelectorAll(mascotSelector).forEach((button) => {
    if (button.dataset.mascotInteraction === "ready") return;

    const image = button.querySelector("img");

    if (!image) return;

    button.dataset.mascotInteraction = "ready";

    button.setAttribute(
      "aria-label",
      "Make the APE Studio mascot react"
    );

    let reaction = null;
    let hovered = false;
    let direction = 1;
    let pointerLean = 0;

    gsap.set(image, {
      transformOrigin: "50% 100%"
    });

    function restPose() {
      const active = hovered && hoverPointer.matches;

      return {
        rotation: active ? pointerLean : 0,
        skewX: 0,
        scaleX: active ? 1.015 : 1,
        scaleY: active ? 1.015 : 1
      };
    }

    function settle() {
      gsap.to(image, {
        ...restPose(),
        duration: 0.65,
        ease: "power3.out",
        overwrite: true
      });
    }

    function canHover(event) {
      return (
        event.pointerType !== "touch" &&
        hoverPointer.matches &&
        !reduceMotion.matches
      );
    }

    button.addEventListener("pointerenter", (event) => {
      if (!canHover(event)) return;

      hovered = true;
      pointerLean = -0.8;

      if (!reaction?.isActive()) settle();
    });

    button.addEventListener("pointermove", (event) => {
      if (!canHover(event)) return;

      const rect = button.getBoundingClientRect();

      if (!rect.width) return;

      const position = gsap.utils.clamp(
        -0.5,
        0.5,
        (event.clientX - rect.left) / rect.width - 0.5
      );

      pointerLean = position * 2.4;

      if (!reaction?.isActive()) {
        gsap.to(image, {
          ...restPose(),
          duration: 0.5,
          ease: "power3.out",
          overwrite: true
        });
      }
    });

    button.addEventListener("pointerleave", () => {
      hovered = false;
      pointerLean = 0;

      if (
        !reduceMotion.matches &&
        !reaction?.isActive()
      ) {
        settle();
      }
    });

    button.addEventListener("click", () => {
      if (reduceMotion.matches) return;

      /* Let each reaction finish cleanly. */
      if (reaction?.isActive()) return;

      direction *= -1;
      const side = direction;

      gsap.killTweensOf(image);

      reaction = gsap.timeline({
        defaults: {
          ease: "power2.inOut"
        }
      });

      reaction
        /* Small anticipation */
        .to(image, {
          rotation: -1.4 * side,
          skewX: 0,
          scaleX: 1.035,
          scaleY: 0.965,
          duration: 0.18
        })

        /* Playful first lean */
        .to(image, {
          rotation: 3 * side,
          skewX: -0.8 * side,
          scaleX: 0.985,
          scaleY: 1.025,
          duration: 0.24,
          ease: "power3.out"
        })

        /* Double wiggle */
        .to(image, {
          rotation: -3.2 * side,
          skewX: 0.8 * side,
          scaleX: 1.02,
          scaleY: 0.985,
          duration: 0.19
        })
        .to(image, {
          rotation: 2.1 * side,
          skewX: -0.5 * side,
          scaleX: 0.99,
          scaleY: 1.015,
          duration: 0.21
        })
        .to(image, {
          rotation: -0.9 * side,
          skewX: 0,
          scaleX: 1.01,
          scaleY: 0.995,
          duration: 0.22
        })

        /* Soft finish */
        .to(image, {
          rotation: 0,
          skewX: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.45,
          ease: "power3.out"
        })
        .call(settle);
    });

    function reset() {
      reaction?.kill();
      reaction = null;
      hovered = false;
      pointerLean = 0;

      gsap.killTweensOf(image);

      gsap.set(image, {
        rotation: 0,
        skewX: 0,
        scaleX: 1,
        scaleY: 1
      });
    }

    reduceMotion.addEventListener("change", reset);
    hoverPointer.addEventListener("change", reset);
  });
}