import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  Car,
  Heart,
  MessageSquare,
  Star,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CommentInsightsPanel, {
  CommentTheme,
  DashboardComment,
} from '@/components/dashboard/comment-insights-panel';
import { dashboardOutlineButtonClassName } from '@/components/dashboard/control-styles';
import { getAdminDashboardData } from '@/db/queries/admin-dashboard';

const recentWindowDays = 30;

const themeStopWords = new Set([
  'about',
  'after',
  'again',
  'almost',
  'around',
  'because',
  'before',
  'being',
  'driver',
  'drivers',
  'drove',
  'front',
  'great',
  'heard',
  'other',
  'people',
  'plate',
  'review',
  'right',
  'their',
  'there',
  'these',
  'thing',
  'this',
  'through',
  'would',
  'without',
]);

function buildThemes(comments: DashboardComment[]): CommentTheme[] {
  const counts = new Map<string, number>();

  for (const item of comments) {
    const words = (item.comment ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3 && !themeStopWords.has(word));

    for (const word of words) {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([term, count]) => ({ term, count }));
}

function adminPlateHref(id: number | null) {
  if (!id) return '/dashboard/plates';
  return `/dashboard/plates/${id}`;
}

export default async function Dashboard() {
  const {
    totalUsers,
    totalPlates,
    totalComments,
    totalFavorites,
    totalLikes,
    recentUsers,
    recentPlates,
    recentCommentsCount,
    ratingStats,
    recentComments,
    topPlates,
    stateRows,
    activeUsers,
    providerRows,
  } = await getAdminDashboardData(recentWindowDays);

  const averageRating = ratingStats.averageRating;
  const themes = buildThemes(recentComments);
  const topProvider = [...providerRows].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 py-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Activity, comment quality, and fast paths into the admin data.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={dashboardOutlineButtonClassName}
          >
            <Link href="/dashboard/comments">Browse Comments</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/plates">Browse Plates</Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Plates"
          value={totalPlates}
          detail={`${recentPlates} in ${recentWindowDays} days`}
          href="/dashboard/plates"
          icon={Car}
        />
        <MetricCard
          title="Users"
          value={totalUsers}
          detail={`${recentUsers} new in ${recentWindowDays} days`}
          href="/dashboard/users"
          icon={Users}
        />
        <MetricCard
          title="Comments"
          value={totalComments}
          detail={`${recentCommentsCount} in ${recentWindowDays} days`}
          href="/dashboard/comments"
          icon={MessageSquare}
        />
        <MetricCard
          title="Favorites"
          value={totalFavorites}
          detail={`${totalLikes} review likes`}
          href="/dashboard/plates"
          icon={Heart}
        />
        <MetricCard
          title="Avg Rating"
          value={averageRating == null ? 'N/A' : averageRating.toFixed(1)}
          detail={
            topProvider ? `${topProvider.provider} leads signups` : 'No providers yet'
          }
          href="/dashboard/comments"
          icon={Star}
        />
      </section>

      <section>
        <CommentInsightsPanel
          comments={recentComments}
          totalComments={totalComments}
          positiveCount={ratingStats.positiveCount}
          criticalCount={ratingStats.criticalCount}
          averageRating={averageRating}
          averageLength={ratingStats.averageLength}
          themes={themes}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Top Plates</CardTitle>
              <CardDescription>Most reviewed or saved</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {topPlates.map((plate) => (
                <Link
                  key={plate.id}
                  href={adminPlateHref(plate.id)}
                  className="rounded-lg border bg-background p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {plate.plateNumber} - {plate.state}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {plate.lastActivity
                          ? formatDistanceToNow(plate.lastActivity, {
                              addSuffix: true,
                            })
                          : 'No activity'}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {plate.averageRating == null
                        ? 'N/A'
                        : plate.averageRating.toFixed(1)}
                      <Star className="size-3" />
                    </Badge>
                  </div>
                  <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
                    <span>{plate.reviewCount} reviews</span>
                    <span>{plate.favoriteCount} favorites</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>State Coverage</CardTitle>
              <CardDescription>Where the data is clustering</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {stateRows.map((row) => (
                <div key={row.state} className="grid gap-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{row.state}</Badge>
                      <span className="text-muted-foreground">
                        {row.plateCount} plates
                      </span>
                    </div>
                    <span className="font-medium">{row.reviewCount} reviews</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.max(
                          8,
                          Math.round((row.plateCount / Math.max(totalPlates, 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>People creating the signal</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {activeUsers.map((user) => (
                <Link
                  key={`${user.id}-${user.provider ?? 'none'}`}
                  href={`/dashboard/users/${user.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">
                      {user.name ?? 'Unknown user'}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="size-3" />
                      {user.commentCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="size-3" />
                      {user.favoriteCount}
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  detail,
  href,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  detail: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link href={href} className="min-w-0">
      <Card size="sm" className="h-full transition-colors hover:bg-accent/60">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
            <div className="mt-2 text-2xl font-semibold leading-none">{value}</div>
          </div>
          <div className="rounded-lg border bg-background p-2">
            <Icon className="size-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="-mt-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="size-3" />
            {detail}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
