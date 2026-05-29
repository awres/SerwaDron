import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://serwadron.pl",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Jeśli masz inne podstrony, dopisz je tutaj, np:
    // {
    //   url: 'https://serwadron.pl/oferta',
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ];
}
