'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, Rectangle, XAxis, YAxis, LabelList } from 'recharts';
import { Report } from '@/types';

interface ReportsRaisedAndClosurePercentageByDateChartProps {
    data?: Report[];
}

const chartConfig: ChartConfig = {
    count: {
        label: 'Reportes Cerrados',
    },
    percentage: {
        label: 'Línea %',
        color: '#dc2626',
    },
    cerrados: {
        label: 'CERRADOS',
        color: 'hsl(var(--chart-3))',
    },
} satisfies ChartConfig;

export default function ReportsRaisedAndClosurePercentageByDateChart({ data = [] }: ReportsRaisedAndClosurePercentageByDateChartProps) {
    const [groupBy, setGroupBy] = useState<'month' | 'year'>('month');
    const [lineType, setLineType] = useState<'percentage' | 'value'>('percentage');

    const chartData = useMemo(() => {
        // Agrupar reportes por mes o año
        const periodData: { [key: string]: { total: number; cerrados: number } } = {};

        data.forEach((report) => {
            const date = new Date(report.fechaReporte);
            const periodKey = groupBy === 'month'
                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                : `${date.getFullYear()}`;

            if (!periodData[periodKey]) {
                periodData[periodKey] = { total: 0, cerrados: 0 };
            }

            periodData[periodKey].total++;
            if (report.estadoReporte?.toLowerCase() === 'cerrado') {
                periodData[periodKey].cerrados++;
            }
        });

        // Convertir a array y calcular porcentajes
        return Object.entries(periodData)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(groupBy === 'month' ? -6 : -5) // Últimos 6 meses o 5 años
            .map(([period, counts]) => {
                const percentage = counts.total > 0 ? (counts.cerrados / counts.total) * 100 : 0;
                const displayPeriod = groupBy === 'month'
                    ? new Date(period + '-01').toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
                    : period;

                return {
                    period: displayPeriod,
                    count: counts.cerrados,
                    percentage: percentage,
                    label: `${counts.cerrados}/${counts.total} (${percentage.toFixed(1)}%)`,
                    fill: 'var(--color-cerrados)'
                };
            });
    }, [data, groupBy]);

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

    const totalClosed = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    }, [chartData]);

    const avgPercentage = useMemo(() => {
        if (chartData.length === 0) return 0;
        const totalPercentage = chartData.reduce((sum, item) => sum + item.percentage, 0);
        return (totalPercentage / chartData.length).toFixed(1);
    }, [chartData]);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardDescription>Reportes generados y porcentaje de cierre por fecha</CardDescription>
                    <div className="flex gap-2">
                        <Select value={groupBy} onValueChange={(value: 'month' | 'year') => setGroupBy(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="month">Por Meses</SelectItem>
                                <SelectItem value="year">Por Años</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={lineType} onValueChange={(value: 'percentage' | 'value') => setLineType(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">Línea %</SelectItem>
                                <SelectItem value="value">Línea Valor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <ComposedChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 30,
                        }}
                    >
                        <CartesianGrid vertical={true} horizontal={false} />
                        <XAxis
                            dataKey="period"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
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
                            dataKey={lineType === 'percentage' ? 'percentage' : 'count'}
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
                    Promedio de cierre: {avgPercentage}% <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Total de {totalClosed} reportes cerrados</div>
            </CardFooter>
        </Card>
    );
}
