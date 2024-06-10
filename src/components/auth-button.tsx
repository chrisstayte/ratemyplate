import { signIn, signOut, auth } from '@/auth';
import { Button } from '@/components/ui/button';

async function AuthButton() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          'use server';
          await signIn();
        }}>
        <Button type='submit'>Signin</Button>
      </form>
    );
  } else {
    return (
      <form
        action={async () => {
          'use server';
          await signOut();
        }}>
        <Button variant='outline' type='submit'>
          Signout
        </Button>
      </form>
    );
  }
}

export default AuthButton;
