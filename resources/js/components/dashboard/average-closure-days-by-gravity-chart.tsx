"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Rectangle } from "recharts";
import { Report } from '@/types';
import { useMemo } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AverageClosureDaysByGravityChartProps {
    data?: Report[];
}

const chartConfig: ChartConfig = {
    promedioDias: {
        label: 'Días Promedio',
        color: "#f59e0b",
    },
    alto: {
        label: 'Alto',
        color: "#dc2626",
    },
    medio: {
        label: 'Medio',
        color: "#f59e0b",
    },
    bajo: {
        label: 'Bajo',
        color: "#16a34a",
    },
} satisfies ChartConfig;

export default function AverageClosureDaysByGravityChart({ data = [] }: AverageClosureDaysByGravityChartProps) {
    const chartData = useMemo(() => {
        // Agrupar reportes cerrados por nivel de gravedad y calcular días promedio
        const gravedadData: { [key: string]: { totalDias: number; cantidad: number } } = {};

        data.forEach((report) => {
            if (report.estadoReporte?.toLowerCase() === 'cerrado' && report.nivelGravedad && report.fechaReporte && report.reportClosedAt) {
                const gravedad = report.nivelGravedad.toLowerCase();
                const fechaReporte = new Date(report.fechaReporte);
                const fechaCierre = new Date(report.reportClosedAt);

                // Calcular días entre reporte y cierre
                const diffTime = fechaCierre.getTime() - fechaReporte.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (!gravedadData[gravedad]) {
                    gravedadData[gravedad] = { totalDias: 0, cantidad: 0 };
                }

                gravedadData[gravedad].totalDias += diffDays;
                gravedadData[gravedad].cantidad += 1;
            }
        });

        // Definir orden y colores específicos
        const ordenGravedad = ['alto', 'medio', 'bajo'];
        const coloresGravedad = {
            'alto': "#dc2626",   // Rojo
            'medio': "#f59e0b",  // Amarillo
            'bajo': "#16a34a"    // Verde
        };

        return ordenGravedad
            .filter(gravedad => gravedadData[gravedad])
            .map((gravedad) => {
                const data = gravedadData[gravedad];
                const promedio = data.cantidad > 0 ? Math.round(data.totalDias / data.cantidad) : 0;

                return {
                    gravedad: gravedad.charAt(0).toUpperCase() + gravedad.slice(1),
                    promedioDias: promedio,
                    cantidad: data.cantidad,
                    fill: coloresGravedad[gravedad as keyof typeof coloresGravedad],
                    label: `${promedio} días (${data.cantidad} reportes)`
                };
            });
    }, [data]);

    // Contar TODOS los reportes cerrados, no solo los que tienen datos completos para el cálculo de días
    const totalReports = useMemo(() => {
        return data.filter(report => report.estadoReporte?.toLowerCase() === 'cerrado').length;
    }, [data]);

    const totalReportsWithCompleteData = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.cantidad, 0);
    }, [chartData]);

    const overallAverage = useMemo(() => {
        if (chartData.length === 0) return 0;
        const totalDias = chartData.reduce((sum, item) => sum + (item.promedioDias * item.cantidad), 0);
        return Math.round(totalDias / totalReportsWithCompleteData);
    }, [chartData, totalReportsWithCompleteData]);

    const activeIndex = useMemo(() => {
        let maxDays = 0;
        let maxIndex = 0;
        chartData.forEach((item, index) => {
            if (item.promedioDias > maxDays) {
                maxDays = item.promedioDias;
                maxIndex = index;
            }
        });
        return maxIndex;
    }, [chartData]);

    const highestGravity = useMemo(() => {
        return chartData.reduce((max, current) =>
            current.promedioDias > max.promedioDias ? current : max,
            chartData[0] || { gravedad: '', promedioDias: 0 }
        );
    }, [chartData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Días de Cierre Promedio por Nivel de Gravedad</CardTitle>
                <CardDescription>
                    Tiempo promedio de cierre según el nivel de gravedad del reporte
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 30,
                            right: 30,
                            left: 20,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} horizontal={true} />
                        <XAxis
                            dataKey="gravedad"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent
                                formatter={(value, name, props) => [
                                    `${value} días promedio`,
                                    `${props.payload.cantidad} reportes`
                                ]}
                            />}
                        />
                        <Bar
                            dataKey="promedioDias"
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
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {highestGravity.gravedad && `Gravedad ${highestGravity.gravedad}: ${highestGravity.promedioDias} días promedio`} <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Promedio general: {overallAverage} días • {totalReports} reportes cerrados ({totalReportsWithCompleteData} con datos completos para análisis)
                </div>
            </CardFooter>
        </Card>
    );
}
