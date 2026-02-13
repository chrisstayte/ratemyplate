import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import '@/lib/extensions';

import FavoritesSection from '@/components/public/favorites-section';

export default async function FavoritesPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect('/');
  }

  return (
    <div className='container w-full flex flex-col py-12'>
      <FavoritesSection />
    </div>
  );
}
