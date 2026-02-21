import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth, isCurrentUserAdmin, signOut } from '@/auth';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'Rate My Plate',
  description: 'Anonymous rating for drivers',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Not Authorized</h1>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access this page.
          </p>
          <a href="/" className="inline-block underline underline-offset-4 hover:text-primary">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  const session = await auth();
  const user = {
    name: session?.user?.name ?? null,
    image: session?.user?.image ?? null,
  };

  async function handleSignOut() {
    'use server';
    await signOut();
    redirect('/');
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar user={user} signOutAction={handleSignOut} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </header>
          <div className="flex flex-1 flex-col p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
