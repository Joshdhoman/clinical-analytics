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

const clinicalAiFocus = [
  {
    label: "Workflow fit",
    detail:
      "Where an alert lands, who is expected to act on it, and what it interrupts.",
  },
  {
    label: "Evaluation",
    detail:
      "Calibration and base rates, not AUC alone — what a false positive costs the unit that receives it.",
  },
  {
    label: "Adoption",
    detail:
      "Alert fatigue is a model problem, not a staffing problem. Clinicians route around tools they do not trust.",
  },
  {
    label: "Safety and drift",
    detail:
      "Documented limits, monitored performance, and a clear answer to who owns the output.",
  },
];

type Project = {
  title: string;
  type: string;
  description: string;
  href: string;
  /** Set when the project is deployed somewhere a visitor can use it. */
  demoHref?: string;
  tags: string[];
};

const projects: Project[] = [
  {
    title: "Clinical AI Transfer Assistant",
    type: "Decision support · NLP and interpretable ML",
    description:
      "Turns an unstructured transfer referral into a reviewable summary and a provisional routing suggestion. Rule-based NLP extracts sixteen fields and shows the source text as evidence for each one, flags what is missing or contradictory, and an interpretable decision tree offers a second opinion. A coordinator confirms or overrides every suggestion, and the decision is written to an audit log.",
    href: siteConfig.transferAssistantUrl,
    demoHref: siteConfig.transferAssistantDemoUrl,
    tags: [
      "NLP",
      "Interpretable ML",
      "Streamlit",
      "Human-in-the-loop",
      "Synthetic data",
    ],
  },
  {
    title: "Transfer Center vs. Emergency Department",
    type: "Patient placement analytics",
    description:
      "A clinical operations dashboard comparing transfer-center admissions to emergency department admissions with a sharper lens on acuity and length of stay by level of care.",
    href: siteConfig.dashboardUrl,
    tags: ["Streamlit", "Healthcare", "Operational analytics", "Synthetic data"],
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

              <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                {project.demoHref ? (
                  <a
                    href={project.demoHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-sm bg-accent px-4 py-2 text-sm font-medium text-ink-inverse transition-opacity hover:opacity-90"
                  >
                    Open the live app
                  </a>
                ) : null}
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
                >
                  {project.demoHref ? "Source and methodology" : "View project"}
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">
          Inside the placement dashboard
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

      <section id="clinical-ai" className="scroll-mt-20">
        <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">
          Clinical AI
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          A model that scores well in a notebook and a model that changes what a
          nurse does at three in the morning are two different problems. Twelve
          years at the bedside is what I bring to the second one — reading
          whether a prediction fits the work, and whether the people on the
          receiving end will act on it.
        </p>

        <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {clinicalAiFocus.map(({ label, detail }) => (
            <div key={label} className="border-t border-line pt-3">
              <dt className="text-xs uppercase tracking-[0.18em] text-ink-subtle">
                {label}
              </dt>
              <dd className="mt-1 text-sm text-ink-muted">{detail}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 max-w-2xl rounded-sm bg-accent-soft px-4 py-3 text-sm text-ink-muted">
          The transfer assistant is where this is worked out in code: every
          extracted field carries the source text it came from, the model
          abstains rather than guessing when evidence is thin, and a coordinator
          confirms or overrides each suggestion. Synthetic data only, decision
          support only — it is not validated for clinical use.
        </p>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      <section id="contact" className="scroll-mt-20">
        <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">
          Contact
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Open to clinical analytics, clinical AI, and data science roles. The
          fastest way to reach me is email.
        </p>

        <p className="mt-6">
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-xl font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
          >
            {siteConfig.email}
          </a>
        </p>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
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
