import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Heart,
  Mail,
  MessageSquare,
  ShieldCheck,
  Star,
  ThumbsUp,
  UserRound,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { getAdminUserDetail } from '@/db/queries/admin-users';
import '@/lib/extensions';

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

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

function plateHref(id: number | null | undefined) {
  if (!id) return '/dashboard/plates';
  return `/dashboard/plates/${id}`;
}

function getInitials(name: string | null, email: string) {
  return (name || email).getInitials();
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  const detail = await getAdminUserDetail(id);

  if (!detail) {
    notFound();
  }

  const {
    user,
    accountRows,
    roleRows,
    stats,
    sessionRows,
    recentReviews,
    createdPlates,
    favoritePlates,
    likedReviews,
  } = detail;
  const primaryProvider = accountRows[0]?.provider ?? 'none';
  const lastSession = sessionRows[0];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="outline"
            size="icon"
            className={dashboardOutlineButtonClassName}
          >
            <Link href="/dashboard/users" aria-label="Back to users">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Avatar className="size-14">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>{getInitials(user.name, user.email)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-semibold tracking-tight">
              {user.name}
            </h1>
            <p className="truncate text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            <ShieldCheck className="size-3" />
            {user.emailVerified ? 'Verified' : 'Unverified'}
          </Badge>
          <Badge variant="outline">{primaryProvider.capitalize()}</Badge>
          {roleRows.map((role) => (
            <Badge key={role.name}>{role.name}</Badge>
          ))}
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Reviews"
          value={stats.reviewCount}
          icon={MessageSquare}
        />
        <StatCard title="Favorites" value={stats.favoriteCount} icon={Heart} />
        <StatCard
          title="Created Plates"
          value={stats.createdPlateCount}
          icon={UserRound}
        />
        <StatCard
          title="Liked Reviews"
          value={stats.likedReviewCount}
          icon={ThumbsUp}
        />
        <StatCard
          title="Avg Rating"
          value={stats.averageRating == null ? 'N/A' : stats.averageRating.toFixed(1)}
          icon={Star}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>
                Comments this user has posted across plates.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-2xl border bg-background p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={plateHref(review.plateId)}
                            className="font-medium underline-offset-4 hover:underline"
                          >
                            {review.plateNumber} - {review.state}
                          </Link>
                          <Badge variant="outline">
                            {formatDistanceToNow(review.createdAt, {
                              addSuffix: true,
                            })}
                          </Badge>
                          {review.likeCount > 0 && (
                            <Badge variant="outline">
                              <ThumbsUp className="size-3" />
                              {review.likeCount}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-3 whitespace-normal break-words text-sm leading-relaxed">
                          {review.comment ?? 'No comment text.'}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-0.5">
                        {ratingStars(review.rating)}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState>This user has not posted reviews yet.</EmptyState>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liked Reviews</CardTitle>
              <CardDescription>
                Reviews this user has upvoted.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {likedReviews.length > 0 ? (
                likedReviews.map((review) => (
                  <Link
                    key={review.reviewId}
                    href={`/dashboard/comments/${review.reviewId}`}
                    className="rounded-2xl border bg-background p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">
                        {review.plateNumber} - {review.state}
                      </div>
                      <div className="flex gap-0.5">{ratingStars(review.rating)}</div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {review.comment ?? 'No comment text.'}
                    </p>
                  </Link>
                ))
              ) : (
                <EmptyState>This user has not liked any reviews yet.</EmptyState>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="grid gap-6 content-start">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Account and session details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <DetailRow icon={Mail} label="Email" value={user.email} />
              <DetailRow
                icon={Calendar}
                label="Joined"
                value={user.createdAt.prettyDateTime()}
              />
              <DetailRow
                icon={Calendar}
                label="Updated"
                value={user.updatedAt.prettyDateTime()}
              />
              <Separator />
              <div>
                <div className="text-muted-foreground">Last session</div>
                <div className="mt-1 font-medium">
                  {lastSession
                    ? formatDistanceToNow(lastSession.updatedAt, {
                        addSuffix: true,
                      })
                    : 'No sessions'}
                </div>
                {lastSession?.userAgent && (
                  <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">
                    {lastSession.userAgent}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Created Plates</CardTitle>
              <CardDescription>Plates first added by this user.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {createdPlates.length > 0 ? (
                createdPlates.map((plate) => (
                  <PlateRow
                    key={plate.id}
                    plateNumber={plate.plateNumber}
                    state={plate.state}
                    subtitle={`${plate.reviewCount} reviews`}
                    href={plateHref(plate.id)}
                  />
                ))
              ) : (
                <EmptyState>No created plates.</EmptyState>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favorite Plates</CardTitle>
              <CardDescription>Plates saved by this user.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {favoritePlates.length > 0 ? (
                favoritePlates.map((plate) => (
                  <PlateRow
                    key={plate.plateId}
                    plateNumber={plate.plateNumber}
                    state={plate.state}
                    subtitle={formatDistanceToNow(plate.timestamp, {
                      addSuffix: true,
                    })}
                    href={plateHref(plate.plateId)}
                  />
                ))
              ) : (
                <EmptyState>No favorite plates.</EmptyState>
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

function PlateRow({
  plateNumber,
  state,
  subtitle,
  href,
}: {
  plateNumber: string;
  state: string;
  subtitle: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent"
    >
      <div className="min-w-0">
        <div className="truncate font-medium">
          {plateNumber} - {state}
        </div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <Badge variant="outline">{state}</Badge>
    </Link>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-background p-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
