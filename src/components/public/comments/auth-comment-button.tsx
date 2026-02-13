'use client';

import { Plate } from '@/lib/plates';
import { authClient, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import NewCommentButton from '@/components/public/comments/new-comment-button';
import { useRouter } from 'next/navigation';

interface AuthCommentButtonProps {
  className?: string;
  plate: Plate;
}

const AuthCommentButton: React.FC<AuthCommentButtonProps> = ({
  plate,
  className,
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
  };

  if (!session?.user) {
    return <Button onClick={handleSignIn}>Signin to add comment</Button>;
  }

  return <NewCommentButton plate={plate} />;
};

export default AuthCommentButton;
