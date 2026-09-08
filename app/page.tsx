// TEMPORARY — a specimen page for checking the design tokens render correctly.
// This gets replaced wholesale by the hero section in the next step.

const swatches = [
  { token: "bg-canvas", className: "bg-canvas border border-line", hex: "#ffffff" },
  { token: "bg-surface", className: "bg-surface", hex: "#f8f8f9" },
  { token: "bg-ink", className: "bg-ink", hex: "#18181b" },
  { token: "bg-ink-muted", className: "bg-ink-muted", hex: "#52525b" },
  { token: "bg-line", className: "bg-line", hex: "#e6e6e9" },
  { token: "bg-accent", className: "bg-accent", hex: "#2f6f4e" },
  { token: "bg-accent-ink", className: "bg-accent-ink", hex: "#1f5138" },
  { token: "bg-accent-soft", className: "bg-accent-soft border border-line", hex: "#eff5f1" },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-content px-6 py-20">
      <p className="numeral text-xs uppercase tracking-widest text-ink-subtle">
        Design tokens
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
        Specimen
      </h1>
      <p className="mt-3 max-w-xl text-ink-muted">
        Temporary page. Confirms the color, type, and numeral tokens compile
        before any real content is built on top of them.
      </p>

      <hr className="my-12 border-line" />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-widest text-ink-subtle">
          Color
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.token}>
              <div className={`h-16 w-full rounded-sm ${s.className}`} />
              <p className="mt-2 text-sm text-ink">{s.token}</p>
              <p className="numeral text-xs text-ink-subtle">{s.hex}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-12 border-line" />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-widest text-ink-subtle">
          Type
        </h2>
        <div className="mt-6 space-y-4">
          <p className="text-5xl font-semibold tracking-tight text-ink">
            Display — 5xl semibold
          </p>
          <p className="text-2xl font-medium tracking-tight text-ink">
            Section heading — 2xl medium
          </p>
          <p className="max-w-2xl text-base text-ink-muted">
            Body copy — base, ink-muted. Twelve years at the bedside, now
            working the data side of the same problems. This paragraph exists to
            check line length and color contrast at reading size.
          </p>
          <p className="text-sm text-ink-subtle">
            Caption — sm, ink-subtle. Source notes and figure labels.
          </p>
          <p>
            <a
              href="#"
              className="font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
            >
              An accent link
            </a>
          </p>
        </div>
      </section>

      <hr className="my-12 border-line" />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-widest text-ink-subtle">
          Numerals
        </h2>
        <dl className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            ["Encounters", "18,412"],
            ["Transfer share", "31.6%"],
            ["Median LOS", "4.20"],
            ["ICU at admit", "27.9%"],
          ].map(([label, value]) => (
            <div key={label} className="border-t border-line pt-3">
              <dt className="text-xs uppercase tracking-wider text-ink-subtle">
                {label}
              </dt>
              <dd className="numeral mt-1 text-2xl text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
