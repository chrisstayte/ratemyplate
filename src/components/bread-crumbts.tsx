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

const BreadCrumbs = ({ className }: BreadCrumbsProps) => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
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

  if (!breadcrumbs.length) return null;

  return (
    <Breadcrumb className={cn(className, 'select-none')}>
      <BreadcrumbList>
        <BreadcrumbLink href={AppRoutes.HOME}>Dashboard</BreadcrumbLink>
        <BreadcrumbSeparator />
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
