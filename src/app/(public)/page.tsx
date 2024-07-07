import SearchCard from '@/components/public/search-card/search-card';
import RecentEntriesSection from '@/components/public/plate-sections/recent-commented-plates-section';
import PopularEntriesSection from '@/components/public/plate-sections/popular-plates-section';
import MostFavoritedPlatesSection from '@/components/public/plate-sections/most-favorites-plates-section';

export default function Home() {
  return (
    <div className='container flex flex-col gap-10 py-10 items-center'>
      <div className='flex flex-col gap-5  min-h-36 justify-center items-center'>
        <p className='text-5xl text-center'>R8MYPL8</p>
        <p className='text-lg text-center'>
          See what others are saying. Share your own experiences. Stay
          anonymous.
        </p>
      </div>
      <SearchCard />
      <PopularEntriesSection />
      <RecentEntriesSection />
      <MostFavoritedPlatesSection />
    </div>
  );
}
