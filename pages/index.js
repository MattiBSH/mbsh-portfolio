import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ProjectCarousel from "./carousel";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english"); // "english" or "danish"

  // Content in both languages
  const content = {
    english: {
      title: "Matti Hansen Portfolio",
      headline: {
        line1: "I am",
        line2: "Matti Hansen"
      },
      description: "As a software developer, I am dedicated to designing and implementing solutions that enhance operational efficiency in my clients organisations. My focus is on creating innovative tools and applications that streamline daily tasks, and deliver measurable benefits to both the employees and their organizations.",
      info: "Helping municipalities and regions with IT solutions",
      sections: {
        frontend: {
          title: "Frontend",
          subtitle: "Creating user interfaces that are easy to use and understand",
          description: "I have experience using Angular, React, and Flutter for building dynamic and responsive front-end applications."
        },
        backend: {
          title: "Backend",
          subtitle: "Creating and maintaining databases and server-side code",
          description: "I have worked with Java and Python to develop robust and scalable backend solutions. In Java I have maintained existing systems and also created new ones from scratch. In python I have integrated with AI models to handle help municipalities handle GDPR sensitive data."
        },
        devops: {
          title: "DevOps",
          subtitle: "Creating and maintaining CI/CD pipelines",
          description: "I am proficient in using Jenkins, GitHub Actions, and Argo to automate and streamline development workflows."
        }
      },
      education: {
        title: "Education",
        items: [
          { name: "Borupgaard Gymnasium", period: "2016-2018" },
          { name: "Computer science (AP)", period: "2019-2022" },
          { name: "PBA in Software development", period: "2022-2023" }
        ]
      },
      contact: {
        title: "Contact me",
        description: "Feel free to contact me if you have any questions",
        email: "Email: mattibenhansen@gmail.com ✉️",
        linkedin: "My LinkedIn 💻"
      },
      projects: {
        title: "Projects",
        items: [
          { title: "AI GDPR Integration", description: "Made an integration of an AI model that the municipalities had paid for so they can now use it to analyze freedom of information pdfs." },
          { title: "Easy search", description: "Worked for a long period with easy search which is used to update properties and land parcels." },
          { title: "Property and land parcel update", description: "Made a newer version of the property and land parcel update that can now handle building on foreign land and condominiums." },
          { title: "Building and environmental monitoring", description: "Made a frontend to monitor the building and environmental project." },
          { title: "Fitness App", description: "Made a frontend for the Fortis app. Which can be found on the appstore." },
          { title: "American singer/rapper tiktok-like competition app", description: "Made an app in flutter when I worked at meew that did not come out, but it taught me a lot about designing mobile apps and how social media is made. Used Firebase and flutter" }
        ]
      },
      footer: "Made by Matti Hansen",
      buttons: {
        theme: "Dark / Light",
        random: "Random effect",
        language: "Dansk"
      }
    },
    danish: {
      title: "Matti Hansen Portfolio",
      headline: {
        line1: "Jeg er",
        line2: "Matti Hansen"
      },
      description: "Som softwareudvikler er jeg dedikeret til at designe og implementere løsninger, der forbedrer den operationelle effektivitet i mine kunders organisationer. Mit fokus er på at skabe innovative værktøjer og applikationer, der strømliner daglige opgaver, og leverer målbare fordele for både medarbejderne og deres organisationer.",
      info: "Jeg har arbejdet med flere kommuner og regioner for at hjælpe dem med at digitalisere deres arbejdsgange og skabe mere effektive løsninger.",
      sections: {
        frontend: {
          title: "Frontend",
          subtitle: "Skabe UI som er let at bruge og forstå",
          description: "Jeg har brugt Angular, React, and Flutter til at udvikle brugergrænseflader, der er lette at bruge og forstå. Jeg har også arbejdet med designere for at skabe brugergrænseflader, der er intuitive og lette at navigere."
        },
        backend: {
          title: "Backend",
          subtitle: "Skabe og bibeholde backend systemer",
          description: "Jeg har arbejdet med Java og Python til at udvikle robuste og skalerbare backend-løsninger. I Java har jeg vedligeholdt eksisterende systemer og også oprettet nye fra bunden. I python har jeg integreret med AI-modeller for at hjælpe kommuner håndtere GDPR-følsomme data."
        },
        devops: {
          title: "DevOps",
          subtitle: "Skabe og bibeholde CI/CD pipelines",
          description: "Jeg er erfaren i at bruge Jenkins, GitHub Actions og Argo til at automatisere og optimere udviklingsprocesser."
        }
      },
      education: {
        title: "Udannelse",
        items: [
          { name: "Borupgaard Gymnasium", period: "2016-2018" },
          { name: "Datamatiker", period: "2019-2022" },
          { name: "PBA in Software udvikling", period: "2022-2023" }
        ]
      },
      contact: {
        title: "Kontakt mig",
        description: "I kan kontakte mig på følgende måder:",
        email: "Email: mattibenhansen@gmail.com ✉️",
        linkedin: "Min LinkedIn 💻"
      },
      projects: {
        title: "Projekter",
        items: [
          { title: 'AI GDPR Integration', description: 'Lavet en integration af en AI model som kommunerne havde betalt for så de nu kan bruge den til at analysere aktindsigt pdf´er' },
          { title: 'Nemsøg', description: 'Arbejdet i en lang periode med nemsøg som bruges til at opdatere ejendomme og matrikler.' },
          { title: 'Ejendom og matrikel opdatering', description: 'Lavet en nyere version af ejendom og matrikel opdateringen som nu kan håndtere bygning på fremmed grund og ejerlejligheder.' },
          { title: 'Bygning og miljø monitorering', description: 'Lavet en frontend til at monitorere bygning og miljø projektet' },
          { title: 'Fitness App', description: 'Lavet en frontend til Fortis appen. Som kan findes på appstore.' },
          { title: '"Amerikansk sanger/rapper" tiktok agtig konkurrence app', description: 'Lavet en app i flutter da jeg arbejdet hos meew som ikke kom ud, men den lærte mig en masse om design af mobil app og hvordan sociale medier er lavet. Benyttede mig af Firebase og flutter for at skabe den.' }
        ]
      },
      footer: "Lavet af Matti Hansen",
      buttons: {
        theme: "Dark / Light",
        random: "Random effect",
        language: "English"
      }
    }
  };

  const t = content[language]; // Current language content

  function changeTheme() {
    console.log("Changing theme");
    setDarkMode(!darkMode);
  }

  function toggleLanguage() {
    setLanguage(language === "english" ? "danish" : "english");
  }

  function randomEffect() {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        console.log("Random effect");
        const elements = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'button'];
  
        elements.forEach(tag => {
          document.querySelectorAll(tag).forEach(element => {
            element.style.color = randomColor();
          });
        });
      }, 200 * i);
    }   
  }

  function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  return (
    <div>
      <Head>
        <title>{t.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href={darkMode ? "/styles/darkmode.css" : "/styles/lightmode.css"} />
      </Head>

      <div className="toolbarHolder">
        <div className="toolbar">
          <button onClick={changeTheme} className="buttonStyle"><b>{t.buttons.theme}</b></button>
          <button onClick={randomEffect} className="buttonStyle"><b>{t.buttons.random}</b></button>
          <button onClick={toggleLanguage} className="buttonStyle"><b>{t.buttons.language}</b></button>
        </div>
      </div>

      <div className="container">
        <main>
          <div className="mainContent">
            <div className="spaceAtStart"></div>

            <div className="threeBlocks">
              <div className="third">
                <h1 className="headline">
                  {t.headline.line1}
                  <br />
                  {t.headline.line2}
                </h1>
                <div className="line"></div>
                <h4 className="description">{t.description}</h4>
              </div>

              <div className="third">
                <div className="tintedShadow">
                  <Image 
                    className="profileImage"
                    src="/images/profile.png"
                    width={1200}
                    height={1200}
                    alt="Picture of the author"
                  />
                </div>
              </div>

              <div className="third">
                <h3 className="info">{t.info}</h3>
              </div>

              <div className="threePointBreakBox">
                <div className="third">
                  <h2 className="point">{t.sections.frontend.title}</h2>
                  <h4 className="description">{t.sections.frontend.subtitle}</h4>
                  <p className="description2">{t.sections.frontend.description}</p>
                </div>
                <div className="third">
                  <h2 className="point">{t.sections.backend.title}</h2>
                  <h4 className="description">{t.sections.backend.subtitle}</h4>
                  <p className="description2">{t.sections.backend.description}</p>
                </div>
                <div className="third">
                  <h2 className="point">{t.sections.devops.title}</h2>
                  <h4 className="description">{t.sections.devops.subtitle}</h4>
                  <p className="description2">{t.sections.devops.description}</p>
                </div>
              </div>
            </div>

            <div className="education">
              <h2 className="basicHeadline">{t.education.title}</h2>
              <br />
              <div className="timeline">
                {t.education.items.map((item, index) => (
                  <div key={index} className="timelineItem">
                    <div className="timelineContent">
                      <h2 className="timelineHeader">{item.name}</h2>
                      <p className="timelineTimePeriod">{item.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="center">
              <div className="contactMe">
                <h2 className="timelineHeader">{t.contact.title}</h2>
                <br />
                <h4 className="description">{t.contact.description}</h4>
                <br />
                <h4 className="description">{t.contact.email}</h4>
                <h4 className="description">
                  LinkedIn:{" "}
                  <Link href={"https://www.linkedin.com/in/matti-hansen-74a454109/"}>
                    {t.contact.linkedin}
                  </Link>
                </h4>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="edgeSpace"></div>

      <div className="projectsDiv">
        <h2 className="headlineWhite">{t.projects.title}</h2>
        <ProjectCarousel projects={t.projects.items}></ProjectCarousel>
      </div>
      <div className="edgeSpace"></div>

      <footer>
        <h5>{t.footer}</h5>
      </footer>
    </div>
  );
}