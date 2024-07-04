import type { Metadata } from 'next';
import Navbar from '@/components/dashboard/navbar/navbar';
import { isCurrentUserAdmin } from '@/auth';

export const metadata: Metadata = {
  title: 'Rate My Plate',
  description: 'Anonymous rating for drivers',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await isCurrentUserAdmin();

  return (
    <div className={`flex flex-col min-h-screen`}>
      {isAdmin && <Navbar />}
      <main className='flex flex-grow'>{children}</main>
      <hr />
    </div>
  );
}
