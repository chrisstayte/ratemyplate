import StatCardsSection from '@/components/dashboard/stat-cards-section';
import PlateStatePieChart from '@/components/dashboard/charts/plate-state-pie-chart';
import OAuthPlatformPieChart from '@/components/dashboard/charts/oauth-platform-pie-chart';
import CommentLengthRadarChart from '@/components/dashboard/charts/comment-length-radar-chart';

export default async function Dashboard() {
  return (
    <div className='container flex flex-col gap-10 py-10 '>
      <div className='flex flex-col gap-5  '>
        <StatCardsSection />
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <PlateStatePieChart />
          <OAuthPlatformPieChart />
          <CommentLengthRadarChart />
        </div>
      </div>
    </div>
  );
}
