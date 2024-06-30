import type { Metadata } from 'next';
import { Inconsolata } from 'next/font/google';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import { ThemeProvider } from '@/components/theme-prodiver';

export const metadata: Metadata = {
  title: 'Rate My Plate',
  description: 'Anonymous rating for drivers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`flex flex-col min-h-screen`}>
      <main className='flex flex-grow'>{children}</main>
      <hr />
    </div>
  );
}
