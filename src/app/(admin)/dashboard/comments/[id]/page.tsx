import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Car,
  ExternalLink,
  Mail,
  MessageSquare,
  Star,
  ThumbsUp,
  Trash,
  UserRound,
} from 'lucide-react';
import { deleteComment } from '@/app/actions';
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
import { getAdminCommentDetail } from '@/db/queries/admin-comments';
import '@/lib/extensions';

type CommentDetailPageProps = {
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

function publicPlateHref(state: string | null, plateNumber: string | null) {
  if (!state || !plateNumber) return null;
  return `/${encodeURIComponent(state.toLowerCase())}/${encodeURIComponent(
    plateNumber.toLowerCase()
  )}`;
}

function ratingLabel(rating: number | null) {
  if (rating == null) return 'Unrated';
  if (rating <= 2) return 'Critical';
  if (rating >= 4) return 'Positive';
  return 'Mixed';
}

export default async function CommentDetailPage({
  params,
}: CommentDetailPageProps) {
  const { id } = await params;
  const commentId = parseId(id);

  if (!commentId) {
    notFound();
  }

  const detail = await getAdminCommentDetail(commentId);

  if (!detail) {
    notFound();
  }

  const { comment, likedByRows } = detail;
  const publicHref = publicPlateHref(comment.state, comment.plateNumber);

  async function deleteReviewAction() {
    'use server';
    await deleteComment(comment.id);
    redirect('/dashboard/comments');
  }

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
            <Link href="/dashboard/comments" aria-label="Back to comments">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-3xl font-semibold tracking-tight">
                Comment #{comment.id}
              </h1>
              <Badge variant="outline">{ratingLabel(comment.rating)}</Badge>
              {comment.likeCount > 0 && (
                <Badge variant="outline">
                  <ThumbsUp />
                  {comment.likeCount}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Posted {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            variant="outline"
            className={dashboardOutlineButtonClassName}
          >
            <Link href={`/dashboard/plates/${comment.plateId}`}>
              <Car />
              Plate
            </Link>
          </Button>
          {publicHref && (
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
          )}
          <form action={deleteReviewAction}>
            <Button type="submit" variant="destructive">
              <Trash />
              Delete
            </Button>
          </form>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Comment</CardTitle>
              <CardDescription>Full review text and rating.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-0.5">{ratingStars(comment.rating)}</div>
                <Badge variant="outline">
                  {comment.rating == null ? 'No rating' : `${comment.rating}/5`}
                </Badge>
              </div>
              <p className="whitespace-normal break-words rounded-xl border bg-background p-4 text-sm leading-relaxed">
                {comment.comment ?? 'No comment text.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liked By</CardTitle>
              <CardDescription>Users who upvoted this review.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {likedByRows.length > 0 ? (
                likedByRows.map((like) => (
                  <Link
                    key={like.userId}
                    href={`/dashboard/users/${like.userId}`}
                    className="rounded-lg border bg-background p-3 transition-colors hover:bg-accent"
                  >
                    <div className="truncate font-medium">
                      {like.name ?? 'Unknown user'}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {like.email ?? like.userId}
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState>No likes yet.</EmptyState>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Context</CardTitle>
              <CardDescription>Plate, author, and timestamps.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <DetailLink
                icon={Car}
                label="Plate"
                href={`/dashboard/plates/${comment.plateId}`}
                value={
                  comment.plateNumber && comment.state
                    ? `${comment.plateNumber} - ${comment.state}`
                    : `Plate #${comment.plateId}`
                }
              />
              <DetailLink
                icon={UserRound}
                label="Author"
                href={`/dashboard/users/${comment.authorId}`}
                value={comment.authorEmail ?? comment.authorName ?? comment.authorId}
              />
              <Separator />
              <DetailRow
                icon={Calendar}
                label="Created"
                value={comment.createdAt.prettyDateTime()}
              />
              <DetailRow
                icon={Calendar}
                label="Updated"
                value={comment.updatedAt.prettyDateTime()}
              />
              <Separator />
              <DetailRow
                icon={MessageSquare}
                label="Comment ID"
                value={String(comment.id)}
              />
              <DetailRow
                icon={Mail}
                label="Author ID"
                value={comment.authorId}
              />
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
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

function DetailLink({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 text-muted-foreground" />
      <div className="min-w-0">
        <div className="text-muted-foreground">{label}</div>
        <Link
          href={href}
          className="block truncate font-medium underline-offset-4 hover:underline"
        >
          {value}
        </Link>
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
