import Image from "next/image";
import Link from "next/link";
import styles from "../styles/theme.module.css";
import ProjectCarousel from "./ProjectCarousel";
import { SiteHead, Toolbar, SiteFooter } from "./SiteChrome";
import { EMAIL, LINKEDIN_URL, PROJECTS } from "../lib/content";
// The whole page, for either language. Copy comes from lib/content.js and the
// <head> metadata from lib/site.js, so the two page files under pages/ are just
// thin wrappers that pick a language.
export default function Portfolio({ content, meta, toggleTheme }) {
  return (
    <div>
      <Toolbar
        content={content}
        switchHref={content.switchHref}
        toggleTheme={toggleTheme}
      />

      <div className={styles.container}>
        <SiteHead meta={meta} path={content.homeHref} />

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
        {/* PROJECTS is language-neutral; only the prose inside each entry and
            the small labels come from the language block. */}
        <ProjectCarousel
          projects={PROJECTS}
          lang={content.lang}
          labels={content.projectLabels}
        />
      </div>

      <div className={styles.edgeSpace}></div>

      {/* The only route into the personal side of the site. Deliberately quiet
          and after the projects, so it does not interrupt the professional
          narrative above. */}
      <div className={styles.personalTeaser}>
        <Link className={styles.channelLink} href={content.personalHref}>
          🌿 {content.personal.teaser}
        </Link>
      </div>

      <div className={styles.edgeSpace}></div>

      <SiteFooter content={content} />
    </div>
  );
}
