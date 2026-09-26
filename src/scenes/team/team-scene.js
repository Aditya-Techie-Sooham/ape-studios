import * as THREE from "three";


import {
  team
} from "../../team/team-data.js";


export function createTeamScene({

  world,

  renderer

}) {

  const root =
    new THREE.Group();


  world.add(
    root
  );


  const textureLoader =
    new THREE.TextureLoader();


  const members =
    [];


  const SPACING =
    6.5;


  team.forEach(
    (
      member,
      index
    ) => {


      const group =
        new THREE.Group();


      group.position.x =
        index *
        SPACING;


      root.add(
        group
      );


      const violet =
        index % 2 === 0;


      const accent =
        violet
          ? 0x6547a8
          : 0xc98942;


      const accentBright =
        violet
          ? 0x8d70d6
          : 0xe3a255;


      /* =================================================
         PORTRAIT
      ================================================= */

      const portraitMaterial =
        new THREE.MeshBasicMaterial({

          color:
            0xffffff,

          transparent:
            true,

          opacity:
            1,

          toneMapped:
            false

        });


      const portrait =
        new THREE.Mesh(

          new THREE.PlaneGeometry(
            3.5,
            5.0
          ),

          portraitMaterial

        );


      portrait.position.z =
        0;


      group.add(
        portrait
      );


      textureLoader.load(

        member.image,

        function (
          texture
        ) {

          texture.colorSpace =
            THREE.SRGBColorSpace;


          texture.anisotropy =
            Math.min(

              8,

              renderer
                .capabilities
                .getMaxAnisotropy()

            );


          portraitMaterial.map =
            texture;


          portraitMaterial.needsUpdate =
            true;

        },

        undefined,

        function () {

          console.warn(

            "[APE EXPERIENCE] Team image failed:",

            member.image

          );

        }

      );


      /* =================================================
         LARGE ORBIT
      ================================================= */

      const orbit =
        new THREE.Mesh(

          new THREE.TorusGeometry(
            2.5,
            0.025,
            16,
            128
          ),

          new THREE.MeshBasicMaterial({

            color:
              accentBright,

            transparent:
              true,

            opacity:
              0.14,

            depthWrite:
              false,

            toneMapped:
              false

          })

        );


      orbit.position.z =
        -0.8;


      group.add(
        orbit
      );


      /* =================================================
         SECOND ORBIT
      ================================================= */

      const orbitTwo =
        new THREE.Mesh(

          new THREE.TorusGeometry(
            2.05,
            0.012,
            12,
            96
          ),

          new THREE.MeshBasicMaterial({

            color:
              accent,

            transparent:
              true,

            opacity:
              0.07,

            toneMapped:
              false

          })

        );


      orbitTwo.rotation.x =
        Math.PI *
        0.18;


      orbitTwo.position.z =
        -1.15;


      group.add(
        orbitTwo
      );


      /* =================================================
         GLASS MONOLITH
      ================================================= */

      const monolith =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            0.11,
            3.0,
            0.7
          ),

          new THREE.MeshPhysicalMaterial({

            color:
              accent,

            roughness:
              0.08,

            metalness:
              0.08,

            transmission:
              0.55,

            thickness:
              0.65,

            transparent:
              true,

            opacity:
              0.35

          })

        );


      monolith.position.set(
        -2.20,
        0,
        -0.10
      );


      group.add(
        monolith
      );


      /* =================================================
         SYMBOL
      ================================================= */

      const symbol =
        new THREE.Mesh(

          new THREE.IcosahedronGeometry(
            0.13,
            1
          ),

          new THREE.MeshStandardMaterial({

            color:
              accentBright,

            emissive:
              accent,

            emissiveIntensity:
              1.2,

            roughness:
              0.20,

            metalness:
              0.60

          })

        );


      symbol.position.set(
        2.05,
        1.85,
        0.65
      );


      group.add(
        symbol
      );


      group.userData = {

        member,

        portrait,

        portraitMaterial,

        orbit,

        orbitTwo,

        monolith,

        symbol,

        accent

      };


      members.push(
        group
      );

    }
  );


  root.visible =
    false;


  return {

    root,

    members,

    spacing:
      SPACING,

    team

  };

}