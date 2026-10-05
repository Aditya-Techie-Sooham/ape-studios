/* =========================================================
   APE STUDIO — HOME PROJECT POPUP

   The popup opens once the complete Hero scroll experience
   has finished.

   It does NOT interfere with hero.js.
========================================================= */


export function initHomeProjectPopup() {


  /* =======================================================
     ELEMENTS
  ======================================================= */

  const popup =
    document.getElementById(
      "home-project-popup"
    );


  const hero =
    document.getElementById(
      "ape-hero"
    );


  if (
    !popup
    ||
    !hero
  ) {

    return;

  }



  const dialog =
    popup.querySelector(
      ".home-project-popup__dialog"
    );


  const closeButton =
    document.getElementById(
      "home-project-popup-close"
    );


  const closeTriggers =
    popup.querySelectorAll(
      "[data-popup-close]"
    );


  const projectLink =
    popup.querySelector(
      ".home-project-popup__cta"
    );



  /* =======================================================
     STATE
  ======================================================= */

  let hasTriggered =
    false;


  let isOpen =
    false;


  let previousActiveElement =
    null;


  let scrollQueued =
    false;



  /* =======================================================
     OPEN
  ======================================================= */

  function openPopup() {

    if (
      hasTriggered
      ||
      isOpen
    ) {

      return;

    }


    hasTriggered =
      true;


    isOpen =
      true;


    previousActiveElement =
      document.activeElement;


    popup.classList.add(
      "is-open"
    );


    popup.setAttribute(
      "aria-hidden",
      "false"
    );


    document.documentElement.classList.add(
      "home-popup-open"
    );


    document.body.classList.add(
      "home-popup-open"
    );



    /*
     * Focus the close button after the entrance starts.
     */

    window.setTimeout(
      function () {

        if (
          closeButton
        ) {

          closeButton.focus(
            {
              preventScroll: true
            }
          );

        }

      },
      420
    );

  }



  /* =======================================================
     CLOSE
  ======================================================= */

  function closePopup() {

    if (
      !isOpen
    ) {

      return;

    }


    isOpen =
      false;


    popup.classList.remove(
      "is-open"
    );


    popup.setAttribute(
      "aria-hidden",
      "true"
    );


    document.documentElement.classList.remove(
      "home-popup-open"
    );


    document.body.classList.remove(
      "home-popup-open"
    );



    /*
     * Restore keyboard focus.
     */

    if (
      previousActiveElement
      &&
      typeof previousActiveElement.focus ===
      "function"
    ) {

      window.setTimeout(
        function () {

          previousActiveElement.focus(
            {
              preventScroll: true
            }
          );

        },
        260
      );

    }

  }



  /* =======================================================
     HERO END DETECTION
  ======================================================= */

  function checkHeroEnd() {

    if (
      hasTriggered
    ) {

      return;

    }



    /*
     * hero.js dynamically sets the complete Hero height to:
     *
     * video scroll distance
     * +
     * transition distance
     * +
     * viewport height
     *
     * Therefore:
     *
     * hero top
     * +
     * hero height
     * -
     * viewport height
     *
     * = exact point where the pinned Hero completes.
     */

    const heroTop =
      hero.getBoundingClientRect().top
      +
      window.scrollY;


    const heroEnd =
      heroTop
      +
      hero.offsetHeight
      -
      window.innerHeight;



    /*
     * Trigger slightly before the browser mathematically
     * passes the final pixel, so it feels intentional.
     */

    const triggerPoint =
      heroEnd -
      20;



    if (
      window.scrollY >=
      triggerPoint
    ) {

      openPopup();

    }

  }



  /* =======================================================
     SCROLL
  ======================================================= */

  function onScroll() {

    if (
      hasTriggered
      ||
      scrollQueued
    ) {

      return;

    }


    scrollQueued =
      true;


    requestAnimationFrame(
      function () {

        scrollQueued =
          false;


        checkHeroEnd();

      }
    );

  }



  window.addEventListener(
    "scroll",
    onScroll,
    {
      passive: true
    }
  );



  /* =======================================================
     CLOSE BUTTONS / BACKDROP / MAYBE LATER
  ======================================================= */

  closeTriggers.forEach(
    function (
      trigger
    ) {

      trigger.addEventListener(
        "click",
        function () {

          closePopup();

        }
      );

    }
  );



  /* =======================================================
     PROJECT CTA

     Let navigation happen normally.
     Just remove popup lock first.
  ======================================================= */

  if (
    projectLink
  ) {

    projectLink.addEventListener(
      "click",
      function () {

        document.documentElement.classList.remove(
          "home-popup-open"
        );


        document.body.classList.remove(
          "home-popup-open"
        );

      }
    );

  }



  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  document.addEventListener(
    "keydown",
    function (
      event
    ) {

      if (
        !isOpen
      ) {

        return;

      }


      if (
        event.key ===
        "Escape"
      ) {

        event.preventDefault();


        closePopup();

      }

    }
  );



  /* =======================================================
     SIMPLE FOCUS TRAP
  ======================================================= */

  document.addEventListener(
    "keydown",
    function (
      event
    ) {

      if (
        !isOpen
        ||
        event.key !==
        "Tab"
        ||
        !dialog
      ) {

        return;

      }


      const focusable =
        Array.from(
          dialog.querySelectorAll(
            `
              a[href],
              button:not([disabled]),
              [tabindex]:not([tabindex="-1"])
            `
          )
        );


      if (
        focusable.length === 0
      ) {

        return;

      }


      const first =
        focusable[0];


      const last =
        focusable[
          focusable.length - 1
        ];



      if (
        event.shiftKey
        &&
        document.activeElement ===
        first
      ) {

        event.preventDefault();


        last.focus();

      }


      else if (
        !event.shiftKey
        &&
        document.activeElement ===
        last
      ) {

        event.preventDefault();


        first.focus();

      }

    }
  );



  /* =======================================================
     INITIAL CHECK

     Useful if browser restores the page close to Hero end.
  ======================================================= */

  requestAnimationFrame(
    function () {

      checkHeroEnd();

    }
  );

}