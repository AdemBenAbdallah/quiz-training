import { quizLevels } from "@/public/quiz";
import { MetadataRoute } from "next";

const URL = "https://awsquizgame.adembenabdallah.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const levels = Array.from({ length: 8 }, (_, index) => ({
    url: `${URL}/quiz/${index + 1}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: URL,
      lastModified: new Date(),
    },
    {
      url: `${URL}/levels`,
      lastModified: new Date(),
    },
    ...levels,
  ];
}
