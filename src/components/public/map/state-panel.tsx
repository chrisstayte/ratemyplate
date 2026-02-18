'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Loader2, Search } from 'lucide-react';
import { getRecentCommentsByState } from '@/app/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const [searchPlate, setSearchPlate] = useState('');
  const router = useRouter();

  useEffect(() => {
    startTransition(async () => {
      const results = await getRecentCommentsByState(stateAbbreviation);
      setComments(results);
    });
  }, [stateAbbreviation]);

  const sortedComments = [...comments].sort((a, b) => {
    const ta = new Date(a.timestamp).getTime();
    const tb = new Date(b.timestamp).getTime();
    return sortOrder === 'recent' ? tb - ta : ta - tb;
  });

  const handleSearch = () => {
    const trimmed = searchPlate.trim().toUpperCase();
    if (!trimmed) return;
    router.push(`/plate?plate=${trimmed}&state=${stateAbbreviation}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className='absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] z-10 flex flex-col'
    >
      <Card className='flex flex-col shadow-lg max-h-full'>
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
          <div className='flex gap-2 mt-2'>
            <Input
              placeholder='Search plate...'
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className='h-8 text-sm'
            />
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8 shrink-0'
              onClick={handleSearch}
            >
              <Search className='h-3.5 w-3.5' />
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
              <Select
                value={sortOrder}
                onValueChange={(v) => setSortOrder(v as 'recent' | 'oldest')}
              >
                <SelectTrigger className='h-8 text-xs w-fit'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='recent'>Most Recent</SelectItem>
                  <SelectItem value='oldest'>Oldest First</SelectItem>
                </SelectContent>
              </Select>
              {sortedComments.map((comment, i) => {
                const text = comment.commentText;
                const truncated = text.length > 100;
                return (
                  <Link
                    key={`${comment.plateNumber}-${i}`}
                    href={`/plate?plate=${comment.plateNumber}&state=${stateAbbreviation}`}
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
                    <p className='text-muted-foreground'>
                      {truncated ? text.slice(0, 100) + '...' : text}
                      {truncated && (
                        <span className='text-primary ml-1 text-xs'>
                          read more
                        </span>
                      )}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
