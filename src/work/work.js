import gsap from "gsap";

import {
  ScrollTrigger
} from "gsap/ScrollTrigger";


import * as THREE from "three";


import "../styles/variables.css";
import "../styles/reset.css";
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/work-page.css";


import {
  initHeader
} from "../header/header.js";


gsap.registerPlugin(
  ScrollTrigger
);



/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    initHeader();

    initMotionPlayground();

    initWorkThree();


    requestAnimationFrame(
      function () {

        ScrollTrigger.refresh();

      }
    );

  }
);



/* =========================================================
   MOTION PLAYGROUND
========================================================= */

function initMotionPlayground() {

  const section =
    document.getElementById(
      "work-motion-playground"
    );


  if (!section) {
    return;
  }


  const stage =
    section.querySelector(
      ".work-playground__stage"
    );


  const mainWord =
    section.querySelector(
      ".work-main-word"
    );


  const workText =
    section.querySelector(
      ".work-main-word h1"
    );


  const watermark =
    section.querySelector(
      ".work-ape-watermark"
    );


  const grid =
    section.querySelector(
      ".work-grid"
    );


  const orbit =
    section.querySelector(
      ".work-orbit"
    );


  const rings =
    section.querySelectorAll(
      ".work-orbit__ring"
    );


  const core =
    section.querySelector(
      ".work-orbit__core"
    );


  const shapes =
    Array.from(
      section.querySelectorAll(
        "[data-work-shape]"
      )
    );


  const statements =
    Array.from(
      section.querySelectorAll(
        ".work-statement"
      )
    );


  const reveal =
    section.querySelector(
      ".work-reveal"
    );


  const signalFill =
    document.getElementById(
      "work-signal-fill"
    );


  if (!stage) {
    return;
  }


  /* =====================================================
     AMBIENT ORBIT
  ===================================================== */

  rings.forEach(
    function (
      ring,
      index
    ) {

      gsap.to(
        ring,
        {
          rotation:
            index %
            2 ===
            0
              ? 360
              : -360,

          duration:
            24 +
            index *
            9,

          repeat:
            -1,

          ease:
            "none"
        }
      );

    }
  );


  if (core) {

    gsap.to(
      core,
      {
        scale:
          1.10,

        duration:
          1.8,

        repeat:
          -1,

        yoyo:
          true,

        ease:
          "sine.inOut"
      }
    );

  }


  /* =====================================================
     SHAPE FLOAT
  ===================================================== */

  shapes.forEach(
    function (
      shape,
      index
    ) {

      gsap.to(
        shape,
        {
          y:
            index %
            2 ===
            0
              ? -14
              : 14,

          rotation:
            `+=${18 + index * 8}`,

          duration:
            2.7 +
            index *
            0.35,

          repeat:
            -1,

          yoyo:
            true,

          ease:
            "sine.inOut"
        }
      );

    }
  );


  /* =====================================================
     INITIAL STATES
  ===================================================== */

  statements.forEach(
    function (
      statement,
      index
    ) {

      gsap.set(
        statement,
        {
          opacity:
            index === 0
              ? 0
              : 0,

          visibility:
            "hidden",

          y:
            45
        }
      );

    }
  );


  if (reveal) {

    gsap.set(
      reveal,
      {
        opacity:
          0,

        visibility:
          "hidden"
      }
    );

  }


  /* =====================================================
     MAIN SCROLL TIMELINE
  ===================================================== */

  const tl =
    gsap.timeline({

      defaults: {
        ease:
          "none"
      },


      scrollTrigger: {

        trigger:
          section,

        start:
          "top top",

        end:
            () =>
            "+=" +
            (
                section.offsetHeight -
                window.innerHeight
            ),

        scrub:
          0.9,

        invalidateOnRefresh:
          true,


        onUpdate:
          function (
            self
          ) {

            if (signalFill) {

              signalFill.style.transform =
                `scaleX(${self.progress})`;

            }

          }

      }

    });


  /* =====================================================
     PHASE 01
     WORK BREAKS APART
  ===================================================== */

  if (workText) {

    tl.to(
      workText,
      {
        scale:
          1.42,

        letterSpacing:
          "-0.02em",

        opacity:
          0.10,

        duration:
          1.2
      },

      0
    );

  }


  if (mainWord) {

    tl.to(
      mainWord,
      {
        yPercent:
          -8,

        duration:
          1.2
      },

      0
    );

  }


  if (grid) {

    tl.to(
      grid,
      {
        scale:
          1.15,

        rotation:
          2,

        opacity:
          0.55,

        duration:
          1.2
      },

      0
    );

  }


  if (watermark) {

    tl.to(
      watermark,
      {
        xPercent:
          7,

        rotation:
          -2,

        duration:
          1.4
      },

      0
    );

  }


  if (orbit) {

    tl.to(
      orbit,
      {
        xPercent:
          -22,

        scale:
          1.28,

        rotation:
          40,

        duration:
          1.4
      },

      0
    );

  }


  /* =====================================================
     STATEMENT 01
  ===================================================== */

  showStatement(
    0,
    0.60,
    1.35
  );


  /* =====================================================
     STATEMENT 02
  ===================================================== */

  showStatement(
    1,
    1.48,
    2.22
  );


  /* =====================================================
     STATEMENT 03
  ===================================================== */

  showStatement(
    2,
    2.34,
    3.16
  );


  /* =====================================================
     GRAPHICS BECOME MORE AGGRESSIVE
  ===================================================== */

  shapes.forEach(
    function (
      shape,
      index
    ) {

      tl.to(
        shape,
        {
          x:
            index %
            2 ===
            0
              ? -120 -
                index *
                30
              : 120 +
                index *
                30,

          y:
            index %
            2 ===
            0
              ? 90
              : -90,

          scale:
            1.7,

          opacity:
            0,

          duration:
            0.9
        },

        2.75 +
        index *
        0.03
      );

    }
  );


  if (orbit) {

    tl.to(
      orbit,
      {
        scale:
          2.5,

        opacity:
          0,

        rotation:
          145,

        duration:
          1.15
      },

      3.0
    );

  }


  if (workText) {

    tl.to(
      workText,
      {
        scale:
          2.3,

        opacity:
          0,

        duration:
          0.85
      },

      3.0
    );

  }


  if (grid) {

    tl.to(
      grid,
      {
        opacity:
          0,

        scale:
          1.5,

        duration:
          0.8
      },

      3.1
    );

  }


  /* =====================================================
     FINAL REVEAL
  ===================================================== */

  if (reveal) {

    tl.set(
      reveal,
      {
        visibility:
          "visible"
      },

      3.52
    );


    tl.to(
      reveal,
      {
        opacity:
          1,

        duration:
          0.65,

        ease:
          "power2.inOut"
      },

      3.52
    );


    tl.fromTo(
      reveal.querySelector("h2"),

      {
        scale:
          0.90,

        y:
          55
      },

      {
        scale:
          1,

        y:
          0,

        duration:
          0.85,

        ease:
          "power3.out"
      },

      3.56
    );

  }


  /* =====================================================
     HELPER
  ===================================================== */

  function showStatement(
    index,
    start,
    end
  ) {

    const statement =
      statements[index];


    if (!statement) {
      return;
    }


    tl.set(
      statement,
      {
        visibility:
          "visible"
      },

      start
    );


    tl.to(
      statement,
      {
        opacity:
          1,

        y:
          0,

        duration:
          0.30,

        ease:
          "power3.out"
      },

      start
    );


    tl.to(
      statement,
      {
        x:
          index %
          2 ===
          0
            ? 35
            : -35,

        duration:
          Math.max(
            0.1,
            end -
            start -
            0.42
          )
      },

      start +
      0.18
    );


    tl.to(
      statement,
      {
        opacity:
          0,

        y:
          -40,

        duration:
          0.30
      },

      end -
      0.30
    );


    tl.set(
      statement,
      {
        visibility:
          "hidden"
      },

      end
    );

  }

}



/* =========================================================
   THREE.JS
   LIGHTWEIGHT DEPTH FIELD
========================================================= */

function initWorkThree() {

  const canvas =
    document.getElementById(
      "work-motion-canvas"
    );


  const section =
    document.getElementById(
      "work-motion-playground"
    );


  if (
    !canvas ||
    !section
  ) {
    return;
  }


  const renderer =
    new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      1.5
    )
  );


  const scene =
    new THREE.Scene();


  const camera =
    new THREE.PerspectiveCamera(
      50,
      1,
      0.1,
      100
    );


  camera.position.z =
    6;


  /* =====================================================
     PARTICLE FIELD
  ===================================================== */

  const count =
    window.innerWidth <=
    767
      ? 45
      : 100;


  const geometry =
    new THREE.BufferGeometry();


  const positions =
    new Float32Array(
      count *
      3
    );


  for (
    let i = 0;
    i < count;
    i++
  ) {

    positions[
      i *
      3
    ] =
      (
        Math.random() -
        0.5
      ) *
      12;


    positions[
      i *
      3 +
      1
    ] =
      (
        Math.random() -
        0.5
      ) *
      7;


    positions[
      i *
      3 +
      2
    ] =
      (
        Math.random() -
        0.5
      ) *
      8;

  }


  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );


  const material =
    new THREE.PointsMaterial({
      color:
        0x7452d9,

      size:
        0.035,

      transparent:
        true,

      opacity:
        0.48
    });


  const particles =
    new THREE.Points(
      geometry,
      material
    );


  scene.add(
    particles
  );


  /* =====================================================
     WIREFRAME OBJECT
  ===================================================== */

  const objectGeometry =
    new THREE.IcosahedronGeometry(
      1.4,
      1
    );


  const objectMaterial =
    new THREE.MeshBasicMaterial({
      color:
        0xd84ba9,

      wireframe:
        true,

      transparent:
        true,

      opacity:
        0.12
    });


  const object =
    new THREE.Mesh(
      objectGeometry,
      objectMaterial
    );


  object.position.x =
    2.8;


  object.position.y =
    -0.2;


  scene.add(
    object
  );


  /* =====================================================
     SIZE
  ===================================================== */

  function resize() {

    const width =
      section.clientWidth;


    const height =
      window.innerHeight;


    renderer.setSize(
      width,
      height,
      false
    );


    camera.aspect =
      width /
      height;


    camera.updateProjectionMatrix();

  }


  resize();


  window.addEventListener(
    "resize",
    resize
  );


  /* =====================================================
     POINTER DEPTH
  ===================================================== */

  let pointerX = 0;
  let pointerY = 0;


  function pointerMove(
    event
  ) {

    if (
      window.innerWidth <=
      767
    ) {
      return;
    }


    pointerX =
      (
        event.clientX /
        window.innerWidth -
        0.5
      );


    pointerY =
      (
        event.clientY /
        window.innerHeight -
        0.5
      );

  }


  window.addEventListener(
    "pointermove",
    pointerMove
  );


  /* =====================================================
     LOOP
  ===================================================== */

  function render() {

    particles.rotation.y +=
      0.0005;


    particles.rotation.x +=
      0.00015;


    object.rotation.x +=
      0.0015;


    object.rotation.y +=
      0.002;


    if (
      window.innerWidth >
      767
    ) {

      camera.position.x +=
        (
          pointerX *
          0.28 -
          camera.position.x
        ) *
        0.025;


      camera.position.y +=
        (
          -pointerY *
          0.20 -
          camera.position.y
        ) *
        0.025;

    }


    renderer.render(
      scene,
      camera
    );


    requestAnimationFrame(
      render
    );

  }


  render();

}