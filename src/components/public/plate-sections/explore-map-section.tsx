import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPinned, MessageSquareText } from 'lucide-react';

export default function ExploreMapSection() {
  return (
    <section aria-labelledby="explore-map-heading" className="w-full">
      <Link
        href="/globe"
        className="group relative isolate block overflow-hidden rounded-[2rem] border border-white/10 bg-[#030725] text-white shadow-[0_24px_70px_-36px_rgba(43,20,122,0.8)] transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-[0_30px_90px_-34px_rgba(109,40,217,0.75)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/40"
      >
        <Image
          src="/images/map/nationwide-plate-activity-wide.png"
          alt=""
          fill
          sizes="(min-width: 768px) 1152px, 0px"
          className="hidden object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.015] md:block"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#030725] via-[#030725]/95 to-[#030725]/5 md:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-[#030725]/70 via-transparent to-[#030725]/20 md:block" />

        <div className="relative z-10 flex min-h-[430px] flex-col justify-center px-7 py-10 sm:px-10 sm:py-12 md:max-w-[55%] md:px-14 lg:max-w-[52%] lg:px-16">
          <div className="mb-6 flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-fuchsia-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-fuchsia-400" />
            </span>
            Nationwide plate activity
          </div>

          <h2
            id="explore-map-heading"
            className="max-w-xl text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-balance sm:text-5xl"
          >
            See what the road is saying
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
            Explore plate activity across the U.S., discover recent reviews,
            and find the road stories happening near you.
          </p>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <MapPinned className="size-4 text-violet-300" />
              All 50 states
            </span>
            <span className="flex items-center gap-2">
              <MessageSquareText className="size-4 text-violet-300" />
              Real community reviews
            </span>
          </div>

          <div className="mt-9 flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#090c2c] shadow-lg shadow-black/20 transition-colors group-hover:bg-violet-100">
            Open the live globe
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>

        <div className="relative z-10 aspect-[16/9] overflow-hidden border-t border-white/10 md:hidden">
          <Image
            src="/images/map/nationwide-plate-activity.png"
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 0px"
            className="object-cover object-right"
          />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#030725] to-transparent" />
        </div>
      </Link>
    </section>
  );
}
