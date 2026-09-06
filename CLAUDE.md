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
```

Node >= 18 (`.nvmrc` pins `18`). There is no linter and no CI; `npm test` is the
verification story.

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
  Portfolio.jsx      The entire page, rendered for whichever language it is given
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
  index.js           English route "/" — a thin wrapper over Portfolio
  danish_index.jsx   Danish route "/danish_index" — same wrapper, Danish content
tests/
  site.spec.js       Playwright integration suite, run on desktop + mobile
styles/
  global.css         Imports slick CSS, sets base typography and dark page bg
  theme.module.css   Both themes in one file (see Theming below)
public/images/       profile.png, image.png
```

## How the page works

**Theming.** Both stylesheets export an identical set of ~32 class names
(`container`, `headline`, `third`, `timeline`, `toolbar`, …). The page picks one
whole module at runtime:

```js
const styles = darkMode ? darkStyles : lightStyles;
```

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

**Projects** are a hardcoded array literal inside each page component, passed to
`<ProjectCarousel projects={projects} />`. There is no CMS, no data fetching, no
API routes, and no `getStaticProps`/`getServerSideProps` anywhere — the site is
fully static content in JSX.

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

## Personal section

Between Education and Contact there is an "Outside work" box linking to the
YouTube channel `@TheRealDanishNature`, where Matti posts nature videos filmed
in Denmark, plus a grid of four Shorts.

Copy lives under `personal` in each language in `lib/content.js`. The videos
themselves are in the language-neutral `REELS` export in the same file — the
clips are identical in both languages, only `reelsHeading` is translated. Add
or remove videos by editing that array; the gallery renders nothing when it is
empty.

**Reels are click-to-play, and must stay that way.** A YouTube iframe pulls
roughly a megabyte before anyone presses play, so four of them would dwarf the
rest of the page. The grid renders lazy-loaded thumbnails from `i.ytimg.com`;
exactly one real player exists at a time, created inside the lightbox via
`youtube-nocookie.com`. Do not replace this with plain iframes.

Clicking a thumbnail opens a focused viewer. It is rendered with
`createPortal` into `document.body` — deliberately, so that no ancestor's
`transform`, `filter` or `overflow` can trap its `position: fixed`. The
`.reelPoster:hover` transform sits close enough in the tree to make that a real
risk if it were rendered inline.

The viewer closes on Escape, the close button, and backdrop clicks (the player
itself stops propagation so clicking the video does not dismiss it); arrow keys
step between clips and wrap around. It locks `document.body.style.overflow`
while open and restores the previous value on close — the tests assert the
restore, because leaving the page unscrollable is the obvious way to break this.
Focus moves to the close button on open and returns to the originating
thumbnail on close. True fullscreen is YouTube's own control inside the player,
which is why the iframe keeps `allowFullScreen`.

**Reel cards must stay 9:16, and that is not a style choice.** YouTube serves
Shorts thumbnails (`hqdefault.jpg`) as a 4:3 image with the vertical clip
letterboxed in the centre and blurred stretched filler down each side. The
centre 9:16 strip is exactly the clean content, so any shorter card ratio
exposes those blurred bars. `oardefault.jpg` is natively vertical but returns
404 for some videos, so it cannot be relied on. **To resize the cards, change the column
count on `.reelGrid` or the width of `.personal` — never the `aspect-ratio` on
`.reelPoster`.** They currently run four-up on one row at 195x346, dropping to
two-up at 125x222 below 900px. `.personal` is deliberately 100% wide, unlike
`.contactMe` at 50%, because four cards do not fit on a half-width row.

The copy is deliberately general about what the videos contain — the channel
sits behind a consent redirect that cannot be read programmatically, so nothing
about upload frequency or subscriber counts should be written into the page
unless Matti supplies it.

Two testing gotchas this area introduced:

- The channel link's accessible name contains "@TheRealDanishNature", and
  Playwright matches accessible names as case-insensitive **substrings** by
  default. That made `getByRole("link", { name: "danish" })` — the language
  switch — ambiguous, so those locators pass `exact: true`.
- Reel thumbnails are `loading="lazy"` and sit below the fold, so a test must
  `scrollIntoViewIfNeeded()` and poll before asserting `naturalWidth`.

## Toolbar icons

There is no navigation bar. The two controls — theme and language — are matched
46px circles sitting at the top right of the page, directly on the background
above the content panel (40px below 480px wide). `.toolbar` is only a flex row
for positioning; it has no background, border or width of its own, and giving it
any would put the old pill bar back. No text labels, so both carry `aria-label`s
from `themeAria` / `switchAria` in `lib/content.js`.

**The sun/moon swap is done in CSS, not React.** Both icons are always in the
markup and `html[data-theme="dark"]` decides which one displays. This is
deliberate: the component has no idea what the current theme is, because the
theme lives on the DOM rather than in React state, and keeping the markup
identical on server and client is exactly what lets the pre-paint script work
without a hydration mismatch. Do not "fix" this by lifting the theme into state.

The flag shown is the flag of the language you would switch **to** — Dannebrog
on the English page, Union Jack on the Danish one, chosen by `switchFlag`.

Icons are inline SVG in `Icons.jsx` rather than emoji, because flag emoji
(🇩🇰 🇬🇧) do not render as flags on Windows — it shows "DK" / "GB" letters
instead. The Union Jack's `clipPath` is what counterchanges the red diagonals
so they fall on the correct side of each white one; removing it produces a flag
that looks subtly wrong. Flags fill their circle via
`preserveAspectRatio="xMidYMid slice"`, which crops the sides instead of
letterboxing.

## The random effect easter egg

There is no "Random effect" button. It is triggered by clicking the name in the
footer ("Made by Matti Hansen" / "Lavet af Matti Hansen"), which is a real
`<button>` styled by `.footerName` to be visually identical to the surrounding
text — keeping it a button means keyboard users can reach it. A test asserts no
button named "Random effect" exists anywhere, so re-adding one to the toolbar
will fail the suite.

## Project content

None of the six listed projects are publicly reachable — they are internal
municipal systems, and the Fortis app has since been pulled from the App Store.
Do not add "view project" links or try to source screenshots; there is nothing
to point at. The descriptions are the deliverable.

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
