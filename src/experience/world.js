import * as THREE from "three";

import {
  EffectComposer
} from "three/addons/postprocessing/EffectComposer.js";

import {
  RenderPass
} from "three/addons/postprocessing/RenderPass.js";

import {
  UnrealBloomPass
} from "three/addons/postprocessing/UnrealBloomPass.js";

import {
  getQualityProfile
} from "./quality.js";


export function createWorld(
  canvas
) {

  let quality =
    getQualityProfile();


  /* =====================================================
     SCENE
  ===================================================== */

  const scene =
    new THREE.Scene();


  scene.background =
    new THREE.Color(
      0x030604
    );


  scene.fog =
    new THREE.FogExp2(
      0x071009,
      0.032
    );


  /* =====================================================
     CAMERA
  ===================================================== */

  const camera =
    new THREE.PerspectiveCamera(
      40,
      window.innerWidth /
      window.innerHeight,
      0.1,
      140
    );


  camera.position.set(
    0,
    0,
    9.5
  );


  /* =====================================================
     RENDERER
  ===================================================== */

  const renderer =
    new THREE.WebGLRenderer({

      canvas,

      antialias:
        true,

      alpha:
        false,

      powerPreference:
        "high-performance"

    });


  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );


  renderer.setPixelRatio(
    quality.pixelRatio
  );


  renderer.outputColorSpace =
    THREE.SRGBColorSpace;


  renderer.toneMapping =
    THREE.ACESFilmicToneMapping;


  renderer.toneMappingExposure =
    1.28;


  /* =====================================================
     COMPOSER
  ===================================================== */

  const composer =
    new EffectComposer(
      renderer
    );


  composer.addPass(

    new RenderPass(
      scene,
      camera
    )

  );


  const bloomPass =
    new UnrealBloomPass(

      new THREE.Vector2(
        window.innerWidth,
        window.innerHeight
      ),

      quality.bloom *
      0.72,

      0.48,

      0.92

    );


  composer.addPass(
    bloomPass
  );


  /* =====================================================
     WORLD
  ===================================================== */

  const world =
    new THREE.Group();


  scene.add(
    world
  );


  /* =====================================================
     LIGHTS
  ===================================================== */

  const ambientLight =
    new THREE.AmbientLight(
      0xa8b8a3,
      1.05
    );


  scene.add(
    ambientLight
  );


  const sunlight =
    new THREE.DirectionalLight(
      0xffc878,
      3.4
    );


  sunlight.position.set(
    -5,
    9,
    7
  );


  scene.add(
    sunlight
  );


  const violetLight =
    new THREE.PointLight(
      0x6547a8,
      8,
      24,
      2
    );


  violetLight.position.set(
    5,
    1,
    2
  );


  scene.add(
    violetLight
  );


  const amberLight =
    new THREE.PointLight(
      0xc98942,
      10,
      26,
      2
    );


  amberLight.position.set(
    -5,
    0,
    4
  );


  scene.add(
    amberLight
  );


  /* =====================================================
     FLOOR
  ===================================================== */

  const floorMaterial =
    new THREE.MeshStandardMaterial({

      color:
        0x0a0d09,

      roughness:
        0.96,

      metalness:
        0.02

    });


  const floor =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        180,
        70
      ),

      floorMaterial

    );


  floor.rotation.x =
    -Math.PI /
    2;


  floor.position.y =
    -3.2;


  floor.position.z =
    -10;


  scene.add(
    floor
  );


  /* =====================================================
     DUST
  ===================================================== */

  const dustCount =
    quality.name ===
    "mobile"
      ? 38
      : 85;


  const dustPositions =
    new Float32Array(
      dustCount *
      3
    );


  for (
    let i = 0;
    i < dustCount;
    i++
  ) {

    dustPositions[
      i * 3
    ] =
      Math.random() *
      40 -
      10;


    dustPositions[
      i * 3 + 1
    ] =
      Math.random() *
      9 -
      3;


    dustPositions[
      i * 3 + 2
    ] =
      Math.random() *
      -20;

  }


  const dustGeometry =
    new THREE.BufferGeometry();


  dustGeometry.setAttribute(

    "position",

    new THREE.BufferAttribute(
      dustPositions,
      3
    )

  );


  const dustMaterial =
    new THREE.PointsMaterial({

      color:
        0xd6b47d,

      size:
        0.018,

      transparent:
        true,

      opacity:
        0.14,

      depthWrite:
        false

    });


  const dust =
    new THREE.Points(
      dustGeometry,
      dustMaterial
    );


  scene.add(
    dust
  );


  /* =====================================================
     LEAVES
  ===================================================== */

  const leaves =
    new THREE.Group();


  scene.add(
    leaves
  );


  const leafCount =
    quality.name ===
    "mobile"
      ? 5
      : 12;


  const leafGeometry =
    new THREE.PlaneGeometry(
      0.20,
      0.09
    );


  for (
    let i = 0;
    i < leafCount;
    i++
  ) {

    const leaf =
      new THREE.Mesh(

        leafGeometry,

        new THREE.MeshStandardMaterial({

          color:
            i % 3 === 0
              ? 0x536146
              : 0x273728,

          side:
            THREE.DoubleSide,

          roughness:
            0.92

        })

      );


    leaf.position.set(

      Math.random() *
      34 -
      8,

      Math.random() *
      7 -
      2,

      Math.random() *
      -16

    );


    leaf.rotation.set(

      Math.random() *
      Math.PI,

      Math.random() *
      Math.PI,

      Math.random() *
      Math.PI

    );


    leaves.add(
      leaf
    );

  }


  /* =====================================================
     WORLD MOODS
  ===================================================== */

  function setMood(
    mood
  ) {

    if (
      mood ===
      "team"
    ) {

      scene.background.set(
        0x030604
      );


      scene.fog.color.set(
        0x071009
      );


      scene.fog.density =
        0.032;


      floor.visible =
        true;


      dust.visible =
        true;


      leaves.visible =
        true;


      ambientLight.intensity =
        1.05;


      sunlight.intensity =
        3.4;


      amberLight.intensity =
        10;


      violetLight.intensity =
        8;


      bloomPass.strength =
        0.18;


      return;
    }


    if (
      mood ===
      "transition"
    ) {

      scene.background.set(
        0x140e22
      );


      scene.fog.color.set(
        0x24183c
      );


      scene.fog.density =
        0.018;


      floor.visible =
        false;


      dust.visible =
        false;


      leaves.visible =
        false;


      ambientLight.intensity =
        0.45;


      sunlight.intensity =
        0;


      amberLight.intensity =
        4;


      violetLight.intensity =
        12;


      bloomPass.strength =
        0.24;


      return;
    }


    if (
      mood ===
      "about"
    ) {

      scene.background.set(
        0x1d1630
      );


      scene.fog.color.set(
        0x2b2145
      );


      scene.fog.density =
        0.017;


      floor.visible =
        true;


      floorMaterial.color.set(
        0x181122
      );


      dust.visible =
        true;


      dustMaterial.color.set(
        0xb9a7ee
      );


      dustMaterial.opacity =
        0.09;


      leaves.visible =
        false;


      ambientLight.intensity =
        1.4;


      sunlight.intensity =
        2.2;


      amberLight.intensity =
        7;


      violetLight.intensity =
        12;


      bloomPass.strength =
        0.20;

    }

  }


  /* =====================================================
     RESIZE
  ===================================================== */

  function resize() {

    quality =
      getQualityProfile();


    camera.aspect =
      window.innerWidth /
      window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    renderer.setPixelRatio(
      quality.pixelRatio
    );


    composer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }


  return {

    scene,

    camera,

    renderer,

    composer,

    world,

    floor,

    floorMaterial,

    dust,

    dustMaterial,

    leaves,

    ambientLight,

    sunlight,

    amberLight,

    violetLight,

    bloomPass,

    setMood,

    resize

  };

}