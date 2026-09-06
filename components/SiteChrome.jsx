import Head from "next/head";
import Link from "next/link";
import styles from "../styles/theme.module.css";
import { SunIcon, MoonIcon, FlagDK, FlagGB } from "./Icons";
import { OG_IMAGE, SITE_URL } from "../lib/site";
import { runRandomEffect, clearRandomColors } from "../lib/effects";

// Chrome shared by every page: the <head> tags, the toolbar, and the footer.
// Extracted when the personal section moved to its own route — without this the
// two page types would drift apart the same way the two language pages used to.

export function SiteHead({ meta, path = "" }) {
  // Root is the bare origin, not origin + "/", so the canonical URL of the
  // front page has no stray trailing slash.
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={meta.ogTitle} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.ogTitle} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

// `switchHref` is a prop rather than read straight off `content` because the
// language switch has to stay on the same kind of page — from /personal it goes
// to /danish_personal, not back to the Danish front page.
export function Toolbar({ content, switchHref, toggleTheme }) {
  // Clearing first is what keeps the toggle working after "Random effect" has
  // painted inline colours over everything.
  function handleThemeToggle() {
    clearRandomColors();
    toggleTheme();
  }

  return (
    <div className={styles.toolbarHolder}>
      <div className={styles.toolbar}>
        {/* Both icons are always rendered; CSS shows one based on
            html[data-theme]. Doing it in CSS rather than React state keeps the
            server and client markup identical, which is what lets the pre-paint
            theme script work without a hydration mismatch. */}
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
          href={switchHref}
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
  );
}

export function SiteFooter({ content }) {
  return (
    <footer>
      <h5>
        {/* Easter egg: the random effect has no visible button any more, it is
            triggered by clicking the name here. A real <button> keeps it
            reachable by keyboard. */}
        <button
          type="button"
          className={styles.footerName}
          onClick={runRandomEffect}
        >
          {content.footer}
        </button>
      </h5>
    </footer>
  );
}
