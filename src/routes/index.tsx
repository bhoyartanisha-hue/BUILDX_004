import { createFileRoute } from "@tanstack/react-router";
import { AnvayaApp } from "@/features/anvaya/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nagar Setu — Nagpur Civic Operations" },
      {
        name: "description",
        content:
          "Live Nagpur utilities map, road health, work verification, asset expiry and citizen complaint tracking — all in one civic operations console.",
      },
      { property: "og:title", content: "Nagar Setu — Nagpur Civic Operations" },
      {
        property: "og:description",
        content:
          "Track utilities, roads and repairs on a live map. File and follow citizen complaints end to end.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <AnvayaApp />;
}
