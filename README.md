# Matti Hansen — Portfolio

Personal portfolio site for Matti Hansen, a software developer working on IT
solutions for Danish municipalities and regions.

Built with [Next.js](https://nextjs.org) (Pages Router) and CSS Modules.
Available in English (`/`) and Danish (`/danish_index`), with a light/dark
theme that persists across pages and reloads.

## Getting started

Requires Node 18 or newer (see `.nvmrc`).

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

-
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
components/   Portfolio page component and the projects carousel
lib/          Page copy, site metadata, theme handling, the random effect
pages/        Routes: / (English), /danish_index (Danish), plus _app/_document
styles/       global.css and a single theme.module.css covering both themes
tests/        Playwright integration suite
```

## Notes

`SITE_URL` in `lib/site.js` must match the deployed domain — Open Graph images
have to be absolute URLs, or link previews will render without an image.

See `CLAUDE.md` for architecture details and gotchas.
