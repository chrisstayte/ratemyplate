import type { Metadata } from 'next';
import { Inconsolata } from 'next/font/google';
import Navbar from '@/components/dashboard/navbar';
import Footer from '@/components/public/footer/footer';
import { ThemeProvider } from '@/components/theme-prodiver';
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
