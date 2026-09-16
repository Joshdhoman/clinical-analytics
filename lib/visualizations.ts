/**
 * The data-visualization gallery, in display order.
 *
 * Every chart here is a finished exhibit from The Homan Quant, a
 * data-visualization series Josh writes and designs. Each entry says what
 * kind of chart it is and how the figure was produced, because the point of
 * the gallery is the craft and the method, not the subject.
 *
 * Images live in public/images/viz/. They all share a 4:5 aspect ratio so
 * the grid stays even.
 */

export type Visualization = {
  slug: string;
  src: string;
  width: number;
  height: number;
  title: string;
  /** The chart form, shown as a tag. */
  chartType: string;
  /** How the figure was produced — data, window, method. One or two sentences. */
  method: string;
  alt: string;
};

export const visualizations: Visualization[] = [
  {
    slug: "nfl-model-vs-vegas",
    src: "/images/viz/nfl-model-vs-vegas.png",
    width: 1080,
    height: 1350,
    title: "Model vs. market: NFL win totals",
    chartType: "Dumbbell comparison",
    method:
      "An ensemble of ridge regression, gradient boosting, and a random forest, trained on 736 team-seasons since 2002 and walk-forward tested on 15 unseen seasons. Each team's projection sits beside the sportsbook line so the disagreement is the chart.",
    alt: "Dumbbell chart of all 32 NFL teams, each showing a model-projected win total beside the Vegas line, with the twelve largest disagreements highlighted.",
  },
  {
    slug: "btc-power-law-four-fits",
    src: "/images/viz/btc-power-law-four-fits.png",
    width: 1080,
    height: 1350,
    title: "One regression, four vintages",
    chartType: "Small multiples",
    method:
      "The same log-log fit refit using only the data that existed in 2013, 2015, 2021, and today. Shaded wedges are each fit's own residual quantiles. It shows how much a long-horizon projection depends on when the clock stopped.",
    alt: "Four small log-log price charts, each with a fitted power-law line and quantile bands, showing the projected 2030 value changing with the fit date.",
  },
  {
    slug: "btc-gold-rolling-correlation",
    src: "/images/viz/btc-gold-rolling-correlation.png",
    width: 1080,
    height: 1350,
    title: "Signal or noise?",
    chartType: "Rolling correlation with null band",
    method:
      "A 24-month rolling correlation of monthly log returns, plotted inside the 95% interval that two unrelated series would produce by chance. Ninety-seven percent of windows since 2017 never leave the band.",
    alt: "Line chart of a rolling 24-month correlation oscillating between minus 0.3 and 0.45, almost entirely inside a shaded band labeled the 95% no-signal range.",
  },
  {
    slug: "fed-hike-event-study",
    src: "/images/viz/fed-hike-event-study.png",
    width: 1080,
    height: 1350,
    title: "Three assets after a Fed hike",
    chartType: "Event study",
    method:
      "Average return 1, 7, and 30 calendar days after each of the 20 rate hikes from December 2015 to July 2023, for Bitcoin, the S&P 500, and gold. Grouped bars, one group per horizon.",
    alt: "Grouped bar chart of average returns for Bitcoin, the S&P 500, and gold at one, seven, and thirty days after a Fed rate hike.",
  },
  {
    slug: "implied-vs-realized-vol",
    src: "/images/viz/implied-vs-realized-vol.png",
    width: 1080,
    height: 1350,
    title: "What options priced vs. what happened",
    chartType: "Layered bars",
    method:
      "The S&P 500's implied daily move (prior VIX close divided by the square root of 252) drawn behind the realized close-to-close move for 23 sessions. Days that moved more than priced are flagged, and the averages are summarized below the chart.",
    alt: "Bar chart of 23 trading days comparing the options-implied daily move to the actual move, with five days exceeding the implied move highlighted.",
  },
  {
    slug: "mortgage-rates-vs-homebuilding",
    src: "/images/viz/mortgage-rates-vs-homebuilding.png",
    width: 1080,
    height: 1350,
    title: "Rates and housing starts",
    chartType: "Scatter with fit line",
    method:
      "Monthly housing starts against the 30-year Treasury rate since January 2022, with a least-squares line: about 118,000 fewer homes per point of rate. The caption says association, not cause, on purpose.",
    alt: "Scatter plot of monthly new-home starts against the 30-year Treasury rate with a downward-sloping best-fit line and today's point marked.",
  },
  {
    slug: "productivity-pay-gap",
    src: "/images/viz/productivity-pay-gap.png",
    width: 1080,
    height: 1350,
    title: "Where a 56-point gap came from",
    chartType: "Area chart + decomposition",
    method:
      "Net productivity and median hourly compensation indexed to 1979, then EPI's decomposition of the gap into three components as a single stacked bar. Two chart forms carry one argument.",
    alt: "Area chart of productivity rising 72 percent against pay rising 16 percent from 1979 to 2019, above a stacked bar decomposing the gap into three causes.",
  },
  {
    slug: "emmys-wins-by-platform",
    src: "/images/viz/emmys-wins-by-platform.png",
    width: 2160,
    height: 2700,
    title: "Emmy wins by platform, 2019–2026",
    chartType: "Ranked bar + multi-line",
    method:
      "Total wins per platform for one ceremony year as a ranked bar, then an eight-season line series with the leader tagged under each year. A ranking and a trend in one exhibit, with the counts in stat tiles up top.",
    alt: "Ranked horizontal bar chart of 2026 Emmy wins by platform, above a multi-line chart of wins per season from 2019 to 2026 with the annual leader labeled.",
  },
];
