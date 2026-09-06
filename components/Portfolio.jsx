import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/theme.module.css";
import ProjectCarousel from "./ProjectCarousel";
import ReelGallery from "./ReelGallery";
import { SunIcon, MoonIcon, FlagDK, FlagGB } from "./Icons";
import {
  EMAIL,
  LINKEDIN_URL,
  YOUTUBE_URL,
  YOUTUBE_HANDLE,
  REELS,
} from "../lib/content";
import { OG_IMAGE, SITE_URL } from "../lib/site";
import { runRandomEffect, clearRandomColors } from "../lib/effects";

// The whole page, for either language. Copy comes from lib/content.js and the
// <head> metadata from lib/site.js, so the two page files under pages/ are just
// thin wrappers that pick a language.
export default function Portfolio({ content, meta, toggleTheme }) {
  // Clearing first is what keeps the toggle working after "Random effect" has
  // painted inline colours over everything.
  function handleThemeToggle() {
    clearRandomColors();
    toggleTheme();
  }

  return (
    <div>
      <div className={styles.toolbarHolder}>
        <div className={styles.toolbar}>
          {/* Both icons are always rendered; CSS shows one based on
              html[data-theme]. Doing it in CSS rather than React state keeps
              the server and client markup identical, which is what lets the
              pre-paint theme script work without a hydration mismatch. */}
          <button
            type="button"
            onClick={handleThemeToggle}
            className={styles.iconButton}
            aria-label={content.themeAria}
          >
            <SunIcon className={styles.iconSun} />
            <MoonIcon className={styles.iconMoon} />
          </button>

          <Link
            href={content.switchHref}
            className={styles.iconButton}
            aria-label={content.switchAria}
          >
            {content.switchFlag === "gb" ? (
              <FlagGB className={styles.flagIcon} />
            ) : (
              <FlagDK className={styles.flagIcon} />
            )}
          </Link>
        </div>
      </div>

      <div className={styles.container}>
        <Head>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={SITE_URL} />
          <meta property="og:title" content={meta.ogTitle} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:image" content={OG_IMAGE} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={meta.ogTitle} />
          <meta name="twitter:description" content={meta.description} />
          <meta name="twitter:image" content={OG_IMAGE} />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div className={styles.mainContent}>
            <div className={styles.spaceAtStart}></div>

            <div className={styles.threeBlocks}>
              <div className={styles.third}>
                <h1 className={styles.headline}>
                  {content.headlineLead}
                  <br />
                  {content.name}
                </h1>
                <div className={styles.line}></div>
                <h4 className={styles.description}>{content.intro}</h4>
              </div>

              <div className={styles.third}>
                <div className={styles.tintedShadow}>
                  <Image
                    className={styles.profileImage}
                    src="/images/profile.png"
                    width={1200}
                    height={1200}
                    priority
                    alt="Picture of the author"
                  />
                </div>
              </div>

              <div className={styles.third}>
                <h3 className={styles.info}>{content.info}</h3>
              </div>

              <div className={styles.threePointBreakBox}>
                {content.skills.map((skill) => (
                  <div className={styles.third} key={skill.title}>
                    <h2 className={styles.point}>{skill.title}</h2>
                    <h4 className={styles.description}>{skill.lead}</h4>
                    <p className={styles.description2}>{skill.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.education}>
              <h2 className={styles.basicHeadline}>{content.educationTitle}</h2>
              <br />
              <div className={styles.timeline}>
                {content.education.map((item) => (
                  <div className={styles.timelineItem} key={item.title}>
                    <div className={styles.timelineContent}>
                      <h2 className={styles.timelineHeader}>{item.title}</h2>
                      <p className={styles.timelineTimePeriod}>{item.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.center}>
              <div className={styles.personal}>
                <h2 className={styles.timelineHeader}>
                  {content.personal.title}
                </h2>
                <br />
                <h4 className={styles.description}>
                  🌿 {content.personal.lead}
                </h4>
                <br />
                <p className={styles.description2}>{content.personal.body}</p>
                <br />
                <a
                  className={styles.channelLink}
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ▶ {content.personal.linkText} ({YOUTUBE_HANDLE})
                </a>
                <ReelGallery
                  reels={REELS}
                  heading={content.personal.reelsHeading}
                />
              </div>
            </div>

            <div className={styles.center}>
              <div className={styles.contactMe}>
                <h2 className={styles.timelineHeader}>{content.contactTitle}</h2>
                <br />
                <h4 className={styles.description}>{content.contactLead}</h4>
                <br />
                <h4 className={styles.description}>
                  {content.emailLabel}: <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ✉️
                </h4>
                <h4 className={styles.description}>
                  {content.linkedinLabel}:{" "}
                  <Link href={LINKEDIN_URL}>{content.linkedinText}</Link>
                </h4>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className={styles.edgeSpace}></div>

      <div className={styles.projectsDiv}>
        <h2 className={styles.headlineWhite}>{content.projectsTitle}</h2>
        <ProjectCarousel projects={content.projects} />
      </div>

      <div className={styles.edgeSpace}></div>

      <footer>
        <h5>
          {/* Easter egg: the random effect has no visible button any more,
              it is triggered by clicking the name here. A real <button> keeps
              it reachable by keyboard. */}
          <button
            type="button"
            className={styles.footerName}
            onClick={runRandomEffect}
          >
            {content.footer}
          </button>
        </h5>
      </footer>
    </div>
  );
}
