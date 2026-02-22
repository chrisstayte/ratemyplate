import type { MetadataRoute } from 'next';
import { database } from '@/db/database';
import { plates } from '@/db/schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BETTER_AUTH_URL ?? 'https://ratemyplate.wtf';

  const allPlates = await database
    .select({
      plateNumber: plates.plateNumber,
      state: plates.state,
      timestamp: plates.timestamp,
    })
    .from(plates);

  const plateEntries: MetadataRoute.Sitemap = allPlates.map((plate) => ({
    url: `${baseUrl}/${plate.state}/${plate.plateNumber}`,
    lastModified: plate.timestamp,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const stateAbbreviations = [...new Set(allPlates.map((p) => p.state))];
  const stateEntries: MetadataRoute.Sitemap = stateAbbreviations.map(
    (state) => ({
      url: `${baseUrl}/${state}`,
      changeFrequency: 'daily',
      priority: 0.8,
    })
  );

  return [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/map`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...stateEntries,
    ...plateEntries,
  ];
}
