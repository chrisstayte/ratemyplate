import type { Metadata } from 'next';
import { Inconsolata } from 'next/font/google';
import './globals.css';
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
      <body className={` ${inconsolata.className}`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <main className=''>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
