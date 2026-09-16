import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { visualizations } from "@/lib/visualizations";

export const metadata: Metadata = {
  title: "Data visualization",
  description:
    "Twelve finished data visualizations: regression, event studies, a calendar heatmap, and labor-market charts, each with a note on how the figure was produced.",
  alternates: { canonical: "/visualizations" },
};

export default function VisualizationsPage() {
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
          Gallery · {visualizations.length} charts
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Data visualization
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Finished exhibits from The Homan Quant, a data-visualization series I
          write and design. The topics change from chart to chart — sports,
          housing, markets, labor. The way each one is built does not. Each
          chart below has the chart type listed and a note on how the figure
          was produced.
        </p>
      </header>

      <section className="mt-14">
        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visualizations.map((viz, index) => (
            <li key={viz.slug} id={viz.slug} className="scroll-mt-20">
              <figure>
                <a
                  href={viz.src}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-sm border border-line transition-opacity hover:opacity-90"
                  aria-label={`Open ${viz.title} at full size`}
                >
                  <Image
                    src={viz.src}
                    alt={viz.alt}
                    width={viz.width}
                    height={viz.height}
                    sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full"
                    priority={index < 3}
                  />
                </a>
                <figcaption className="mt-4">
                  <p className="numeral text-xs uppercase tracking-[0.2em] text-ink-subtle">
                    {String(index + 1).padStart(2, "0")} · {viz.chartType}
                  </p>
                  <h2 className="mt-2 text-lg font-medium tracking-tight text-ink">
                    {viz.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {viz.method}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <hr className="my-14 border-line sm:my-16" />

      <section>
        <p className="max-w-2xl rounded-sm bg-accent-soft px-4 py-3 text-sm text-ink-muted">
          Each image opens at full size. Sources and calculation notes are
          printed in the footer of every chart.
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
