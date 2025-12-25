import { MetadataRoute } from "next";
import { certificateLevels } from "@/public/quiz";

const URL = "https://certquickly.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: URL,
      lastModified: new Date(),
    },
    {
      url: `${URL}/levels`,
      lastModified: new Date(),
    },
  ];

  for (const [certSlug, levels] of Object.entries(certificateLevels)) {
    for (let i = 0; i < levels.length; i++) {
      entries.push({
        url: `${URL}/quiz/${certSlug}/level/${i + 1}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
