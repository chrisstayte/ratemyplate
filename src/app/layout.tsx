import type { Metadata } from 'next';
import { Inconsolata } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-prodiver';
import PlausibleProvider from 'next-plausible';
import { headers } from 'next/headers';
import { getShareImages, getShareMetadataBase } from '@/lib/share-metadata';

const inconsolata = Inconsolata({ subsets: ['latin'], display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: getShareMetadataBase(await headers()),
    title: 'Rate My Plate',
    description: 'Publicly anonymous rating for drivers',
    ...getShareImages(),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider
          domain="ratemyplate.wtf"
          customDomain="https://plausible.chrisstayte.com"
        />
      </head>
      <body className={` ${inconsolata.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
