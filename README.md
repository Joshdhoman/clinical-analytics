# clinical-analytics

Portfolio and credibility site for **Josh Homan** — a registered nurse with
twelve years of bedside experience working in clinical analytics and data
science.

Two projects share this repo.

## Repo root — the site

A [Next.js 16](https://nextjs.org) site (App Router, TypeScript, Tailwind v4).
This is the active work.

```bash
npm install
npm run dev      # http://localhost:3000
```

Checks:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

### Configuration

`lib/site.ts` is the single source of truth for site-wide strings and the
canonical URL — the name, description, contact address, and outbound links all
read from there.

Set `NEXT_PUBLIC_SITE_URL` to the production domain before deploying. Without
it, Open Graph URLs fall back to `localhost` and social cards will not render.
See `.env.example`.

### Design tokens

All color, type, and spacing come from the `@theme` block in `app/globals.css`.
Sections use semantic token utilities (`bg-canvas`, `text-ink-muted`,
`border-line`, `text-accent-ink`) rather than raw Tailwind palette classes, so
the palette stays swappable from one file. Light mode only, by decision.

## `dashboard/` — Streamlit dashboard

A "Transfer Center vs. Emergency Department" patient-placement dashboard
comparing transfer-center admissions to ED admissions by volume, acuity, and
length of stay. Built on synthetic, Epic-shaped data — no real patient records.

It is not under active development; it is portfolio evidence the site links to.
See `dashboard/README.md` for how to run it.

`dashboard/` is deliberately excluded from `eslint.config.mjs` and
`tsconfig.json`. Its `.venv` contains Streamlit's bundled frontend JS, which
ESLint will otherwise parse until it exhausts the V8 heap. Leave those
exclusions in place.
