'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { LabelList, Pie, PieChart } from 'recharts';

interface ReportsStatusChartProps {
    data?: any[];
}

const chartConfig: ChartConfig = {
    count: {
        label: 'Reportes',
    },
    cumulative: {
        label: 'Línea',
        color: '#dc2626',
    },
    abierto: {
        label: 'ABIERTO',
        color: 'hsl(var(--chart-1))',
    },
    revisado: {
        label: 'REVISADO',
        color: 'hsl(var(--chart-2))',
    },
    cerrado: {
        label: 'CERRADO',
        color: 'hsl(var(--chart-3))',
    },
} satisfies ChartConfig;

export default function ReportsStatusChart({ data = [] }: ReportsStatusChartProps) {
    const chartData = useMemo(() => {
        const counts = {
            abierto: 0,
            revisado: 0,
            cerrado: 0,
        };

        data.forEach((report) => {
            const status = report.estadoReporte?.toLowerCase();
            if (status === 'generado') {
                counts.abierto++;
            } else if (status === 'visualizado' || status === 'revisado') {
                counts.revisado++;
            } else if (status === 'cerrado' || status === 'finalizado') {
                counts.cerrado++;
            }
        });

        const total = counts.abierto + counts.revisado + counts.cerrado;

        return [
            {
                status: 'abierto',
                count: counts.abierto,
                percentage: total > 0 ? ((counts.abierto / total) * 100).toFixed(1) : '0',
                fill: 'var(--color-abierto)'
            },
            {
                status: 'revisado',
                count: counts.revisado,
                percentage: total > 0 ? ((counts.revisado / total) * 100).toFixed(1) : '0',
                fill: 'var(--color-revisado)'
            },
            {
                status: 'cerrado',
                count: counts.cerrado,
                percentage: total > 0 ? ((counts.cerrado / total) * 100).toFixed(1) : '0',
                fill: 'var(--color-cerrado)'
            },
        ].filter(item => item.count > 0);
    }, [data]);

    const activeIndex = useMemo(() => {
        let maxCount = 0;
        let maxIndex = 0;
        chartData.forEach((item, index) => {
            if (item.count > maxCount) {
                maxCount = item.count;
                maxIndex = index;
            }
        });
        return maxIndex;
    }, [chartData]);

    const totalReports = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    }, [chartData]);

    const topStatus = useMemo(() => {
        const maxItem = chartData[activeIndex];
        return maxItem ? chartConfig[maxItem.status as keyof typeof chartConfig]?.label : '';
    }, [chartData, activeIndex]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardDescription>Distribución de reportes por estado</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[350px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    const percentage = totalReports > 0 ? ((data.count / totalReports) * 100).toFixed(1) : '0';
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        {chartConfig[data.status as keyof typeof chartConfig]?.label}
                                                    </span>
                                                    <span className="font-bold text-muted-foreground">
                                                        {data.count} ({percentage}%)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                        >
                            <LabelList
                                dataKey="count"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: number) => {
                                    const percentage = totalReports > 0 ? ((value / totalReports) * 100).toFixed(1) : '0';
                                    return `${value} (${percentage}%)`;
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    {topStatus} es el estado más común <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Mostrando {totalReports} reportes en total
                </div>
            </CardFooter>
        </Card>
    );
}
