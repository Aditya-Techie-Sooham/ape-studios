import gsap from "gsap";

import {
  animate
} from "motion";

import {
  createWorld
} from "./world.js";

import {
  createTeamScene
} from "../scenes/team/team-scene.js";

import {
  createStoryController
} from "../story/story.js";


export function initExperience() {

  /* =====================================================
     DOM
  ===================================================== */

  const stage =
    document.getElementById(
      "experience-stage"
    );


  const canvas =
    document.getElementById(
      "experience-canvas"
    );


  const memberCopy =
    document.getElementById(
      "experience-member-copy"
    );


  const kicker =
    document.getElementById(
      "experience-kicker"
    );


  const memberRole =
    document.getElementById(
      "experience-member-role"
    );


  const memberName =
    document.getElementById(
      "experience-member-name"
    );


  const memberLine =
    document.getElementById(
      "experience-member-line"
    );


  const progressFill =
    document.getElementById(
      "experience-progress-fill"
    );


  const teamChapter =
    document.getElementById(
      "chapter-team"
    );


  const storyChapter =
    document.getElementById(
      "chapter-story"
    );


  if (
    !stage ||
    !canvas ||
    !teamChapter ||
    !storyChapter
  ) {

    console.error(
      "[APE] Experience DOM missing."
    );

    return;
  }


  /* =====================================================
     TEAM WEBGL
  ===================================================== */

  const {

    camera,

    renderer,

    composer,

    world,

    dust,

    leaves,

    setMood,

    resize

  } =
    createWorld(
      canvas
    );


  const teamScene =
    createTeamScene({

      world,

      renderer

    });


  world.remove(
    teamScene.root
  );


  /* =====================================================
     STORY
  ===================================================== */

  const story =
    createStoryController({

      section:
        storyChapter

    });


  if (
    !story
  ) {

    console.error(
      "[APE] Story controller failed."
    );

    return;
  }


  /* =====================================================
     STATE
  ===================================================== */

  let activeChapter =
    "none";


  let activeMember =
    -1;


  let teamTargetX =
    0;


  let teamCurrentX =
    0;


  let elapsed =
    0;


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


  /*
   * Team needs viewport subtraction
   * because it is a classic pinned section.
   */

  function teamProgress() {

    const rect =
      teamChapter
        .getBoundingClientRect();


    const distance =
      Math.max(

        teamChapter.offsetHeight -
        window.innerHeight,

        1

      );


    return clamp(

      -rect.top /
      distance

    );

  }


  /*
   * Story is now a TRUE fixed stage.
   *
   * Use the FULL section height.
   *
   * Therefore progress continues smoothly
   * until the Story section actually ends.
   */

  function storyProgress() {

    const rect =
      storyChapter
        .getBoundingClientRect();


    /*
    * IMPORTANT:
    *
    * The usable pinned-scroll distance is the
    * section height MINUS one viewport.
    *
    * This allows progress to reach 1 BEFORE
    * the Story section physically leaves the screen.
    *
    * Therefore the final scene gets a proper
    * full-screen hold.
    */

    const distance =
      Math.max(

        storyChapter.offsetHeight -
        window.innerHeight,

        1

      );


    return clamp(

      -rect.top /
      distance

    );

  }


  /* =====================================================
     CHAPTER DETECTION
  ===================================================== */

  function detectChapter() {

    const storyRect =
      storyChapter
        .getBoundingClientRect();


    const teamRect =
      teamChapter
        .getBoundingClientRect();


    /*
     * STORY
     *
     * Starts exactly when its top hits viewport top.
     *
     * No 50% trigger anymore.
     */

    if (
      storyRect.top <=
      0

      &&

      storyRect.bottom >
      0
    ) {

      return "story";

    }


    /*
     * TEAM
     *
     * Team stays active until Story actually begins.
     */

    if (
      teamRect.top <=
      0

      &&

      teamRect.bottom >
      0
    ) {

      return "team";

    }


    return "none";

  }


  /* =====================================================
     TEAM MEMBER UI
  ===================================================== */

  function showMember(
    index
  ) {

    if (
      index ===
      activeMember
    ) {

      return;
    }


    activeMember =
      index;


    const member =
      teamScene.team[
        index
      ];


    if (
      !member
    ) {

      return;
    }


    if (
      memberRole
    ) {

      memberRole.textContent =
        member.designation;

    }


    if (
      memberName
    ) {

      memberName.textContent =
        member.name;

    }


    if (
      memberRole
    ) {

      animate(
        memberRole,
        {

          opacity:
            [0, 1],

          y:
            [10, 0]

        },
        {

          duration:
            0.34

        }
      );

    }


    if (
      memberName
    ) {

      animate(
        memberName,
        {

          opacity:
            [0, 1],

          y:
            [28, 0]

        },
        {

          duration:
            0.50

        }
      );

    }


    if (
      memberLine
    ) {

      gsap.fromTo(
        memberLine,

        {
          scaleX:
            0
        },

        {

          scaleX:
            1,

          duration:
            0.55,

          ease:
            "power3.out"

        }
      );

    }

  }


  /* =====================================================
     CHAPTER ACTIVATION
  ===================================================== */

  function activateChapter(
    chapter
  ) {

    if (
      chapter ===
      activeChapter
    ) {

      return;
    }


    activeChapter =
      chapter;


    /*
     * Team visual gets physically removed
     * whenever Team isn't active.
     */

    world.remove(
      teamScene.root
    );


    /* =================================================
       TEAM
    ================================================= */

    if (
      chapter ===
      "team"
    ) {

      world.add(
        teamScene.root
      );


      teamScene.root.visible =
        true;


      stage.classList.add(
        "is-active"
      );


      if (
        memberCopy
      ) {

        memberCopy.style.display =
          "block";

      }


      if (
        kicker
      ) {

        kicker.style.display =
          "block";


        kicker.textContent =
          "THE PEOPLE BEHIND APE";

      }


      if (
        typeof setMood ===
        "function"
      ) {

        setMood(
          "team"
        );

      }


      camera.position.set(
        0,
        0,
        9.5
      );


      camera.rotation.set(
        0,
        0,
        0
      );


      return;
    }


    /* =================================================
       STORY / NONE
    ================================================= */

    stage.classList.remove(
      "is-active"
    );


    if (
      memberCopy
    ) {

      memberCopy.style.display =
        "none";

    }


    if (
      kicker
    ) {

      kicker.style.display =
        "none";

    }

  }


  /* =====================================================
     TEAM UPDATE
  ===================================================== */

  function updateTeam() {

    const p =
      teamProgress();


    const count =
      teamScene.members.length;


    const maxTravel =

      Math.max(

        0,

        (
          count -
          1
        )

        *
        teamScene.spacing

      );


    teamTargetX =
      -p *
      maxTravel;


    const index =

      clamp(

        Math.round(

          p *

          (
            count -
            1
          )

        ),

        0,

        count -
        1

      );


    showMember(
      index
    );


    if (
      progressFill
    ) {

      progressFill.style.transform =
        `scaleX(${p})`;

    }


    teamScene.members.forEach(
      function (
        member,
        memberIndex
      ) {

        const visualX =
          member.position.x +
          teamCurrentX;


        const focus =

          1 -

          clamp(

            Math.abs(
              visualX
            )

            /

            5.5

          );


        member.position.z =

          -3 +
          focus *
          3;


        member.position.y =

          Math.sin(
            elapsed *
            0.75 +
            memberIndex
          )

          *
          0.03;


        member.scale.setScalar(

          0.78 +
          focus *
          0.27

        );


        member.rotation.y =

          clamp(

            visualX *
            -0.055,

            -0.30,

            0.30

          );


        const data =
          member.userData;


        if (
          data.orbit
        ) {

          data.orbit.rotation.z +=
            0.001;

        }


        if (
          data.orbitTwo
        ) {

          data.orbitTwo.rotation.z -=
            0.0007;

        }


        if (
          data.symbol
        ) {

          data.symbol.rotation.x +=
            0.005;


          data.symbol.rotation.y +=
            0.008;

        }

      }
    );

  }


  /* =====================================================
     UPDATE
  ===================================================== */

  function update() {

    /*
     * Pin state is updated EVERY frame,
     * even before/after Story.
     */

    story.updateStageState();


    const chapter =
      detectChapter();


    activateChapter(
      chapter
    );


    if (
      chapter ===
      "team"
    ) {

      updateTeam();

    }


    else if (
      chapter ===
      "story"
    ) {

      story.update(
        storyProgress()
      );

    }

  }


  /* =====================================================
     LOOP
  ===================================================== */

  function render() {

    elapsed +=
      0.016;


    teamCurrentX +=

      (
        teamTargetX -
        teamCurrentX
      )

      *
      0.075;


    if (
      activeChapter ===
      "team"
    ) {

      teamScene.root.position.x =
        teamCurrentX;


      if (
        dust
      ) {

        dust.rotation.y +=
          0.000025;

      }


      if (
        leaves
      ) {

        leaves.children.forEach(
          function (
            leaf,
            index
          ) {

            leaf.rotation.x +=
              0.0006;


            leaf.rotation.y +=
              0.0008;


            leaf.position.y +=

              Math.sin(
                elapsed +
                index
              )

              *
              0.00012;

          }
        );

      }


      composer.render();

    }


    update();


    requestAnimationFrame(
      render
    );

  }


  /* =====================================================
     RESIZE
  ===================================================== */

  let resizeTimer;


  window.addEventListener(
    "resize",
    function () {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          function () {

            resize();

            update();

          },
          120
        );

    }
  );


  /* =====================================================
     START
  ===================================================== */

  update();


  requestAnimationFrame(
    render
  );

}