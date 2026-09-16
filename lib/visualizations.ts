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
  {
    slug: "btc-gold-direction-heatmap",
    src: "/images/viz/btc-gold-direction-heatmap.png",
    width: 1080,
    height: 1350,
    title: "Bitcoin and gold, month by month",
    chartType: "Calendar heatmap",
    method:
      "One square per month since January 2015, filled when both assets finished the month on the same side of zero. That happened in 72 of 139 months, 51.8 percent, against a coin-flip baseline of 50. The legend carries the counts so the reader can check the percentage.",
    alt: "Calendar heatmap with one square per month from 2015 to 2026, filled in orange when Bitcoin and gold moved in the same direction, 72 filled and 67 not.",
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
    slug: "satisfaction-by-income",
    src: "/images/viz/satisfaction-by-income.png",
    width: 1080,
    height: 1350,
    title: "Satisfaction by household income",
    chartType: "Bar chart with reference line",
    method:
      "Share of workers who say they are satisfied, for households under $25,000 and at $150,000 or more, against the national figure as a dashed reference line. Two bars and one line carry a 31-point gap. The Conference Board Job Satisfaction survey, 2026.",
    alt: "Two bars showing 45.3 percent job satisfaction for households under 25,000 dollars and 76 percent for households at 150,000 or more, with a dashed line at the 68.9 percent national figure.",
  },
  {
    slug: "satisfaction-vs-quits",
    src: "/images/viz/satisfaction-vs-quits.png",
    width: 1080,
    height: 1350,
    title: "Satisfaction up, quitting down",
    chartType: "Dual-axis lines",
    method:
      "Overall job satisfaction from The Conference Board's annual survey, 2010 to 2026, on the left axis; the monthly quits rate from BLS JOLTS on the right. Two series from two sources, with the endpoints and the 2022 quits peak labeled directly on the lines.",
    alt: "Line chart with job satisfaction rising from 42.6 percent in 2010 to a record 68.9 percent in 2026, and the quits rate peaking at 2.8 percent in 2022 before falling to 1.9 percent.",
  },
  {
    slug: "jobs-by-industry",
    src: "/images/viz/jobs-by-industry.png",
    width: 1080,
    height: 1350,
    title: "Where the jobs were added",
    chartType: "Diverging bar",
    method:
      "Over-the-month change in payroll employment by industry, in thousands, from the August 2026 BLS Employment Situation. Sorted by size, gains and losses on either side of a zero line, with the two industries that made up 60 percent of the total set in the accent color.",
    alt: "Horizontal diverging bar chart of August 2026 job changes by industry, led by leisure and hospitality at plus 62 thousand and government at plus 35 thousand, with financial activities and information negative.",
  },
  {
    slug: "tiktok-us-ownership",
    src: "/images/viz/tiktok-us-ownership.png",
    width: 1080,
    height: 1350,
    title: "Who runs TikTok's U.S. business",
    chartType: "Stacked bar + sourced table",
    method:
      "A 100 percent stacked bar of ownership before and after the joint venture, board seats as a unit chart, then a who-runs-what table with a column for who says so. Built from the joint-venture filing, the White House fact sheet, a DOJ opinion, and a House committee letter; five of the six answers rest on TikTok's own account, and the chart says so.",
    alt: "Stacked bar showing ByteDance's TikTok stake falling from 100 percent to 19.9 percent alongside Oracle, Silver Lake, MGX, and other investors, above a table of who controls data, algorithm, moderation, and ads, each with its source.",
  },
  {
    slug: "study-329-outcomes",
    src: "/images/viz/study-329-outcomes.jpg",
    width: 1264,
    height: 1568,
    title: "Nine outcomes promised, four published",
    chartType: "Unit bars, before and after",
    method:
      "Study 329, an antidepressant trial in adolescents published in 2001. The top stack is the nine outcomes written down before the trial, none of which beat placebo; the bottom is the four positive results in the published paper, none of which were on the original list. Counts from the 2015 independent reanalysis in The BMJ.",
    alt: "Two stacks of horizontal bars: nine gray bars for outcomes promised before the trial, none of which beat a sugar pill, and four gold bars for positive results reported in the published paper, none of which were pre-specified.",
  },
];
