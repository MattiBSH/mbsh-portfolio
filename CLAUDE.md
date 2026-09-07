# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A single-page personal portfolio site for **Matti Hansen** (software developer,
building IT solutions for Danish municipalities and regions). It is a Next.js 14
app scaffolded from the `Learn Next.js` starter template — the starter's blog
functionality was removed and replaced with portfolio content.

The site is bilingual (English + Danish), has a light/dark theme toggle that
persists across pages and reloads, a "random effect" gag button that recolours
text, a carousel of past projects, and a personal section with a gallery of
nature reels from Matti's YouTube channel.

## Commands

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npm run preview # build and serve in one step
npm test        # Playwright integration tests (builds and serves on :3100)
npm run test:ui # same, in Playwright's interactive UI
npm run lint    # next lint (eslint-config-next)
```

CI runs lint then the full Playwright suite on every push and PR
(`.github/workflows/ci.yml`).

Node >= 18 (`.nvmrc` pins `18`).

## Stack

- **Next.js 14.2.5** (`next: "latest"` in package.json — the resolved version can
  drift), React 18.2, **Pages Router** (no `app/` directory, no TypeScript)
- **react-slick** + **slick-carousel** — the projects carousel
- **sharp** — production image optimisation for `next/image`
- CSS Modules; no Tailwind, no CSS-in-JS
- **@playwright/test** (dev only) — integration tests in `tests/`

## Layout

```
components/
  Portfolio.jsx      The portfolio page, rendered for whichever language it is given
  PersonalPage.jsx   The /personal route: nature reels, kept off the front page
  SiteChrome.jsx     SiteHead / Toolbar / SiteFooter, shared by both page types
  ProjectCarousel.jsx  react-slick wrapper for the projects section
  ReelGallery.jsx    Shorts grid plus the focused lightbox viewer
  Icons.jsx          Inline SVG sun, moon, and the two flags
lib/
  content.js         All page copy, as CONTENT.en / CONTENT.da, plus the
                     EMAIL / LINKEDIN_URL / YOUTUBE_URL constants
  site.js            SITE_URL, OG image, per-language <head> metadata
  theme.js           data-theme handling, the pre-paint script, lang mapping
  effects.js         The "Random effect" button: run it, and clear what it painted
pages/
  _app.js            Passes toggleTheme down, keeps <html lang> in sync
  _document.js       Inlines the pre-paint theme script into <head>
  index.js           English "/" — a thin wrapper over Portfolio
  danish_index.jsx   Danish "/danish_index" — same wrapper, Danish content
  personal.jsx       English "/personal" — wrapper over PersonalPage
  danish_personal.jsx  Danish "/danish_personal"
tests/
  site.spec.js       Playwright integration suite, run on desktop + mobile
styles/
  global.css         Imports slick CSS, sets base typography and dark page bg
  theme.module.css   Both themes in one file (see Theming below)
public/images/       profile.png, image.png
```

## How the page works

**Theming.** One stylesheet, `styles/theme.module.css`. The light values are the
base rules; the ~12 declarations that differ in dark mode live in a block keyed
on `:global(html[data-theme="dark"])` near the end of the file. Class names never
change with the theme, which is exactly what lets the pre-paint script in
`pages/_document.js` set `data-theme` before first paint without a hydration
mismatch.

Watch specificity when adding a dark override: `:global(html[data-theme="dark"])
.foo` is (0,2,1), which beats a descendant rule like `.bar h2` at (0,1,1). That
is how the education timeline once ended up with white text on a white card —
the dark block recoloured `.timelineHeader` but nothing darkened
`.timelineContent`. If a dark rule targets text, check what paints the
background behind it.

`darkMode` and `toggleTheme` are owned by `_app.js` and passed down as props, so
the theme survives navigation between the two language pages. It is persisted to
`localStorage` under the key `darkMode`, read back in a `useEffect` (not in the
`useState` initializer, which would break SSR). Pages are prerendered in light
mode, so a visitor who chose dark sees a brief light flash on first paint —
removing that needs a blocking inline script in `_document`.

So **any class added to one theme must be added to the other**, or that element
silently loses all styling in the other mode. The two files are ~90% identical;
they differ mainly in `background-color` and text `color`.

**Language switching** is two routes over one component. `pages/index.js` and
`pages/danish_index.jsx` are both four-line wrappers that render
`components/Portfolio.jsx` with `CONTENT.en` or `CONTENT.da` from
`lib/content.js`. **Layout changes are made once, in `Portfolio.jsx`; copy
changes are made in `lib/content.js`.** These used to be two full hand-maintained
copies of the same JSX, so if you find yourself editing near-identical markup
twice, something has regressed.

`<html lang>` is set to `en` or `da` by the pre-paint script on first load and
kept in sync on client-side navigation by an effect in `_app.js` — `<html>` sits
outside the React tree, so it is never re-rendered on its own.

**Responsive rules** live at the bottom of both stylesheets, in matching
`@media (max-width: 900px)` and `(max-width: 480px)` blocks. Font sizes use
`clamp(min, vw, max)` so text has a floor on phones and a ceiling on large
monitors — do not reintroduce a bare `vw` font size. At 900px the three-column
flex rows stack and the timeline collapses from its alternating left/right
layout to a single column with the line down the left edge. The carousel drops
to 2 slides at 1024px and 1 slide at 640px via react-slick's `responsive` array.

**Projects** come from the single `PROJECTS` array in `lib/content.js`. It is
language-neutral: `id`, `company`, `from`/`to` and `tech` sit at the top level and
so cannot differ between the two pages, while `en` and `da` nest only the prose.
This replaced two parallel arrays paired by array position alone, where adding a
project to one language and not the other went unnoticed — a parity test now
guards it. `COMPANIES` in the same file maps `company` to a display name and the
`current` flag that badges today's employer differently.

There is still no CMS, no data fetching, no API routes, and no
`getStaticProps`/`getServerSideProps` anywhere — the site is fully static.

## Testing

`npm test` runs `tests/site.spec.js` against a real Chromium in two projects,
`desktop` and `mobile` (Pixel 5), so the responsive rules are actually exercised
rather than assumed. The suite covers both pages rendering, the Open Graph tags,
the theme toggle surviving navigation and reload, the no-flash script applying
the theme before first paint, the Random-effect/theme interaction, the LinkedIn
link, mobile font sizes, horizontal overflow, and the carousel's slide count.

**The config deliberately uses port 3100 with `reuseExistingServer: false`.** Do
not "simplify" this back to :3000 with reuse. A `next start` process caches the
build manifest at boot, so a server left running from an earlier build serves
asset URLs that 404 after any rebuild. Playwright will happily reuse that server
and every test needing CSS or hydration fails in a way that looks like an
application bug — this cost real debugging time once already.

Two locator traps worth remembering: `getByRole("heading", { name: /Matti
Hansen/ })` also matches the footer's "Made by Matti Hansen", and counting
`.slick-active` is unreliable because react-slick clones slides when `infinite`
is on — measure slide width against `.slick-list` instead.

## Accessibility and semantics

Heading levels follow the document, not the font size: `h1` for the page title,
`h2` for section headings, `h3` for timeline entries and project cards. Body copy
is `<p>`, never a heading — several paragraphs used to be `<h4>` purely for its
size, which is why `.description` and `.info` are applied to paragraphs now.
`.timelineContent h3` is tied to that choice; changing the tag means changing the
selector.

Every interactive control has a `:focus-visible` ring, including slick's arrows
and dots, which ship with `outline: none`. `prefers-reduced-motion` disables the
hover transforms and reduces the random effect to a single recolour rather than
ten repaints in two seconds.

Contrast is asserted in the test suite rather than eyeballed — see the
"regressions from the audit" block, which computes the real ratio from computed
styles in both themes.

**Touch targets must stay at or above 24x24** (WCAG 2.5.8, and what Lighthouse
reports as "Touch targets do not have sufficient size or spacing"). slick-theme
ships 20x20 arrows and 20x20 dots, so `.projectsDiv` overrides both — the dots
get a 32px hit area with the visual dot kept small by the glyph `font-size`,
independent of how big it is to hit. A test measures every `a`/`button` on all
four routes; dropping those overrides fails it.

Body copy uses `line-height: 1.6` (WCAG 1.4.12). Inline links inside a sentence
carry `padding: 3px 2px` — vertical padding on an inline element grows the hit
area without changing the line box, so the email and LinkedIn links clear 24px
without the paragraph reflowing.

## Performance

The front page's LCP element is the profile photo, so its weight sets the LCP
time — nothing else on the page comes close. Two things keep it down:

- `next.config.js` enables **AVIF** ahead of WebP. Next only negotiates WebP by
  default; AVIF is about 37% smaller here (79 kB vs 127 kB at w=1080).
- The image is served at `quality={65}` rather than the default 75. At its
  rendered size (~294 CSS px on a phone) the difference is not visible.

Measured on a throttled Slow 4G + 4x CPU profile: LCP went 1728ms -> 1416ms.

**Critical CSS is inlined** via `experimental.optimizeCss` (which needs the
`critters` dev dependency). The two stylesheets ship as
`media="print" onload="this.media='all'"` so they no longer block the first
paint. Under real CPU+network throttling this took FCP from 1.6s to 0.9s and the
Lighthouse performance score from 99 to 100.

If you change the markup substantially, re-check this: critters decides what is
"critical" by scanning the rendered HTML, so a rule it fails to spot would show
as a flash of unstyled content on a slow connection. `npm test` covers it
indirectly (contrast, touch targets and layout all read computed styles), and
the quick manual check is to throttle to Slow 4G and compare a screenshot at
~250ms against one after full load.

**No web fonts are downloaded.** The site uses the system font stack, and
slick-carousel's bundled icon font — which it uses only for the `←`, `→` and `•`
glyphs — is bypassed by pointing those pseudo-elements at the inherited family.
An unused `@font-face` is never fetched, which is strictly better than setting
`font-display` (that still downloads the file). The arrows and dots are drawn in
CSS instead: 44px circles and 10px round dots. A test asserts zero font requests
across all four routes, so reintroducing one is caught immediately.

**Read Lighthouse's score, not its Insights list.** The Insights entries
("Improve image delivery", "Legacy JavaScript", "Render-blocking requests") all
carry weight 0 and cost nothing. The score comes only from FCP, LCP, TBT, CLS
and Speed Index.

**Lighthouse's default throttling is simulated and pessimistic here.** It
attributes ~79% of LCP to "render delay" that real throttling does not show —
with `--throttling-method=devtools` the gap between FCP and LCP is 0.1s. When a
number looks wrong, re-run with real throttling before optimising against it.

## Known issues

- The Open Graph image is `profile.png`, which is 1127x774 (roughly 3:2).
  Scrapers prefer 1200x630; the current image will be letterboxed or cropped in
  some previews. Not broken, just not ideal.
- `next` is pinned to `"latest"` in package.json, so the resolved version drifts
  between installs. Worth pinning to the version you have tested against.

## Deployment

The site is deployed on Vercel at **https://mbsh-portfolio.vercel.app**.

`SITE_URL` in `lib/site.js` must match that domain: Open Graph images have to be
absolute URLs, and a mismatch means link previews render with no image. The test
suite asserts the exact value, so changing the domain means changing it in both
`lib/site.js` and `tests/site.spec.js`.

## Project content and confidentiality

Several entries summarise work tracked in Dafolo's internal Jira. Descriptions
are written fresh, never pasted from ticket summaries, and the rule is:

- **Never on the page**: ticket keys, Jira URLs, internal release numbers, or the
  name of any municipality that piloted a feature. The export this came from
  named at least two as pilot customers.
- **Fine**: SBSYS, SBSIP, Datafordeleren, DAWA, Dataforsyningen, CVR, BFE,
  matrikel/ejerlav — publicly documented Danish public-sector systems, and what
  makes the work legible to a Danish employer.

Before deploying a change to project copy, grep the built output:
`grep -riE "<pilot municipality names>|SBSIP-[0-9]|atlassian\.net" .next/server/pages/*.html`
must return nothing. **Substitute the actual names from the Jira export when running
it — do not write them into this file.** This repository is public, and naming the
pilot municipalities a few lines below a note that two of them piloted the work
leaks exactly what the rule above exists to protect.

None of the projects are publicly reachable — they are internal municipal
systems, and the Fortis app has since been pulled from the App Store. Do not add
"view project" links; there is nothing to point at.

## Project cards and react-slick

Two things about this carousel are load-bearing and easy to break:

**react-slick does not merge props onto `.slick-slide`.** It wraps the element you
return from the map in two further divs, so `data-project-id` lands on a
grandchild. Test selectors must use a descendant combinator
(`.slick-slide:not(.slick-cloned) [data-project-id]`), and `getByRole` does not
work for carousel content at all — inactive slides are `aria-hidden`, which
Playwright's role engine skips.

**Equal card heights come from a chain, not one rule.** `.slick-track` is a flex
row, `.slick-slide` is `height:auto; display:flex`, react-slick's own wrapper div
gets `display:flex`, and the card takes `height:100%`. That last step is
`height:100%` rather than `flex:1` because react-slick writes an inline
`display:inline-block` on the div above the card, which no stylesheet rule can
override — the div is already stretched, so the card just inherits its height.
Do not use `adaptiveHeight`.

`slidesToScroll` must equal `slidesToShow` at every breakpoint, repeated inside
each `responsive` entry. react-slick renders `ceil(slideCount / slidesToScroll)`
dots, so leaving it at 1 gives one dot per project.

## The personal page

The nature-video content lives on its own route — `/personal` and
`/danish_personal` — rather than on the front page, so it does not interrupt the
professional narrative. The only way in is a quiet link under the Projects
carousel (`content.personal.teaser`); there is deliberately no toolbar entry.

Copy is under `personal` in each language in `lib/content.js`; the videos are in
the language-neutral `REELS` export, with only `reelsHeading` translated. The
page has its own `META_PERSONAL` in `lib/site.js` — sharing the portfolio's
metadata would give both routes an identical link preview.

**Four routes now exist, and two of them are Danish.** `langForPath` in
`lib/theme.js` matches against `DANISH_PATHS`, and the pre-paint script in the
same file has to agree with it — they are separate implementations of one rule,
so change both together. The language switch uses `switchPersonalHref` on the
personal page so it stays on the same kind of page rather than dropping the
visitor back on the Danish front page.

`SiteChrome.jsx` holds the `<head>` tags, toolbar and footer. Both page types
use it — without that, the two would drift apart exactly the way the two
language pages used to.

**Reels are click-to-play, and must stay that way.** A YouTube iframe pulls
roughly a megabyte before anyone presses play, so four of them would dwarf the
rest of the page. The grid renders lazy-loaded thumbnails from `i.ytimg.com`;
exactly one real player exists at a time, created inside the lightbox via
`youtube-nocookie.com`. Do not replace this with plain iframes.

Clicking a thumbnail opens a focused viewer, rendered with `createPortal` into
`document.body` — deliberately, so no ancestor's `transform`, `filter` or
`overflow` can trap its `position: fixed`. It closes on Escape, the close
button, and backdrop clicks (the player itself stops propagation); arrow keys
step between clips and wrap. It locks `document.body.style.overflow` while open
and restores the previous value — the tests assert the restore, because leaving
the page unscrollable is the obvious way to break this. Focus moves to the close
button on open and returns to the originating thumbnail on close.

Copy is deliberately general about what the videos contain — the channel sits
behind a consent redirect that cannot be read programmatically, so nothing about
upload frequency or subscriber counts should be written into the page unless
Matti supplies it.

One testing gotcha: the channel link's accessible name contains
"@TheRealDanishNature", and Playwright matches accessible names as
case-insensitive **substrings** by default. That made
`getByRole("link", { name: "danish" })` ambiguous, so language-switch locators
pass `exact: true`.

## The random effect easter egg

There is no "Random effect" button. It is triggered by clicking the name in the
footer ("Made by Matti Hansen" / "Lavet af Matti Hansen"), which is a real
`<button>` styled by `.footerName` to be visually identical to the surrounding
text — keeping it a button means keyboard users can reach it. A test asserts no
button named "Random effect" exists anywhere, so re-adding one to the toolbar
will fail the suite.

## Conventions

- 2-space indent, double quotes in JSX files, semicolons.
- Pages are default-exported function components named `Home` (both language
  pages use this same name — that is fine, they are separate modules).
- Files are a mix of `.js` and `.jsx` with no rule behind it; match whatever the
  file you are editing already uses rather than renaming.
- Images go through `next/image` with explicit `width`/`height`, sourced from
  `/images/`.
- The site is deployed on Vercel (`public/vercel.svg` is left over from the
  starter); there is no deploy script in the repo.
