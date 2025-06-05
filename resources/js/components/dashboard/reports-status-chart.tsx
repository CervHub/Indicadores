'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, Rectangle, XAxis, YAxis, LabelList } from 'recharts';

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
    generado: {
        label: 'GENERADO',
        color: 'hsl(var(--chart-1))',
    },
    visualizado: {
        label: 'VISUALIZADO',
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
            generado: 0,
            visualizado: 0,
            cerrado: 0,
        };

        data.forEach((report) => {
            const status = report.estadoReporte?.toLowerCase();
            if (status === 'generado') counts.generado++;
            else if (status === 'visualizado') counts.visualizado++;
            else if (status === 'cerrado') counts.cerrado++;
        });

        const total = counts.generado + counts.visualizado + counts.cerrado;

        return [
            {
                status: 'generado',
                count: counts.generado,
                cumulative: counts.generado,
                label: total > 0 ? `${counts.generado} (${((counts.generado / total) * 100).toFixed(1)}%)` : '0 (0%)',
                fill: 'var(--color-generado)'
            },
            {
                status: 'visualizado',
                count: counts.visualizado,
                cumulative: counts.visualizado,
                label: total > 0 ? `${counts.visualizado} (${((counts.visualizado / total) * 100).toFixed(1)}%)` : '0 (0%)',
                fill: 'var(--color-visualizado)'
            },
            {
                status: 'cerrado',
                count: counts.cerrado,
                cumulative: counts.cerrado,
                label: total > 0 ? `${counts.cerrado} (${((counts.cerrado / total) * 100).toFixed(1)}%)` : '0 (0%)',
                fill: 'var(--color-cerrado)'
            },
        ];
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
        <Card>
            <CardHeader>
                {/* <CardTitle>Estado de Reportes</CardTitle> */}
                <CardDescription>Distribución de reportes por estado</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[100px] w-full">
                    <ComposedChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={true} horizontal={false} />
                        <XAxis
                            dataKey="status"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.toUpperCase()}
                        />
                        <YAxis hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="count"
                            strokeWidth={2}
                            radius={8}
                            activeIndex={activeIndex}
                            activeBar={({ ...props }) => {
                                return (
                                    <Rectangle {...props} fillOpacity={0.8} stroke={props.payload.fill} strokeDasharray={4} strokeDashoffset={4} />
                                );
                            }}
                        >
                            <LabelList
                                dataKey="label"
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={11}
                            />
                        </Bar>
                        <Line
                            type="linear"
                            dataKey="cumulative"
                            stroke="#dc2626"
                            strokeWidth={3}
                            dot={{ r: 6, fill: "#dc2626" }}
                            activeDot={{ r: 8, stroke: "#dc2626", strokeWidth: 2, fill: "#dc2626" }}
                        />
                    </ComposedChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {topStatus} es el estado más común <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Mostrando {totalReports} reportes en total</div>
            </CardFooter>
        </Card>
    );
}
