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
        <SiteHead
          meta={meta}
          path={content.homeHref}
          altPath={content.switchHref}
          lang={content.lang}
        />

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
                <p className={styles.description}>{content.intro}</p>
              </div>

              <div className={styles.third}>
                <div className={styles.tintedShadow}>
                  <Image
                    className={styles.profileImage}
                    src="/images/profile.png"
                    width={1127}
                    height={774}
                    sizes="(max-width: 900px) 80vw, 30vw"
                    priority
                    // 65 rather than the default 75: this is a photograph
                    // displayed at ~294 CSS px, where the difference is not
                    // visible but the byte saving is significant. It is the
                    // LCP element, so its weight sets the LCP time.
                    quality={65}
                    alt="Picture of the author"
                  />
                </div>
              </div>

              <div className={styles.third}>
                <p className={styles.info}>{content.info}</p>
              </div>

              <div className={styles.threePointBreakBox}>
                {content.skills.map((skill) => (
                  <div className={styles.third} key={skill.title}>
                    <h2 className={styles.point}>{skill.title}</h2>
                    <p className={styles.description}>{skill.lead}</p>
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
                      <h3 className={styles.timelineHeader}>{item.title}</h3>
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
                <p className={styles.description}>{content.contactLead}</p>
                <br />
                <p className={styles.description}>
                  {content.emailLabel}: <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ✉️
                </p>
                <p className={styles.description}>
                  {content.linkedinLabel}:{" "}
                  <Link href={LINKEDIN_URL}>{content.linkedinText}</Link>
                </p>
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
