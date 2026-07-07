export const dashboardControlClassName =
  'border-border bg-card hover:border-ring/40 hover:bg-card focus-visible:border-ring/50 focus-visible:ring-ring/20';

export const dashboardInputClassName =
  `${dashboardControlClassName} placeholder:text-muted-foreground/75`;

export const dashboardSelectTriggerClassName = dashboardControlClassName;

export const dashboardToggleClassName =
  `${dashboardControlClassName} aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary aria-pressed:hover:text-primary-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground`;

export const dashboardToolbarClassName =
  'flex flex-wrap items-center gap-2';

export const dashboardOutlineButtonClassName =
  `${dashboardControlClassName} hover:bg-card`;
