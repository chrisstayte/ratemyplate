import type { Metadata } from 'next';
import { Inconsolata } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-prodiver';
import PlausibleProvider from 'next-plausible';

const inconsolata = Inconsolata({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Rate My Plate',
    template: '%s | Rate My Plate',
  },
  description:
    'Rate and review drivers anonymously by license plate. Share your experiences and help make roads safer.',
  metadataBase: new URL(
    process.env.BETTER_AUTH_URL ?? 'https://ratemyplate.wtf'
  ),
  openGraph: {
    title: 'Rate My Plate',
    description:
      'Rate and review drivers anonymously by license plate. Share your experiences and help make roads safer.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Rate My Plate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rate My Plate',
    description:
      'Rate and review drivers anonymously by license plate. Share your experiences and help make roads safer.',
  },
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
