import {
  defineConfig
} from "vite";


import {
  resolve
} from "node:path";



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
   BLOG ARTICLES
========================================================= */

const BLOG_ARTICLES = [

  "why-brand-consistency-matters",

  "creativity-and-performance",

  "digital-experiences-that-people-remember"

];



const blogArticleInputs =
  Object.fromEntries(

    BLOG_ARTICLES.map(
      function (
        slug
      ) {

        return [

          `blog-${slug}`,

          resolve(
            process.cwd(),
            `blog/${slug}/index.html`
          )

        ];

      }
    )

  );



/* =========================================================
   VITE 8
========================================================= */

export default defineConfig({

  input: {


    /* =====================================================
       HOME
    ====================================================== */

    home:
      resolve(
        process.cwd(),
        "index.html"
      ),



    /* =====================================================
       ABOUT
    ====================================================== */

    about:
      resolve(
        process.cwd(),
        "about/index.html"
      ),



    /* =====================================================
       SERVICES
    ====================================================== */

    services:
      resolve(
        process.cwd(),
        "services/index.html"
      ),


    ...serviceDetailInputs,



    /* =====================================================
       WORK
    ====================================================== */

    work:
      resolve(
        process.cwd(),
        "work/index.html"
      ),


    ...workProjectInputs,



    /* =====================================================
       BLOG
    ====================================================== */

    blog:
      resolve(
        process.cwd(),
        "blog/index.html"
      ),


    ...blogArticleInputs,



    /* =====================================================
       LEGACY BLOG READER

       Keep this temporarily so old URLs like:

       /blog/read/?slug=why-brand-consistency-matters

       still load.

       The updated blog-read.js canonicalizes those pages
       to the new clean article URLs.
    ====================================================== */

    blogRead:
      resolve(
        process.cwd(),
        "blog/read/index.html"
      ),



    /* =====================================================
       FAQ
    ====================================================== */

    faq:
      resolve(
        process.cwd(),
        "faq/index.html"
      ),



    /* =====================================================
       CONTACT
    ====================================================== */

    contact:
      resolve(
        process.cwd(),
        "contact/index.html"
      )

  }

});