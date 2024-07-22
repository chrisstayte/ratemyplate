import type { Metadata } from 'next';
import { Inconsolata } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-prodiver';
import PlausibleProvider from 'next-plausible';

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
      <head>
        <PlausibleProvider
          domain='ratemyplate.wtf'
          customDomain='https://plausible.chrisstayte.com'
        />
      </head>
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
