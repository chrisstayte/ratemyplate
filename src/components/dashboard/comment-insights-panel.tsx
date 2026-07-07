import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export type DashboardComment = {
  id: number;
  plateId: number;
  comment: string | null;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
  userEmail: string | null;
  userName: string | null;
  plateNumber: string | null;
  state: string | null;
  likeCount: number;
};

export type CommentTheme = {
  term: string;
  count: number;
};

type CommentInsightsPanelProps = {
  comments: DashboardComment[];
  totalComments: number;
  positiveCount: number;
  criticalCount: number;
  averageRating: number | null;
  averageLength: number;
  themes: CommentTheme[];
};

const attentionTerms = [
  'accident',
  'almost',
  'cut off',
  'horrible',
  'lunatic',
  'speed',
  'swearing',
  'yelling',
  'red light',
  'wrong exit',
  'merged',
];

function getAttentionReasons(comment: DashboardComment) {
  const text = comment.comment ?? '';
  const lower = text.toLowerCase();
  const reasons: string[] = [];

  if (comment.rating != null && comment.rating <= 2) {
    reasons.push('low rating');
  }

  const matchedTerm = attentionTerms.find((term) => lower.includes(term));
  if (matchedTerm) {
    reasons.push(matchedTerm);
  }

  const letters = text.replace(/[^a-z]/gi, '');
  const uppercase = text.replace(/[^A-Z]/g, '');
  if (letters.length > 16 && uppercase.length / letters.length > 0.55) {
    reasons.push('high intensity');
  }

  if (text.length > 140) {
    reasons.push('long detail');
  }

  return reasons;
}

function ratingStars(rating: number | null) {
  return Array.from({ length: 5 }).map((_, index) => {
    const filled = rating != null && index < Math.round(rating);
    return (
      <Star
        key={index}
        className={cn(
          'size-3.5',
          filled
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-muted-foreground/35'
        )}
      />
    );
  });
}

export default function CommentInsightsPanel({
  comments,
  totalComments,
  positiveCount,
  criticalCount,
  averageRating,
  averageLength,
  themes,
}: CommentInsightsPanelProps) {
  const attentionCount = comments.filter(
    (comment) => getAttentionReasons(comment).length > 0
  ).length;
  const positivePercent = totalComments
    ? Math.round((positiveCount / totalComments) * 100)
    : 0;
  const criticalPercent = totalComments
    ? Math.round((criticalCount / totalComments) * 100)
    : 0;
  const attentionPercent = comments.length
    ? Math.round((attentionCount / comments.length) * 100)
    : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Comment Signal</CardTitle>
          <CardDescription>
            {comments.length} recent comments analyzed
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Average rating</span>
              <span className="font-medium">
                {averageRating == null ? 'N/A' : averageRating.toFixed(1)}
              </span>
            </div>
            <div className="mt-2 flex gap-0.5">{ratingStars(averageRating)}</div>
          </div>

          <SignalRow label="Positive" value={positivePercent} />
          <SignalRow label="Critical" value={criticalPercent} />
          <SignalRow label="Needs attention" value={attentionPercent} />

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="rounded-lg border bg-background p-2.5">
              <div className="text-xl font-semibold">{averageLength}</div>
              <div className="text-xs text-muted-foreground">avg chars</div>
            </div>
            <div className="rounded-lg border bg-background p-2.5">
              <div className="text-xl font-semibold">{attentionCount}</div>
              <div className="text-xs text-muted-foreground">flagged</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Comment Themes</CardTitle>
          <CardDescription>Terms showing up in reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {themes.length > 0 ? (
              themes.map((theme) => (
                <Badge key={theme.term} variant="outline">
                  {theme.term}
                  <span className="text-muted-foreground">{theme.count}</span>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No themes yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SignalRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}
