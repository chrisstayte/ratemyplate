import { Suspense } from 'react';
import { database } from '@/db/database';
import { plate_reviews, plates } from '@/db/schema';
import { count, countDistinct, eq } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EyeOff, Activity, Users, ShieldAlert } from 'lucide-react';

const features = [
  {
    icon: EyeOff,
    title: 'Publicly Anonymous',
    description:
      'Reviews show on the plate page without your name. Sign-in stays behind the scenes for abuse prevention.',
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
    <section className="flex flex-col gap-12 w-full">
      <div className="text-start">
        <p className="eyebrow mb-3">Built by drivers, for drivers</p>
        <h2 className="font-display text-3xl sm:text-4xl">Driving safer together.</h2>
        <p className="text-muted-foreground mt-3 leading-7">
          Join a community committed to road safety
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="shrink-0 flex items-center justify-center size-10 rounded-md border bg-secondary/50">
                <feature.icon className="size-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
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
      count: countDistinct(plate_reviews.plateId),
    })
    .from(plate_reviews);

  const [activeMembers] = await database
    .select({
      count: countDistinct(plate_reviews.userId),
    })
    .from(plate_reviews);

  const [statesCovered] = await database
    .select({
      count: countDistinct(plates.state),
    })
    .from(plates)
    .innerJoin(plate_reviews, eq(plates.id, plate_reviews.plateId));

  const [totalReviews] = await database
    .select({
      count: count(),
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
            <span className="font-display text-4xl tabular-nums">
              {stat.value.toLocaleString()}
            </span>
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
