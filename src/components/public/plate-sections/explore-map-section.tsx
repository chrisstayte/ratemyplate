import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Globe2 } from 'lucide-react';
import atlas from './data/us-atlas.json';

const ohio = atlas.states.find((state) => state.code === 'OH')!;

export default function ExploreMapSection() {
  return (
    <section
      id="explore"
      aria-labelledby="explore-map-heading"
      className="w-full scroll-mt-24 overflow-hidden rounded-xl border border-border bg-card text-foreground"
    >
      <div className="grid md:grid-cols-[0.88fr_1.12fr]">
        <div className="flex flex-col items-start px-6 py-8 sm:px-10 sm:py-12 md:px-7 lg:px-12 lg:py-14">
          <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Globe2 aria-hidden="true" className="size-4" strokeWidth={1.5} />
            Explore America
          </div>

          <h2
            id="explore-map-heading"
            className="font-display mt-6 text-[48px] leading-[1.02] sm:mt-7 sm:text-[64px] md:text-[52px] lg:text-[66px]"
          >
            The road,
            <br />
            <span className="italic">reviewed.</span>
          </h2>
          <p className="mt-6 max-w-[32ch] text-[15px] leading-7 text-muted-foreground sm:text-base">
            Get a local perspective on the drivers around you. Explore ratings
            and reviews, one state at a time.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-8">
            <Link
              href="/globe"
              className="inline-flex min-h-11 items-center gap-4 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Explore the globe
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="mt-10 hidden items-center gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex lg:mt-auto lg:w-full lg:pt-6">
            <span className="text-lg font-medium tabular-nums text-foreground">50</span>
            states. A local view of every one.
          </div>
        </div>

        <div className="flex min-w-0 flex-col border-t border-border bg-atlas px-5 pb-5 pt-6 sm:px-8 sm:pb-7 md:border-l md:border-t-0 lg:pt-9">
          <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <span>United States</span>
            <span>Community atlas</span>
          </div>

          {/* Exact state boundaries projected from the app's existing GeoJSON. */}
          <svg
            viewBox={atlas.viewBox}
            role="img"
            aria-label="Map of all 50 United States, with Ohio highlighted"
            className="my-4 block h-auto w-full flex-1 overflow-visible sm:my-6"
          >
            {atlas.states.map((state) => (
              <path
                key={state.code}
                d={state.path}
                className={state.code === 'OH'
                  ? 'fill-atlas-featured stroke-atlas'
                  : 'fill-atlas-land stroke-atlas'}
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            ))}
            <text
              x={ohio.center[0]}
              y={ohio.center[1] + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              className="fill-card dark:fill-background"
            >
              OH
            </text>
          </svg>

          <Link
            href="/OH"
            className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:gap-5 sm:p-3.5"
          >
            <Image
              src="/images/state-plates/OH.svg"
              alt=""
              width={600}
              height={300}
              className="h-auto w-20 shrink-0 sm:w-28"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Featured state</p>
              <p className="mt-1 text-[15px] font-semibold sm:text-base">Explore Ohio</p>
            </div>
            <ArrowRight aria-hidden="true" className="ml-auto size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
          </Link>
        </div>
      </div>
    </section>
  );
}
