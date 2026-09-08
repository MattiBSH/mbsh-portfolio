import Link from "next/link";
import styles from "../styles/theme.module.css";
import ProjectCarousel from "./ProjectCarousel";
import { SiteHead, Toolbar, SiteFooter } from "./SiteChrome";
import { PROJECTS } from "../lib/content";

// Projects on their own route. It is the one section with enough substance to
// stand alone, and putting it here means it can be linked to directly rather
// than being something a reader has to scroll far enough to find.
//
// The carousel keeps its .projectsDiv wrapper: every rule that makes it work
// (equal card heights, the dot row, the arrow sizing) is scoped to that class.
export default function ProjectsPage({ content, meta, toggleTheme }) {
  return (
    // No light content panel here, so the page paints its own background and
    // the framing greys go transparent; see .flatPage.
    <div className={styles.flatPage}>
      <Toolbar
        content={content}
        switchHref={content.switchProjectsHref}
        toggleTheme={toggleTheme}
      />

      <SiteHead
        meta={meta}
        path={content.projectsHref}
        altPath={content.switchProjectsHref}
        lang={content.lang}
      />

      <main>
        <div className={styles.edgeSpace}></div>

        <div className={styles.projectsDiv}>
          <h1 className={styles.pageHeading}>{content.projectsTitle}</h1>
          <ProjectCarousel
            projects={PROJECTS}
            lang={content.lang}
            labels={content.projectLabels}
          />
        </div>

        <div className={styles.edgeSpace}></div>

        <div className={styles.personalTeaser}>
          <Link className={styles.channelLink} href={content.homeHref}>
            ← {content.backLabel}
          </Link>
        </div>

        <div className={styles.edgeSpace}></div>
      </main>

      <SiteFooter content={content} />
    </div>
  );
}
