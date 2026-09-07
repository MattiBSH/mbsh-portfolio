import Head from "next/head";
import Link from "next/link";
import styles from "../styles/theme.module.css";
import { SunIcon, MoonIcon, FlagDK, FlagGB } from "./Icons";
import { OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, SITE_URL } from "../lib/site";
import { runRandomEffect, clearRandomColors } from "../lib/effects";

// Chrome shared by every page: the <head> tags, the toolbar, and the footer.
// Extracted when the personal section moved to its own route — without this the
// two page types would drift apart the same way the two language pages used to.

// `path` is this page's route, `altPath` the same page in the other language.
// Both are needed: canonical stops the two languages competing as duplicates,
// and hreflang tells a search engine they are translations rather than rivals.
export function SiteHead({ meta, path = "", altPath, lang = "en", preconnect = [] }) {
  // Root is the bare origin, not origin + "/", so the canonical URL of the
  // front page has no stray trailing slash.
  const abs = (p) => (p === "/" ? SITE_URL : `${SITE_URL}${p}`);
  const url = abs(path);
  const otherLang = lang === "da" ? "en" : "da";
  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      {altPath && (
        <link rel="alternate" hrefLang={lang} href={url} key="alt-self" />
      )}
      {altPath && (
        <link
          rel="alternate"
          hrefLang={otherLang}
          href={abs(altPath)}
          key="alt-other"
        />
      )}
      {altPath && (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={lang === "en" ? url : abs(altPath)}
          key="alt-default"
        />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Matti Hansen" />
      <meta property="og:locale" content={lang === "da" ? "da_DK" : "en_GB"} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={meta.ogTitle} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta property="og:image:alt" content={meta.ogTitle} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.ogTitle} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {preconnect.map((href) => (
        <link rel="preconnect" href={href} key={href} crossOrigin="anonymous" />
      ))}
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
      <p>
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
      </p>
    </footer>
  );
}
