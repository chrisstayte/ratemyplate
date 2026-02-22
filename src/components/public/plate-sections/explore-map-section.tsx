import Link from 'next/link';
import { MapPin, ArrowRight, Map } from 'lucide-react';

export default function ExploreMapSection() {
  return (
    <section className="flex flex-col gap-6 w-full">
      <div className="text-start">
        <h2 className="text-3xl font-bold">Explore the Map</h2>
        <p className="text-muted-foreground mt-1">
          See rated plates across all 50 states
        </p>
      </div>
      <Link
        href="/map"
        className="group relative grid md:grid-cols-2 overflow-hidden rounded-xl border hover:border-primary/50 transition-colors"
      >
        <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
              <MapPin className="size-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">
              Interactive State-by-State Map
            </h3>
          </div>
          <p className="text-muted-foreground">
            Discover which states have the most rated plates. Click any state to
            dive into its plate activity.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            View the Map
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
        <div className="relative flex items-center justify-center bg-muted/50 min-h-[200px]">
          <Map className="size-24 text-muted-foreground/30 group-hover:text-primary/30 transition-colors" strokeWidth={1} />
        </div>
      </Link>
    </section>
  );
}
