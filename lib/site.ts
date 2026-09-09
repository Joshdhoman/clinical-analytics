/**
 * Single source of truth for site-wide strings and the canonical URL.
 *
 * Anything that appears in more than one place — the <title>, the OG card, the
 * footer, the resume link — reads from here so the site can never contradict itself.
 */

/**
 * Absolute base URL, used to turn relative asset paths into the absolute URLs
 * that Open Graph and Twitter crawlers require.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — set this to the real domain in production.
 *   2. Vercel's production URL, if deployed there and (1) is unset.
 *   3. localhost, for development.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Josh Homan",
  role: "Clinical Analytics & Data Science",
  title: "Josh Homan — Clinical Analytics & Data Science",
  description:
    "Registered nurse with 12 years of clinical experience across critical care and patient placement, now working in clinical analytics and data science. Healthcare data projects and clinical AI evaluation.",
  url: resolveSiteUrl(),
  email: "joshdhoman@gmail.com",
  githubUrl: "https://github.com/Joshdhoman",
  repoUrl: "https://github.com/Joshdhoman/clinical-analytics",
  dashboardUrl: "https://github.com/Joshdhoman/clinical-analytics/tree/main/dashboard",
  dashboardDemoUrl:
    process.env.NEXT_PUBLIC_PLACEMENT_DEMO_URL || "https://clinical-analytics-dash.streamlit.app",
  transferAssistantUrl:
    "https://github.com/Joshdhoman/clinical-ai-transfer-assistant",
  transferAssistantDemoUrl: "https://clinical-ai-transfer-assistant.streamlit.app",
  resumeUrl: "/Josh_Homan_Resume_Sept_2026.pdf",
} as const;

/**
 * Brand hexes for contexts that cannot read CSS custom properties.
 *
 * Open Graph images are rendered by Satori on the server, not by a browser —
 * there is no Tailwind and no CSS variable resolution, so those values have to
 * be literal. Keep in sync with the @theme block in app/globals.css.
 */
export const brand = {
  canvas: "#ffffff",
  ink: "#18181b",
  inkMuted: "#52525b",
  inkSubtle: "#8b8b93",
  line: "#e6e6e9",
  accent: "#2f6f4e",
  accentInk: "#1f5138",
  accentSoft: "#eff5f1",
} as const;
