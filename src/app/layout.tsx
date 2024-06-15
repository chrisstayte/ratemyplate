import type { Metadata } from 'next';
import { Inconsolata } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import { ThemeProvider } from '@/components/theme-prodiver';

const inconsolata = Inconsolata({ subsets: ['latin'], display: 'swap' });

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
    <html lang='en'>
      <body className={` ${inconsolata.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <Navbar />
          <main className='flex flex-grow'>{children}</main>
          <hr />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
