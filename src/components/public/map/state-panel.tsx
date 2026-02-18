'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { getRecentCommentsByState } from '@/app/actions';
import Link from 'next/link';

type Comment = {
  commentText: string;
  plateNumber: string;
  timestamp: Date;
};

type StatePanelProps = {
  stateAbbreviation: string;
  stateName: string;
  plateCount: number;
  onClose: () => void;
};

export default function StatePanel({
  stateAbbreviation,
  stateName,
  plateCount,
  onClose,
}: StatePanelProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const results = await getRecentCommentsByState(stateAbbreviation);
      setComments(results);
    });
  }, [stateAbbreviation]);

  return (
    <Card className='absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] z-10 flex flex-col shadow-lg'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex flex-col gap-1'>
            <CardTitle className='text-lg'>{stateName}</CardTitle>
            <div className='flex gap-2'>
              <Badge variant='secondary'>{stateAbbreviation}</Badge>
              <Badge variant='outline'>
                {plateCount} {plateCount === 1 ? 'plate' : 'plates'}
              </Badge>
            </div>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 shrink-0'
            onClick={onClose}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='flex-1 overflow-y-auto pt-0'>
        {isPending ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
          </div>
        ) : comments.length === 0 ? (
          <p className='text-sm text-muted-foreground py-4 text-center'>
            No comments yet for this state.
          </p>
        ) : (
          <div className='flex flex-col gap-3'>
            {comments.map((comment, i) => (
              <Link
                key={`${comment.plateNumber}-${i}`}
                href={`/plate?plate=${encodeURIComponent(comment.plateNumber)}&state=${encodeURIComponent(stateAbbreviation)}`}
                className='rounded-md border p-3 text-sm block hover:bg-accent transition-colors'
              >
                <div className='flex items-center justify-between mb-1'>
                  <span className='font-mono font-semibold'>
                    {comment.plateNumber}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className='text-muted-foreground'>{comment.commentText}</p>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
