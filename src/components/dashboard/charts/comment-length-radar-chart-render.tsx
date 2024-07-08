'use client';

import { TrendingUp } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { commentLengthGroup: '10', count: 186 },
  { commentLengthGroup: '25', count: 305 },
  { commentLengthGroup: '50', count: 237 },
  { commentLengthGroup: '100', count: 273 },
  { commentLengthGroup: '150', count: 209 },
  { commentLengthGroup: '254', count: 214 },
];

const chartConfig = {
  comments: {
    label: 'comments',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface CommentLengthRadarChartProps {
  data: {
    commentLengthGroup: string;
    count: number;
  }[];
}

export default function CommentLengthRadarChartRender({
  data,
}: CommentLengthRadarChartProps) {
  return (
    <Card>
      <CardHeader className='items-center pb-4'>
        <CardTitle>Comment Lengths</CardTitle>
        <CardDescription>All time</CardDescription>
      </CardHeader>
      <CardContent className='pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'>
          <RadarChart data={data}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <PolarAngleAxis dataKey='commentLengthGroup' />
            <PolarGrid />
            <Radar
              dataKey='count'
              name='Comments'
              fill='var(--color-comments)'
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        {/* <div className='flex items-center gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='flex items-center gap-2 leading-none text-muted-foreground'>
          January - June 2024
        </div> */}
      </CardFooter>
    </Card>
  );
}
