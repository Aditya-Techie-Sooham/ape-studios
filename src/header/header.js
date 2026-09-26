import gsap from "gsap";


export function initHeader() {

  const header =
    document.getElementById(
      "site-header"
    );


  const toggle =
    document.getElementById(
      "site-menu-toggle"
    );


  const menu =
    document.getElementById(
      "site-mobile-menu"
    );


  const hero =
    document.getElementById(
      "ape-hero"
    );


  if (
    !header
  ) {
    return;
  }


  let menuOpen =
    false;


  /* =====================================================
     HEADER THEME
  ===================================================== */

  function updateHeaderTheme() {

    if (
      !hero
    ) {

      header.classList.add(
        "is-light"
      );

      return;
    }


    const heroRect =
      hero
        .getBoundingClientRect();


    /*
     * Light header begins near end of hero.
     */

    const shouldBeLight =
      heroRect.bottom <=
      window.innerHeight *
      0.35;


    header.classList.toggle(
      "is-light",
      shouldBeLight ||
      menuOpen
    );

  }


  /* =====================================================
     MENU
  ===================================================== */

  function openMenu() {

    if (
      !toggle ||
      !menu
    ) {
      return;
    }


    menuOpen =
      true;


    header.classList.add(
      "is-menu-open",
      "is-light"
    );


    toggle.setAttribute(
      "aria-expanded",
      "true"
    );


    toggle.setAttribute(
      "aria-label",
      "Close menu"
    );


    menu.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    const links =
      menu.querySelectorAll(
        ".site-mobile-menu__links a"
      );


    gsap.fromTo(
      links,
      {
        opacity:
          0,

        y:
          35
      },
      {
        opacity:
          1,

        y:
          0,

        duration:
          0.55,

        stagger:
          0.05,

        ease:
          "power3.out"
      }
    );

  }


  function closeMenu() {

    if (
      !toggle ||
      !menu
    ) {
      return;
    }


    menuOpen =
      false;


    header.classList.remove(
      "is-menu-open"
    );


    toggle.setAttribute(
      "aria-expanded",
      "false"
    );


    toggle.setAttribute(
      "aria-label",
      "Open menu"
    );


    menu.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";


    updateHeaderTheme();

  }


  function toggleMenu() {

    if (
      menuOpen
    ) {

      closeMenu();

    }

    else {

      openMenu();

    }

  }


  if (
    toggle
  ) {

    toggle.addEventListener(
      "click",
      toggleMenu
    );

  }


  if (
    menu
  ) {

    menu
      .querySelectorAll(
        "a"
      )
      .forEach(
        function (
          link
        ) {

          link.addEventListener(
            "click",
            closeMenu
          );

        }
      );

  }


  /* =====================================================
     SCROLL
  ===================================================== */

  window.addEventListener(
    "scroll",
    updateHeaderTheme,
    {
      passive:
        true
    }
  );


  window.addEventListener(
    "resize",
    function () {

      if (
        window.innerWidth >
        767 &&
        menuOpen
      ) {

        closeMenu();

      }


      updateHeaderTheme();

    }
  );


  updateHeaderTheme();

}