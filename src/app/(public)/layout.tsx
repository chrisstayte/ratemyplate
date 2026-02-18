import type { Metadata } from 'next';
import Navbar from '@/components/public/navbar/navbar';
import Footer from '@/components/public/footer/footer';

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
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='grow'>{children}</main>
      <hr />
      <Footer />
    </div>
  );
}
