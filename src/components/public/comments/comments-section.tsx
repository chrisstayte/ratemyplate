import { eq, and } from 'drizzle-orm';
import { Plate } from '@/lib/plates';
import { desc } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { comments } from '@/db/schema';
import { Badge } from '@/components/ui/badge';
import { database } from '@/db/database';
import LoginDialog from '../login-dialog';
import { auth } from '@/auth';
import NewCommentButton from './new-comment-button';
import { user_favorite_plates } from '@/db/schema';
import FavoritePlateButton from '@/components/public/favorite-plate-button';

interface CommentsSectionProps {
  state: string;
  plateNumber: string;
}

export default async function CommentsSection({
  state,
  plateNumber,
}: CommentsSectionProps) {
  const session = await auth();

  const databasePlate = await database.query.plates.findFirst({
    where: (plates, { eq }) =>
      and(eq(plates.plateNumber, plateNumber), eq(plates.state, state)),
  });

  var isFavorite: boolean = false;

  if (session && databasePlate) {
    isFavorite = await database
      .select()
      .from(user_favorite_plates)
      .where(
        and(
          eq(user_favorite_plates.userId, session!.user!.id!),
          eq(user_favorite_plates.plateId, databasePlate!.id)
        )
      )
      .execute()
      .then((result) => {
        return result.length > 0;
      });
  }

  return (
    <div className='h-full w-full flex flex-col gap-5'>
      <div className='flex flex-col gap-5 sm:flex-row justify-between items-center'>
        <p className='text-2xl'>Comments</p>

        {!session && <LoginDialog buttonTitle='Signin to comment' />}
        {session && (
          <div className='w-full flex flex-row gap-5 justify-between items-center sm:justify-end'>
            <FavoritePlateButton
              isFavorite={isFavorite}
              plate={{ state, plateNumber }}
            />
            <NewCommentButton plate={{ state, plateNumber }} />
          </div>
        )}
      </div>
      <Comments plate={{ state, plateNumber }} />
    </div>
  );
}

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
