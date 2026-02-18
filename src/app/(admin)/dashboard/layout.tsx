import type { Metadata } from 'next';
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
    return null;
  }

  const session = await auth();
  const user = {
    name: session?.user?.name ?? null,
    image: session?.user?.image ?? null,
  };

  async function handleSignOut() {
    'use server';
    await signOut();
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
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
