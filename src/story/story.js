import gsap from "gsap";


export function createStoryController({
  section
}) {

  /* =====================================================
     DOM
  ===================================================== */

  const stage =
    section.querySelector(
      ".ape-story__stage"
    );


  const scenes =
    Array.from(
      section.querySelectorAll(
        ".story-scene"
      )
    );


  const indexElement =
    document.getElementById(
      "story-current-index"
    );


  const labelElement =
    document.getElementById(
      "story-current-label"
    );


  const progressFill =
    document.getElementById(
      "story-progress-fill"
    );


  if (
    !stage ||
    scenes.length === 0
  ) {

    console.error(
      "[APE STORY] Story DOM missing."
    );

    return null;
  }


  const labels = [
    "PEOPLE",
    "CULTURE",
    "INSIDE APE",
    "STUDIO",
    "FILM",
    "DIGITAL",
    "BRAND",
    "GROWTH"
  ];


  const SCENE_COUNT =
    scenes.length;


  let currentIndex =
    -1;


  /* =====================================================
     HELPERS
  ===================================================== */

  function clamp(
    value,
    min = 0,
    max = 1
  ) {

    return Math.min(
      Math.max(
        value,
        min
      ),
      max
    );

  }


  function smoothStep(
    value
  ) {

    const v =
      clamp(
        value
      );


    return (
      v *
      v *
      (
        3 -
        2 *
        v
      )
    );

  }


  function range(
    value,
    start,
    end
  ) {

    if (
      end <= start
    ) {

      return 0;
    }


    return smoothStep(

      clamp(

        (
          value -
          start
        )

        /

        (
          end -
          start
        )

      )

    );

  }


  /* =====================================================
     REAL MEDIA
  ===================================================== */

  function setupMedia() {

    const mediaElements =
      section.querySelectorAll(
        "[data-story-media]"
      );


    mediaElements.forEach(
      function (
        media
      ) {

        /* ---------------------------------------------
           IMAGE
        --------------------------------------------- */

        if (
          media.tagName ===
          "IMG"
        ) {

          function revealImage() {

            if (
              media.naturalWidth >
              0
            ) {

              media.classList.add(
                "is-loaded"
              );

            }

          }


          if (
            media.complete
          ) {

            revealImage();

          }


          media.addEventListener(
            "load",
            revealImage
          );


          media.addEventListener(
            "error",
            function () {

              console.warn(
                "[APE STORY] Image failed:",
                media.src
              );

            }
          );

        }


        /* ---------------------------------------------
           VIDEO
        --------------------------------------------- */

        else if (
          media.tagName ===
          "VIDEO"
        ) {

          function revealVideo() {

            media.classList.add(
              "is-loaded"
            );


            media
              .play()
              .catch(
                function () {}
              );

          }


          if (
            media.readyState >=
            2
          ) {

            revealVideo();

          }


          media.addEventListener(
            "loadeddata",
            revealVideo
          );


          media.addEventListener(
            "canplay",
            revealVideo
          );

        }

      }
    );

  }


  setupMedia();


  /* =====================================================
     TRUE FIXED STAGE
  ===================================================== */

  function updateStageState() {

    const rect =
      section.getBoundingClientRect();


    /*
     * BEFORE STORY
     */

    if (
      rect.top >
      0
    ) {

      stage.classList.remove(
        "is-fixed",
        "is-ended"
      );


      stage.classList.add(
        "is-before"
      );


      return "before";

    }


    /*
    * STORY IS PLAYING
    *
    * Keep the stage fixed while there is
    * more than one viewport of story remaining.
    */
    if (
      rect.bottom >
      window.innerHeight
    ) {

      stage.classList.remove(
        "is-before",
        "is-ended"
      );


      stage.classList.add(
        "is-fixed"
      );


      return "fixed";
    }


    /*
    * STORY RELEASE
    *
    * As soon as the footer starts approaching
    * the viewport, release the fixed stage.
    *
    * The final story scene now scrolls upward
    * naturally while the footer enters below it.
    */
    stage.classList.remove(
      "is-before",
      "is-fixed"
    );


    stage.classList.add(
      "is-ended"
    );


    return "ended";

  }


  /* =====================================================
     SCENE WEIGHT
  ===================================================== */

  function getSceneWeight(
    progress,
    index
  ) {

    const size =
      1 /
      SCENE_COUNT;


    const start =
      index *
      size;


    const end =
      (
        index +
        1
      )
      *
      size;


    /*
     * Small intentional overlap.
     *
     * Scene B begins BEFORE Scene A fully disappears.
     */

    const overlap =
      size *
      0.14;


    const enter =

      index === 0
        ? 1
        : range(
            progress,
            start -
            overlap,
            start +
            overlap
          );


    const leave =

      index ===
      SCENE_COUNT - 1
        ? 1
        : (
            1 -
            range(
              progress,
              end -
              overlap,
              end +
              overlap
            )
          );


    return (
      enter *
      leave
    );

  }


  /* =====================================================
     LOCAL SCENE PROGRESS
  ===================================================== */

  function getLocalProgress(
    progress,
    index
  ) {

    const size =
      1 /
      SCENE_COUNT;


    const start =
      index *
      size;


    return clamp(

      (
        progress -
        start
      )

      /

      size

    );

  }


  /* =====================================================
     TRANSITION MOTION
  ===================================================== */

  function updateTransitionScene(
    scene,
    local,
    index
  ) {

    const copy =
      scene.querySelector(
        ".story-transition__copy"
      );


    const number =
      scene.querySelector(
        ".story-transition__number"
      );


    if (
      copy
    ) {

      /*
       * The copy stays almost completely stationary.
       *
       * No more text lagging behind a moving background.
       */

      gsap.set(
        copy,
        {

          x:
            -10 +
            local *
            10,

          scale:
            0.99 +
            local *
            0.01

        }
      );

    }


    if (
      number
    ) {

      gsap.set(
        number,
        {

          opacity:
            0.45 +
            local *
            0.55

        }
      );

    }


    /*
     * Give every transition a slightly different treatment.
     */

    if (
      index === 0 &&
      copy
    ) {

      gsap.set(
        copy,
        {
          rotation:
            0
        }
      );

    }


    else if (
      index === 1 &&
      copy
    ) {

      gsap.set(
        copy,
        {
          x:
            18 -
            local *
            18
        }
      );

    }


    else if (
      index === 2 &&
      copy
    ) {

      gsap.set(
        copy,
        {
          scale:
            0.975 +
            local *
            0.025
        }
      );

    }

  }


  /* =====================================================
     STUDIO
  ===================================================== */

  function updateStudio(
    scene,
    local
  ) {

    const media =
      scene.querySelector(
        ".story-studio__media"
      );


    const copy =
      scene.querySelector(
        ".story-studio__copy"
      );


    if (
      media
    ) {

      gsap.set(
        media,
        {

          scale:
            0.96 +
            local *
            0.04,

          rotation:
            -1.5 +
            local *
            1.5,

          x:
            24 -
            local *
            24

        }
      );

    }


    if (
      copy
    ) {

      gsap.set(
        copy,
        {

          y:
            18 -
            local *
            18

        }
      );

    }

  }


  /* =====================================================
     FILM
  ===================================================== */

  function updateFilm(
    scene,
    local
  ) {

    const media =
      scene.querySelector(
        ".story-film__media"
      );


    const copy =
      scene.querySelector(
        ".story-film__copy"
      );


    const word =
      scene.querySelector(
        ".story-film__word"
      );


    if (
      media
    ) {

      gsap.set(
        media,
        {

          y:
            44 -
            local *
            44,

          rotation:
            -5 +
            local *
            2,

          scale:
            0.92 +
            local *
            0.08

        }
      );

    }


    if (
      copy
    ) {

      gsap.set(
        copy,
        {

          x:
            34 -
            local *
            34

        }
      );

    }


    if (
      word
    ) {

      gsap.set(
        word,
        {

          xPercent:
            -8 *
            local

        }
      );

    }

  }


  /* =====================================================
     DIGITAL
  ===================================================== */

  function updateDigital(
    scene,
    local
  ) {

    const media =
      scene.querySelector(
        ".story-digital__media"
      );


    if (
      media
    ) {

      gsap.set(
        media,
        {

          scaleX:
            0.88 +
            local *
            0.12,

          scaleY:
            0.94 +
            local *
            0.06

        }
      );

    }

  }


  /* =====================================================
     BRAND
  ===================================================== */

  function updateBrand(
    scene,
    local
  ) {

    const media =
      scene.querySelector(
        ".story-brand__media"
      );


    const word =
      scene.querySelector(
        ".story-brand__word"
      );


    if (
      media
    ) {

      gsap.set(
        media,
        {

          x:
            38 -
            local *
            38,

          rotation:
            4 -
            local *
            2,

          scale:
            0.94 +
            local *
            0.06

        }
      );

    }


    if (
      word
    ) {

      gsap.set(
        word,
        {

          xPercent:
            -10 +
            local *
            6

        }
      );

    }

  }


  /* =====================================================
     FINAL
  ===================================================== */

  function updateFinal(
    scene,
    local
  ) {

    const media =
      scene.querySelector(
        ".story-final__media"
      );


    const copy =
      scene.querySelector(
        ".story-final__copy"
      );


    if (
      media
    ) {

      gsap.set(
        media,
        {

          scale:
            0.92 +
            local *
            0.08,

          borderRadius:
            30 -
            local *
            30

        }
      );

    }


    if (
      copy
    ) {

      gsap.set(
        copy,
        {

          y:
            28 -
            local *
            28

        }
      );

    }

  }


  /* =====================================================
     UPDATE
  ===================================================== */

  function update(
    progress
  ) {

    updateStageState();


    const p =
      clamp(
        progress
      );


    let strongestIndex =
      0;


    let strongestWeight =
      -1;


    scenes.forEach(
      function (
        scene,
        index
      ) {

        const weight =
          getSceneWeight(
            p,
            index
          );


        const local =
          getLocalProgress(
            p,
            index
          );


        if (
          weight >
          strongestWeight
        ) {

          strongestWeight =
            weight;

          strongestIndex =
            index;

        }


        scene.classList.toggle(
          "is-visible",
          weight >
          0.002
        );


        gsap.set(
          scene,
          {

            opacity:
              weight,

            visibility:
              weight >
              0.002
                ? "visible"
                : "hidden",

            zIndex:
              weight >
              0.5
                ? 40
                : 30

          }
        );


        if (
          index <= 2
        ) {

          updateTransitionScene(
            scene,
            local,
            index
          );

        }


        else if (
          index === 3
        ) {

          updateStudio(
            scene,
            local
          );

        }


        else if (
          index === 4
        ) {

          updateFilm(
            scene,
            local
          );

        }


        else if (
          index === 5
        ) {

          updateDigital(
            scene,
            local
          );

        }


        else if (
          index === 6
        ) {

          updateBrand(
            scene,
            local
          );

        }


        else if (
          index === 7
        ) {

          updateFinal(
            scene,
            local
          );

        }

      }
    );


    /* =================================================
       UI
    ================================================= */

    if (
      strongestIndex !==
      currentIndex
    ) {

      currentIndex =
        strongestIndex;


      if (
        indexElement
      ) {

        indexElement.textContent =
          String(
            currentIndex +
            1
          )
          .padStart(
            2,
            "0"
          );

      }


      if (
        labelElement
      ) {

        labelElement.textContent =
          labels[
            currentIndex
          ] ||
          "";

      }

    }


    if (
      progressFill
    ) {

      progressFill.style.transform =
        `scaleX(${p})`;

    }

  }


  /* =====================================================
     RETURN
  ===================================================== */

  return {

    update,

    updateStageState

  };

}