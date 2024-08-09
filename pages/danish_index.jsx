import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import darkStyles from "../styles/darkmode.module.css";
import lightStyles from "../styles/lightmode.module.css";
import React, { useState } from "react"; // Correct import for React and useState
import ProjectCarousel from "./carousel";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const styles = darkMode ? darkStyles : lightStyles;
  const [language, setLanguage] = useState("English");

  const [languageURL, setLanguageURL] = useState("/");

  const projects = [
    { title: 'AI GDPR Integration', description: 'Lavet en integration af en AI model som kommunerne havde betalt for så de nu kan bruge den til at analysere aktindsigt pdf´er' },
    { title: 'Nemsøg', description: 'Arbejdet i en lang periode med nemsøg som bruges til at opdatere ejendomme og matrikler.' },
    { title: 'Ejendom og matrikel opdatering', description: 'Lavet en nyere version af ejendom og matrikel opdateringen som nu kan håndtere bygning på fremmed grund og ejerlejligheder.' },
    { title: 'Bygning og miljø monitorering', description: 'Lavet en frontend til at monitorere bygning og miljø projektet' },
    { title: 'Fitness App', description: 'Lavet en frontend til Fortis appen. Som kan findes på appstore.' },
    { title: '"Amerikansk sanger/rapper" tiktok agtig konkurrence app', description: 'Lavet en app i flutter da jeg arbejdet hos meew som ikke kom ud, men den lærte mig en masse om design af mobil app og hvordan sociale medier er lavet. Benyttede mig af Firebase og flutter for at skabe den.' },
  ];

  function changeTheme() {
    console.log("Changing theme");
    setDarkMode(!darkMode);
  }

  function randomEffect() {
    
    for (let i = 0; i < 10; i++) {

      // set 0.5s timeout
      setTimeout(() => {
        console.log("Random effect");
        // Apply random color to all h1, h2, h3, h4, h5, and p elements
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
      <div className={styles.toolbarHolder}>
      <div className={styles.toolbar}>
          <button onClick={changeTheme} className={styles.buttonStyle}><b>Dark / Light</b></button>
          <button onClick={randomEffect} className={styles.buttonStyle}><b>Random effect</b></button>
          <Link href={languageURL} className={styles.buttonStyle} ><b>{language}</b></Link>
          </div>

          
          </div>
      <div className={styles.container}>
        <Head>
          <title>Matti Hansen Portfolio</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          
          <div className={styles.mainContent}>
          
          <div className={styles.spaceAtStart}></div>

          <div className={styles.threeBlocks}>
            <div className={styles.third}>
              <h1 className={styles.headline}>
                Jeg er
                <br />
                Matti Hansen
              </h1>
              <div class={styles.line}></div>
              <h4 className={styles.description}>
                Som softwareudvikler er jeg dedikeret til at designe og
                implementere løsninger, der forbedrer den operationelle effektivitet i mine kunders
                organisationer. Mit fokus er på at skabe innovative værktøjer og
                applikationer, der strømliner daglige opgaver,
                og leverer målbare fordele for både medarbejderne og deres
                organisationer.
              </h4>
            </div>
            <div className={styles.third}>
              <div className={styles.tintedShadow}>
                <Image className={styles.profileImage}
                  src="/images/profile.png"
                  width={1200}
                  height={1200}
                  alt="Picture of the author"
                />
              </div>
            </div>
            <div className={styles.third}>
              <h3 className={styles.info}>
                Jeg har arbejdet med flere kommuner og regioner for at hjælpe dem med at
                digitalisere deres arbejdsgange og skabe mere effektive løsninger.
              </h3>
            </div>

            <div className={styles.threePointBreakBox}>
              <div className={styles.third}>
                <h2 className={styles.point}>Frontend</h2>
                <h4 className={styles.description}>Skabe UI som er let at bruge og forstå</h4>
                <p className={styles.description2}>Jeg har brugt Angular, React, and Flutter til at
                    udvikle brugergrænseflader, der er lette at bruge og forstå. Jeg har
                    også arbejdet med designere for at skabe brugergrænseflader, der er
                    intuitive og lette at navigere.
                </p>
              </div>
              <div className={styles.third}>
                <h2 className={styles.point}>Backend</h2>
                <h4 className={styles.description}>Skabe og bibeholde backend systemer</h4>
                <p className={styles.description2}>
                  Jeg har arbejdet med Java og Python til at udvikle robuste og
                    skalerbare backend-løsninger. I Java har jeg vedligeholdt eksisterende
                    systemer og også oprettet nye fra bunden. I python har jeg
                    integreret med AI-modeller for at hjælpe kommuner
                    håndtere GDPR-følsomme data.
                </p>
              </div>
              <div className={styles.third}>
                <h2 className={styles.point}>DevOps</h2>
                <h4 className={styles.description}>Skabe og bibeholde CI/CD pipelines</h4>
                <p className={styles.description2}>
                    Jeg er erfaren i at bruge Jenkins, GitHub Actions og Argo til
                    at automatisere og optimere udviklingsprocesser.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.education}>
            <h2 className={styles.basicHeadline}>Udannelse</h2>
            <br />
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineContent}>
                  <h2 className={styles.timelineHeader}>Borupgaard Gymnasium</h2>
                  <p className={styles.timelineTimePeriod}>2016-2018</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineContent}>
                  <h2 className={styles.timelineHeader}>Datamatiker</h2>
                  <p className={styles.timelineTimePeriod}>2019-2022</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineContent}>
                  <h2 className={styles.timelineHeader}>PBA in Software udvikling</h2>
                  <p className={styles.timelineTimePeriod}>2022-2023</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.center}>
            <div className={styles.contactMe}>
              <h2 className={styles.timelineHeader}>Kontakt mig</h2>
              <br />
              <h4 className={styles.description}>
                I kan kontakte mig på følgende måder:
              </h4>
              <br />
              <h4 className={styles.description}>Email: mattibenhansen@gmail.com ✉️</h4>
              <h4 className={styles.description}>
                LinkedIn:{" "}
                <Link
                  href={"https://www.linkedin.com/in/matti-hansen-74a454109/"}
                >
                  
                </Link>
                Min LinkedIn 💻
              </h4>
            </div>
          </div>
          
          </div>

        </main>

        
      </div>

      <div className={styles.edgeSpace}></div>

      <div className={styles.projectsDiv}>
      <h2 className={styles.headlineWhite}>Projekter</h2>
      <ProjectCarousel projects={projects}></ProjectCarousel>
      </div>
      <div className={styles.edgeSpace}></div>

      <footer>
        <h5>Lavet af Matti Hansen</h5>
      </footer>
    </div>
  );
}
