import type { Metadata } from 'next';
import { count, countDistinct, eq, max } from 'drizzle-orm';
import GlobeExperience, {
  type GlobeStateActivity,
  type GlobeView,
} from '@/components/public/globe/globe-experience';
import { database } from '@/db/database';
import { plate_reviews, plates } from '@/db/schema';
import { US_STATE_CENTERS } from '@/lib/us-state-centers';

export const metadata: Metadata = {
  title: 'Live Plate Globe · RateMyPlate',
  description: 'Explore anonymous driver reports across America on a live 3D globe.',
};

export const dynamic = 'force-dynamic';

type GlobeSearchParams = {
  lat?: string | string[];
  lng?: string | string[];
  z?: string | string[];
};

function parseInitialView(searchParams: GlobeSearchParams): GlobeView | undefined {
  const latitudeValue = Array.isArray(searchParams.lat) ? undefined : searchParams.lat;
  const longitudeValue = Array.isArray(searchParams.lng) ? undefined : searchParams.lng;
  const zoomValue = Array.isArray(searchParams.z) ? undefined : searchParams.z;

  if (!latitudeValue?.trim() || !longitudeValue?.trim() || !zoomValue?.trim()) {
    return undefined;
  }

  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);
  const zoom = Number(zoomValue);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(zoom) ||
    latitude < -85 ||
    latitude > 85 ||
    longitude < -180 ||
    longitude > 180 ||
    zoom < 0.7 ||
    zoom > 6
  ) {
    return undefined;
  }

  return { latitude, longitude, zoom };
}

export default async function GlobePage({
  searchParams,
}: {
  searchParams: Promise<GlobeSearchParams>;
}) {
  const initialView = parseInitialView(await searchParams);
  const [reportActivity, plateActivity] = await Promise.all([
    database
      .select({
        state: plates.state,
        reportCount: count(plate_reviews.id),
        reportedPlateCount: countDistinct(plates.id),
        latestReportAt: max(plate_reviews.createdAt),
      })
      .from(plate_reviews)
      .innerJoin(plates, eq(plate_reviews.plateId, plates.id))
      .groupBy(plates.state),
    database
      .select({
        state: plates.state,
        plateCount: count(plates.id),
      })
      .from(plates)
      .groupBy(plates.state),
  ]);

  const plateCounts = new Map(
    plateActivity.map((state) => [state.state, Number(state.plateCount)])
  );

  const activity: GlobeStateActivity[] = reportActivity
    .flatMap((state) => {
      const center = US_STATE_CENTERS[state.state];
      if (!center || !state.latestReportAt) return [];

      return [
        {
          abbreviation: state.state,
          name: center.name,
          longitude: center.longitude,
          latitude: center.latitude,
          reportCount: Number(state.reportCount),
          plateCount:
            plateCounts.get(state.state) ?? Number(state.reportedPlateCount),
          latestReportAt: state.latestReportAt.toISOString(),
        },
      ];
    })
    .sort((a, b) => b.reportCount - a.reportCount);

  const totalReports = activity.reduce(
    (total, state) => total + state.reportCount,
    0
  );
  const totalPlates = plateActivity.reduce(
    (total, state) => total + Number(state.plateCount),
    0
  );

  return (
    <GlobeExperience
      activity={activity}
      totalReports={totalReports}
      totalPlates={totalPlates}
      initialView={initialView}
    />
  );
}
