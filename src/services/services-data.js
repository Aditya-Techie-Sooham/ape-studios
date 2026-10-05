const pair = function (basePath) {
  return [
    `/images/services/${basePath}-01.jpg`,
    `/images/services/${basePath}-02.jpg`
  ];
};

export const SERVICE_PAGES = {
  "digital-marketing": {
    slug: "digital-marketing",
    navLabel: "Digital Marketing",
    eyebrow: "Growth / Digital / Performance",
    heroLines: [
      { text: "GROW WITH", accent: false },
      { text: "DIGITAL", accent: true },
      { text: "THAT PERFORMS.", accent: false }
    ],
    intro:
      "A connected digital marketing system that brings strategy, content, design, performance, video and web together to move brands forward.",
    summary:
      "From daily communication to high-performance campaigns, we build digital ecosystems that help brands stay visible, relevant and growth-focused.",
    subservices: [
      {
        title: "Social Media Marketing",
        description:
          "Content planning, creative direction, post design, reels, scheduling and platform management tailored to brand positioning and audience behaviour.",
        tags: ["Content Strategy", "Creative Posts", "Reels"],
        images: pair("digital-marketing/social-media")
      },
      {
        title: "Performance Marketing",
        description:
          "Campaign planning and paid media execution across platforms with audience targeting, creative testing, optimisation and reporting.",
        tags: ["Meta Ads", "Google Ads", "Lead Generation"],
        images: pair("digital-marketing/performance-marketing")
      },
      {
        title: "Website Development",
        description:
          "Responsive, conversion-focused websites and landing pages designed around the brand identity, customer journey and business goals.",
        tags: ["Responsive Sites", "Landing Pages", "UI / UX"],
        images: pair("digital-marketing/website-development")
      },
      {
        title: "Graphic Design",
        description:
          "High-impact digital communication design for campaigns, product launches, social media, ads and branded visual systems.",
        tags: ["Campaign Design", "Digital Creatives", "Brand Visuals"],
        images: pair("digital-marketing/graphic-design")
      },
      {
        title: "Motion Graphics",
        description:
          "Animated visual assets that make communication clearer, stronger and more engaging across digital platforms.",
        tags: ["Explainers", "Animated Creatives", "Promo Motion"],
        images: pair("digital-marketing/motion-graphics")
      },
      {
        title: "Video Editing",
        description:
          "Sharp, platform-ready edits for reels, brand films, ads, event highlights and performance-driven short-form content.",
        tags: ["Reels", "Ad Films", "Short-form Video"],
        images: pair("digital-marketing/video-editing")
      }
    ]
  },

  "printables": {
    slug: "printables",
    navLabel: "Printables",
    eyebrow: "Print / Offline / Execution",
    heroLines: [
      { text: "PRINT THAT", accent: false },
      { text: "GETS", accent: true },
      { text: "NOTICED.", accent: false }
    ],
    intro:
      "Print and physical brand communication designed to create stronger real-world visibility across packaging, retail, events and advertising.",
    summary:
      "We combine functionality, brand expression and scale to build offline materials that feel as sharp and considered as your digital presence.",
    subservices: [
      {
        title: "Packaging",
        description:
          "Packaging systems and SKU-ready artwork that align with the brand while improving shelf appeal and product presentation.",
        tags: ["Packaging Design", "Label Systems", "SKU Artwork"],
        images: pair("printables/packaging")
      },
      {
        title: "Brochure",
        description:
          "Structured brand and product brochures with strong hierarchy, clear information flow and premium visual communication.",
        tags: ["Corporate Brochure", "Product Brochure", "Print Layout"],
        images: pair("printables/brochure")
      },
      {
        title: "Leaflet",
        description:
          "Compact print collateral for offers, launches, local campaigns and direct communication with focused messaging and design clarity.",
        tags: ["Flyers", "Promotions", "Campaign Collateral"],
        images: pair("printables/leaflet")
      },
      {
        title: "Mobility Branding",
        description:
          "Vehicle and movement-based branding systems that turn mobility into a visible extension of the brand.",
        tags: ["Vehicle Graphics", "Transit Branding", "Visibility"],
        images: pair("printables/mobility-branding")
      },
      {
        title: "OOH (Out-of-Home Advertising)",
        description:
          "Large-scale brand communication for billboards, kiosks and outdoor display formats designed for immediate impact.",
        tags: ["Billboards", "Kiosks", "Outdoor Ads"],
        images: pair("printables/ooh")
      },
      {
        title: "ATL (Above the Line)",
        description:
          "Mass communication support material built for wide-reach brand campaigns across broader media channels.",
        tags: ["Mass Reach", "Campaign Rollout", "Brand Awareness"],
        images: pair("printables/atl")
      },
      {
        title: "BTL (Below the Line)",
        description:
          "Targeted brand communication for activation, retail, events and direct-response marketing touchpoints.",
        tags: ["Activations", "Retail Collateral", "On-ground"],
        images: pair("printables/btl")
      },
      {
        title: "TTL (Through the Line)",
        description:
          "Integrated communication assets designed to bridge ATL and BTL into one connected campaign language.",
        tags: ["Integrated Campaigns", "Cross-channel", "Unified Messaging"],
        images: pair("printables/ttl")
      }
    ]
  },

  "branding": {
    slug: "branding",
    navLabel: "Branding",
    eyebrow: "Identity / Positioning / Systems",
    heroLines: [
      { text: "MAKE THE BRAND", accent: false },
      { text: "IMPOSSIBLE", accent: true },
      { text: "TO MISS.", accent: false }
    ],
    intro:
      "Branding that helps a business look sharper, speak clearer and stay more memorable across every touchpoint.",
    summary:
      "We work on strategic and visual brand foundations that give direction, consistency and distinctiveness to growing businesses.",
    subservices: [
      {
        title: "Branding",
        description:
          "From positioning and naming logic to visual identity, design language and rollout systems — we shape brands that feel complete and recognisable.",
        tags: ["Brand Strategy", "Identity Design", "Brand Systems"],
        images: pair("branding/branding")
      }
    ]
  },

  "influencer-marketing": {
    slug: "influencer-marketing",
    navLabel: "Influencer Marketing",
    eyebrow: "Creator / Reach / Relevance",
    heroLines: [
      { text: "TURN REACH", accent: false },
      { text: "INTO REAL", accent: true },
      { text: "INFLUENCE.", accent: false }
    ],
    intro:
      "Strategic creator collaborations designed to build trust, visibility and campaign impact with the right audience.",
    summary:
      "We identify the right creator fit, craft content direction and manage collaborations that stay aligned with the brand objective.",
    subservices: [
      {
        title: "Influencer Marketing",
        description:
          "Campaign ideation, creator mapping, collaboration planning and execution support to help brands connect with audiences through trusted voices.",
        tags: ["Creator Campaigns", "Influencer Outreach", "Branded Collaborations"],
        images: pair("influencer-marketing/influencer-marketing")
      }
    ]
  },

  "visual-studio": {
    slug: "visual-studio",
    navLabel: "Visual Studio",
    eyebrow: "Production / Capture / Content",
    heroLines: [
      { text: "SHOOT IT.", accent: false },
      { text: "SHAPE IT.", accent: true },
      { text: "MAKE IT MOVE.", accent: false }
    ],
    intro:
      "Production-led visual content for brands that need photography, films, reels and platform-ready creative execution.",
    summary:
      "We create visual assets that help businesses look more premium, tell their story better and stay content-ready across platforms.",
    subservices: [
      {
        title: "Photography",
        description:
          "Product, lifestyle, campaign and brand photography designed to elevate visual quality and create strong first impressions.",
        tags: ["Product Shoots", "Campaign Shoots", "Lifestyle"],
        images: pair("visual-studio/photography")
      },
      {
        title: "Videography",
        description:
          "Brand films, campaign videos, event coverage and business storytelling content created with a strong visual narrative.",
        tags: ["Brand Films", "Events", "Campaign Videos"],
        images: pair("visual-studio/videography")
      },
      {
        title: "Reels",
        description:
          "Fast-paced short-form video content made for reach, engagement and platform-native storytelling.",
        tags: ["Instagram Reels", "Short-form", "Content Production"],
        images: pair("visual-studio/reels")
      }
    ]
  }
};