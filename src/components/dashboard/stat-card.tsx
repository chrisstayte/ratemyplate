import { DollarSign } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  Icon: React.ElementType<{
    className?: string;
  }>;
}

export default function StatCard({
  title,
  value,
  subtitle,
  Icon,
}: StatCardProps) {
  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-5 w-5' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{subtitle}</p>
      </CardContent>
    </Card>
  );
}
