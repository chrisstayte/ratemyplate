import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { database } from '@/db/database';
import { plate_reviews } from '@/db/schema';
import { avg, eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateParam = searchParams.get('state');
  const plateParam = searchParams.get('plate');

  if (!stateParam || !plateParam) {
    return new Response('Missing state or plate query params', { status: 400 });
  }

  const plateNumber = plateParam.toUpperCase();
  const stateUpper = stateParam.toUpperCase();

  const [fontData, interFontData, statesJson] = await Promise.all([
    readFile(join(process.cwd(), 'public/fonts/LICENSE-PLATE-USA.ttf')),
    readFile(join(process.cwd(), 'public/fonts/Inter-Bold.ttf')),
    readFile(join(process.cwd(), 'public/data/states.json'), 'utf-8'),
  ]);

  const states: { abbreviation: string; name: string }[] =
    JSON.parse(statesJson);
  const stateData = states.find((s) => s.abbreviation === stateUpper);
  // Use the full state name if found, otherwise preserve original casing
  const stateName = stateData?.name ?? stateParam;

  // Look up plate and average rating
  let avgRating: number | null = null;

  const plateRecord = await database.query.plates.findFirst({
    where: (plates, { and, eq }) =>
      and(eq(plates.state, stateUpper), eq(plates.plateNumber, plateNumber)),
  });

  if (plateRecord) {
    const [stats] = await database
      .select({
        avgRating: avg(plate_reviews.rating),
      })
      .from(plate_reviews)
      .where(eq(plate_reviews.plateId, plateRecord.id));

    if (stats) {
      avgRating = stats.avgRating == null ? null : Number(stats.avgRating);
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter',
          background:
            'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          position: 'relative',
        }}
      >
        {/* Title */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '40px',
            color: 'white',
            fontSize: '42px',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          RateMyPlate
        </div>

        {/* Plate card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '700px',
            height: '350px',
            background: 'white',
            borderRadius: '24px',
            border: '4px solid #e0e0e0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative',
          }}
        >
          {/* State name badge */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: '24px',
              background: '#18181b',
              color: 'white',
              padding: '6px 20px',
              borderRadius: '9999px',
              fontSize: '22px',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            {stateName}
          </div>

          {/* Plate number */}
          <div
            style={{
              display: 'flex',
              fontFamily: 'LicensePlate',
              fontSize: '100px',
              color: '#18181b',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {plateNumber}
          </div>
        </div>

        {/* Star rating — bottom right */}
        {avgRating !== null && (
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              bottom: '32px',
              right: '40px',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill={i < Math.round(avgRating!) ? '#facc15' : '#4b5563'}
                stroke={i < Math.round(avgRating!) ? '#facc15' : '#4b5563'}
                strokeWidth="1.5"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span
              style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: 700,
                marginLeft: '8px',
              }}
            >
              {avgRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interFontData,
          style: 'normal' as const,
        },
        {
          name: 'LicensePlate',
          data: fontData,
          style: 'normal' as const,
        },
      ],
    }
  );
}
