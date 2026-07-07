import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, isCurrentUserAdmin, signOut } from '@/auth';
import BreadCrumbs from '@/components/bread-crumbs';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
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
          <Link href="/" className="inline-block underline underline-offset-4 hover:text-primary">
            Back to home
          </Link>
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
      <SidebarProvider
        defaultOpen={defaultOpen}
        className="h-svh overflow-hidden bg-muted/40"
      >
        <AppSidebar user={user} signOutAction={handleSignOut} />
        <SidebarInset className="h-svh min-h-0 min-w-0 overflow-hidden">
          <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <BreadCrumbs
              baseHref="/dashboard"
              baseLabel="Dashboard"
              className="min-w-0"
              showBaseWhenRoot
            />
          </header>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-clip bg-muted/30 p-4 pt-0 [overscroll-behavior:none]">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
