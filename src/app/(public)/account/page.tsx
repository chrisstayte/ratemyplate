import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { redirect } from 'next/navigation';
import '@/lib/extensions';
import { database } from '@/db/database';
import { desc, eq } from 'drizzle-orm';
import { plate_reviews, plates } from '@/db/schema';
import { DataTable } from '@/components/data-table';
import { commentsColumn } from '@/components/public/comments-columns';
import { Badge } from '@/components/ui/badge';
import BreadCrumbs from '@/components/bread-crumbs';

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  const user = session?.user;
  const userImageUrl = user?.image ?? undefined;
  const initials = user?.name?.getInitials();

  const userData = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user?.id!),
  });

  const userComments = await database
    .select({
      userId: plate_reviews.userId,
      comment: plate_reviews.comment,
      timestamp: plate_reviews.createdAt,
      plateNumber: plates.plateNumber,
      state: plates.state,
    })
    .from(plate_reviews)
    .where(eq(plate_reviews.userId, user?.id!))
    .leftJoin(plates, eq(plate_reviews.plateId, plates.id))
    .orderBy(desc(plate_reviews.createdAt));

  return (
    <div className="container w-full flex flex-col gap-5 pt-5">
      <BreadCrumbs />
      <div className="w-full rounded-xl border bg-card py-10">
        <div className="text-foreground flex flex-col justify-center items-center gap-3">
          <Avatar className="size-28 pointer-events-none">
            <AvatarImage src={userImageUrl} alt="user image" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-display text-4xl">{user?.name}</h1>
            <p className="text-base text-muted-foreground">{user?.email ?? ''}</p>
            <Badge variant="secondary" className="mt-2 text-sm">
              Joined {userData?.createdAt.toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>
      <div className=" w-full flex flex-col gap-5">
        <h2 className="font-display text-3xl">Comments</h2>
        <DataTable
          columns={commentsColumn}
          data={userComments}
          className="w-full"
        />
      </div>
    </div>
  );
}
