'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import '@/lib/extensions';

const AppRoutes = {
  HOME: '/',
};

const routeToLabelMap: Record<string, string> = {
  // Add mappings here if needed
};

interface BreadCrumbsProps {
  className?: string;
  baseHref?: string;
  baseLabel?: string;
  showBaseWhenRoot?: boolean;
}

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const formatBreadcrumbLabel = (label: string, isUUID: boolean) => {
  if (isUUID) return label;

  const decoded = safeDecodeURIComponent(label);

  if (!decoded.includes('-')) return decoded.capitalize();

  return decoded
    .split('-')
    .filter(Boolean)
    .map((word) => word.capitalize())
    .join(' ');
};

const getPathSegments = (path: string) => path.split('/').filter(Boolean);

const BreadCrumbs = ({
  className,
  baseHref = AppRoutes.HOME,
  baseLabel = 'Home',
  showBaseWhenRoot = false,
}: BreadCrumbsProps) => {
  const pathname = usePathname();
  const pathSegments = getPathSegments(pathname);
  const basePathSegments = getPathSegments(baseHref);
  const isInBasePath =
    basePathSegments.length > 0 &&
    basePathSegments.every((segment, index) => pathSegments[index] === segment);
  const visiblePathSegments = isInBasePath
    ? pathSegments.slice(basePathSegments.length)
    : pathSegments;

  const breadcrumbs = visiblePathSegments.map((segment, index) => {
    const href = `/${[
      ...(isInBasePath ? basePathSegments : []),
      ...visiblePathSegments.slice(0, index + 1),
    ].join('/')}`;
    const label = routeToLabelMap[href] || segment;
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        label
      );

    return {
      href,
      label,
      isUUID,
      displayLabel: formatBreadcrumbLabel(label, isUUID),
    };
  });

  if (!breadcrumbs.length && !showBaseWhenRoot) return null;

  return (
    <Breadcrumb className={cn(className, 'select-none')}>
      <BreadcrumbList>
        <BreadcrumbLink href={baseHref}>{baseLabel}</BreadcrumbLink>
        {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index < breadcrumbs.length - 1 ? (
                <BreadcrumbLink href={crumb.href}>
                  {crumb.displayLabel}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.displayLabel}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;
