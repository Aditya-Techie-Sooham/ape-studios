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
      "A selection of APE Studio's creative work for Babumoshai.",

    description:
      "Explore ten visual pieces from the current project archive. The final case-study narrative, objectives and detailed scope can be updated here once the approved project notes are ready."
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
      "A visual selection from APE Studio's work for Noodle Oodle.",

    description:
      "This project page brings the current creative archive together in one place, allowing the visual work to lead while the final case-study story is being prepared."
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
      "A collection of visual work created for Boho.",

    description:
      "The gallery below presents the project's current visual archive through an editorial layout rather than a conventional equal-sized grid."
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
      "Selected visual work from APE Studio's work for Baraf.",

    description:
      "This case study currently focuses on the visual output. The detailed project story and approved scope can be added later without changing the page structure."
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
      "A visual archive from APE Studio's work for Grandly.",

    description:
      "The project is presented as a flexible editorial case study, combining different image scales to let each piece of work breathe."
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
      "Selected work from the Aditya Academy project archive.",

    description:
      "The gallery brings together the available visual pieces in a case-study format designed to expand later as additional approved project information becomes available."
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
      "A selection of APE Studio's visual work for Aditya Academy Junior.",

    description:
      "This page is structured around the creative output first, using an irregular editorial gallery instead of a conventional portfolio grid."
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
      "Selected visual work for Aditya Food Park.",

    description:
      "Ten pieces from the current project archive are presented below. Approved case-study details can be added later through this same data file."
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
      "A visual selection from APE Studio's work for Homelicious.",

    description:
      "The project is presented through a flexible visual system that allows different image proportions and formats to coexist naturally."
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
      "Selected creative work from the Shopnamo project archive.",

    description:
      "The current visual archive is shown below in an editorial case-study format, with the detailed project narrative ready to be added later."
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