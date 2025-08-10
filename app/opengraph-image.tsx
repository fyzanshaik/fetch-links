import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OG() {
  const bg = "#F3D3EA"; // bubblegum light
  const fg = "#2B2A2A";
  const accent = "#E23C8A";

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: bg,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: fg,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
              <path d="M10 8v8l6-4-6-4z" fill="#fff" />
            </svg>
          </div>
          <div style={{ fontWeight: 700 }}>Playlist Link Fetcher</div>
        </div>
        <div style={{ fontSize: 28, marginTop: 20, opacity: 0.8 }}>
          Paste a playlist URL → copy all links instantly
        </div>
      </div>
    ),
    { ...size }
  );
}


