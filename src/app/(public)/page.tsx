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
      <section className="flex flex-col items-center text-center border-b px-5 py-16 sm:py-20">
        <p className="eyebrow mb-6">A local view of the road</p>
        <h1 className="font-display max-w-3xl text-5xl leading-[1.05] sm:text-7xl">
          Every plate has <span className="italic">a story.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          See what others are saying. Share your own experiences. Your name
          stays off the public page.
        </p>
        <div className="mt-8 mb-5 w-full max-w-2xl">
          <InlineSearch />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
          <Badge variant="outline" className="border-transparent bg-transparent px-0 font-normal text-muted-foreground">
            <EyeOff className="size-3" />
            Publicly anonymous
          </Badge>
          <Badge variant="outline" className="border-transparent bg-transparent px-0 font-normal text-muted-foreground">
            <MapPin className="size-3" />
            50 States
          </Badge>
          <Badge variant="outline" className="border-transparent bg-transparent px-0 font-normal text-muted-foreground">
            <Users className="size-3" />
            Community Driven
          </Badge>
        </div>
        <div className="mt-8"><TypingPlate plates={plateNumbers} /></div>
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
