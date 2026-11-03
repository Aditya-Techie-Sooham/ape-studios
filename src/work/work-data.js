/* =========================================================
   APE STUDIO — WORK DATA

   This is now the single source of truth for Work.

   Images:
   public/work/<slug>/01.jpg ... 10.jpg
========================================================= */


export const WORK_CATEGORIES = [

  {
    id: "all",
    label: "All"
  },

  {
    id: "hospitality",
    label: "Hospitality"
  },

  {
    id: "education",
    label: "Education"
  },

  {
    id: "food-lifestyle",
    label: "Food & Lifestyle"
  },

  {
    id: "spaces-design",
    label: "Spaces & Design"
  },

  {
    id: "retail",
    label: "Retail"
  }

];



export const WORK_PROJECTS = [

  {
    number: "01",
    slug: "babumoshai",
    name: "Babumoshai",

    category: "hospitality",
    categoryLabel: "Hospitality",

    tone: "black",

    span: 7,
    size: "large",

    galleryLayout: "a",

    intro:
      "Selected creative and visual work by APE Studio for Babumoshai.",

    description:
      "This hospitality project is presented through a curated visual archive showcasing APE Studio's creative work for the brand."
  },


  {
    number: "02",
    slug: "noodle-oodle",
    name: "Noodle Oodle",

    category: "hospitality",
    categoryLabel: "Hospitality",

    tone: "violet",

    span: 5,
    size: "medium",

    galleryLayout: "b",

    intro:
      "Selected creative and visual work by APE Studio for Noodle Oodle.",

    description:
      "This hospitality project is presented through a curated visual archive showcasing APE Studio's creative work for the brand."
  },


  {
    number: "03",
    slug: "boho",
    name: "Boho",

    category: "hospitality",
    categoryLabel: "Hospitality",

    tone: "lime",

    span: 4,
    size: "medium",

    galleryLayout: "c",

    intro:
      "Selected creative and visual work by APE Studio for Boho.",

    description:
      "This hospitality project brings together selected visual work created by APE Studio for Boho in a focused creative portfolio."
  },


  {
    number: "04",
    slug: "baraf",
    name: "Baraf",

    category: "hospitality",
    categoryLabel: "Hospitality",

    tone: "white",

    span: 8,
    size: "wide",

    galleryLayout: "d",

    intro:
      "Selected creative and visual work by APE Studio for Baraf.",

    description:
      "This hospitality project is presented through a curated collection of visual work created by APE Studio for the brand."
  },


  {
    number: "05",
    slug: "grandly",
    name: "Grandly",

    category: "spaces-design",
    categoryLabel: "Spaces & Design",

    tone: "black",

    span: 5,
    size: "tall",

    galleryLayout: "a",

    intro:
      "Selected creative and visual work by APE Studio for Grandly.",

    description:
      "This spaces and design project brings together selected visual work created by APE Studio for Grandly in a curated creative portfolio."
  },


  {
    number: "06",
    slug: "aditya-academy",
    name: "Aditya Academy",

    category: "education",
    categoryLabel: "Education",

    tone: "violet",

    span: 7,
    size: "large",

    galleryLayout: "b",

    intro:
      "Selected creative and visual work by APE Studio for Aditya Academy.",

    description:
      "This education project brings together selected visual work created by APE Studio for Aditya Academy in a curated creative portfolio."
  },


  {
    number: "07",
    slug: "aditya-academy-junior",
    name: "Aditya Academy Junior",

    category: "education",
    categoryLabel: "Education",

    tone: "lime",

    span: 8,
    size: "wide",

    galleryLayout: "c",

    intro:
      "Selected creative and visual work by APE Studio for Aditya Academy Junior.",

    description:
      "This education project brings together selected visual work created by APE Studio for Aditya Academy Junior in a curated creative portfolio."
  },


  {
    number: "08",
    slug: "aditya-food-park",
    name: "Aditya Food Park",

    category: "food-lifestyle",
    categoryLabel: "Food & Lifestyle",

    tone: "white",

    span: 4,
    size: "medium",

    galleryLayout: "d",

    intro:
      "Selected creative and visual work by APE Studio for Aditya Food Park.",

    description:
      "This food and lifestyle project brings together selected visual work created by APE Studio for Aditya Food Park in a curated creative portfolio."
  },


  {
    number: "09",
    slug: "homelicious",
    name: "Homelicious",

    category: "food-lifestyle",
    categoryLabel: "Food & Lifestyle",

    tone: "black",

    span: 6,
    size: "medium",

    galleryLayout: "b",

    intro:
      "Selected creative and visual work by APE Studio for Homelicious.",

    description:
      "This food and lifestyle project brings together selected visual work created by APE Studio for Homelicious in a curated creative portfolio."
  },


  {
    number: "10",
    slug: "shopnamo",
    name: "Shopnamo",

    category: "retail",
    categoryLabel: "Retail",

    tone: "violet",

    span: 6,
    size: "medium",

    galleryLayout: "a",

    intro:
      "Selected creative and visual work by APE Studio for Shopnamo.",

    description:
      "This retail project brings together selected visual work created by APE Studio for Shopnamo in a curated creative portfolio."
  }

];



/* =========================================================
   HELPERS
========================================================= */

export function getWorkProject(
  slug
) {

  return WORK_PROJECTS.find(
    function (
      project
    ) {

      return (
        project.slug ===
        slug
      );

    }
  )
  ||
  null;

}



export function getNextWorkProject(
  slug
) {

  const index =
    WORK_PROJECTS.findIndex(
      function (
        project
      ) {

        return (
          project.slug ===
          slug
        );

      }
    );


  if (
    index === -1
  ) {

    return WORK_PROJECTS[0];

  }


  return WORK_PROJECTS[
    (
      index + 1
    )
    %
    WORK_PROJECTS.length
  ];

}



export function workImagePath(
  slug,
  index
) {

  const number =
    String(
      index
    )
    .padStart(
      2,
      "0"
    );


  return (
    `/work/${slug}/${number}.jpg`
  );

}