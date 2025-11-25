import { quizLevels } from "@/public/quiz";
import { MetadataRoute } from "next";
import { LevelParts } from "./(preview)/parts";

const URL = "https://awsquizgame.adembenabdallah.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const levels = LevelParts.map((level) => ({
    url: `${URL}/level/${level.id}`,
    lastModified: new Date(),
  }));

  const quizzes = quizLevels.map((_, index) => ({
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
    ...quizzes,
  ];
}
