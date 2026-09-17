import { COMPANIES, LINKEDIN_URL, YOUTUBE_URL } from "./content";

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
    ogTitle: "Matti Hansen, Software Developer",
    description:
      "Software developer helping Danish municipalities and regions with frontend, backend and DevOps solutions. Angular, React, Flutter, Java, Python.",
  },
  da: {
    title: "Matti Hansen, Softwareudvikler | Portefølje",
    ogTitle: "Matti Hansen, Softwareudvikler",
    description:
      "Softwareudvikler der hjælper danske kommuner og regioner med frontend-, backend- og DevOps-løsninger. Angular, React, Flutter, Java, Python.",
  },
};

// The personal route has its own metadata: it is a separate page, so a shared
// description would make both look identical in a link preview.
export const META_PERSONAL = {
  en: {
    title: "Outside work | Matti Hansen",
    ogTitle: "Matti Hansen, Danish nature on film",
    description:
      "Nature clips filmed around Denmark in my spare time, shared on YouTube as @TheRealDanishNature.",
  },
  da: {
    title: "Uden for arbejdet | Matti Hansen",
    ogTitle: "Matti Hansen, dansk natur på film",
    description:
      "Naturklip filmet rundt om i Danmark i min fritid, delt på YouTube som @TheRealDanishNature.",
  },
};

// The projects route needs its own metadata: it is the page most likely to be
// shared on its own, so a generic portfolio description would waste the preview.
export const META_PROJECTS = {
  en: {
    title: "Projects | Matti Hansen",
    ogTitle: "Matti Hansen, selected projects",
    description:
      "Case management systems for Danish municipalities: Datafordeleren address migration, SBSYS gateway work, document import, CVR updates, plus earlier mobile apps.",
  },
  da: {
    title: "Projekter | Matti Hansen",
    ogTitle: "Matti Hansen, udvalgte projekter",
    description:
      "Sagsbehandlingssystemer til danske kommuner: omlægning af adresseopslag til Datafordeleren, SBSYS-gateway, dokumentimport, CVR-opdatering og tidligere mobilapps.",
  },
};

// Structured data. The whole site describes one person, so every route carries
// the same Person node: a crawler that lands on /projects should be able to tell
// whose projects they are without visiting the front page.
//
// Only facts already visible on the page go in here. Structured data that says
// more than the page does is what Google calls spammy markup, and it is the kind
// of thing that gets rich results turned off for a domain.
const PERSON_NAME = "Matti Hansen";

// Derived from COMPANIES rather than written out again, so the employer cannot
// disagree with the badge on the project cards.
const currentEmployer = Object.values(COMPANIES).find((c) => c.current);

export function personJsonLd(lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSON_NAME,
    url: SITE_URL,
    image: OG_IMAGE,
    jobTitle: lang === "da" ? "Softwareudvikler" : "Software Developer",
    ...(currentEmployer
      ? { worksFor: { "@type": "Organization", name: currentEmployer.name } }
      : {}),
    // Both languages are served, and the site says so with hreflang already.
    knowsLanguage: ["da", "en"],
    // sameAs is how a crawler links this page to the profiles it already knows.
    // Both are linked in the page body too, so nothing new is claimed here.
    sameAs: [LINKEDIN_URL, YOUTUBE_URL],
  };
}
