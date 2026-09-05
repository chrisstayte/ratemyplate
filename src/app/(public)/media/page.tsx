import type { Metadata } from 'next';
import PlateGallery from '@/components/public/media/plate-gallery';

export const metadata: Metadata = {
  title: 'Plate Media Library | RateMyPlate',
  description: 'Explore all 50 state license plate illustrations. Add your own text or download a blank plate as SVG, PNG, or JPG.',
};

export default function MediaPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:py-10">
      <header className="mb-6 max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Media library</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">A plate for every state.</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Browse all 50 designs. Download a blank plate or add your own text.
        </p>
      </header>
      <PlateGallery />
    </div>
  );
}
