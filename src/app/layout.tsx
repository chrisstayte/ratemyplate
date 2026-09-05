import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-prodiver';
import PlausibleProvider from 'next-plausible';
import { headers } from 'next/headers';
import { getShareImages, getShareMetadataBase } from '@/lib/share-metadata';
import { instrumentSans, instrumentSerif } from '@/lib/typography';

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
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <PlausibleProvider
          domain="ratemyplate.wtf"
          customDomain="https://plausible.chrisstayte.com"
        />
      </head>
      <body className="font-sans antialiased">
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
