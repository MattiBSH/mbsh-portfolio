// Shared site metadata used by both language pages.
//
// NOTE: Open Graph scrapers (LinkedIn, Slack, iMessage, X) require ABSOLUTE
// image URLs — a relative "/images/profile.png" will not render a preview.
// This must match the deployed domain.
export const SITE_URL = "https://mbsh-portfolio.vercel.app";

// A purpose-made 1200x630 crop. profile.png is 1127x774 (3:2) and 1.6 MB —
// scrapers want 1.91:1 and would letterbox or crop it unpredictably.
export const OG_IMAGE = `${SITE_URL}/images/og.jpg`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const META = {
  en: {
    title: "Matti Hansen Portfolio",
    ogTitle: "Matti Hansen — Software Developer",
    description:
      "Software developer helping Danish municipalities and regions with frontend, backend and DevOps solutions. Angular, React, Flutter, Java, Python.",
  },
  da: {
    title: "Matti Hansen — Softwareudvikler | Portefølje",
    ogTitle: "Matti Hansen — Softwareudvikler",
    description:
      "Softwareudvikler der hjælper danske kommuner og regioner med frontend-, backend- og DevOps-løsninger. Angular, React, Flutter, Java, Python.",
  },
};

// The personal route has its own metadata: it is a separate page, so a shared
// description would make both look identical in a link preview.
export const META_PERSONAL = {
  en: {
    title: "Outside work — Matti Hansen",
    ogTitle: "Matti Hansen — Danish nature on film",
    description:
      "Nature clips filmed around Denmark in my spare time, shared on YouTube as @TheRealDanishNature.",
  },
  da: {
    title: "Uden for arbejdet — Matti Hansen",
    ogTitle: "Matti Hansen — dansk natur på film",
    description:
      "Naturklip filmet rundt om i Danmark i min fritid, delt på YouTube som @TheRealDanishNature.",
  },
};
