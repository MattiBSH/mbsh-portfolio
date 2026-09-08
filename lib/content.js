// All page copy, in both languages.
//
// The English and Danish pages used to be two hand-maintained copies of the
// same JSX, which meant every layout change had to be made twice. The markup
// now lives once in components/Portfolio.jsx and reads from here, so adding a
// section is a change in two places (this file) rather than two files.

export const EMAIL = "mattibenhansen@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/matti-hansen-74a454109/";
export const YOUTUBE_URL = "https://www.youtube.com/@TheRealDanishNature";
export const YOUTUBE_HANDLE = "@TheRealDanishNature";

// Videos shown in the personal section. Language-neutral: the clips are the
// same in both, only the heading above them is translated.
//
// The id is the 11-character YouTube id — the part after "/shorts/" or
// "watch?v=" in the URL. Leave this empty and the gallery renders nothing.
export const REELS = [
  { id: "H12_mzWp8GU" },
  { id: "--758dpiscM" },
  { id: "KaxeIeVya0M" },
  { id: "_UuPG0FZr6o" },
];

// Where each project was built. Language-neutral: these are proper nouns.
// `current` is what separates today's employer from earlier roles — the card
// badges it differently rather than the data carrying a colour.
export const COMPANIES = {
  dafolo: { name: "Dafolo", current: true },
  // meew was the employer, an agency — Fortis and the other apps below were its
  // clients, so they are badged meew and name the client in the description.
  meew: { name: "meew", current: false },
};

// Education, in the same shape as EXPERIENCE so the two can be merged into one
// chronological timeline. Years are structured rather than a "2019-2022" string
// precisely so they can be sorted against the work entries.
export const EDUCATION = [
  {
    id: "pba",
    kind: "education",
    from: 2022,
    to: 2023,
    en: { role: "PBA in Software development" },
    da: { role: "PBA i softwareudvikling" },
  },
  {
    id: "datamatiker",
    kind: "education",
    from: 2019,
    to: 2022,
    en: { role: "Computer science (AP)" },
    da: { role: "Datamatiker" },
  },
  {
    id: "gymnasium",
    kind: "education",
    from: 2016,
    to: 2018,
    en: { role: "Borupgaard Gymnasium" },
    da: { role: "Borupgaard Gymnasium" },
  },
];

// Work history. Same shape as PROJECTS: `company` keys into COMPANIES,
// language-neutral facts sit at the top level, and only the prose is nested.
// `to: null` means current, rendered with the translated "present" label.
//
// `kind` badges the entry: "internship" or "student" (a paid student job), with
// the label coming from `kindLabels` in each language. A role with no `kind` is
// ordinary employment and gets no badge. Splitting a placement into its stages
// is deliberate — an internship that converted into a paid role says more than
// one date range that hides how it started.
//
// !! THE YEARS BELOW ARE STILL UNCONFIRMED. They were inferred from the project
// dates and the education timeline (Datamatiker to 2022, PBA to 2023, both of
// which carry a mandatory internship). Check them against LinkedIn before
// relying on them — a portfolio that contradicts a CV is worse than a quiet one.
export const EXPERIENCE = [
  {
    id: "dafolo-dev",
    company: "dafolo",
    kind: "role",
    from: 2023,
    to: null,
    en: {
      role: "Software Developer",
      description:
        "Building and maintaining case management systems used by Danish municipalities and regions. That covers backend services, integrations with the national registries, and the interfaces caseworkers use on top of them.",
    },
    da: {
      role: "Softwareudvikler",
      description:
        "Bygger og vedligeholder sagsbehandlingssystemer, som danske kommuner og regioner bruger. Det dækker backendservices, integrationer til de nationale registre og de flader, sagsbehandlerne arbejder i.",
    },
  },
  {
    id: "dafolo-intern",
    company: "dafolo",
    kind: "internship",
    from: 2023,
    to: 2023,
    en: {
      role: "Software Developer",
      description:
        "Groundwork for adopting Kombit's fordelingskomponent, the shared distribution infrastructure for Danish municipalities. That meant learning SOAP and making it work inside a legacy Java 8 codebase. That preparation fed projects the team took on in the years after, and I was hired as a developer at the end of the placement.",
    },
    da: {
      role: "Softwareudvikler",
      description:
        "Forarbejdet til at tage Kombits fordelingskomponent i brug, den fælles distributionsinfrastruktur for danske kommuner. Det betød at lære SOAP og få det til at spille i en ældre Java 8-kodebase. Arbejdet forberedte de projekter, teamet siden gik i gang med, og jeg blev ansat som udvikler efter praktikken.",
    },
  },
  {
    id: "meew-student",
    company: "meew",
    kind: "student",
    from: 2021,
    to: 2022,
    en: {
      role: "Mobile Developer",
      description:
        "Stayed on as a student worker after the internship, building mobile apps in Flutter for the agency's clients, including a fitness app that shipped on the App Store.",
    },
    da: {
      role: "Mobiludvikler",
      description:
        "Fortsatte som studentermedhjælper efter praktikken og byggede mobilapps i Flutter til bureauets kunder, blandt andet en fitness-app, der udkom på App Store.",
    },
  },
  {
    id: "meew-intern",
    company: "meew",
    kind: "internship",
    from: 2021,
    to: 2021,
    en: {
      role: "Mobile Developer",
      description:
        "A twelve-week internship at a digital agency, working in Flutter on client apps, and kept on as a student worker afterwards.",
    },
    da: {
      role: "Mobiludvikler",
      description:
        "Tolv ugers praktik hos et digitalt bureau med Flutter-udvikling på kundeprojekter, og fortsatte som studentermedhjælper bagefter.",
    },
  },
];

// Projects, as one list — same pattern as REELS above.
//
// Anything identical in both languages (tech, company, years) lives at the top
// level and so physically cannot disagree between the two pages; only the prose
// is nested per language. This replaced two parallel arrays paired by array
// position alone, where adding a project to one language and not the other went
// unnoticed.
//
// `id` is an ASCII slug used as the React key and as the test selector
// (data-project-id). It must be unique — titles are not a safe key, since
// different projects can share one.
//
// `to: null` means still running; the card renders the translated "present"
// label instead of a year.
//
// NOTE ON CONTENT: several of these summarise work tracked in Dafolo's internal
// Jira. Descriptions are written fresh and deliberately name only publicly
// documented Danish public-sector systems (SBSYS, SBSIP, Datafordeleren, DAWA,
// CVR, BFE). Never add ticket keys, Jira links, internal release numbers, or the
// names of individual municipalities that piloted a feature.
export const PROJECTS = [
  {
    id: "datafordeleren-migration",
    company: "dafolo",
    from: 2026,
    to: null,
    tech: ["Java", "REST API", "Datafordeleren", "OpenAPI"],
    en: {
      title: "Address lookup migration to Datafordeleren",
      description:
        "Moved the case management system's address and property lookups off DAWA and Dataforsyningen onto Datafordeleren, behind a new API gateway. Covered address and cadastral search, ownership records, and enriching land parcel data so the rest of the platform kept working unchanged.",
    },
    da: {
      title: "Omlægning af adresseopslag til Datafordeleren",
      description:
        "Flyttede sagsbehandlingssystemets adresse- og ejendomsopslag fra DAWA og Dataforsyningen over på Datafordeleren via en ny API-gateway. Omfattede adresse- og matrikelsøgning, ejerfortegnelse og berigelse af jordstykkedata, så resten af platformen kunne køre videre uændret.",
    },
  },
  {
    id: "sbsys-gateway",
    company: "dafolo",
    from: 2025,
    to: 2026,
    tech: ["Java", "REST API", "SBSYS"],
    en: {
      title: "SBSYS gateway: parties and objects",
      description:
        "Built and released the gateway endpoints municipalities use to attach properties, land parcels and people to a case. Included address and cadastral search, BFE handling, and filtering out demolished buildings and historic records so caseworkers only see what still exists.",
    },
    da: {
      title: "SBSYS gateway: parter og genstande",
      description:
        "Byggede og frigav de gateway-endpoints, kommunerne bruger til at knytte ejendomme, matrikler og personer til en sag. Herunder adresse- og matrikelsøgning, håndtering af BFE-numre og frafiltrering af nedrevne bygninger og historiske data, så sagsbehandlerne kun ser det, der findes.",
    },
  },
  {
    id: "document-import",
    company: "dafolo",
    from: 2026,
    to: null,
    tech: ["Java", "Batch jobs", "SBSYS"],
    en: {
      title: "Document import pipeline",
      description:
        "A job that lands documents from external construction and health systems directly on the right case in SBSYS. Configurable templates and blacklists decide what gets imported, folder structure is preserved, and anything that fails is written out as an error file so it can be re-run rather than lost.",
    },
    da: {
      title: "Dokumentimport-pipeline",
      description:
        "Et job der lægger dokumenter fra eksterne bygge- og sundhedssystemer direkte på den rigtige sag i SBSYS. Konfigurerbare skabeloner og blacklists styrer, hvad der importeres, mappestrukturen bevares, og fejlede dokumenter skrives ud som fejlfiler, så de kan køres igen i stedet for at gå tabt.",
    },
  },
  {
    id: "cvr-updater",
    company: "dafolo",
    from: 2026,
    to: null,
    tech: ["Java", "Batch jobs", "CVR", "OpenAPI"],
    en: {
      title: "CVR company data updater",
      description:
        "A scheduled job that keeps company records in the case management system current against the Danish business registry. Works through changes in timed steps and records how far it got, so a run can resume where it stopped instead of starting over.",
    },
    da: {
      title: "CVR-opdatering af virksomhedsdata",
      description:
        "Et planlagt job der holder virksomhedsdata i sagsbehandlingssystemet opdateret mod CVR. Det arbejder sig gennem ændringer i tidsstyrede trin og gemmer, hvor langt det nåede, så et gennemløb kan fortsætte derfra i stedet for at starte forfra.",
    },
  },
  {
    id: "sbsip-platform",
    company: "dafolo",
    from: 2025,
    to: 2026,
    tech: ["Java", "Angular", "CI/CD"],
    en: {
      title: "SBSIP platform work",
      description:
        "Extended the merge fields available to SBSIP Office so letters can pull in objects, the primary party and family relations. Also moved the family tree lookup onto the gateway and set up the build pipeline behind it.",
    },
    da: {
      title: "SBSIP-platformen",
      description:
        "Udvidede flettefelterne i SBSIP Office, så breve kan trække genstande, primær part og familierelationer med. Flyttede desuden familietræ-opslaget over på gatewayen og satte build-pipelinen op bag det.",
    },
  },
  {
    id: "ai-gdpr",
    company: "dafolo",
    from: 2024,
    to: 2026,
    tech: ["Python", "AI integration", "GDPR"],
    en: {
      title: "AI GDPR integration",
      description:
        "Integrated an AI model the municipalities had licensed so they could use it to analyse freedom of information PDFs, and later moved that integration into the main case access platform.",
    },
    da: {
      title: "AI GDPR-integration",
      description:
        "Integrerede en AI-model, som kommunerne havde betalt for, så de kunne bruge den til at analysere aktindsigts-PDF'er, og flyttede senere integrationen ind i den samlede aktindsigtsplatform.",
    },
  },
  {
    id: "nemsoeg",
    company: "dafolo",
    from: 2023,
    to: 2025,
    tech: ["Java", "Angular"],
    en: {
      title: "Easy search",
      description:
        "Worked for a long period on Nemsøg, which municipalities use to look up and update properties and land parcels.",
    },
    da: {
      title: "Nemsøg",
      description:
        "Arbejdede i en lang periode med Nemsøg, som kommunerne bruger til at slå op i og opdatere ejendomme og matrikler.",
    },
  },
  {
    id: "property-update",
    company: "dafolo",
    from: 2023,
    to: 2024,
    tech: ["Java", "Angular"],
    en: {
      title: "Property and land parcel update",
      description:
        "Built a newer version of the property and land parcel update that can handle buildings on leased land and condominiums, which the previous version could not represent.",
    },
    da: {
      title: "Ejendoms- og matrikelopdatering",
      description:
        "Byggede en nyere version af ejendoms- og matrikelopdateringen, som kan håndtere bygninger på fremmed grund og ejerlejligheder, hvilket den tidligere version ikke kunne rumme.",
    },
  },
  {
    id: "building-environment",
    company: "dafolo",
    from: 2023,
    to: 2024,
    tech: ["Angular", "Monitoring"],
    en: {
      title: "Building and environmental monitoring",
      description:
        "Built the frontend used to monitor the building and environmental project, giving the team a single view of how the running integrations were behaving.",
    },
    da: {
      title: "Bygning og miljø-monitorering",
      description:
        "Byggede den frontend, der bruges til at monitorere bygning og miljø-projektet, så teamet fik ét samlet overblik over, hvordan de kørende integrationer opførte sig.",
    },
  },
  {
    id: "fortis-fitness",
    company: "meew",
    from: 2022,
    to: 2022,
    tech: ["Flutter", "Dart"],
    en: {
      title: "Fortis fitness app",
      description:
        "Built the frontend for Fortis, a fitness app delivered for a client while at meew. It shipped on the App Store.",
    },
    da: {
      title: "Fortis fitness-app",
      description:
        "Byggede frontenden til Fortis, en fitness-app leveret til en kunde, mens jeg var hos meew. Den udkom på App Store.",
    },
  },
  {
    id: "meew-competition",
    company: "meew",
    from: 2021,
    to: 2022,
    tech: ["Flutter", "Firebase"],
    en: {
      title: "Social competition app",
      description:
        "A short-video competition app built in Flutter for another meew client. It never launched, but it taught me a great deal about designing mobile apps and how social platforms are put together.",
    },
    da: {
      title: "Social konkurrence-app",
      description:
        "En kortvideo-konkurrenceapp bygget i Flutter til en anden af meews kunder. Den kom aldrig ud, men den lærte mig en masse om design af mobilapps, og hvordan sociale platforme er skruet sammen.",
    },
  },
];

// The two timelines rendered as one. Sorted most recent first; where two
// entries start in the same year, an ongoing one outranks a finished one and a
// later end date wins. That is what puts the current Dafolo role above the
// internship that preceded it, and slots the PBA between them.
export function timelineEntries() {
  return [...EXPERIENCE, ...EDUCATION].sort((a, b) => {
    if (b.from !== a.from) return b.from - a.from;
    return (b.to ?? Infinity) - (a.to ?? Infinity);
  });
}

export const CONTENT = {
  en: {
    lang: "en",
    projectLabels: {
      present: "now",
      tech: "Technologies",
    },
    // Routes. The language switch has to stay on the same kind of page, so
    // there is a separate href for the personal route.
    homeHref: "/",
    personalHref: "/personal",
    switchPersonalHref: "/danish_personal",
    switchFlag: "dk",
    switchAria: "Switch to Danish",
    themeAria: "Toggle dark mode",
    switchHref: "/danish_index",
    headlineLead: "I am",
    name: "Matti Hansen",
    intro:
      "As a software developer, I am dedicated to designing and implementing solutions that enhance operational efficiency in my clients' organisations. My focus is on creating innovative tools and applications that streamline daily tasks, and deliver measurable benefits to both the employees and their organizations.",
    info: "Helping municipalities and regions with IT solutions",
    skills: [
      {
        title: "Frontend",
        lead: "Creating user interfaces that are easy to use and understand",
        body: "I have experience using Angular, React, and Flutter for building dynamic and responsive front-end applications.",
      },
      {
        title: "Backend",
        lead: "Creating and maintaining databases and server-side code",
        body: "I have worked with Java and Python to develop scalable backend solutions. In Java I have maintained existing systems and also created new ones from scratch. In python I have integrated with AI models to handle help municipalities handle GDPR sensitive data.",
      },
      {
        title: "DevOps",
        lead: "Creating and maintaining CI/CD pipelines",
        body: "I am proficient in using Jenkins, GitHub Actions, and Argo to automate and streamline development workflows.",
      },
    ],
    backgroundTitle: "Background",
    kindLabels: {
      internship: "Internship",
      student: "Student worker",
      education: "Education",
    },
    personal: {
      title: "Outside work",
      lead: "I film Danish nature",
      body:
        "In my spare time I sometimes capture some nature clips and then compile them later. " +
        "I share what I catch on my YouTube channel, not to earn money but for fun and for remembering the moments.",
      linkText: "Watch on YouTube",
      reelLabel: "Nature clip",
      playLabel: "Play",
      closeLabel: "Close",
      prevLabel: "Previous clip",
      nextLabel: "Next clip",
      teaser: "Outside work I film Danish nature. See the clips",
      backLabel: "Back to the portfolio",
      reelsHeading: "Recent clips",
    },
    contactTitle: "Contact me",
    contactLead: "Feel free to contact me if you have any questions",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    linkedinText: "My LinkedIn 💻",
    projectsTitle: "Projects",
    footer: "Made by Matti Hansen",
  },

  da: {
    lang: "da",
    projectLabels: {
      present: "nu",
      tech: "Teknologier",
    },
    homeHref: "/danish_index",
    personalHref: "/danish_personal",
    switchPersonalHref: "/personal",
    switchFlag: "gb",
    switchAria: "Skift til engelsk",
    themeAria: "Skift mellem lyst og mørkt tema",
    switchHref: "/",
    headlineLead: "Jeg er",
    name: "Matti Hansen",
    intro:
      "Som softwareudvikler er jeg dedikeret til at designe og implementere løsninger, der forbedrer den operationelle effektivitet i mine kunders organisationer. Mit fokus er på at skabe innovative værktøjer og applikationer, der strømliner daglige opgaver, og leverer målbare fordele for både medarbejderne og deres organisationer.",
    info: "Jeg har arbejdet med flere kommuner og regioner for at hjælpe dem med at digitalisere deres arbejdsgange og skabe mere effektive løsninger.",
    skills: [
      {
        title: "Frontend",
        lead: "Skabe UI som er let at bruge og forstå",
        body: "Jeg har brugt Angular, React og Flutter til at udvikle brugergrænseflader, der er lette at bruge og forstå. Jeg har også arbejdet med designere for at skabe brugergrænseflader, der er intuitive og lette at navigere.",
      },
      {
        title: "Backend",
        lead: "Skabe og vedligeholde backendsystemer",
        body: "Jeg har arbejdet med Java og Python til at udvikle skalerbare backend-løsninger. I Java har jeg vedligeholdt eksisterende systemer og også oprettet nye fra bunden. I Python har jeg integreret med AI-modeller for at hjælpe kommuner med at håndtere GDPR-følsomme data.",
      },
      {
        title: "DevOps",
        lead: "Skabe og vedligeholde CI/CD-pipelines",
        body: "Jeg er erfaren i at bruge Jenkins, GitHub Actions og Argo til at automatisere og optimere udviklingsprocesser.",
      },
    ],
    backgroundTitle: "Baggrund",
    kindLabels: {
      internship: "Praktik",
      student: "Studentermedhjælper",
      education: "Uddannelse",
    },
    personal: {
      title: "Uden for arbejdet",
      lead: "Jeg filmer dansk natur",
      body:
        "I min fritid er jeg ude med kameraet og filmer naturen rundt om i Danmark. Jeg deler det, jeg fanger, på min YouTube-kanal, ikke for at blive rig men mere bare fordi jeg synes det er hyggeligt. Men udover det for at holde fast i nogle minder.",
      linkText: "Se med på YouTube",
      reelLabel: "Naturklip",
      playLabel: "Afspil",
      closeLabel: "Luk",
      prevLabel: "Forrige klip",
      nextLabel: "Næste klip",
      teaser: "Uden for arbejdet filmer jeg dansk natur. Se klippene",
      backLabel: "Tilbage til porteføljen",
      reelsHeading: "Seneste klip",
    },
    contactTitle: "Kontakt mig",
    contactLead: "I kan kontakte mig på følgende måder:",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    linkedinText: "Min LinkedIn 💻",
    projectsTitle: "Projekter",
    footer: "Lavet af Matti Hansen",
  },
};
