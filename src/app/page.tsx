import LicensePlateInputCard from '@/components/license-plate-input-card';
import RecentEntriesSection from '@/components/recent-entries/recent-entries-section';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='container flex flex-col gap-5 py-10 items-center'>
      <div className='flex flex-col gap-5  min-h-36 justify-center items-center'>
        <p className='text-5xl text-center'>RateMyPlate</p>
        <p className='text-lg text-center'>
          See what others are saying. Share your own experiences. Stay
          anonymous.
        </p>
      </div>
      <LicensePlateInputCard />
      <RecentEntriesSection />
    </div>
  );
}
