import { EyeOff, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import InlineSearch from '@/components/public/inline-search';
import RecentlyRatedSection from '@/components/public/plate-sections/recently-rated-section';
import ExploreMapSection from '@/components/public/plate-sections/explore-map-section';
import DrivingSaferSection from '@/components/public/plate-sections/driving-safer-section';
import TypingPlate from '@/components/public/typing-plate';
import { database } from '@/db/database';
import { plates } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { selectTypingPlateNumbers } from '@/lib/home-plates';

export default async function Home() {
  const recentPlates = await database
    .select({ plateNumber: plates.plateNumber })
    .from(plates)
    .orderBy(desc(plates.timestamp))
    .limit(100);

  const plateNumbers = selectTypingPlateNumbers(recentPlates, 20);
  return (
    <>
      {/* Hero + Inline Search */}
      <section className="flex flex-col items-center gap-4 text-center py-20 pb-16 border-b px-5 sm:px-0 bg-card">
        <h1 className="text-5xl font-bold tracking-tight">
          <TypingPlate plates={plateNumbers} />
        </h1>
        <p className="text-lg text-muted-foreground">
          See what others are saying. Share your own experiences. Your name
          stays off the public page.
        </p>
        <InlineSearch />
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge className="bg-purple-400 dark:bg-purple-200">
            <EyeOff className="size-3" />
            Publicly anonymous
          </Badge>
          <Badge className="bg-purple-400 dark:bg-purple-200">
            <MapPin className="size-3" />
            50 States
          </Badge>
          <Badge className="bg-purple-400 dark:bg-purple-200">
            <Users className="size-3" />
            Community Driven
          </Badge>
        </div>
      </section>

      {/* Recently Rated - full width for marquee */}
      <div className="py-16">
        <RecentlyRatedSection />
      </div>

      <div className="max-w-6xl px-5 mx-auto flex flex-col gap-16 pb-16 items-center">
        {/* Explore the Map */}
        <ExploreMapSection />

        {/* Driving Safer Together */}
        <DrivingSaferSection />
      </div>
    </>
  );
}
