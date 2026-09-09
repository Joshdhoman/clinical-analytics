import { ImageResponse } from "next/og";
import { brand, siteConfig } from "@/lib/site";

// Next picks this file up by convention and emits both og:image and
// twitter:image pointing at it — no manual wiring in the metadata object.
export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered by Satori on the server, not a browser. Flexbox only (no grid),
// inline styles only (no Tailwind), literal hexes only (no CSS variables),
// and any element with more than one child needs an explicit display: flex.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: brand.canvas,
          padding: "76px 80px",
          borderTop: `18px solid ${brand.accent}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: brand.inkSubtle,
            }}
          >
            {siteConfig.role}
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -3,
              color: brand.ink,
              marginTop: 18,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.4,
              color: brand.inkMuted,
              marginTop: 26,
              maxWidth: 880,
            }}
          >
            Registered nurse — 12 years of clinical experience across critical
            care and patient placement. Now working the data side of the same
            problems.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 48,
              height: 5,
              backgroundColor: brand.accent,
              marginRight: 20,
            }}
          />
          <div
            style={{ fontSize: 30, fontWeight: 600, color: brand.accentInk }}
          >
            Data science portfolio
          </div>
        </div>
      </div>
    ),
    size,
  );
}
