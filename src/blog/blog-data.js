/* =========================================================
   APE STUDIO — BLOG DATA
   =========================================================

   THIS IS THE MAIN FILE YOU UPDATE EVERY WEEK.

   RULE:

   images[0]
   =
   COVER IMAGE

   It appears:
   - on Blog home page
   - as the large image on the full article


   images[1], images[2], images[3]...
   =
   GALLERY IMAGES

   They appear automatically in a grid
   after somebody clicks READ MORE.


   IMPORTANT:

   Always add the NEWEST BLOG
   at the TOP of BLOGS.
========================================================= */


export const BLOGS = [


  /* =======================================================
     BLOG 03 — NEWEST
  ======================================================= */

  {
    slug:
      "why-brand-consistency-matters",

    heading:
      "Why Brand Consistency Matters More Than Ever",

    subheading:
      "Recognition is built long before conversion happens.",


    /* FIRST IMAGE = COVER */

    images: [

      "/images/blog/blog-03-image-02.webp",

      "/images/blog/blog-03-image-01.webp",

      "/images/blog/blog-03-cover.webp",

      "/images/blog/blog-06.webp"

    ],


    content: [

      `A strong brand is much more than a logo. It is the way people recognise, remember and experience a business across every interaction.`,

      `From visual identity and communication to social media and digital experiences, consistency creates familiarity. That familiarity eventually becomes trust.`,

      `The strongest brands understand that every touchpoint contributes to the same larger story.`

    ]

  },



  /* =======================================================
     BLOG 02
  ======================================================= */

  {
    slug:
      "creativity-and-performance",

    heading:
      "Creativity And Performance Should Never Work Separately",

    subheading:
      "The strongest campaigns connect ideas with measurable outcomes.",


    images: [

      "/images/blog/blog-02.webp"

    ],


    content: [

      `Creative thinking gets attention, but performance tells us what happens after that attention arrives.`,

      `When creative teams and performance teams work separately, brands often lose the opportunity to understand why certain ideas work better than others.`,

      `Bringing both disciplines together creates campaigns that are not only memorable, but capable of improving over time.`

    ]

  },



  /* =======================================================
     BLOG 01
  ======================================================= */

  {
    slug:
      "digital-experiences-that-people-remember",

    heading:
      "Digital Experiences People Actually Remember",

    subheading:
      "Good digital design should make interaction feel effortless.",


    images: [

      "/images/blog/blog-01.webp"

    ],


    content: [

      `A website is often one of the first meaningful interactions somebody has with a brand.`,

      `Strong digital experiences combine clear thinking, useful information, thoughtful design and motion without allowing any one element to overpower the others.`,

      `When all of those pieces work together, the experience becomes easier to use and much harder to forget.`

    ]

  }

];