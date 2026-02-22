import { EyeOff, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import InlineSearch from '@/components/public/inline-search';
import RecentlyRatedSection from '@/components/public/plate-sections/recently-rated-section';
import DrivingSaferSection from '@/components/public/plate-sections/driving-safer-section';

export default function Home() {
  return (
    <div className="container flex flex-col gap-16 py-10 items-center">
      {/* Hero + Inline Search */}
      <section className="flex flex-col items-center gap-6 text-center max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight">
          Rate Any License Plate
        </h1>
        <p className="text-lg text-muted-foreground">
          See what others are saying. Share your own experiences. Stay
          anonymous.
        </p>
        <InlineSearch />
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge className="bg-purple-400 dark:bg-purple-200">
            <EyeOff className="size-3" />
            100% Anonymous
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

      {/* Recently Rated */}
      <RecentlyRatedSection />

      {/* Driving Safer Together */}
      <DrivingSaferSection />
    </div>
  );
}
