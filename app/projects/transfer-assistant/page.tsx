import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import confusionMatrices from "./images/confusion_matrices.png";
import evaluationView from "./images/evaluation.png";
import requestReview from "./images/request-review.png";

export const metadata: Metadata = {
  title: "Clinical AI Transfer Assistant",
  description:
    "A case study: turning an unstructured transfer referral into a reviewable summary and a routing suggestion, with rule-based NLP, an interpretable decision tree, and a coordinator in the loop.",
  alternates: { canonical: "/projects/transfer-assistant" },
};

const pipeline = [
  {
    step: "01",
    label: "Extraction",
    detail:
      "Rule-based NLP pulls sixteen structured fields out of the referral prose. Every field carries the span of source text it came from, so a reviewer checks the note rather than trusting the parse.",
  },
  {
    step: "02",
    label: "Gaps and conflicts",
    detail:
      "Missing critical fields and internal contradictions are surfaced as a checklist. An incomplete referral is a normal referral, and the system is explicit about what it does not know.",
  },
  {
    step: "03",
    label: "Routing",
    detail:
      "Deterministic rules produce a route together with the rule IDs that fired. When the evidence is thin, the rules abstain instead of guessing.",
  },
  {
    step: "04",
    label: "Second opinion",
    detail:
      "A depth-six decision tree, trained only on extracted fields, offers a comparison. Its decision path is printed node by node. When rules and tree disagree, the app says so rather than silently picking one.",
  },
  {
    step: "05",
    label: "Final coordinator decision",
    detail:
      "A coordinator accepts the suggested route or chooses a different route and documents why. The decision is appended to a local record containing the route, rule IDs, versions, and a hash of the note — never the note itself.",
  },
];

const results = [
  {
    approach: "Majority baseline",
    accuracy: "32.8%",
    precision: "0.082",
    recall: "0.250",
    f1: "0.123",
    coverage: "100%",
  },
  {
    approach: "Rules",
    accuracy: "73.2%",
    precision: "1.000",
    recall: "0.707",
    f1: "0.818",
    coverage: "73.2%",
  },
  {
    approach: "Decision tree",
    accuracy: "97.6%",
    precision: "0.975",
    recall: "0.974",
    f1: "0.974",
    coverage: "100%",
  },
];

const limitations = [
  "Authored adult scenarios, English vocabulary, and a single generator do not represent real transfer-center practice.",
  "Routing rules are prototype assumptions, not validated clinical criteria. Placement conventions vary by institution.",
  "Scenario labels are authored assumptions, not clinician-adjudicated ground truth. No metric here establishes real-world safety.",
  "Completeness is not a calibrated probability, and tree leaf proportions are uncalibrated.",
  "No real-patient testing, external adjudication, fairness validation, or prospective evaluation has occurred.",
];

export default function TransferAssistantCaseStudy() {
  return (
    <main className="mx-auto w-full max-w-content px-6 py-20 sm:py-28">
      <Link
        href="/"
        className="text-sm font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
      >
        ← Josh Homan
      </Link>

      <header className="mt-10">
        <p className="numeral text-xs uppercase tracking-[0.22em] text-ink-subtle">
          Case study · Decision support
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Clinical AI Transfer Assistant
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Interhospital transfer referrals arrive as incomplete, inconsistent
          narratives — a paragraph typed by someone at another hospital, under
          time pressure. A placement coordinator has to find the clinical
          support needs inside that text, notice what is missing, and reconcile
          the request against capacity. This prototype turns one referral into a
          reviewable summary and a provisional route, and leaves the decision
          with a person.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={siteConfig.transferAssistantDemoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-sm bg-accent px-4 py-2 text-sm font-medium text-ink-inverse transition-opacity hover:opacity-90"
          >
            Open the live app
          </a>
          <a
            href={siteConfig.transferAssistantUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
          >
            Source and methodology
          </a>
        </div>

        <p className="mt-8 max-w-2xl rounded-sm bg-accent-soft px-4 py-3 text-sm text-ink-muted">
          Synthetic data only. Decision support only. Not validated for clinical
          use, and not affiliated with any health system.
        </p>
      </header>

      <hr className="my-14 border-line sm:my-16" />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">
          How it works
        </h2>

        <ol className="mt-8 space-y-6">
          {pipeline.map(({ step, label, detail }) => (
            <li
              key={step}
              className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-line pt-5"
            >
              <span className="numeral text-xs text-ink-subtle">{step}</span>
              <div>
                <h3 className="text-base font-medium text-ink">{label}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
                  {detail}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <figure className="mt-10">
          <Image
            src={requestReview}
            alt="The review screen: source note on the left, extracted fields with evidence, an ICU routing rationale, and a capacity warning."
            className="h-auto w-full rounded-sm border border-line"
            sizes="(min-width: 1024px) 68rem, 100vw"
            placeholder="blur"
          />
          <figcaption className="mt-3 text-sm text-ink-subtle">
            Reviewing a fictional referral. The route is shown with the rules
            that produced it and the capacity context around it.
          </figcaption>
        </figure>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">
          Results
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
          One thousand synthetic referrals, split 625 / 125 / 250 by narrative
          template family so identical prose never appears in both training and
          test. The tree was trained on extracted fields only — no scenario
          labels, outcomes, or IDs.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line-strong text-left">
                <th className="py-3 pr-4 font-medium text-ink">Approach</th>
                <th className="py-3 pr-4 text-right font-medium text-ink">
                  Accuracy
                </th>
                <th className="py-3 pr-4 text-right font-medium text-ink">
                  Macro precision
                </th>
                <th className="py-3 pr-4 text-right font-medium text-ink">
                  Macro recall
                </th>
                <th className="py-3 pr-4 text-right font-medium text-ink">
                  Macro F1
                </th>
                <th className="py-3 text-right font-medium text-ink">
                  Coverage
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.approach} className="border-b border-line">
                  <td className="py-3 pr-4 text-ink-muted">{row.approach}</td>
                  <td className="numeral py-3 pr-4 text-right text-ink">
                    {row.accuracy}
                  </td>
                  <td className="numeral py-3 pr-4 text-right text-ink-muted">
                    {row.precision}
                  </td>
                  <td className="numeral py-3 pr-4 text-right text-ink-muted">
                    {row.recall}
                  </td>
                  <td className="numeral py-3 pr-4 text-right text-ink-muted">
                    {row.f1}
                  </td>
                  <td className="numeral py-3 text-right text-ink-muted">
                    {row.coverage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <figure className="mt-10">
          <Image
            src={confusionMatrices}
            alt="Held-out confusion matrices for the rules and the decision tree across ICU, telemetry, medical/surgical, specialty review, and insufficient information."
            className="h-auto w-full rounded-sm border border-line bg-canvas"
            sizes="(min-width: 1024px) 68rem, 100vw"
            placeholder="blur"
          />
          <figcaption className="mt-3 text-sm text-ink-subtle">
            Held-out confusion matrices. The rules concentrate their misses in
            the abstention column rather than spreading them across wards.
          </figcaption>
        </figure>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">
          Reading those numbers honestly
        </h2>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
          The tree looks better than the rules, and the comparison is more
          interesting than that. Overall accuracy counts a withheld suggestion
          as a miss, so the rules are penalised for declining. On the referrals
          they did answer, they were right every time — macro precision 1.000
          across 183 of 250 requests. The tree answers all 250, and that extra
          coverage is where its six errors live, including one ICU false
          positive. The rules produced no ICU false positives; their two ICU
          misses were both abstentions, which is a different kind of wrong.
        </p>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
          Higher coverage can hide unsupported inference from an incomplete
          referral. That is the trade-off the project is actually about, and it
          is why both approaches ship side by side instead of one replacing the
          other.
        </p>

        <div className="mt-8 max-w-2xl space-y-3 rounded-sm bg-surface px-4 py-4 text-sm leading-relaxed text-ink-muted">
          <p>
            <span className="font-medium text-ink">
              What these numbers are not.
            </span>{" "}
            The generator strongly correlates physiology and service with the
            target, which simplifies the ML task considerably. Scenario labels
            are authored assumptions, not clinician-adjudicated truth.
          </p>
          <p>
            Test diagnostics informed parser bug fixes, so this is a development
            benchmark rather than an untouched external evaluation — the
            repository says so too.
          </p>
          <p>
            Extraction scored 1.000 on supported prose, which reflects a shared,
            bounded vocabulary. A separately authored language challenge suite
            passed 17 of 20 field assertions, failing on a pressor abbreviation,
            a hypothetical device statement, and an isolation synonym. Those
            cases are kept in the repository rather than dropped.
          </p>
        </div>

        <figure className="mt-10">
          <Image
            src={evaluationView}
            alt="The evaluation workspace showing measured routing performance, per-class metrics, and browsable failure cases."
            className="h-auto w-full rounded-sm border border-line"
            sizes="(min-width: 1024px) 68rem, 100vw"
            placeholder="blur"
          />
          <figcaption className="mt-3 text-sm text-ink-subtle">
            The evaluation view ships inside the app, including the failure
            cases. You can read the misses without leaving the demo.
          </figcaption>
        </figure>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">
          Limitations
        </h2>
        <ul className="mt-8 max-w-2xl space-y-3">
          {limitations.map((item) => (
            <li
              key={item}
              className="border-t border-line pt-3 text-sm leading-relaxed text-ink-muted"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-ink-muted">
          The next meaningful step is clinician-led validation of the workflow
          and the rules, followed by an independently adjudicated evaluation —
          not deployment into patient care.
        </p>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">
          Contact
        </h2>
        <p className="mt-6">
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-xl font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
          >
            {siteConfig.email}
          </a>
        </p>
        <p className="mt-6">
          <Link
            href="/"
            className="font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-4"
          >
            Back to portfolio
          </Link>
        </p>
      </section>
    </main>
  );
}
