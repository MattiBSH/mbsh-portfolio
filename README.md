# Matti Hansen — Portfolio

Personal portfolio site for Matti Hansen, a software developer working on IT
solutions for Danish municipalities and regions.

**Live at [mattihansen.com](https://mattihansen.com).**

Built with [Next.js](https://nextjs.org) (Pages Router) and CSS Modules. Every
page exists in English and Danish, with a light/dark theme that persists across
pages and reloads.

| | English | Danish |
| --- | --- | --- |
| Portfolio | `/` | `/danish_index` |
| Projects | `/projects` | `/danish_projects` |
| Personal | `/personal` | `/danish_personal` |

## Getting started

Requires Node 20.9 or newer (`.nvmrc` pins 20). The floor comes from the
dependencies rather than the app: `sharp` needs >= 20.9 and `@playwright/test`
needs >= 20.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run preview` | Build and serve in one step |
| `npm test` | Run the Playwright integration tests |
| `npm run test:ui` | Run the tests in Playwright's interactive UI |

Tests build the site and serve it on port 3100, so they do not collide with a
dev server running on 3000.

## Project layout

```
components/   Portfolio, ProjectsPage and PersonalPage, the chrome they
              share (SiteChrome), the carousel, the reel gallery and the icons
lib/          Page copy, site metadata, theme handling, the random effect
pages/        The six routes above, plus _app and _document
styles/       global.css and a single theme.module.css covering both themes
tests/        Playwright integration suite, run on desktop and mobile
```

## Notes

`SITE_URL` in `lib/site.js` must match the deployed domain. Open Graph images
have to be absolute URLs, or link previews render without an image, and the
canonical, hreflang and sitemap URLs are all built from the same constant.

Page copy lives in `lib/content.js`, not in the components. A layout change is
made once in the component; a wording change is made in `lib/content.js` for
both languages.

See `CLAUDE.md` for architecture details and gotchas.
