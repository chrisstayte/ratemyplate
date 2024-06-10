import { eq, and } from 'drizzle-orm';
import { Plate } from '@/lib/plates';
import { Button } from '@/components/ui/button';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AuthCommentButton from '@/components/comments/auth-comment-button';

interface CommentsSectionProps {
  state: string;
  plateNumber: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  state,
  plateNumber,
}) => {
  return (
    <div className='h-full w-full flex flex-col gap-10'>
      <div className='flex flex-col gap-5 sm:flex-row justify-between items-center'>
        <p className='text-2xl'>Comments</p>
        <AuthCommentButton plate={{ plateNumber, state }} />
      </div>
      <div className='container flex flex-col gap-5 py-10 items-center'>
        <Comments plate={{ state, plateNumber }} />
      </div>
    </div>
  );
};

async function Comments({
  limit = 10,
  plate,
}: {
  limit?: number;
  plate: Plate;
}) {
  const licensePlate = await database?.query.plates.findFirst({
    where: (plates, { eq }) =>
      and(
        eq(plates.plateNumber, plate.plateNumber),
        eq(plates.state, plate.state)
      ),
  });

  if (!licensePlate) {
    return <p>No comments yet</p>;
  }

  const comments = await database?.query.comments.findMany({
    where: (comments, { eq }) => eq(comments.plateId, licensePlate?.id),
  });

  if (!comments || comments.length === 0) {
    return <p>No comments yet</p>;
  }

  return (
    <div className='flex flex-col gap-5'>
      {comments.map((comment) => (
        <p key={comment.id}>{comment.comment}</p>
      ))}
    </div>
  );
}

function CommentsSkeleton({ limit = 10 }) {
  const skeletons = Array.from({ length: limit });

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
      {skeletons.map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  );
}

function CommentSkeleton() {
  return (
    <Card className='aspect-video flex flex-col justify-center items-center'>
      <div className='flex flex-col h-full relative p-1 w-full items-center'>
        <Skeleton className='w-full max-w-[50px] h-[20px] ' />
        <div className='absolute inset-0 flex items-center justify-center uppercase'>
          <Skeleton className='w-full max-w-[100px] h-[20px] ' />
        </div>
      </div>
    </Card>
  );
}

export default CommentsSection;
