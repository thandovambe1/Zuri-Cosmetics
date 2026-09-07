import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zuri Cosmetics — Beauty, Made Effortless",
    short_name: "Zuri",
    description:
      "A curated collection of lashes, press-on nails and lip essentials designed to elevate your everyday beauty routine.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfaf7",
    theme_color: "#f6e7e3",
    icons: [
      {
        src: "/logo.png",
        sizes: "1024x640",
        type: "image/png",
      },
    ],
  };
}
