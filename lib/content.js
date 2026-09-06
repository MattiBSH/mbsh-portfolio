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

export const CONTENT = {
  en: {
    switchLabel: "danish",
    switchHref: "/danish_index",
    headlineLead: "I am",
    name: "Matti Hansen",
    intro:
      "As a software developer, I am dedicated to designing and implementing solutions that enhance operational efficiency in my clients organisations. My focus is on creating innovative tools and applications that streamline daily tasks, and deliver measurable benefits to both the employees and their organizations.",
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
        body: "I have worked with Java and Python to develop robust and scalable backend solutions. In Java I have maintained existing systems and also created new ones from scratch. In python I have integrated with AI models to handle help municipalities handle GDPR sensitive data.",
      },
      {
        title: "DevOps",
        lead: "Creating and maintaining CI/CD pipelines",
        body: "I am proficient in using Jenkins, GitHub Actions, and Argo to automate and streamline development workflows.",
      },
    ],
    educationTitle: "Education",
    education: [
      { title: "Borupgaard Gymnasium", period: "2016-2018" },
      { title: "Computer science (AP)", period: "2019-2022" },
      { title: "PBA in Software development", period: "2022-2023" },
    ],
    personal: {
      title: "Outside work",
      lead: "I film Danish nature",
      body:
        "In my spare time I am out with a camera filming nature around Denmark. I share what I catch on my YouTube channel.",
      linkText: "Watch on YouTube",
    },
    contactTitle: "Contact me",
    contactLead: "Feel free to contact me if you have any questions",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    linkedinText: "My LinkedIn 💻",
    projectsTitle: "Projects",
    projects: [
      {
        title: "AI GDPR Integration",
        description:
          "Made an integration of an AI model that the municipalities had paid for so they can now use it to analyze freedom of information pdfs.",
      },
      {
        title: "Easy search",
        description:
          "Worked for a long period with easy search which is used to update properties and land parcels.",
      },
      {
        title: "Property and land parcel update",
        description:
          "Made a newer version of the property and land parcel update that can now handle building on foreign land and condominiums.",
      },
      {
        title: "Building and environmental monitoring",
        description:
          "Made a frontend to monitor the building and environmental project.",
      },
      {
        title: "Fitness App",
        description:
          "Made a frontend for the Fortis app. Which can be found on the appstore.",
      },
      {
        title: "American singer/rapper tiktok-like competition app",
        description:
          "Made an app in flutter when I worked at meew that did not come out, but it taught me a lot about designing mobile apps and how social media is made. Used Firebase and flutter",
      },
    ],
    footer: "Made by Matti Hansen",
  },

  da: {
    switchLabel: "English",
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
        body: "Jeg har brugt Angular, React, and Flutter til at udvikle brugergrænseflader, der er lette at bruge og forstå. Jeg har også arbejdet med designere for at skabe brugergrænseflader, der er intuitive og lette at navigere.",
      },
      {
        title: "Backend",
        lead: "Skabe og bibeholde backend systemer",
        body: "Jeg har arbejdet med Java og Python til at udvikle robuste og skalerbare backend-løsninger. I Java har jeg vedligeholdt eksisterende systemer og også oprettet nye fra bunden. I python har jeg integreret med AI-modeller for at hjælpe kommuner håndtere GDPR-følsomme data.",
      },
      {
        title: "DevOps",
        lead: "Skabe og bibeholde CI/CD pipelines",
        body: "Jeg er erfaren i at bruge Jenkins, GitHub Actions og Argo til at automatisere og optimere udviklingsprocesser.",
      },
    ],
    educationTitle: "Uddannelse",
    education: [
      { title: "Borupgaard Gymnasium", period: "2016-2018" },
      { title: "Datamatiker", period: "2019-2022" },
      { title: "PBA in Software udvikling", period: "2022-2023" },
    ],
    personal: {
      title: "Uden for arbejdet",
      lead: "Jeg filmer dansk natur",
      body:
        "I min fritid er jeg ude med kameraet og filmer naturen rundt om i Danmark. Jeg deler det, jeg fanger, på min YouTube-kanal.",
      linkText: "Se med på YouTube",
    },
    contactTitle: "Kontakt mig",
    contactLead: "I kan kontakte mig på følgende måder:",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    linkedinText: "Min LinkedIn 💻",
    projectsTitle: "Projekter",
    projects: [
      {
        title: "AI GDPR Integration",
        description:
          "Lavet en integration af en AI model som kommunerne havde betalt for så de nu kan bruge den til at analysere aktindsigt pdf´er",
      },
      {
        title: "Nemsøg",
        description:
          "Arbejdet i en lang periode med nemsøg som bruges til at opdatere ejendomme og matrikler.",
      },
      {
        title: "Ejendom og matrikel opdatering",
        description:
          "Lavet en nyere version af ejendom og matrikel opdateringen som nu kan håndtere bygning på fremmed grund og ejerlejligheder.",
      },
      {
        title: "Bygning og miljø monitorering",
        description: "Lavet en frontend til at monitorere bygning og miljø projektet",
      },
      {
        title: "Fitness App",
        description: "Lavet en frontend til Fortis appen. Som kan findes på appstore.",
      },
      {
        title: '"Amerikansk sanger/rapper" tiktok agtig konkurrence app',
        description:
          "Lavet en app i flutter da jeg arbejdet hos meew som ikke kom ud, men den lærte mig en masse om design af mobil app og hvordan sociale medier er lavet. Benyttede mig af Firebase og flutter for at skabe den.",
      },
    ],
    footer: "Lavet af Matti Hansen",
  },
};
