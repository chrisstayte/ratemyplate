import { Plate } from '@/lib/plates';
import { signIn, auth } from '@/auth';
import { Button } from '@/components/ui/button';
import NewCommentButton from '@/components/public/comments/new-comment-button';

interface AuthCommentButtonProps {
  className?: string;
  plate: Plate;
}

const AuthCommentButton: React.FC<AuthCommentButtonProps> = async ({
  plate,
  className,
}) => {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          'use server';
          await signIn();
        }}>
        <Button type='submit'>Signin to add comment</Button>
      </form>
    );
  }

  return <NewCommentButton plate={plate} />;
};

export default AuthCommentButton;
