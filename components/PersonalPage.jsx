import Link from "next/link";
import styles from "../styles/theme.module.css";
import ReelGallery from "./ReelGallery";
import { SiteHead, Toolbar, SiteFooter } from "./SiteChrome";
import { REELS, YOUTUBE_URL, YOUTUBE_HANDLE } from "../lib/content";

// The nature-video side of the site, on its own route so it does not interrupt
// the professional narrative on the front page. Reached from a quiet link at the
// end of the portfolio.
export default function PersonalPage({ content, meta, toggleTheme }) {
  const personal = content.personal;

  return (
    <div>
      <Toolbar
        content={content}
        switchHref={content.switchPersonalHref}
        toggleTheme={toggleTheme}
      />

      <div className={styles.container}>
        <SiteHead
          meta={meta}
          path={content.personalHref}
          altPath={content.switchPersonalHref}
          lang={content.lang}
          preconnect={["https://i.ytimg.com"]}
        />

        <main>
          <div className={styles.mainContent}>
            <div className={styles.spaceAtStart}></div>

            <div className={styles.personalPage}>
              <h1 className={styles.basicHeadline}>{personal.title}</h1>
              <div className={styles.line}></div>
              <p className={styles.description}>🌿 {personal.lead}</p>
              <p className={styles.description2}>{personal.body}</p>

              <a
                className={styles.channelLink}
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                ▶ {personal.linkText} ({YOUTUBE_HANDLE})
              </a>

              <ReelGallery
                reels={REELS}
                heading={personal.reelsHeading}
                labels={{
                  reel: personal.reelLabel,
                  play: personal.playLabel,
                  close: personal.closeLabel,
                  prev: personal.prevLabel,
                  next: personal.nextLabel,
                }}
              />

              <Link className={styles.backLink} href={content.homeHref}>
                ← {personal.backLabel}
              </Link>
            </div>
          </div>
        </main>
      </div>

      <div className={styles.edgeSpace}></div>

      <SiteFooter content={content} />
    </div>
  );
}
