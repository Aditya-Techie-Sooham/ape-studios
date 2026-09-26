export function getQualityProfile() {

  const width =
    window.innerWidth;


  const dpr =
    window.devicePixelRatio || 1;


  if (
    width <= 767
  ) {

    return {

      name:
        "mobile",

      pixelRatio:
        Math.min(
          dpr,
          1.15
        ),

      particles:
        90,

      bloom:
        0.20,

      geometryCount:
        8

    };

  }


  if (
    width <= 1100
  ) {

    return {

      name:
        "medium",

      pixelRatio:
        Math.min(
          dpr,
          1.35
        ),

      particles:
        150,

      bloom:
        0.28,

      geometryCount:
        14

    };

  }


  return {

    name:
      "high",

    pixelRatio:
      Math.min(
        dpr,
        1.6
      ),

    particles:
      240,

    bloom:
      0.38,

    geometryCount:
      24

  };

}