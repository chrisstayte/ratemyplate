import { eq, and } from 'drizzle-orm';
import { Plate } from '@/lib/plates';
import { desc } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { comments } from '@/db/schema';
import AuthCommentButton from '@/components/comments/auth-comment-button';
import { Badge } from '@/components/ui/badge';
import { database } from '@/db/database';

interface CommentsSectionProps {
  state: string;
  plateNumber: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  state,
  plateNumber,
}) => {
  return (
    <div className='h-full w-full flex flex-col gap-5'>
      <div className='flex flex-col gap-5 sm:flex-row justify-between items-center'>
        <p className='text-2xl'>Comments</p>
        <AuthCommentButton plate={{ plateNumber, state }} />
      </div>
      <Comments plate={{ state, plateNumber }} />
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
  const licensePlate = await database.query.plates.findFirst({
    where: (plates, { eq }) =>
      and(
        eq(plates.plateNumber, plate.plateNumber),
        eq(plates.state, plate.state)
      ),
  });

  if (!licensePlate) {
    return <p>No comments yet</p>;
  }

  const plateComments = await database.query.comments.findMany({
    where: (comments, { eq }) => eq(comments.plateId, licensePlate?.id),
    orderBy: [desc(comments.timestamp)],
  });

  if (!plateComments || plateComments.length === 0) {
    return <p>No comments yet</p>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      {plateComments.map((comment) => (
        <Card
          key={comment.id}
          className=' flex flex-col justify-center items-center p-3 h-full '>
          <div className='flex flex-col justify-between content-between h-full w-full gap-5'>
            <p>{comment.comment}</p>
            <Badge className='self-end'>
              {new Date(comment.timestamp!).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </Badge>
          </div>
        </Card>
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
