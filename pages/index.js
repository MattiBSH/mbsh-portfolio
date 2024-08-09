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
  const [language, setLanguage] = useState("danish");
  const [languageURL, setLanguageURL] = useState("/danish_index");


  const projects = [
    {title: "AI GDPR Integration", description: "Made an integration of an AI model that the municipalities had paid for so they can now use it to analyze freedom of information pdfs."},
    {title: "Easy search", description: "Worked for a long period with easy search which is used to update properties and land parcels."},
    {title: "Property and land parcel update", description: "Made a newer version of the property and land parcel update that can now handle building on foreign land and condominiums."},
    {title: "Building and environmental monitoring", description: "Made a frontend to monitor the building and environmental project."},
    {title: "Fitness App", description: "Made a frontend for the Fortis app. Which can be found on the appstore."},
    {title: "American singer/rapper tiktok-like competition app", description: "Made an app in flutter when I worked at meew that did not come out, but it taught me a lot about designing mobile apps and how social media is made. Used Firebase and flutter"}
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
                I am
                <br />
                Matti Hansen
              </h1>
              <div class={styles.line}></div>
              <h4 className={styles.description}>
                As a software developer, I am dedicated to designing and
                implementing solutions that enhance operational efficiency in my clients
                organisations. My focus is on creating innovative tools and
                applications that streamline daily tasks,
                and deliver measurable benefits to both the employees and their
                organizations.
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
                Helping municipalities and regions with IT solutions
              </h3>
            </div>

            <div className={styles.threePointBreakBox}>
              <div className={styles.third}>
                <h2 className={styles.point}>Frontend</h2>
                <h4 className={styles.description}>Creating user interfaces that are easy to use and understand</h4>
                <p className={styles.description2}>I have experience using Angular, React, and Flutter for
                  building dynamic and responsive front-end applications.
                </p>
              </div>
              <div className={styles.third}>
                <h2 className={styles.point}>Backend</h2>
                <h4 className={styles.description}>Creating and maintaining databases and server-side code</h4>
                <p className={styles.description2}>
                  I have worked with Java and Python to develop robust and
                  scalable backend solutions. In Java I have maintained existing
                  systems and also created new ones from scratch. In python I
                  have integrated with AI models to handle help municipalities
                  handle GDPR sensitive data.
                </p>
              </div>
              <div className={styles.third}>
                <h2 className={styles.point}>DevOps</h2>
                <h4 className={styles.description}>Creating and maintaining CI/CD pipelines</h4>
                <p className={styles.description2}>
                  I am proficient in using Jenkins, GitHub Actions, and Argo to
                  automate and streamline development workflows.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.education}>
            <h2 className={styles.basicHeadline}>Education</h2>
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
                  <h2 className={styles.timelineHeader}>Computer science (AP)</h2>
                  <p className={styles.timelineTimePeriod}>2019-2022</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineContent}>
                  <h2 className={styles.timelineHeader}>PBA in Software development</h2>
                  <p className={styles.timelineTimePeriod}>2022-2023</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.center}>
            <div className={styles.contactMe}>
              <h2 className={styles.timelineHeader}>Contact me</h2>
              <br />
              <h4 className={styles.description}>
                Feel free to contact me if you have any questions
              </h4>
              <br />
              <h4 className={styles.description}>Email: mattibenhansen@gmail.com ✉️</h4>
              <h4 className={styles.description}>
                LinkedIn:{" "}
                <Link
                  href={"https://www.linkedin.com/in/matti-hansen-74a454109/"}
                >
                  
                </Link>
                My LinkedIn 💻
              </h4>
            </div>
          </div>
          
          </div>

        </main>

        
      </div>

      <div className={styles.edgeSpace}></div>

      <div className={styles.projectsDiv}>
      <h2 className={styles.headlineWhite}>Projects</h2>
      <ProjectCarousel projects={projects}></ProjectCarousel>
      </div>
      <div className={styles.edgeSpace}></div>

      <footer>
        <h5>Made by Matti Hansen</h5>
      </footer>
    </div>
  );
}
