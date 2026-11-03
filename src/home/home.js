import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


gsap.registerPlugin(
  ScrollTrigger
);



/* =========================================================
   HOME
========================================================= */

export function initHome() {


  initFooterYear();


  /*
   * WHO image → video.
   */

  setupWhoVideo();


  /*
   * Prepare client marquee clones.
   */

  prepareClientRows();


  /*
   * FAQ already exists in HTML.
   */

  initFAQInteraction();


  const reduced =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduced) {

    showReducedState();

    return;

  }


  /*
   * HERO
   *
   * KEEP EXISTING LETTER LOGIC.
   */

  initHeroAlphabetExchange();


  /*
   * Homepage systems.
   */

  initScenes();

  initWho();

  initServices();

  initWork();

  initClients();

  initRecognition();

  initFAQMotion();


  requestAnimationFrame(
    function () {

      ScrollTrigger.refresh();

    }
  );

}



/* =========================================================
   WHO VIDEO
========================================================= */

function setupWhoVideo() {

  const section =
    document.getElementById(
      "home-who"
    );


  if (!section) {
    return;
  }


  const imageFrame =
    section.querySelector(
      ".home-who__image"
    );


  if (!imageFrame) {
    return;
  }


  if (
    imageFrame.querySelector(
      ".home-who__work-video"
    )
  ) {

    return;

  }


  const currentImage =
    imageFrame.querySelector(
      "img"
    );


  const video =
    document.createElement(
      "video"
    );


  video.className =
    "home-who__work-video";


  video.src =
    "/videos/apework.mp4";


  video.muted =
    true;


  video.defaultMuted =
    true;


  video.autoplay =
    true;


  video.loop =
    true;


  video.playsInline =
    true;


  video.preload =
    "auto";


  video.setAttribute(
    "muted",
    ""
  );


  video.setAttribute(
    "playsinline",
    ""
  );


  video.setAttribute(
    "webkit-playsinline",
    ""
  );


  if (
    currentImage?.src
  ) {

    video.poster =
      currentImage.src;

  }


  if (currentImage) {

    currentImage.replaceWith(
      video
    );

  }

  else {

    imageFrame.appendChild(
      video
    );

  }


  function playVideo() {

    const request =
      video.play();


    if (
      request &&
      typeof request.catch ===
      "function"
    ) {

      request.catch(
        function () {}
      );

    }

  }


  playVideo();


  window.addEventListener(
    "pageshow",
    playVideo
  );

}



/* =========================================================
   HERO ALPHABET EXCHANGE

   KEEP HERO BEHAVIOUR
========================================================= */

function createHeroAlphabetExchangeController(
  characters,
  isMobile
) {

  const letters =
    characters.filter(
      function (
        character
      ) {

        const final =
          character.dataset.final
          ||
          "";


        return /^[A-Za-z]$/.test(
          final
        );

      }
    );


  let interval =
    null;


  let restoreTimer =
    null;


  let running =
    false;


  let exchangeCount =
    0;



  function restore() {

    characters.forEach(
      function (
        character
      ) {

        if (
          character.dataset.final !==
          undefined
        ) {

          character.textContent =
            character.dataset.final;

        }


        gsap.set(
          character,
          {
            x:
              0,

            y:
              0,

            rotation:
              0,

            opacity:
              1,

            filter:
              "blur(0px)"
          }
        );

      }
    );

  }



  function chooseCharacters(
    amount = 3
  ) {

    const shuffled =
      gsap.utils.shuffle(
        [
          ...letters
        ]
      );


    const selected =
      [];


    const usedWords =
      new Set();


    shuffled.forEach(
      function (
        character
      ) {

        if (
          selected.length >=
          amount
        ) {

          return;

        }


        const word =
          character.dataset.wordIndex
          ??
          "unknown";


        if (
          usedWords.has(
            word
          )
        ) {

          return;

        }


        usedWords.add(
          word
        );


        selected.push(
          character
        );

      }
    );


    return selected;

  }



  function exchange() {

    if (!running) {
      return;
    }


    const selected =
      chooseCharacters(
        3
      );


    if (
      selected.length <
      2
    ) {

      return;

    }


    const values =
      selected.map(
        function (
          character
        ) {

          return character.dataset.final;

        }
      );


    gsap.to(
      selected,
      {
        y:
          isMobile()
            ? -3
            : -5,

        opacity:
          0.68,

        duration:
          0.18,

        stagger:
          0.025,

        ease:
          "power2.in",


        onComplete:
          function () {

            selected.forEach(
              function (
                character,
                index
              ) {

                const source =
                  (
                    index -
                    1 +
                    values.length
                  )
                  %
                  values.length;


                character.textContent =
                  values[
                    source
                  ];

              }
            );


            gsap.to(
              selected,
              {
                y:
                  0,

                opacity:
                  1,

                duration:
                  0.29,

                stagger:
                  0.025,

                ease:
                  "power3.out"
              }
            );

          }

      }
    );

  }



  function start() {

    stop(
      true
    );


    running =
      true;


    exchangeCount =
      0;


    const speed =
      isMobile()
        ? 520
        : 455;


    interval =
      window.setInterval(
        function () {

          if (!running) {
            return;
          }


          exchange();


          exchangeCount +=
            1;


          if (
            exchangeCount >=
            7
          ) {

            window.clearInterval(
              interval
            );


            interval =
              null;


            restoreTimer =
              window.setTimeout(
                restore,
                520
              );

          }

        },
        speed
      );

  }



  function stop(
    shouldRestore = true
  ) {

    running =
      false;


    if (interval) {

      window.clearInterval(
        interval
      );


      interval =
        null;

    }


    if (restoreTimer) {

      window.clearTimeout(
        restoreTimer
      );


      restoreTimer =
        null;

    }


    gsap.killTweensOf(
      characters
    );


    if (
      shouldRestore
    ) {

      restore();

    }

  }


  return {

    start,

    stop,

    restore

  };

}



/* =========================================================
   HERO ALPHABET EXCHANGE
========================================================= */

function initHeroAlphabetExchange() {

  const hero =
    document.getElementById(
      "ape-hero"
    );


  if (!hero) {
    return;
  }


  const lines =
    Array.from(
      hero.querySelectorAll(
        ".ape-hero__title-line"
      )
    );


  if (!lines.length) {
    return;
  }


  const characters =
    [];


  let globalWordIndex =
    0;


  lines.forEach(
    function (
      line
    ) {

      const original =
        line.textContent
          .replace(
            /\s+/g,
            " "
          )
          .trim();


      line.textContent =
        "";


      const words =
        original.split(
          " "
        );


      words.forEach(
        function (
          word,
          wordIndex
        ) {

          const wordElement =
            document.createElement(
              "span"
            );


          wordElement.className =
            "ape-alpha-word";


          Array
            .from(
              word
            )
            .forEach(
              function (
                character
              ) {

                const span =
                  document.createElement(
                    "span"
                  );


                span.className =
                  "ape-alpha-char";


                span.dataset.final =
                  character;


                span.dataset.wordIndex =
                  String(
                    globalWordIndex
                  );


                span.textContent =
                  character;


                wordElement.appendChild(
                  span
                );


                characters.push(
                  span
                );

              }
            );


          line.appendChild(
            wordElement
          );


          globalWordIndex +=
            1;


          if (
            wordIndex <
            words.length -
            1
          ) {

            line.appendChild(
              document.createTextNode(
                " "
              )
            );

          }

        }
      );

    }
  );


  if (!characters.length) {
    return;
  }


  const isMobile =
    function () {

      return (
        window.innerWidth <
        768
      );

    };


  const exchange =
    createHeroAlphabetExchangeController(
      characters,
      isMobile
    );


  let loop =
    null;



  function run() {

    if (loop) {

      loop.kill();

    }


    exchange.stop(
      true
    );


    loop =
      gsap.timeline({
        repeat:
          -1
      });


    loop.call(
      function () {

        exchange.start();

      }
    );


    loop.to(
      {},
      {
        duration:
          isMobile()
            ? 4.1
            : 3.8
      }
    );


    loop.call(
      function () {

        exchange.stop(
          true
        );

      }
    );


    loop.to(
      {},
      {
        duration:
          5.3
      }
    );

  }


  ScrollTrigger.create({

    trigger:
      hero,

    start:
      "top 90%",

    end:
      "bottom 10%",


    onEnter:
      run,


    onEnterBack:
      run,


    onLeave:
      function () {

        loop?.pause();


        exchange.stop(
          true
        );

      },


    onLeaveBack:
      function () {

        loop?.pause();


        exchange.stop(
          true
        );

      }

  });


  gsap.delayedCall(
    1.4,
    run
  );

}



/* =========================================================
   WHO TEXT PREPARATION

   REAL TEXT NEVER CHANGES.
========================================================= */

function prepareWhoHeading(
  heading
) {

  if (!heading) {
    return [];
  }


  if (
    heading.dataset.kineticReady ===
    "true"
  ) {

    return Array.from(
      heading.querySelectorAll(
        ".home-who__kinetic-char"
      )
    );

  }


  const textNodes =
    [];


  const walker =
    document.createTreeWalker(
      heading,
      NodeFilter.SHOW_TEXT
    );


  let node;


  while (
    (
      node =
        walker.nextNode()
    )
  ) {

    if (
      node.textContent.trim()
    ) {

      textNodes.push(
        node
      );

    }

  }


  const characters =
    [];


  let globalWordIndex =
    0;


  textNodes.forEach(
    function (
      textNode
    ) {

      const words =
        textNode.textContent
          .trim()
          .replace(
            /\s+/g,
            " "
          )
          .split(
            " "
          );


      const fragment =
        document.createDocumentFragment();


      words.forEach(
        function (
          word,
          wordIndex
        ) {

          const wordWrapper =
            document.createElement(
              "span"
            );


          wordWrapper.className =
            "home-who__kinetic-word";


          Array
            .from(
              word
            )
            .forEach(
              function (
                character
              ) {

                const characterElement =
                  document.createElement(
                    "span"
                  );


                characterElement.className =
                  "home-who__kinetic-char";


                characterElement.dataset.final =
                  character;


                characterElement.dataset.wordIndex =
                  String(
                    globalWordIndex
                  );


                /*
                 * IMPORTANT:
                 *
                 * This actual text NEVER gets replaced.
                 */

                characterElement.textContent =
                  character;


                wordWrapper.appendChild(
                  characterElement
                );


                if (
                  /^[A-Za-z]$/.test(
                    character
                  )
                ) {

                  characters.push(
                    characterElement
                  );

                }

              }
            );


          fragment.appendChild(
            wordWrapper
          );


          globalWordIndex +=
            1;


          if (
            wordIndex <
            words.length -
            1
          ) {

            fragment.appendChild(
              document.createTextNode(
                " "
              )
            );

          }

        }
      );


      textNode.parentNode.replaceChild(
        fragment,
        textNode
      );

    }
  );


  heading.dataset.kineticReady =
    "true";


  return characters;

}



/* =========================================================
   WHO LETTER TRAVEL

   THIS IS THE FIX.

   REAL WORDS STAY:
   THINK BIG.
   THINK APE.

   ONLY CLONED LETTERS MOVE BETWEEN WORDS.
========================================================= */

function createWhoLetterTravelController(
  characters,
  isMobile
) {

  let timer =
    null;


  let running =
    false;


  let activeFlyers =
    [];


  const validCharacters =
    characters.filter(
      function (
        character
      ) {

        return /^[A-Za-z]$/.test(
          character.dataset.final
          ||
          ""
        );

      }
    );



  /* =====================================================
     REMOVE FLYING COPIES
  ===================================================== */

  function cleanFlyers() {

    activeFlyers.forEach(
      function (
        flyer
      ) {

        gsap.killTweensOf(
          flyer
        );


        flyer.remove();

      }
    );


    activeFlyers =
      [];

  }



  /* =====================================================
     FIND LETTERS FROM DIFFERENT WORDS
  ===================================================== */

  function choosePair() {

    if (
      validCharacters.length <
      2
    ) {

      return null;

    }


    const shuffled =
      gsap.utils.shuffle(
        [
          ...validCharacters
        ]
      );


    const first =
      shuffled[0];


    const second =
      shuffled.find(
        function (
          character
        ) {

          return (
            character !==
            first
            &&
            character.dataset.wordIndex !==
            first.dataset.wordIndex
          );

        }
      );


    if (!second) {
      return null;
    }


    return [
      first,
      second
    ];

  }



  /* =====================================================
     CREATE VISUAL COPY
  ===================================================== */

  function createFlyer(
    source
  ) {

    const rect =
      source.getBoundingClientRect();


    const computed =
      window.getComputedStyle(
        source
      );


    const flyer =
      document.createElement(
        "span"
      );


    flyer.textContent =
      source.dataset.final;


    flyer.setAttribute(
      "aria-hidden",
      "true"
    );


    Object.assign(
      flyer.style,
      {
        position:
          "fixed",

        zIndex:
          "9999",

        left:
          `${rect.left}px`,

        top:
          `${rect.top}px`,

        width:
          `${rect.width}px`,

        height:
          `${rect.height}px`,

        display:
          "inline-flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        margin:
          "0",

        padding:
          "0",

        pointerEvents:
          "none",

        fontFamily:
          computed.fontFamily,

        fontSize:
          computed.fontSize,

        fontWeight:
          computed.fontWeight,

        fontStyle:
          computed.fontStyle,

        lineHeight:
          computed.lineHeight,

        letterSpacing:
          computed.letterSpacing,

        color:
          computed.color,

        WebkitTextStroke:
          computed.webkitTextStroke,

        textTransform:
          computed.textTransform,

        transformOrigin:
          "center center",

        willChange:
          "transform, opacity, filter"
      }
    );


    document.body.appendChild(
      flyer
    );


    activeFlyers.push(
      flyer
    );


    return {

      element:
        flyer,

      rect

    };

  }



  /* =====================================================
     CROSS-FLY LETTERS
  ===================================================== */

  function travel() {

    if (!running) {
      return;
    }


    const pair =
      choosePair();


    if (!pair) {
      return;
    }


    const [
      first,
      second
    ] =
      pair;


    const firstFlyer =
      createFlyer(
        first
      );


    const secondFlyer =
      createFlyer(
        second
      );


    const firstTarget =
      second.getBoundingClientRect();


    const secondTarget =
      first.getBoundingClientRect();


    /*
     * Small glow on REAL letters.
     * They stay correctly spelled.
     */

    gsap.fromTo(
      [
        first,
        second
      ],
      {
        scale:
          1
      },
      {
        scale:
          1.08,

        duration:
          0.22,

        yoyo:
          true,

        repeat:
          1,

        ease:
          "power2.out"
      }
    );


    /*
     * FIRST LETTER
     * flies to SECOND word.
     */

    gsap.to(
      firstFlyer.element,
      {
        x:
          firstTarget.left -
          firstFlyer.rect.left,

        y:
          firstTarget.top -
          firstFlyer.rect.top,

        rotation:
          isMobile()
            ? 10
            : 16,

        scale:
          1.12,

        opacity:
          0.08,

        filter:
          "blur(1.5px)",

        duration:
          isMobile()
            ? 0.95
            : 1.1,

        ease:
          "power3.inOut",

        onComplete:
          function () {

            firstFlyer.element.remove();


            activeFlyers =
              activeFlyers.filter(
                function (
                  element
                ) {

                  return (
                    element !==
                    firstFlyer.element
                  );

                }
              );

          }
      }
    );


    /*
     * SECOND LETTER
     * flies back to FIRST word.
     */

    gsap.to(
      secondFlyer.element,
      {
        x:
          secondTarget.left -
          secondFlyer.rect.left,

        y:
          secondTarget.top -
          secondFlyer.rect.top,

        rotation:
          isMobile()
            ? -10
            : -16,

        scale:
          1.12,

        opacity:
          0.08,

        filter:
          "blur(1.5px)",

        duration:
          isMobile()
            ? 0.95
            : 1.1,

        ease:
          "power3.inOut",

        onComplete:
          function () {

            secondFlyer.element.remove();


            activeFlyers =
              activeFlyers.filter(
                function (
                  element
                ) {

                  return (
                    element !==
                    secondFlyer.element
                  );

                }
              );

          }
      }
    );

  }



  /* =====================================================
     START LOOP
  ===================================================== */

  function start() {

    stop();


    running =
      true;


    /*
     * First movement.
     */

    window.setTimeout(
      function () {

        if (running) {

          travel();

        }

      },
      650
    );


    /*
     * Moderate speed.
     * Not glitchy.
     */

    timer =
      window.setInterval(
        function () {

          travel();

        },
        isMobile()
          ? 1700
          : 1500
      );

  }



  /* =====================================================
     STOP
  ===================================================== */

  function stop() {

    running =
      false;


    if (timer) {

      window.clearInterval(
        timer
      );


      timer =
        null;

    }


    cleanFlyers();


    gsap.killTweensOf(
      validCharacters
    );


    gsap.set(
      validCharacters,
      {
        scale:
          1,

        opacity:
          1
      }
    );

  }


  return {

    start,

    stop

  };

}



/* =========================================================
   WHO DESCRIPTION
========================================================= */

function prepareWhoDescription(
  description
) {

  if (!description) {
    return [];
  }


  if (
    description.dataset.wordsReady ===
    "true"
  ) {

    return Array.from(
      description.querySelectorAll(
        ".home-who__description-word"
      )
    );

  }


  const words =
    description.textContent
      .trim()
      .replace(
        /\s+/g,
        " "
      )
      .split(
        " "
      );


  description.textContent =
    "";


  const elements =
    [];


  words.forEach(
    function (
      word,
      index
    ) {

      const mask =
        document.createElement(
          "span"
        );


      mask.className =
        "home-who__description-mask";


      const wordElement =
        document.createElement(
          "span"
        );


      wordElement.className =
        "home-who__description-word";


      wordElement.textContent =
        word;


      mask.appendChild(
        wordElement
      );


      description.appendChild(
        mask
      );


      elements.push(
        wordElement
      );


      if (
        index <
        words.length -
        1
      ) {

        description.appendChild(
          document.createTextNode(
            " "
          )
        );

      }

    }
  );


  description.dataset.wordsReady =
    "true";


  return elements;

}



/* =========================================================
   DESCRIPTION LOOP
========================================================= */

function createDescriptionLoop(
  words,
  isMobile
) {

  if (!words.length) {
    return null;
  }


  const timeline =
    gsap.timeline({

      paused:
        true,

      repeat:
        -1

    });


  timeline.set(
    words,
    {
      yPercent:
        105,

      opacity:
        0,

      filter:
        "blur(5px)"
    }
  );


  timeline.to(
    words,
    {
      yPercent:
        0,

      opacity:
        1,

      filter:
        "blur(0px)",

      duration:
        isMobile()
          ? 0.72
          : 0.62,

      stagger:
        isMobile()
          ? 0.035
          : 0.028,

      ease:
        "power4.out"
    }
  );


  timeline.to(
    {},
    {
      duration:
        5
    }
  );


  timeline.to(
    words,
    {
      yPercent:
        -70,

      opacity:
        0,

      filter:
        "blur(3px)",

      duration:
        0.42,

      stagger:
        isMobile()
          ? 0.018
          : 0.014,

      ease:
        "power3.in"
    }
  );


  timeline.to(
    {},
    {
      duration:
        0.8
    }
  );


  return timeline;

}



/* =========================================================
   WHO / ABOUT APE
========================================================= */

function initWho() {

  const section =
    document.getElementById(
      "home-who"
    );


  if (!section) {
    return;
  }


  const heading =
    section.querySelector(
      ".home-who__title"
    );


  const description =
    section.querySelector(
      ".home-who__body p"
    );


  const actions =
    section.querySelector(
      ".home-action"
    );


  const visual =
    section.querySelector(
      ".home-who__visual"
    );


  const imageFrame =
    section.querySelector(
      ".home-who__image"
    );


  const media =
    imageFrame
      ?.querySelector(
        "video, img"
      );


  const finePointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;


  const isMobile =
    function () {

      return (
        window.innerWidth <
        768
      );

    };



  /* =====================================================
     REMOVE OLD SHAPES
  ===================================================== */

  section
    .querySelectorAll(
      [
        ".home-who__rear",
        ".home-who__disc",
        ".home-who__visual-back"
      ].join(",")
    )
    .forEach(
      function (
        element
      ) {

        element.remove();

      }
    );



  /* =====================================================
     PREPARE TEXT
  ===================================================== */

  const headingCharacters =
    prepareWhoHeading(
      heading
    );


  const descriptionWords =
    prepareWhoDescription(
      description
    );


  /*
   * NEW:
   *
   * WHO uses flying clones.
   * Actual heading never changes.
   */

  const letterTravel =
    createWhoLetterTravelController(
      headingCharacters,
      isMobile
    );



  const descriptionTimeline =
    createDescriptionLoop(
      descriptionWords,
      isMobile
    );



  /* =====================================================
     HEADING ENTRANCE
  ===================================================== */

  if (
    headingCharacters.length
  ) {

    gsap.fromTo(
      headingCharacters,
      {
        y:
          isMobile()
            ? 18
            : 30,

        opacity:
          0
      },
      {
        y:
          0,

        opacity:
          1,

        duration:
          0.75,

        stagger:
          0.018,

        ease:
          "power4.out",

        scrollTrigger: {

          trigger:
            section,

          start:
            "top 82%",

          once:
            true

        }
      }
    );

  }



  /* =====================================================
     MEDIA ENTRANCE
  ===================================================== */

  if (visual) {

    gsap.fromTo(
      visual,
      {
        y:
          isMobile()
            ? 30
            : 42,

        opacity:
          0,

        scale:
          0.94
      },
      {
        y:
          0,

        opacity:
          1,

        scale:
          1,

        duration:
          1,

        ease:
          "power4.out",

        scrollTrigger: {

          trigger:
            visual,

          start:
            "top 87%",

          once:
            true

        }
      }
    );

  }



  const media360 =
    setupWhoMedia360({

      section,

      visual,

      imageFrame,

      media,

      finePointer,

      isMobile

    });



  /* =====================================================
     ACTIVE WHEN SECTION IS VISIBLE
  ===================================================== */

  ScrollTrigger.create({

    trigger:
      section,

    start:
      "top 82%",

    end:
      "bottom 10%",


    onEnter:
      function () {

        letterTravel.start();


        descriptionTimeline
          ?.restart();


        gsap.delayedCall(
          0.55,
          function () {

            media360
              ?.spin(
                1,
                1.65
              );

          }
        );

      },


    onEnterBack:
      function () {

        letterTravel.start();


        descriptionTimeline
          ?.play();

      },


    onLeave:
      function () {

        letterTravel.stop();


        descriptionTimeline
          ?.pause();

      },


    onLeaveBack:
      function () {

        letterTravel.stop();


        descriptionTimeline
          ?.pause();

      }

  });



  if (actions) {

    gsap.fromTo(
      actions,
      {
        y:
          18,

        opacity:
          0
      },
      {
        y:
          0,

        opacity:
          1,

        duration:
          0.7,

        ease:
          "power3.out",

        scrollTrigger: {

          trigger:
            section,

          start:
            "top 74%",

          once:
            true

        }
      }
    );

  }

}



/* =========================================================
   WHO MEDIA 360
========================================================= */

function setupWhoMedia360({

  section,

  visual,

  imageFrame,

  media,

  finePointer,

  isMobile

}) {

  if (
    !section ||
    !visual ||
    !imageFrame ||
    !media
  ) {

    return null;

  }


  media.classList.add(
    "home-who__image-front"
  );


  let backMedia =
    imageFrame.querySelector(
      ".home-who__image-back"
    );


  if (
    backMedia &&
    backMedia.tagName !==
    media.tagName
  ) {

    backMedia.remove();


    backMedia =
      null;

  }


  if (!backMedia) {

    backMedia =
      media.cloneNode(
        true
      );


    backMedia.removeAttribute(
      "id"
    );


    backMedia.classList.remove(
      "home-who__image-front"
    );


    backMedia.classList.add(
      "home-who__image-back"
    );


    backMedia.setAttribute(
      "aria-hidden",
      "true"
    );


    if (
      backMedia.tagName ===
      "IMG"
    ) {

      backMedia.alt =
        "";

    }


    if (
      backMedia.tagName ===
      "VIDEO"
    ) {

      backMedia.muted =
        true;


      backMedia.defaultMuted =
        true;


      backMedia.autoplay =
        true;


      backMedia.loop =
        true;


      backMedia.playsInline =
        true;


      backMedia.setAttribute(
        "muted",
        ""
      );


      backMedia.setAttribute(
        "playsinline",
        ""
      );

    }


    imageFrame.appendChild(
      backMedia
    );

  }



  if (
    media.tagName ===
    "VIDEO"
  ) {

    function playVideos() {

      media
        .play()
        ?.catch?.(
          function () {}
        );


      backMedia
        .play()
        ?.catch?.(
          function () {}
        );

    }


    playVideos();

  }



  imageFrame.classList.add(
    "is-360-ready"
  );


  gsap.set(
    imageFrame,
    {
      rotationX:
        0,

      rotationY:
        0,

      rotationZ:
        0,

      transformPerspective:
        1400,

      transformStyle:
        "preserve-3d",

      transformOrigin:
        "50% 50%",

      force3D:
        true
    }
  );


  gsap.set(
    media,
    {
      rotationY:
        0,

      backfaceVisibility:
        "hidden",

      transformStyle:
        "preserve-3d",

      scale:
        1.04
    }
  );


  gsap.set(
    backMedia,
    {
      rotationY:
        180,

      backfaceVisibility:
        "hidden",

      transformStyle:
        "preserve-3d",

      scale:
        1.04
    }
  );



  let tracking =
    false;


  let horizontalDrag =
    false;


  let startX =
    0;


  let startY =
    0;


  let startRotation =
    0;


  let currentRotation =
    0;


  let lastX =
    0;


  let lastTime =
    0;


  let velocityX =
    0;


  let pointerId =
    null;


  let spinTween =
    null;


  let lastHoverSpin =
    0;



  function getRotation() {

    return (
      Number(
        gsap.getProperty(
          imageFrame,
          "rotationY"
        )
      )
      ||
      0
    );

  }



  function nearestFullTurn(
    value
  ) {

    return (
      Math.round(
        value /
        360
      )
      *
      360
    );

  }



  function spin(
    direction = 1,
    duration = 1.55
  ) {

    if (tracking) {
      return;
    }


    spinTween?.kill();


    const current =
      getRotation();


    const base =
      nearestFullTurn(
        current
      );


    const target =
      base
      +
      (
        direction >=
        0
          ? 360
          : -360
      );


    currentRotation =
      target;


    spinTween =
      gsap.to(
        imageFrame,
        {
          rotationY:
            target,

          rotationX:
            0,

          rotationZ:
            0,

          z:
            0,

          y:
            0,

          duration,

          ease:
            "power4.inOut",

          overwrite:
            true,

          onComplete:
            function () {

              spinTween =
                null;

            }
        }
      );

  }



  gsap.to(
    [
      media,
      backMedia
    ],
    {
      yPercent:
        -4,

      ease:
        "none",

      scrollTrigger: {

        trigger:
          section,

        start:
          "top bottom",

        end:
          "bottom top",

        scrub:
          0.8

      }
    }
  );


  visual.style.touchAction =
    "pan-y";


  visual.style.userSelect =
    "none";


  visual.style.webkitUserSelect =
    "none";



  visual.addEventListener(
    "dragstart",
    function (
      event
    ) {

      event.preventDefault();

    }
  );



  visual.addEventListener(
    "pointerdown",
    function (
      event
    ) {

      if (
        event.button !==
        undefined &&
        event.button !==
        0
      ) {

        return;

      }


      spinTween?.kill();


      spinTween =
        null;


      tracking =
        true;


      horizontalDrag =
        false;


      pointerId =
        event.pointerId;


      startX =
        event.clientX;


      lastX =
        event.clientX;


      startY =
        event.clientY;


      lastTime =
        performance.now();


      velocityX =
        0;


      startRotation =
        getRotation();


      currentRotation =
        startRotation;

    }
  );



  visual.addEventListener(
    "pointermove",
    function (
      event
    ) {

      if (
        !tracking &&
        finePointer
      ) {

        const rect =
          visual.getBoundingClientRect();


        const normalizedY =
          (
            event.clientY -
            rect.top
          )
          /
          rect.height
          -
          0.5;


        gsap.to(
          imageFrame,
          {
            rotationX:
              normalizedY *
              -4,

            z:
              8,

            duration:
              0.4,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );


        return;

      }


      if (!tracking) {
        return;
      }


      const deltaX =
        event.clientX -
        startX;


      const deltaY =
        event.clientY -
        startY;


      if (!horizontalDrag) {

        if (
          Math.abs(
            deltaX
          ) <
          6
          &&
          Math.abs(
            deltaY
          ) <
          6
        ) {

          return;

        }


        if (
          Math.abs(
            deltaY
          )
          >
          Math.abs(
            deltaX
          )
          *
          1.15
        ) {

          tracking =
            false;


          pointerId =
            null;


          return;

        }


        horizontalDrag =
          true;


        visual.classList.add(
          "is-dragging"
        );


        try {

          visual.setPointerCapture?.(
            event.pointerId
          );

        }

        catch {}

      }


      if (
        event.cancelable
      ) {

        event.preventDefault();

      }


      const now =
        performance.now();


      const elapsed =
        Math.max(
          now -
          lastTime,
          1
        );


      velocityX =
        (
          event.clientX -
          lastX
        )
        /
        elapsed;


      lastX =
        event.clientX;


      lastTime =
        now;


      const sensitivity =
        isMobile()
          ? 0.92
          : 0.78;


      currentRotation =
        startRotation
        +
        deltaX
        *
        sensitivity;


      gsap.set(
        imageFrame,
        {
          rotationY:
            currentRotation,

          rotationX:
            gsap.utils.clamp(
              -5,
              5,
              -deltaY *
              0.035
            ),

          z:
            14,

          force3D:
            true
        }
      );

    },
    {
      passive:
        false
    }
  );



  function finishRotation(
    event
  ) {

    if (!tracking) {
      return;
    }


    tracking =
      false;


    visual.classList.remove(
      "is-dragging"
    );


    const dragDistance =
      event.clientX -
      startX;


    if (!horizontalDrag) {
      return;
    }


    const momentum =
      velocityX
      *
      (
        isMobile()
          ? 190
          : 160
      );


    const predicted =
      currentRotation
      +
      momentum;


    let target =
      nearestFullTurn(
        predicted
      );


    const startingTurn =
      nearestFullTurn(
        startRotation
      );


    if (
      Math.abs(
        dragDistance
      )
      >
      34
      &&
      target ===
      startingTurn
    ) {

      target +=
        dragDistance >
        0
          ? 360
          : -360;

    }


    if (
      dragDistance >
      0
      &&
      target <
      currentRotation
    ) {

      target +=
        360;

    }


    if (
      dragDistance <
      0
      &&
      target >
      currentRotation
    ) {

      target -=
        360;

    }


    const duration =
      gsap.utils.clamp(
        0.5,
        1.2,
        Math.abs(
          target -
          currentRotation
        )
        /
        330
      );


    spinTween =
      gsap.to(
        imageFrame,
        {
          rotationY:
            target,

          rotationX:
            0,

          rotationZ:
            0,

          z:
            0,

          y:
            0,

          duration,

          ease:
            "power4.out",

          overwrite:
            true,

          onComplete:
            function () {

              currentRotation =
                target;


              spinTween =
                null;

            }
        }
      );


    if (
      pointerId !==
      null
    ) {

      try {

        visual.releasePointerCapture?.(
          pointerId
        );

      }

      catch {}

    }


    pointerId =
      null;


    horizontalDrag =
      false;

  }



  visual.addEventListener(
    "pointerup",
    finishRotation
  );


  visual.addEventListener(
    "pointercancel",
    function () {

      if (!tracking) {
        return;
      }


      tracking =
        false;


      horizontalDrag =
        false;


      visual.classList.remove(
        "is-dragging"
      );


      gsap.to(
        imageFrame,
        {
          rotationY:
            nearestFullTurn(
              getRotation()
            ),

          rotationX:
            0,

          z:
            0,

          y:
            0,

          duration:
            0.6,

          ease:
            "power3.out"
        }
      );


      pointerId =
        null;

    }
  );



  if (finePointer) {

    visual.addEventListener(
      "pointerenter",
      function (
        event
      ) {

        if (tracking) {
          return;
        }


        const now =
          performance.now();


        if (
          now -
          lastHoverSpin
          <
          900
        ) {

          return;

        }


        lastHoverSpin =
          now;


        const rect =
          visual.getBoundingClientRect();


        spin(
          event.clientX
          <
          rect.left
          +
          rect.width /
          2
            ? -1
            : 1,

          1.45
        );

      }
    );


    visual.addEventListener(
      "pointerleave",
      function () {

        if (tracking) {
          return;
        }


        gsap.to(
          imageFrame,
          {
            rotationX:
              0,

            z:
              0,

            y:
              0,

            duration:
              0.5,

            ease:
              "power3.out",

            overwrite:
              "auto"
          }
        );

      }
    );

  }


  return {

    spin

  };

}



/* =========================================================
   GENERIC SCENES
========================================================= */

function initScenes() {

  const scenes =
    document.querySelectorAll(
      ".home-scene"
    );


  scenes.forEach(
    function (
      scene
    ) {

      if (
        scene.id ===
        "home-services"
      ) {

        return;

      }


      const stage =
        scene.querySelector(
          ".home-scene__stage"
        );


      if (!stage) {
        return;
      }


      gsap.fromTo(
        stage,
        {
          scale:
            0.965,

          opacity:
            0.62,

          y:
            35
        },
        {
          scale:
            1,

          opacity:
            1,

          y:
            0,

          ease:
            "none",

          scrollTrigger: {

            trigger:
              scene,

            start:
              "top 92%",

            end:
              "top 28%",

            scrub:
              0.65

          }
        }
      );


      gsap.to(
        stage,
        {
          scale:
            1.025,

          y:
            -28,

          ease:
            "none",

          scrollTrigger: {

            trigger:
              scene,

            start:
              "65% top",

            end:
              "bottom top",

            scrub:
              0.7

          }
        }
      );

    }
  );

}



/* =========================================================
   SERVICES
========================================================= */

function initServices() {

  const section =
    document.getElementById(
      "home-services"
    );


  if (!section) {
    return;
  }


  const stage =
    section.querySelector(
      ".home-services__stage"
    );


  const rows =
    Array.from(
      section.querySelectorAll(
        ".home-service"
      )
    );


  const images =
    Array.from(
      section.querySelectorAll(
        ".home-service-image"
      )
    );


  const visual =
    section.querySelector(
      ".home-services__visual"
    );


  const title =
    section.querySelector(
      ".home-services__title"
    );


  const list =
    section.querySelector(
      ".home-services__list"
    );


  if (
    !stage ||
    !rows.length ||
    !images.length ||
    !visual
  ) {

    return;

  }


  section
    .querySelectorAll(
      [
        ".home-services__back-shape",
        ".home-services__shape"
      ].join(",")
    )
    .forEach(
      function (
        element
      ) {

        element.remove();

      }
    );


  let currentIndex =
    0;


  let scrollIndex =
    0;


  let lastDirection =
    1;



  rows.forEach(
    function (
      row,
      index
    ) {

      row.classList.toggle(
        "is-active",
        index === 0
      );

    }
  );


  images.forEach(
    function (
      image,
      index
    ) {

      image.classList.toggle(
        "is-active",
        index === 0
      );


      gsap.set(
        image,
        {
          autoAlpha:
            index === 0
              ? 1
              : 0,

          scale:
            index === 0
              ? 1
              : 0.94,

          yPercent:
            index === 0
              ? 0
              : 8,

          rotation:
            index === 0
              ? 0
              : 1.5,

          clipPath:
            index === 0
              ?
              "inset(0% 0% 0% 0% round 26px)"
              :
              "inset(100% 0% 0% 0% round 26px)",

          zIndex:
            index === 0
              ? 5
              : 1
        }
      );

    }
  );



  function activate(
    nextIndex,
    direction = 1
  ) {

    const index =
      gsap.utils.clamp(
        0,
        rows.length -
        1,
        nextIndex
      );


    if (
      index ===
      currentIndex
    ) {

      return;

    }


    const previousImage =
      images[
        currentIndex
      ];


    const nextImage =
      images[
        index
      ];


    if (
      !previousImage ||
      !nextImage
    ) {

      return;

    }


    const forward =
      direction >=
      0;


    currentIndex =
      index;


    rows.forEach(
      function (
        row,
        rowIndex
      ) {

        row.classList.toggle(
          "is-active",
          rowIndex ===
          index
        );

      }
    );


    gsap.killTweensOf(
      [
        previousImage,
        nextImage
      ]
    );


    gsap.set(
      nextImage,
      {
        autoAlpha:
          1,

        zIndex:
          6,

        yPercent:
          forward
            ? 8
            : -8,

        scale:
          0.94,

        rotation:
          forward
            ? 1.5
            : -1.5,

        clipPath:
          forward
            ?
            "inset(100% 0% 0% 0% round 26px)"
            :
            "inset(0% 0% 100% 0% round 26px)"
      }
    );


    const timeline =
      gsap.timeline({

        defaults: {
          overwrite:
            true
        },

        onComplete:
          function () {

            previousImage
              .classList
              .remove(
                "is-active"
              );


            nextImage
              .classList
              .add(
                "is-active"
              );


            gsap.set(
              previousImage,
              {
                autoAlpha:
                  0,

                zIndex:
                  1,

                yPercent:
                  0,

                scale:
                  1,

                rotation:
                  0
              }
            );


            gsap.set(
              nextImage,
              {
                autoAlpha:
                  1,

                zIndex:
                  5,

                yPercent:
                  0,

                scale:
                  1,

                rotation:
                  0,

                clipPath:
                  "inset(0% 0% 0% 0% round 26px)"
              }
            );

          }

      });


    timeline.to(
      previousImage,
      {
        autoAlpha:
          0,

        yPercent:
          forward
            ? -6
            : 6,

        scale:
          0.965,

        duration:
          0.48,

        ease:
          "power3.inOut"
      },
      0
    );


    timeline.to(
      nextImage,
      {
        yPercent:
          0,

        scale:
          1,

        rotation:
          0,

        clipPath:
          "inset(0% 0% 0% 0% round 26px)",

        duration:
          0.72,

        ease:
          "power4.inOut"
      },
      0.03
    );


    const nextImageElement =
      nextImage.querySelector(
        "img"
      );


    if (
      nextImageElement
    ) {

      gsap.fromTo(
        nextImageElement,
        {
          scale:
            1.1
        },
        {
          scale:
            1.02,

          duration:
            0.9,

          ease:
            "power4.out"
        }
      );

    }

  }



  if (title) {

    gsap.fromTo(
      title,
      {
        y:
          28,

        opacity:
          0
      },
      {
        y:
          0,

        opacity:
          1,

        duration:
          0.8,

        ease:
          "power3.out",

        scrollTrigger: {

          trigger:
            section,

          start:
            "top 82%",

          once:
            true

        }
      }
    );

  }



  if (list) {

    gsap.fromTo(
      rows,
      {
        x:
          -20,

        opacity:
          0
      },
      {
        x:
          0,

        opacity:
          1,

        duration:
          0.65,

        stagger:
          0.055,

        ease:
          "power3.out",

        scrollTrigger: {

          trigger:
            section,

          start:
            "top 78%",

          once:
            true

        }
      }
    );

  }



  gsap.fromTo(
    visual,
    {
      y:
        28,

      scale:
        0.94,

      opacity:
        0
    },
    {
      y:
        0,

      scale:
        1,

      opacity:
        1,

      duration:
        0.9,

      ease:
        "power4.out",

      scrollTrigger: {

        trigger:
          section,

        start:
          "top 82%",

        once:
          true

      }
    }
  );



  function getScrollDistance() {

    const mobile =
      window.innerWidth <
      768;


    const tablet =
      window.innerWidth >=
      768
      &&
      window.innerWidth <
      1180;


    const multiplier =
      mobile
        ? 0.54
        : tablet
          ? 0.62
          : 0.68;


    return Math.max(

      window.innerHeight
      *
      (
        rows.length -
        1
      )
      *
      multiplier,

      mobile
        ? 1100
        : 1500

    );

  }



  ScrollTrigger.create({

    trigger:
      section,

    start:
      "top top",

    end:
      function () {

        return (
          `+=${getScrollDistance()}`
        );

      },

    pin:
      true,

    pinSpacing:
      true,

    anticipatePin:
      1,

    invalidateOnRefresh:
      true,


    onUpdate:
      function (
        self
      ) {

        const raw =
          self.progress
          *
          (
            rows.length -
            1
          );


        const nextIndex =
          Math.round(
            raw
          );


        scrollIndex =
          gsap.utils.clamp(
            0,
            rows.length -
            1,
            nextIndex
          );


        lastDirection =
          self.direction >=
          0
            ? 1
            : -1;


        if (
          scrollIndex !==
          currentIndex
        ) {

          activate(
            scrollIndex,
            lastDirection
          );

        }

      },


    onEnter:
      function () {

        activate(
          0,
          1
        );

      },


    onLeaveBack:
      function () {

        scrollIndex =
          0;


        if (
          currentIndex !==
          0
        ) {

          activate(
            0,
            -1
          );

        }

      }

  });



  const finePointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );


  rows.forEach(
    function (
      row,
      index
    ) {

      row.addEventListener(
        "pointerenter",
        function () {

          if (
            !finePointer.matches
          ) {

            return;

          }


          activate(
            index,

            index >=
            currentIndex
              ? 1
              : -1
          );

        }
      );


      row.addEventListener(
        "focus",
        function () {

          activate(
            index,

            index >=
            currentIndex
              ? 1
              : -1
          );

        }
      );


      row.addEventListener(
        "touchstart",
        function () {

          if (
            finePointer.matches
          ) {

            return;

          }


          activate(
            index,

            index >=
            currentIndex
              ? 1
              : -1
          );

        },
        {
          passive:
            true
        }
      );

    }
  );


  initTilt(
    visual,
    3.5
  );

}



/* =========================================================
   WORK
========================================================= */

function initWork() {

  const section =
    document.getElementById(
      "home-work"
    );


  if (!section) {
    return;
  }


  const viewport =
    section.querySelector(
      ".home-work__viewport"
    );


  const track =
    section.querySelector(
      ".home-work__track"
    );


  const cards =
    Array.from(
      section.querySelectorAll(
        ".home-work-card"
      )
    );


  if (
    !viewport ||
    !track
  ) {

    return;

  }


  function distance() {

    return Math.max(
      0,

      track.scrollWidth -
      viewport.clientWidth
    );

  }


  gsap.fromTo(
    track,
    {
      x:
        0
    },
    {
      x:
        function () {

          return (
            -distance()
          );

        },

      ease:
        "none",

      scrollTrigger: {

        trigger:
          section,

        start:
          "top 86%",

        end:
          "bottom 14%",

        scrub:
          0.85,

        invalidateOnRefresh:
          true

      }
    }
  );


  cards.forEach(
    function (
      card,
      index
    ) {

      const image =
        card.querySelector(
          "img"
        );


      gsap.fromTo(
        card,
        {
          rotate:
            index %
            2 ===
            0
              ? -4
              : 4,

          y:
            index %
            2 ===
            0
              ? 40
              : -20
        },
        {
          rotate:
            index %
            2 ===
            0
              ? 2
              : -2,

          y:
            index %
            2 ===
            0
              ? -20
              : 35,

          ease:
            "none",

          scrollTrigger: {

            trigger:
              section,

            start:
              "top bottom",

            end:
              "bottom top",

            scrub:
              1

          }
        }
      );


      if (image) {

        gsap.fromTo(
          image,
          {
            scale:
              1.13
          },
          {
            scale:
              1.02,

            ease:
              "none",

            scrollTrigger: {

              trigger:
                section,

              start:
                "top bottom",

              end:
                "bottom top",

              scrub:
                1

            }
          }
        );

      }


      initTilt(
        card,
        3
      );

    }
  );

}



/* =========================================================
   CLIENT PREPARATION
========================================================= */

function prepareClientRows() {

  const section =
    document.getElementById(
      "home-clients"
    );


  if (!section) {
    return;
  }


  const tracks =
    Array.from(
      section.querySelectorAll(
        ".home-client-row__track"
      )
    );


  tracks.forEach(
    function (
      track
    ) {

      const group =
        track.querySelector(
          ".home-client-row__group:not(.home-client-row__group--clone)"
        );


      if (!group) {
        return;
      }


      if (
        track.querySelector(
          ".home-client-row__group--clone"
        )
      ) {

        return;

      }


      const clone =
        group.cloneNode(
          true
        );


      clone.classList.add(
        "home-client-row__group--clone"
      );


      clone.setAttribute(
        "aria-hidden",
        "true"
      );


      clone
        .querySelectorAll(
          "img"
        )
        .forEach(
          function (
            image
          ) {

            image.alt =
              "";

          }
        );


      track.appendChild(
        clone
      );

    }
  );

}



/* =========================================================
   CLIENTS
========================================================= */

function initClients() {

  const section =
    document.getElementById(
      "home-clients"
    );


  if (!section) {
    return;
  }


  const tracks =
    Array.from(
      section.querySelectorAll(
        ".home-client-row__track"
      )
    );


  const tweens =
    [];



  function createMarquees() {

    tweens.forEach(
      function (
        tween
      ) {

        tween.kill();

      }
    );


    tweens.length =
      0;


    tracks.forEach(
      function (
        track,
        index
      ) {

        const group =
          track.querySelector(
            ".home-client-row__group:not(.home-client-row__group--clone)"
          );


        if (!group) {
          return;
        }


        const width =
          group.getBoundingClientRect()
            .width;


        if (
          width <=
          0
        ) {

          return;

        }


        const reverse =
          index %
          2 ===
          1;


        gsap.set(
          track,
          {
            x:
              reverse
                ? -width
                : 0
          }
        );


        const tween =
          gsap.to(
            track,
            {
              x:
                reverse
                  ? 0
                  : -width,

              duration:
                Math.max(
                  24,
                  width /
                  48
                ),

              ease:
                "none",

              repeat:
                -1
            }
          );


        tweens.push(
          tween
        );

      }
    );

  }


  requestAnimationFrame(
    createMarquees
  );


  let resizeTimer =
    null;


  window.addEventListener(
    "resize",
    function () {

      window.clearTimeout(
        resizeTimer
      );


      resizeTimer =
        window.setTimeout(
          createMarquees,
          180
        );

    }
  );


  section
    .querySelectorAll(
      ".home-client-logo"
    )
    .forEach(
      function (
        logo
      ) {

        initTilt(
          logo,
          3
        );

      }
    );

}



/* =========================================================
   RECOGNITION
========================================================= */

function initRecognition() {

  const section =
    document.getElementById(
      "home-recognition"
    );


  if (!section) {
    return;
  }


  const visual =
    section.querySelector(
      ".home-recognition__visual"
    );


  const image =
    visual
      ?.querySelector(
        "img"
      );


  const content =
    section.querySelector(
      ".home-recognition__content"
    );


  if (visual) {

    gsap.fromTo(
      visual,
      {
        clipPath:
          "inset(16% 15% 16% 15% round 44px)",

        rotate:
          -5,

        scale:
          0.85
      },
      {
        clipPath:
          "inset(0% 0% 0% 0% round 28px)",

        rotate:
          2,

        scale:
          1,

        ease:
          "none",

        scrollTrigger: {

          trigger:
            section,

          start:
            "top bottom",

          end:
            "top 25%",

          scrub:
            0.8

        }
      }
    );

  }


  if (image) {

    gsap.fromTo(
      image,
      {
        scale:
          1.15,

        yPercent:
          -7
      },
      {
        scale:
          1.03,

        yPercent:
          7,

        ease:
          "none",

        scrollTrigger: {

          trigger:
            section,

          start:
            "top bottom",

          end:
            "bottom top",

          scrub:
            1

        }
      }
    );

  }


  if (content) {

    gsap.fromTo(
      content,
      {
        x:
          70,

        opacity:
          0
      },
      {
        x:
          0,

        opacity:
          1,

        ease:
          "none",

        scrollTrigger: {

          trigger:
            section,

          start:
            "top 82%",

          end:
            "top 36%",

          scrub:
            0.65

        }
      }
    );

  }


  initTilt(
    visual,
    3
  );

}



/* =========================================================
   FAQ
========================================================= */

function initFAQInteraction() {

  const section =
    document.getElementById(
      "home-faq"
    );


  if (!section) {
    return;
  }


  const items =
    Array.from(
      section.querySelectorAll(
        ".home-faq__item"
      )
    );


  items.forEach(
    function (
      item
    ) {

      const button =
        item.querySelector(
          ".home-faq__button"
        );


      const answer =
        item.querySelector(
          ".home-faq__answer"
        );


      if (
        !button ||
        !answer
      ) {

        return;

      }


      gsap.set(
        answer,
        {
          height:
            0
        }
      );


      button.addEventListener(
        "click",
        function () {

          const open =
            item.classList.contains(
              "is-open"
            );


          items.forEach(
            function (
              current
            ) {

              const currentButton =
                current.querySelector(
                  ".home-faq__button"
                );


              const currentAnswer =
                current.querySelector(
                  ".home-faq__answer"
                );


              current.classList.remove(
                "is-open"
              );


              currentButton
                ?.setAttribute(
                  "aria-expanded",
                  "false"
                );


              if (
                currentAnswer
              ) {

                gsap.to(
                  currentAnswer,
                  {
                    height:
                      0,

                    duration:
                      0.32,

                    ease:
                      "power3.inOut"
                  }
                );

              }

            }
          );


          if (open) {
            return;
          }


          item.classList.add(
            "is-open"
          );


          button.setAttribute(
            "aria-expanded",
            "true"
          );


          gsap.to(
            answer,
            {
              height:
                "auto",

              duration:
                0.46,

              ease:
                "power4.out"
            }
          );

        }
      );

    }
  );

}



/* =========================================================
   FAQ MOTION
========================================================= */

function initFAQMotion() {

  const section =
    document.getElementById(
      "home-faq"
    );


  if (!section) {
    return;
  }


  const heading =
    section.querySelector(
      ".home-faq__heading"
    );


  const items =
    section.querySelectorAll(
      ".home-faq__item"
    );


  if (heading) {

    gsap.fromTo(
      heading,
      {
        x:
          -42,

        opacity:
          0
      },
      {
        x:
          0,

        opacity:
          1,

        duration:
          0.72,

        ease:
          "power4.out",

        scrollTrigger: {

          trigger:
            section,

          start:
            "top 86%",

          once:
            true

        }
      }
    );

  }


  gsap.fromTo(
    items,
    {
      x:
        34,

      opacity:
        0
    },
    {
      x:
        0,

      opacity:
        1,

      duration:
        0.58,

      stagger:
        0.065,

      ease:
        "power3.out",

      scrollTrigger: {

        trigger:
          section,

        start:
          "top 84%",

        once:
          true

      }
    }
  );

}



/* =========================================================
   POINTER TILT
========================================================= */

function initTilt(
  element,
  amount
) {

  if (
    !element ||
    !window.matchMedia(
      "(pointer: fine)"
    ).matches
  ) {

    return;

  }


  gsap.set(
    element,
    {
      transformPerspective:
        1200,

      transformStyle:
        "preserve-3d"
    }
  );


  const rotateX =
    gsap.quickTo(
      element,
      "rotationX",
      {
        duration:
          0.45,

        ease:
          "power3.out"
      }
    );


  const rotateY =
    gsap.quickTo(
      element,
      "rotationY",
      {
        duration:
          0.45,

        ease:
          "power3.out"
      }
    );


  element.addEventListener(
    "pointermove",
    function (
      event
    ) {

      const rect =
        element.getBoundingClientRect();


      const x =
        (
          event.clientX -
          rect.left
        )
        /
        rect.width;


      const y =
        (
          event.clientY -
          rect.top
        )
        /
        rect.height;


      rotateY(
        (
          x -
          0.5
        )
        *
        amount
        *
        2
      );


      rotateX(
        (
          0.5 -
          y
        )
        *
        amount
        *
        2
      );

    }
  );


  element.addEventListener(
    "pointerleave",
    function () {

      rotateX(
        0
      );


      rotateY(
        0
      );

    }
  );

}



/* =========================================================
   REDUCED MOTION
========================================================= */

function showReducedState() {

  document
    .querySelectorAll(
      [
        ".home-scene__stage",
        ".home-faq__heading",
        ".home-faq__item"
      ].join(",")
    )
    .forEach(
      function (
        element
      ) {

        element.style.opacity =
          "1";


        element.style.transform =
          "none";

      }
    );

}



/* =========================================================
   FOOTER YEAR
========================================================= */

function initFooterYear() {

  const year =
    document.getElementById(
      "ape-footer-year"
    );


  if (year) {

    year.textContent =
      new Date()
        .getFullYear();

  }

}