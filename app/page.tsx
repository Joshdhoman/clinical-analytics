import { siteConfig } from "@/lib/site";

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

const projects = [
  {
    title: "Transfer Center vs. Emergency Department",
    type: "Patient placement analytics",
    description:
      "A clinical operations dashboard comparing transfer-center admissions to emergency department admissions with a sharper lens on acuity and length of stay by level of care.",
    href: siteConfig.dashboardUrl,
    tags: ["Streamlit", "Healthcare", "Operational analytics"],
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-content px-6 py-20 sm:py-28">
      <section>
        <p className="numeral text-xs uppercase tracking-[0.22em] text-ink-subtle">
          {siteConfig.role}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Registered nurse with twelve years at the bedside, now working on the
          data side of the same operational problems. I build healthcare
          analytics, decision-support dashboards, and visual explanations that
          turn messy clinical complexity into clearer stories.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            View resume
          </a>
        </div>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">
            Selected work
          </h2>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
          >
            GitHub
          </a>
        </div>

        <div className="mt-8 space-y-8">
          {projects.map((project) => (
            <article
              key={project.title}
              className="border-t border-line pt-6 first:border-t-0 first:pt-0"
            >
              <p className="numeral text-xs uppercase tracking-[0.2em] text-ink-subtle">
                {project.type}
              </p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-ink">
                {project.title}
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-ink-subtle"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-6">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
                >
                  View project
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">
          Project focus
        </h2>

        <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {transferCenterFocus.map(({ label, detail }) => (
            <div key={label} className="border-t border-line pt-3">
              <dt className="text-xs uppercase tracking-[0.18em] text-ink-subtle">
                {label}
              </dt>
              <dd className="mt-1 text-sm text-ink-muted">{detail}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 max-w-2xl rounded-sm bg-accent-soft px-4 py-3 text-sm text-ink-muted">
          Built on synthetic, Epic-shaped data. No real patient records are used,
          and this app is a demonstration piece rather than a clinical tool.
        </p>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">
          Elsewhere
        </h2>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          <li>
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
            >
              Resume
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
