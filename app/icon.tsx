import { ImageResponse } from "next/og";
import { brand } from "@/lib/site";

// Replaces the Next.js default favicon with a JH monogram. Same Satori
// constraints as opengraph-image.tsx.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: brand.accent,
          color: brand.canvas,
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: -0.5,
          borderRadius: 6,
        }}
      >
        JH
      </div>
    ),
    size,
  );
}
