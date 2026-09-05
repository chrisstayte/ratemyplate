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
      className="w-full scroll-mt-24 overflow-hidden rounded-xl border border-[#dcded4] bg-[#f6f5ef] font-sans text-[#28352b] dark:border-[#3b4238] dark:bg-[#252a24] dark:text-[#f0f1e8]"
    >
      <div className="grid md:grid-cols-[0.88fr_1.12fr]">
        <div className="flex flex-col items-start px-6 py-8 sm:px-10 sm:py-12 md:px-7 lg:px-12 lg:py-14">
          <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#657260] dark:text-[#aebaa5]">
            <Globe2 aria-hidden="true" className="size-4" strokeWidth={1.5} />
            Explore America
          </div>

          <h2
            id="explore-map-heading"
            className="mt-6 text-[48px] leading-[1.02] tracking-[-0.045em] sm:mt-7 sm:text-[64px] md:text-[52px] lg:text-[66px]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            The road,
            <br />
            <span className="italic">reviewed.</span>
          </h2>
          <p className="mt-6 max-w-[32ch] text-[15px] leading-7 text-[#647060] dark:text-[#b4beae] sm:text-base">
            Get a local perspective on the drivers around you. Explore ratings
            and reviews, one state at a time.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-8">
            <Link
              href="/globe"
              className="inline-flex min-h-11 items-center gap-4 rounded-md bg-[#304a36] px-4 py-3 text-sm font-semibold text-[#fffef5] transition-colors hover:bg-[#203c27] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#304a36] dark:bg-[#dce5cf] dark:text-[#253525] dark:hover:bg-[#edf3e6] dark:focus-visible:outline-[#dce5cf]"
            >
              Explore the globe
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              href="/map"
              className="inline-flex min-h-11 items-center border-b border-transparent text-sm font-medium underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              State map
            </Link>
          </div>

          <div className="mt-10 hidden items-center gap-3 border-t border-[#d9ddcf] pt-5 text-xs text-[#6d7667] dark:border-[#41493b] dark:text-[#a5b19b] sm:flex lg:mt-auto lg:w-full lg:pt-6">
            <span className="text-lg font-medium tabular-nums text-[#394835] dark:text-[#dce5cf]">50</span>
            states. A local view of every one.
          </div>
        </div>

        <div className="flex min-w-0 flex-col border-t border-[#dcded4] bg-[#eeeee5] px-5 pb-5 pt-6 dark:border-[#3b4238] dark:bg-[#20251f] sm:px-8 sm:pb-7 md:border-l md:border-t-0 lg:pt-9">
          <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#737d6b] dark:text-[#9ca78f]">
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
                  ? 'fill-[#b16a43] stroke-[#eeeee5] dark:fill-[#d89a6b] dark:stroke-[#20251f]'
                  : 'fill-[#d3d9c8] stroke-[#eeeee5] dark:fill-[#414c39] dark:stroke-[#20251f]'}
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
              className="fill-white dark:fill-[#282c22]"
            >
              OH
            </text>
          </svg>

          <Link
            href="/OH"
            className="group flex items-center gap-3 rounded-lg border border-[#d5dbcc] bg-[#f8f8f1] p-3 transition-colors hover:border-[#a6b39a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#304a36] dark:border-[#46513e] dark:bg-[#2c3428] dark:hover:border-[#81946e] dark:focus-visible:outline-[#dce5cf] sm:gap-5 sm:p-3.5"
          >
            <Image
              src="/images/state-plates/OH.svg"
              alt=""
              width={600}
              height={300}
              className="h-auto w-20 shrink-0 sm:w-28"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#79826f] dark:text-[#a8b59b]">Featured state</p>
              <p className="mt-1 text-[15px] font-semibold sm:text-base">Explore Ohio</p>
            </div>
            <ArrowRight aria-hidden="true" className="ml-auto size-4 shrink-0 text-[#65765a] transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none dark:text-[#c3d0b5]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
