'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
import '@/lib/extensions';

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

interface OAuthPlatformPieChartProps {
  data: {
    provider: string;
    providerCount: number;
  }[];
}

export function OAuthPlatformPieChartRender({
  data,
}: OAuthPlatformPieChartProps) {
  const totalProviders = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.providerCount, 0);
  }, [data]);

  const topProvider = React.useMemo(() => {
    const sortedData = data.sort((a, b) => b.providerCount - a.providerCount);
    return sortedData[0].provider;
  }, [data]);

  const chartConfig = {
    github: {
      label: 'Github',
      color: '#343434',
    },
    discord: {
      label: 'Discord',
      color: '#5865F2',
    },
    google: {
      label: 'Google',
      color: '#1A73E8',
    },
  } as ChartConfig;

  data = data.map((item) => {
    return {
      ...item,
      fill: chartConfig[item.provider.toLowerCase()].color,
    };
  });

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Auth Providers</CardTitle>
        <CardDescription>All time</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey='providerCount'
              nameKey='provider'
              innerRadius={60}
              strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'>
                          {totalProviders.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'>
                          Providers
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          {topProvider.capitalize()} is the most popular{' '}
          <TrendingUp className='h-4 w-4' />
        </div>
        {/* <div className='flex items-center gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div> */}
        {/* <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
