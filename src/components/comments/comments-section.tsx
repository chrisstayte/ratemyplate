import { eq, and } from 'drizzle-orm';
import { Plate } from '@/lib/plates';

interface CommentsSectionProps {
  state: string;
  plateNumber: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  state,
  plateNumber,
}) => {
  return (
    <div className='container flex flex-col gap-5 py-10 items-center'>
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
  const licensePlate = await database?.query.plates.findFirst({
    where: (plates, { eq }) =>
      and(
        eq(plates.plateNumber, plate.plateNumber),
        eq(plates.state, plate.state)
      ),
  });

  if (!licensePlate) {
    return null;
  }

  const comments = await database?.query.comments.findMany({
    where: (comments, { eq }) => eq(comments.plateId, licensePlate?.id),
  });

  if (!comments || comments.length === 0) {
    return <p>No comments</p>;
  }

  return (
    <div className='flex flex-col gap-5'>
      {comments.map((comment) => (
        <p key={comment.id}>{comment.comment}</p>
      ))}
    </div>
  );
}

export default CommentsSection;
