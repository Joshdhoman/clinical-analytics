import { siteConfig } from "@/lib/site";

/**
 * Homepage.
 *
 * Three sections on one shared measure (max-w-content) so every left edge
 * lines up down the page: who this is, what has been built, how to reach him.
 * Sections are separated by hairline rules rather than cards or shadows,
 * per the design system in app/globals.css.
 */

/**
 * What the Transfer Center dashboard actually examines. These are the
 * questions the app answers, not results — the underlying extract is
 * synthetic and regenerated per run, so quoting fixed figures here would be
 * inventing findings.
 */
const transferCenterFocus = [
  {
    label: "Volume",
    detail: "Monthly encounter trend, split by admission source.",
  },
  {
    label: "Acuity",
    detail: "Level-of-care and service-line mix for transfers vs. ED admits.",
  },
  {
    label: "Length of stay",
    detail: "Median and distribution, stratified by level of care.",
  },
  {
    label: "Mapping",
    detail: "Every field traced to its Epic Clarity / Caboodle source.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-content px-6 py-20 sm:py-28">
      {/* --- Hero ------------------------------------------------------- */}
      <section>
        <p className="numeral text-xs uppercase tracking-widest text-ink-subtle">
          {siteConfig.role}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Registered nurse with twelve years at the bedside, now working the
          data side of the same problems. I build analytics on the operational
          questions I used to live with on shift — patient placement, acuity,
          and throughput.
        </p>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      {/* --- Selected work ---------------------------------------------- */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-widest text-ink-subtle">
          Selected work
        </h2>

        <article className="mt-8">
          <h3 className="text-2xl font-medium tracking-tight text-ink">
            Transfer Center vs. Emergency Department
          </h3>
          <p className="numeral mt-2 text-xs uppercase tracking-wider text-ink-subtle">
            Patient placement analytics · Streamlit · Epic-oriented
          </p>

          <p className="mt-5 max-w-2xl leading-relaxed text-ink-muted">
            Inpatient encounters arriving through the Transfer Center run
            higher acuity than ED admits, so comparing length of stay directly
            just measures case mix. This dashboard{" "}
            <span className="text-ink">stratifies LOS by level of care</span>{" "}
            instead, which asks the sharper operational question: do transfers
            stay longer <em>at the same level of care</em>, or does the raw gap
            simply reflect more ICU admissions?
          </p>

          <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {transferCenterFocus.map(({ label, detail }) => (
              <div key={label} className="border-t border-line pt-3">
                <dt className="text-xs uppercase tracking-wider text-ink-subtle">
                  {label}
                </dt>
                <dd className="mt-1 text-sm text-ink-muted">{detail}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8">
            <a
              href={siteConfig.dashboardUrl}
              className="font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
            >
              Source and documentation
            </a>
          </p>

          {/* Stated plainly and up front: this is a demonstration build on
              generated data, and nothing here touches real patient records. */}
          <p className="mt-6 max-w-2xl rounded-sm bg-accent-soft px-4 py-3 text-sm text-ink-muted">
            Built on synthetic, Epic-shaped data. No real patient records are
            used, and the app is a demonstration piece — not for clinical use.
          </p>
        </article>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      {/* --- Contact ---------------------------------------------------- */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-widest text-ink-subtle">
          Elsewhere
        </h2>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          <li>
            <a
              href={siteConfig.xUrl}
              className="font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
            >
              {siteConfig.xHandle}
            </a>
          </li>
          <li>
            <a
              href={siteConfig.githubUrl}
              className="font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
            >
              GitHub
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
