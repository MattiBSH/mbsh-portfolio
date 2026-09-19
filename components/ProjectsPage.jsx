import Link from "next/link";
import styles from "../styles/theme.module.css";
import ProjectGrid from "./ProjectGrid";
import { SiteHead, Toolbar, SiteFooter } from "./SiteChrome";
import { PROJECTS, projectEntries } from "../lib/content";

// Projects on their own route. It is the one section with enough substance to
// stand alone, and putting it here means it can be linked to directly rather
// than being something a reader has to scroll far enough to find.
//
// The grid keeps the .projectsDiv wrapper: it sets the page's measure, and the
// card rules are scoped under it.
export default function ProjectsPage({ content, meta, toggleTheme }) {
  // Three projects lead; the rest still appear, in a quieter run below. The
  // split is driven by `featured` in lib/content.js, so changing which three
  // lead is a data edit rather than a layout one.
  const all = projectEntries();
  const featured = all.filter((p) => p.featured);
  const rest = all.filter((p) => !p.featured);

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
          {/* The teaser was written for the front page's call to action and
              said nothing here, so the destination opened with a bare word.
              The count comes from the data, so it cannot go stale. */}
          <p className={styles.projectsLede}>
            {content.projectsTeaser} ({PROJECTS.length})
          </p>
          {/* An h2 between the h1 and the card h3s. Without it this route
              skipped a heading level, which axe flags and which the rest of the
              site does not do. */}
          <h2 className={styles.projectsSectionHeading}>
            {content.projectsSectionTitle}
          </h2>
          <ProjectGrid
            projects={featured}
            lang={content.lang}
            labels={content.projectLabels}
          />

          <h2 className={styles.projectsSectionHeading}>
            {content.projectsMoreTitle}
          </h2>
          <ProjectGrid
            projects={rest}
            lang={content.lang}
            labels={content.projectLabels}
            variant="compact"
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
