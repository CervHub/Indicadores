'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
            const date = new Date(report.fechaEvento);
            const periodKey = groupBy === 'month'
                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                : `${date.getFullYear()}`;

            if (!periodData[periodKey]) {
                periodData[periodKey] = { total: 0, cerrados: 0 };
            }

            periodData[periodKey].total++;
            if (report.estadoReporte?.toLowerCase() === 'cerrado' || report.estadoReporte?.toLowerCase() === 'finalizado') {
                periodData[periodKey].cerrados++;
            }
        });

        // Generar todos los períodos en el rango de datos
        const allPeriods: string[] = [];

        if (data.length === 0) {
            // Si no hay datos, mostrar últimos períodos
            const now = new Date();
            if (groupBy === 'month') {
                for (let i = 5; i >= 0; i--) {
                    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    allPeriods.push(periodKey);
                }
            } else {
                for (let i = 4; i >= 0; i--) {
                    const year = now.getFullYear() - i;
                    allPeriods.push(year.toString());
                }
            }
        } else {
            // Encontrar el rango de fechas en los datos
            const dates = data.map(report => new Date(report.fechaEvento));
            const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
            const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

            if (groupBy === 'month') {
                // Generar todos los meses desde la fecha mínima hasta la máxima
                const startDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
                const endDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

                const currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    const periodKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                    allPeriods.push(periodKey);
                    currentDate.setMonth(currentDate.getMonth() + 1);
                }
            } else {
                // Generar todos los años desde el año mínimo hasta el máximo
                for (let year = minDate.getFullYear(); year <= maxDate.getFullYear(); year++) {
                    allPeriods.push(year.toString());
                }
            }
        }

        // Convertir a array y calcular porcentajes, incluyendo períodos sin datos
        return allPeriods.map((period) => {
            const counts = periodData[period] || { total: 0, cerrados: 0 };
            const percentage = counts.total > 0 ? (counts.cerrados / counts.total) * 100 : 0;
            let displayPeriod;

            if (groupBy === 'month') {
                // Separar año y mes del período YYYY-MM
                const [year, month] = period.split('-');
                // Crear fecha usando año, mes-1 (porque los meses en JS van de 0-11), y día 1
                const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                displayPeriod = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            } else {
                displayPeriod = period;
            }

            return {
                period: displayPeriod,
                count: counts.cerrados,
                percentage: percentage,
                label: `${counts.cerrados}/${counts.total} (${percentage.toFixed(2)}%)`,
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
        
        // Calcular totales acumulados para regla de 3 simple
        const totalCerrados = chartData.reduce((sum, item) => sum + item.count, 0);
        const totalReportes = chartData.reduce((sum, item) => {
            // Extraer el total de reportes del label "cerrados/total (porcentaje%)"
            const match = item.label.match(/(\d+)\/(\d+)/);
            return sum + (match ? parseInt(match[2]) : 0);
        }, 0);
        
        // Regla de 3 simple: si totalReportes -> 100%, entonces totalCerrados -> x%
        const percentage = totalReportes > 0 ? (totalCerrados / totalReportes) * 100 : 0;
        return percentage.toFixed(2);
    }, [chartData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reportes Abiertos y Porcentaje de Cierre por Fecha</CardTitle>
                <CardDescription>Reportes abiertos y porcentaje de cierre por fecha</CardDescription>
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
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-full w-full">
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
