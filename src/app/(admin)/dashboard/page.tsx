'use server';

import { auth, isUserAdmin } from '@/auth';
import NotAuthenticated from '@/components/dashboard/not-authenticated';
import StatCard from '@/components/dashboard/stat-card';

import LoginPage from '@/components/dashboard/login-page';
import type { Metadata } from 'next';
import StatCardsSection from '@/components/dashboard/stat-cards-section';
import PlateStatePieChart from '@/components/dashboard/charts/plate-state-pie-chart';
import OAuthPlatformPieChart from '@/components/dashboard/charts/oauth-platform-pie-chart';
import CommentLengthRadarChart from '@/components/dashboard/charts/comment-length-radar-chart';

// export const metadata: Metadata = {
//   title: `Dashboard`,
//   description: `RateMyPlate admin dashboard`,
// };

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    return <LoginPage />;
  }

  const user = session.user;

  const isAdmin = await isUserAdmin(user!.id!);

  if (!isAdmin) {
    return <NotAuthenticated />;
  }

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
