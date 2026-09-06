// Shared site metadata used by both language pages.
//
// NOTE: Open Graph scrapers (LinkedIn, Slack, iMessage, X) require ABSOLUTE
// image URLs — a relative "/images/profile.png" will not render a preview.
// This must match the deployed domain.
export const SITE_URL = "https://mbsh-portfolio.vercel.app";

export const OG_IMAGE = `${SITE_URL}/images/profile.png`;

export const META = {
  en: {
    title: "Matti Hansen Portfolio",
    ogTitle: "Matti Hansen — Software Developer",
    description:
      "Software developer helping Danish municipalities and regions with frontend, backend and DevOps solutions. Angular, React, Flutter, Java, Python.",
  },
  da: {
    title: "Matti Hansen Portfolio",
    ogTitle: "Matti Hansen — Softwareudvikler",
    description:
      "Softwareudvikler der hjælper danske kommuner og regioner med frontend-, backend- og DevOps-løsninger. Angular, React, Flutter, Java, Python.",
  },
};
