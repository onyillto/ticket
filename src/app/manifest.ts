import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FWC2026 Mobile Tickets",
    short_name: "FWC Tickets",
    description: "FIFA World Cup 2026 official mobile ticket wallet",
    start_url: "/my-tickets",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#CC2027",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
