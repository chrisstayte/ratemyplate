import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Heart,
  Mail,
  MessageSquare,
  Star,
  ThumbsUp,
  UserRound,
} from 'lucide-react';
import LicensePlate from '@/components/public/license-plate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { dashboardOutlineButtonClassName } from '@/components/dashboard/control-styles';
import { Separator } from '@/components/ui/separator';
import { getAdminPlateDetail } from '@/db/queries/admin-plates';
import '@/lib/extensions';

type PlateDetailPageProps = {
  params: Promise<{ id: string }>;
};

function parseId(id: string) {
  if (!/^\d+$/.test(id)) return null;
  const value = Number(id);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

function ratingStars(rating: number | null) {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={
        rating != null && index < Math.round(rating)
          ? 'size-4 fill-yellow-400 text-yellow-400'
          : 'size-4 text-muted-foreground/35'
      }
    />
  ));
}

function publicPlateHref(state: string, plateNumber: string) {
  return `/${encodeURIComponent(state.toLowerCase())}/${encodeURIComponent(
    plateNumber.toLowerCase()
  )}`;
}

export default async function PlateDetailPage({
  params,
}: PlateDetailPageProps) {
  const { id } = await params;
  const plateId = parseId(id);

  if (!plateId) {
    notFound();
  }

  const detail = await getAdminPlateDetail(plateId);

  if (!detail) {
    notFound();
  }

  const {
    plate,
    reviewStats,
    favoriteCount,
    likeCount,
    reviewRows,
    favoriteRows,
  } = detail;
  const averageRating = reviewStats.averageRating;
  const publicHref = publicPlateHref(plate.state, plate.plateNumber);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Button
            asChild
            variant="outline"
            size="icon"
            className={dashboardOutlineButtonClassName}
          >
            <Link href="/dashboard/plates" aria-label="Back to plates">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-3xl font-semibold tracking-tight">
                {plate.plateNumber} - {plate.state}
              </h1>
              <Badge variant="outline">ID {plate.id}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              First reported {formatDistanceToNow(plate.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            variant="outline"
            className={dashboardOutlineButtonClassName}
          >
            <Link href={publicHref}>
              <ExternalLink />
              Public Page
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/comments?q=${encodeURIComponent(plate.plateNumber)}`}>
              <MessageSquare />
              Comments
            </Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Reviews"
          value={reviewStats?.reviewCount ?? 0}
          icon={MessageSquare}
        />
        <StatCard title="Favorites" value={favoriteCount} icon={Heart} />
        <StatCard title="Review Likes" value={likeCount} icon={ThumbsUp} />
        <StatCard
          title="Avg Rating"
          value={averageRating == null ? 'N/A' : averageRating.toFixed(1)}
          icon={Star}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>
                Latest comments and ratings for this plate.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {reviewRows.length > 0 ? (
                reviewRows.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-xl border bg-background p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/dashboard/comments/${review.id}`}
                            className="font-medium underline-offset-4 hover:underline"
                          >
                            Comment #{review.id}
                          </Link>
                          <Badge variant="outline">
                            {formatDistanceToNow(review.createdAt, {
                              addSuffix: true,
                            })}
                          </Badge>
                          {review.likeCount > 0 && (
                            <Badge variant="outline">
                              <ThumbsUp />
                              {review.likeCount}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-3 whitespace-normal break-words text-sm leading-relaxed">
                          {review.comment ?? 'No comment text.'}
                        </p>
                        <Link
                          href={`/dashboard/users/${review.authorId}`}
                          className="mt-3 inline-flex max-w-full items-center gap-2 truncate text-xs text-muted-foreground underline-offset-4 hover:underline"
                        >
                          <Mail className="size-3" />
                          <span className="truncate">
                            {review.authorEmail ?? review.authorName ?? 'Unknown user'}
                          </span>
                        </Link>
                      </div>
                      <div className="flex shrink-0 gap-0.5">
                        {ratingStars(review.rating)}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState>No reviews for this plate.</EmptyState>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="grid content-start gap-6">
          <Card>
            <CardContent className="flex justify-center pt-6">
              <LicensePlate
                plate={{ state: plate.state, plateNumber: plate.plateNumber }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plate Details</CardTitle>
              <CardDescription>Record metadata and ownership.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <DetailRow
                icon={Calendar}
                label="First reported"
                value={plate.timestamp.prettyDateTime()}
              />
              <DetailRow
                icon={Calendar}
                label="Last activity"
                value={
                  reviewStats?.lastActivity
                    ? reviewStats.lastActivity.prettyDateTime()
                    : 'No review activity'
                }
              />
              <Separator />
              <div className="grid gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserRound className="size-4" />
                  Creator
                </div>
                {plate.creatorId ? (
                  <Link
                    href={`/dashboard/users/${plate.creatorId}`}
                    className="truncate font-medium underline-offset-4 hover:underline"
                  >
                    {plate.creatorEmail ?? plate.creatorName ?? plate.creatorId}
                  </Link>
                ) : (
                  <div className="font-medium">Unknown</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favorited By</CardTitle>
              <CardDescription>Users who saved this plate.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {favoriteRows.length > 0 ? (
                favoriteRows.map((favorite) =>
                  favorite.userId ? (
                    <Link
                      key={favorite.userId}
                      href={`/dashboard/users/${favorite.userId}`}
                      className="rounded-lg border bg-background p-3 transition-colors hover:bg-accent"
                    >
                      <div className="truncate font-medium">
                        {favorite.name ?? 'Unknown user'}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {favorite.email ?? favorite.userId}
                      </div>
                    </Link>
                  ) : null
                )
              ) : (
                <EmptyState>No favorites yet.</EmptyState>
              )}
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
          <div className="mt-3 text-3xl font-semibold">{value}</div>
        </div>
        <div className="rounded-lg border bg-background p-2">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
    </Card>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 text-muted-foreground" />
      <div className="min-w-0">
        <div className="text-muted-foreground">{label}</div>
        <div className="truncate font-medium">{value}</div>
      </div>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
