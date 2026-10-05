import {
  defineConfig
} from "vite";


import {
  resolve
} from "path";



/* =========================================================
   WORK PROJECTS
========================================================= */

const WORK_PROJECTS = [

  "babumoshai",

  "noodle-oodle",

  "boho",

  "baraf",

  "grandly",

  "aditya-academy",

  "aditya-academy-junior",

  "aditya-food-park",

  "homelicious",

  "shopnamo"

];



const workProjectInputs =
  Object.fromEntries(

    WORK_PROJECTS.map(
      function (
        slug
      ) {

        return [

          `work-${slug}`,

          resolve(
            process.cwd(),
            `work/${slug}/index.html`
          )

        ];

      }
    )

  );



/* =========================================================
   SERVICE DETAIL PAGES
========================================================= */

const SERVICE_DETAIL_PAGES = [

  "digital-marketing",

  "printables",

  "branding",

  "influencer-marketing",

  "visual-studio"

];



const serviceDetailInputs =
  Object.fromEntries(

    SERVICE_DETAIL_PAGES.map(
      function (
        slug
      ) {

        return [

          `service-${slug}`,

          resolve(
            process.cwd(),
            `services/${slug}/index.html`
          )

        ];

      }
    )

  );



/* =========================================================
   VITE
========================================================= */

export default defineConfig({

  build: {

    rollupOptions: {

      input: {


        /* =================================================
           HOME
        ================================================= */

        home:
          resolve(
            process.cwd(),
            "index.html"
          ),



        /* =================================================
           ABOUT
        ================================================= */

        about:
          resolve(
            process.cwd(),
            "about/index.html"
          ),



        /* =================================================
           SERVICES
        ================================================= */

        services:
          resolve(
            process.cwd(),
            "services/index.html"
          ),


        ...serviceDetailInputs,



        /* =================================================
           WORK
        ================================================= */

        work:
          resolve(
            process.cwd(),
            "work/index.html"
          ),


        ...workProjectInputs,



        /* =================================================
           BLOG
        ================================================= */

        blog:
          resolve(
            process.cwd(),
            "blog/index.html"
          ),


        blogRead:
          resolve(
            process.cwd(),
            "blog/read/index.html"
          ),



        /* =================================================
           FAQ
        ================================================= */

        faq:
          resolve(
            process.cwd(),
            "faq/index.html"
          ),



        /* =================================================
           CONTACT
        ================================================= */

        contact:
          resolve(
            process.cwd(),
            "contact/index.html"
          )

      }

    }

  }

});