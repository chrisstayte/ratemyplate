import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import '@/lib/extensions';

import FavoritesSection from '@/components/public/favorites-section';
import BreadCrumbs from '@/components/bread-crumbs';

export default async function FavoritesPage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="max-w-6xl px-5 mx-auto w-full flex flex-col pt-5 gap-5 pb-10">
      <BreadCrumbs />
      <FavoritesSection />
    </div>
  );
}
