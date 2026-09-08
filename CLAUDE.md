@AGENTS.md

# Project context

## What this repo is

Two projects share one repo:

- **Repo root** — a Next.js 16 site (App Router, TypeScript, Tailwind v4). This
  is the active work.
- **`dashboard/`** — a pre-existing Streamlit "Transfer Center vs. Emergency
  Department" patient-placement dashboard (Python). Not under active
  development; it is portfolio evidence the site will link to. It has its own
  `dashboard/README.md`.

`dashboard/` is excluded from `eslint.config.mjs` and `tsconfig.json`. Its
`.venv` contains Streamlit's bundled frontend JS, which ESLint will otherwise
parse until it exhausts the V8 heap. Leave those exclusions in place.

## What the site is for

A personal portfolio and credibility site for **Josh Homan** — a registered
nurse with twelve years of bedside experience moving into clinical analytics
and data science. Two jobs:

1. Give hiring managers for clinical analytics roles a place to see healthcare
   data work.
2. Serve as a credibility page linked from the X account **@TheHomanQuant**,
   where quantitative research is posted.

## Planned sections, in order

1. **Hero** — Josh, and the nursing + data science combination
2. **Healthcare analytics** — leads with a transfer center decline prediction
   project
3. **Quantitative research** — branded data visualizations
4. **Contact**

Build one section at a time. Josh reviews each before the next starts.

## Visual direction

Light, bright, lots of white space. Clean and technical, not decorative.
**Light mode only** — no dark mode, by decision.

One accent color: **forest green**. An earlier orange accent was rejected for
reading as an AI-generated default — do not reintroduce orange-family accents.

All color, type, and spacing comes from the tokens in `app/globals.css`, defined
in Tailwind v4's `@theme` block. Sections should use semantic token utilities
(`bg-canvas`, `text-ink-muted`, `border-line`, `text-accent-ink`) rather than
raw Tailwind palette classes like `bg-green-700`, so the palette stays
swappable from one file.

The accent has three roles because one value cannot serve all three:

| Token | Use |
|---|---|
| `accent` (`#2f6f4e`) | graphic marks, fills, chart series, underlines |
| `accent-ink` (`#1f5138`) | accent-colored text, deeper emphasis |
| `accent-soft` (`#eff5f1`) | tinted background wash behind callouts |

`.numeral` gives tabular monospace figures — use it for any number that should
line up in a column (stat readouts, chart labels, table cells).

## Conventions

- `lib/site.ts` is the single source of truth for site-wide strings and the
  canonical URL. Do not hardcode the name, description, or X handle elsewhere.
- `lib/site.ts` also exports a `brand` object of literal hexes. Open Graph
  images render through Satori, which has no Tailwind and no CSS variables, so
  those values must be literal. **Keep it in sync with `app/globals.css`.**
- `app/opengraph-image.tsx` and `app/icon.tsx` are Satori-rendered: flexbox
  only, no grid, inline styles only, and any element with more than one child
  needs an explicit `display: flex`.
- Set `NEXT_PUBLIC_SITE_URL` in production — see `.env.example`. Without it,
  Open Graph URLs fall back to localhost and social cards will not render.

## Status

- Done: scaffold, design tokens, metadata / OG / favicon / robots / sitemap.
- `app/page.tsx` is a **temporary token specimen page**. The hero section
  replaces it wholesale — do not build on it.
- Root `README.md` is still create-next-app boilerplate and should be replaced.

## Checks

```bash
npm run dev      # http://localhost:3000
npx tsc --noEmit
npm run lint
npm run build
```
