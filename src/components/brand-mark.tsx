import type { SVGProps } from 'react';

/** The shared plate-and-star logo. Exported icons use this same artwork. */
export function BrandMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <rect x="2.5" y="6.5" width="27" height="19" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M6.5 16H8M24 16h1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m16 10.5 1.7 3.45 3.8.55-2.75 2.68.65 3.79L16 19.18l-3.4 1.79.65-3.79-2.75-2.68 3.8-.55Z" fill="currentColor" />
    </svg>
  );
}
