import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Patient Placement Analytics",
  description: "Comparing transfer-center and emergency department admissions through volume, care mix, and length of stay. An interactive Streamlit project using 6,000 synthetic encounters.",
  alternates: { canonical: "/projects/patient-placement" },
};

const questions = [
  ["01", "Who is arriving?", "Track monthly admissions and transfer share. Filter by service, level of care, patient class, and admission dates to define the population behind every chart."],
  ["02", "What care do they need?", "Compare service-line and care-level composition using percentages within each source. Counts in the chart tooltips keep the denominator visible."],
  ["03", "How long do they stay?", "Compare median LOS and distributions within each care level, then check subgroup sizes and the 90th percentile. Stratification provides context; it does not fully adjust for acuity."],
  ["04", "Can the result be traced?", "Search fictional encounters and referring facilities, inspect the selected cohort, and download the same rows as CSV. Read definitions and simulation assumptions inside the app."],
];

export default function PatientPlacementCaseStudy() {
  return (
    <main className="mx-auto w-full max-w-content px-6 py-20 sm:py-28">
      <Link href="/" className="text-sm font-medium text-accent-ink underline underline-offset-4">← {siteConfig.name}</Link>
      <header className="mt-10">
        <p className="numeral text-xs uppercase tracking-[0.22em] text-ink-subtle">Case study · Clinical operations</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Patient placement,<br />in perspective.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">An overall length-of-stay comparison can hide the differences between the patients entering through a transfer center and those admitted from the emergency department. This dashboard puts the care mix next to the outcome, so the question becomes more specific: how do stays compare within a level of care?</p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          {siteConfig.dashboardDemoUrl ? <a href={siteConfig.dashboardDemoUrl} target="_blank" rel="noreferrer" className="rounded-sm bg-accent px-4 py-2 text-sm font-medium text-ink-inverse">Open the live app</a> : null}
          <a href={siteConfig.dashboardUrl} target="_blank" rel="noreferrer" className="font-medium text-accent-ink underline decoration-accent underline-offset-4">Source and methodology</a>
        </div>
        <p className="mt-8 rounded-sm bg-accent-soft px-4 py-3 text-sm leading-relaxed text-ink-muted">6,000 fictional adult encounters · January–December 2025 · Python, pandas, Plotly, Streamlit. Synthetic data only; no real patient records or clinical deployment.</p>
      </header>
      <figure className="mt-12">
        <Image src="/images/patient-placement.png" alt="Patient placement dashboard showing cohort filters, encounter counts, transfer share, median length-of-stay gap, monthly admission volumes, and care-level composition." width={1440} height={1280} sizes="(min-width: 1024px) 68rem, 100vw" className="h-auto w-full rounded-sm border border-line" />
        <figcaption className="mt-3 text-sm text-ink-subtle">The overview connects admission volume, care mix, and the unadjusted LOS gap. Every number follows the selected cohort.</figcaption>
      </figure>
      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-ink-subtle">Four questions, one cohort</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2">{questions.map(([number, title, detail]) => <li key={number} className="border-t border-line pt-5"><span className="numeral text-xs text-accent-ink">{number}</span><h3 className="mt-3 text-xl font-medium text-ink">{title}</h3><p className="mt-3 text-sm leading-relaxed text-ink-muted">{detail}</p></li>)}</ol>
      </section>
      <section className="mt-16 border-t border-line pt-8">
        <h2 className="text-2xl font-medium tracking-tight text-ink">An operational question, with honest limits.</h2>
        <div className="mt-5 max-w-2xl space-y-4 text-base leading-relaxed text-ink-muted">
          <p>The generator deliberately gives transfers a higher ICU probability and longer expected stays at each care level. The resulting differences illustrate how to investigate a cohort; they are not evidence about an actual hospital.</p>
          <p>Care level is a single encounter category. Diagnoses, severity, comorbidities, discharge barriers, and bed movements are not modeled. Comparing within care levels is descriptive, not a causal estimate or a full risk adjustment.</p>
          <p>Encounter bed-days sum the full stays of selected admissions, including days after the selected admission window. They are not a measure of daily census, staffed capacity, or hospital occupancy.</p>
        </div>
      </section>
      <section className="mt-12 rounded-sm bg-accent-soft p-6">
        <h2 className="text-lg font-medium text-ink">From bedside context to a reviewable analysis</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">The work combines cohort design, reproducible data generation, interactive visualization, and explicit metric definitions. Empty selections and missing comparison groups are handled visibly, and the source includes regression checks for dates, denominators, and navigation.</p>
        <Link href="/projects/transfer-assistant" className="mt-5 inline-block text-sm font-medium text-accent-ink underline underline-offset-4">Explore the related Clinical AI Transfer Assistant →</Link>
      </section>
    </main>
  );
}
