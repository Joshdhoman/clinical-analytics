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

A personal portfolio site for **Josh Homan** — a registered nurse with twelve
years of bedside experience moving into clinical analytics and data science.

It has one job: give hiring managers for clinical analytics roles a place to
see healthcare data work. It is linked from Josh's resume, so every claim on
it has to survive a hiring manager clicking through to the source.

Social media is deliberately not part of this site. An earlier plan linked it
to an X account; that was dropped as off-register for the hiring audience. Do
not reintroduce social links.

## Planned sections, in order

1. **Hero** — Josh, and the nursing + data science combination
2. **Healthcare analytics** — leads with a transfer center decline prediction
   project
3. **Quantitative research** — branded data visualizations. Undecided; this
   section was originally scoped around the X audience and may be cut.
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

- Done: scaffold, design tokens, metadata / OG / favicon / robots / sitemap,
  README, hero, selected work, project focus, contact.
- The **decline prediction project** that section 2 is supposed to lead with
  does not exist yet. `dashboard/` is descriptive only — pandas, numpy, plotly,
  no model. Until that project is built, nothing on the site may be tagged or
  described as AI, ML, or predictive.

## Checks

```bash
npm run dev      # http://localhost:3000
npx tsc --noEmit
npm run lint
npm run build
```
