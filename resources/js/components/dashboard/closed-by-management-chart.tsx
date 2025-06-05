"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
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

interface ClosedByManagementChartProps {
    data?: Report[];
}

const chartConfig: ChartConfig = {
    cerrados: {
        label: 'Reportes Cerrados',
        color: "#3b82f6", // Azul base
    },
    label: {
        color: "var(--background)",
    },
} satisfies ChartConfig;

export default function ClosedByManagementChart({ data = [] }: ClosedByManagementChartProps) {
    const chartData = useMemo(() => {
        // Agrupar reportes por gerencia (todos los reportes y cerrados)
        const gerenciaData: { [key: string]: { total: number; cerrados: number } } = {};

        data.forEach((report) => {
            if (report.nombreGerencia) {
                const gerencia = report.nombreGerencia;
                if (!gerenciaData[gerencia]) {
                    gerenciaData[gerencia] = { total: 0, cerrados: 0 };
                }
                gerenciaData[gerencia].total++;
                if (report.estadoReporte?.toLowerCase() === 'cerrado') {
                    gerenciaData[gerencia].cerrados++;
                }
            }
        });

        // Gama de colores azul claro a oscuro
        const blueColors = [
            "#dbeafe", // azul muy claro
            "#bfdbfe", // azul claro
            "#93c5fd", // azul medio claro
            "#60a5fa", // azul medio
            "#3b82f6", // azul
            "#2563eb", // azul medio oscuro
            "#1d4ed8", // azul oscuro
            "#1e40af", // azul muy oscuro
        ];

        return Object.entries(gerenciaData)
            .map(([gerencia, counts], index) => ({
                gerencia: gerencia.length > 15 ? gerencia : gerencia,
                fullGerencia: gerencia, // Mantener el nombre completo para tooltip
                cerrados: counts.cerrados,
                total: counts.total,
                ratio: `${counts.cerrados}/${counts.total}`,
                percentage: counts.total > 0 ? ((counts.cerrados / counts.total) * 100).toFixed(1) : '0',
                fill: blueColors[index % blueColors.length]
            }))
            .sort((a, b) => b.cerrados - a.cerrados)
            .slice(0, 8); // Limitar a las 8 gerencias con más reportes cerrados
    }, [data]);

    const totalClosed = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.cerrados, 0);
    }, [chartData]);

    const totalGenerated = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.total, 0);
    }, [chartData]);

    const topManagement = useMemo(() => {
        return chartData.length > 0 ? chartData[0] : null;
    }, [chartData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reportes Cerrados por Gerencia</CardTitle>
                <CardDescription>
                    Cantidad de reportes cerrados por cada gerencia
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            // left: 120,
                            right: 50,
                            // top: 20,
                            // bottom: 20,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="gerencia"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            hide
                        />
                        <XAxis dataKey="cerrados" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="cerrados"
                            layout="vertical"
                            radius={4}
                        >
                            <LabelList
                                dataKey="gerencia"
                                position="insideLeft"
                                offset={8}
                                className="fill-white"
                                fontSize={12}
                                fontWeight="bold"
                            />
                            <LabelList
                                dataKey="ratio"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                                fontWeight="bold"
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {topManagement && `${topManagement.fullGerencia} lidera: ${topManagement.ratio} (${topManagement.percentage}%)`} <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Total: {totalClosed}/{totalGenerated} reportes cerrados ({totalGenerated > 0 ? ((totalClosed / totalGenerated) * 100).toFixed(1) : 0}%)
                </div>
            </CardFooter>
        </Card>
    );
}
