# Simply Enak — Frontend Site

Simply Enak's Malaysian food tour website, built with **Astro v6** and **Tailwind CSS v4**.

**Stack:** Astro v6 | Tailwind CSS v4 | TypeScript | MDX | Sharp

## Quick Reference

| Command           | Purpose                             |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start dev server at localhost:4321  |
| `npm run build`   | Production build to `./dist/`       |
| `npm run preview` | Preview production build locally    |
| `npm run check`   | Run astro check + ESLint + Prettier |
| `npm run fix`     | Auto-fix ESLint + Prettier issues   |

**Node.js requirement:** >= 22.12.0

## Content

Content is sourced from Payload CMS at `cms.system.simplyenak.com`. The build pulls JSON snapshots into `src/data/content/`.

```bash
npm run sync              # Sync content from Payload
npm run sync:dry          # Preview sync without writing
```

## Build

```bash
npm run build             # Static build → dist/
```

Deploys to Cloudflare Pages (`dist/` output).
