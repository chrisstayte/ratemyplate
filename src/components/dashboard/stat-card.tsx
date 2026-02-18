import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string;
  href: string;
  subtitle: string;
  Icon: React.ElementType<{
    className?: string;
  }>;
}

export default function StatCard({
  title,
  value,
  subtitle,
  href,
  Icon,
}: StatCardProps) {
  return (
    <Link href={href}>
      <Card className='w-full'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          <Icon className='size-6 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{value}</div>
          <p className='text-xs text-muted-foreground'>{subtitle}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
