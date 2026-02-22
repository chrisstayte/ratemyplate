import { Suspense } from 'react';
import { database } from '@/db/database';
import { plate_reviews, plates } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  EyeOff,
  Activity,
  Users,
  ShieldAlert,
} from 'lucide-react';

const features = [
  {
    icon: EyeOff,
    title: 'Anonymous Reviews',
    description:
      'Share your experiences without revealing your identity. Your privacy is our priority.',
  },
  {
    icon: Activity,
    title: 'Real-Time Ratings',
    description:
      'See up-to-date ratings and reviews from drivers across the country.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description:
      'Built by drivers, for drivers. Every review helps make our roads safer.',
  },
  {
    icon: ShieldAlert,
    title: 'Safe Reporting',
    description:
      'Report dangerous or reckless drivers to help keep everyone on the road safe.',
  },
];

export default function DrivingSaferSection() {
  return (
    <section className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Driving Safer Together</h2>
        <p className="text-muted-foreground mt-1">
          Join a community committed to road safety
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="shrink-0 flex items-center justify-center size-10 rounded-lg bg-primary/10">
                <feature.icon className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Suspense fallback={<StatsGridSkeleton />}>
          <StatsGrid />
        </Suspense>
      </div>
    </section>
  );
}

async function StatsGrid() {
  const [platesRated] = await database
    .select({
      count: sql<number>`cast(count(distinct ${plate_reviews.plateId}) as int)`,
    })
    .from(plate_reviews);

  const [activeMembers] = await database
    .select({
      count: sql<number>`cast(count(distinct ${plate_reviews.userId}) as int)`,
    })
    .from(plate_reviews);

  const [statesCovered] = await database
    .select({
      count: sql<number>`cast(count(distinct ${plates.state}) as int)`,
    })
    .from(plates)
    .innerJoin(plate_reviews, eq(plates.id, plate_reviews.plateId));

  const [totalReviews] = await database
    .select({
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(plate_reviews);

  const stats = [
    { label: 'Plates Rated', value: platesRated.count },
    { label: 'Active Members', value: activeMembers.count },
    { label: 'States Covered', value: statesCovered.count },
    { label: 'Total Reviews', value: totalReviews.count },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <span className="text-3xl font-bold">{stat.value.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground mt-1">
              {stat.label}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center gap-1">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
