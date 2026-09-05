import type { Metadata } from 'next';
import { getPlateArtwork } from '@/lib/plate-artwork';

export const DEFAULT_SHARE_STATE = 'OH';
export const DEFAULT_SHARE_PLATE = 'R8MYPL8';

/** Keep crawler image requests on the same deployment as the shared page. */
export function getShareMetadataBase(requestHeaders: Pick<Headers, 'get'>) {
  const host =
    requestHeaders.get('x-forwarded-host')?.split(',')[0].trim() ||
    requestHeaders.get('host') ||
    'ratemyplate.wtf';
  const forwardedProtocol = requestHeaders
    .get('x-forwarded-proto')
    ?.split(',')[0].trim();
  const local = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  const protocol =
    forwardedProtocol === 'http' || forwardedProtocol === 'https'
      ? forwardedProtocol
      : local
        ? 'http'
        : 'https';

  return new URL(`${protocol}://${host}`);
}

export function getShareImages(
  state = DEFAULT_SHARE_STATE,
  plateNumber?: string
): Pick<Metadata, 'openGraph' | 'twitter'> {
  const artwork = getPlateArtwork(state);
  const value = plateNumber?.trim().toUpperCase();
  // A new URL lets preview crawlers refresh the previous placeholder image.
  const params = new URLSearchParams({ state: artwork.code, v: 'state-plates-2' });
  if (value) params.set('plate', value);

  const image = {
    url: `/api/og?${params}`,
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: `${artwork.name} license plate: ${value || DEFAULT_SHARE_PLATE}`,
  };

  return {
    openGraph: { siteName: 'Rate My Plate', images: [image] },
    twitter: { card: 'summary_large_image', images: [image] },
  };
}
