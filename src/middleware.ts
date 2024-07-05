import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname;
  const fullPath = url.pathname + url.search;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  requestHeaders.set('x-origin', origin);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-fullPath', fullPath);

  // Define the paths where you want the middleware to run
  const paths = ['/', '/plate'];

  if (paths.some((path) => path === pathname)) {
    console.log('x-fullPath: ', fullPath);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
