'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

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

interface PlateStatePieChartProps {
  data: {
    state: string;
    plateCount: number;
    fill: string;
    stateName: string;
  }[];
}

export function PlateStatePieChartRender({ data }: PlateStatePieChartProps) {
  const totalPlates = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.plateCount, 0);
  }, [data]);

  const chartConfig = data.reduce((config, state) => {
    config[state.state] = {
      label: state.stateName,
      color: state.fill,
    };
    return config;
  }, {} as ChartConfig);

  const topState = React.useMemo(() => {
    const sortedData = data.sort((a, b) => b.plateCount - a.plateCount);
    return sortedData[0].stateName;
  }, [data]);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Plates By State</CardTitle>
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
              dataKey='plateCount'
              nameKey='state'
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
                          {totalPlates.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'>
                          Plates
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
          {topState} is the most popular <TrendingUp className='h-4 w-4' />
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
