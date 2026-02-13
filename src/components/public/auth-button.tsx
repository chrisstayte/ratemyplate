'use client';

import { authClient, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function AuthButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignIn = async () => {
    router.push('/login');
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  if (!session?.user) {
    return <Button onClick={handleSignIn}>Signin</Button>;
  } else {
    return (
      <Button variant='outline' onClick={handleSignOut}>
        Signout
      </Button>
    );
  }
}

export default AuthButton;
