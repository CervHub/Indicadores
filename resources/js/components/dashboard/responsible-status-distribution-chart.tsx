'use client';

import { Report } from '@/types';
import { ChevronLeft, ChevronRight, Search, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Input } from '@/components/ui/input';

interface ResponsibleStatusDistributionChartProps {
    data?: Report[];
}

const chartConfig: ChartConfig = {
    abierto: {
        label: 'Abierto',
        color: '#ef4444', // Rojo
    },
    cerrado: {
        label: 'Cerrado',
        color: '#22c55e', // Verde
    },
    cerradoPorOtro: {
        label: 'Cerrado por otro',
        color: '#3b82f6', // Azul
    },
    label: {
        color: 'var(--background)',
    },
} satisfies ChartConfig;

export default function ResponsibleStatusDistributionChart({ data = [] }: ResponsibleStatusDistributionChartProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm]);

    const allChartData = useMemo(() => {
        // Group by idUsuarioCierre and nombreUsuarioCierre pair
        const responsableData: { [key: string]: { abierto: number; cerrado: number; cerradoPorOtro: number; total: number; idUsuario: string; nombre: string } } = {};

        data.forEach((report) => {
            const idUsuario = report.idUsuarioCierre || 'sin-id';
            const nombre = report.nombreUsuarioCierre || 'Sin encargado de cierre';
            const key = `${idUsuario}-${nombre}`;
            const estado = report.estadoReporte?.toLowerCase();

            if (!responsableData[key]) {
                responsableData[key] = {
                    abierto: 0,
                    cerrado: 0,
                    cerradoPorOtro: 0,
                    total: 0,
                    idUsuario,
                    nombre
                };
            }

            responsableData[key].total++;

            if (estado === 'cerrado' || estado === 'finalizado') {
                // Check if it was closed by the assigned person or someone else
                const cerradoPor = report.idUsuarioRealmenteCerro;
                if (cerradoPor && cerradoPor !== idUsuario) {
                    responsableData[key].cerradoPorOtro++;
                } else {
                    responsableData[key].cerrado++;
                }
            } else {
                responsableData[key].abierto++;
            }
        });

        // Sort by closure performance (percentage of closed reports), then by total reports
        const sortedEntries = Object.entries(responsableData).sort(([, a], [, b]) => {
            const aPerformance = a.total > 0 ? ((a.cerrado + a.cerradoPorOtro) / a.total) * 100 : 0;
            const bPerformance = b.total > 0 ? ((b.cerrado + b.cerradoPorOtro) / b.total) * 100 : 0;
            
            // First sort by performance (closure percentage), then by total reports
            if (bPerformance !== aPerformance) {
                return bPerformance - aPerformance;
            }
            return b.total - a.total;
        });

        return sortedEntries
            .map(([key, datos], globalIndex) => {
                // Calculate exact percentages that sum to 100%
                const abiertoPercent = datos.total > 0 ? (datos.abierto / datos.total) * 100 : 0;
                const cerradoPercent = datos.total > 0 ? (datos.cerrado / datos.total) * 100 : 0;
                const cerradoPorOtroPercent = datos.total > 0 ? (datos.cerradoPorOtro / datos.total) * 100 : 0;

                // Round percentages but ensure they sum to 100%
                let abiertoPercentRounded = Math.round(abiertoPercent);
                let cerradoPercentRounded = Math.round(cerradoPercent);
                let cerradoPorOtroPercentRounded = Math.round(cerradoPorOtroPercent);

                // Adjust rounding to ensure sum equals 100%
                const totalRounded = abiertoPercentRounded + cerradoPercentRounded + cerradoPorOtroPercentRounded;
                const difference = 100 - totalRounded;

                if (difference !== 0 && datos.total > 0) {
                    const decimals = [
                        { key: 'abierto', decimal: abiertoPercent - abiertoPercentRounded, value: abiertoPercentRounded },
                        { key: 'cerrado', decimal: cerradoPercent - cerradoPercentRounded, value: cerradoPercentRounded },
                        { key: 'cerradoPorOtro', decimal: cerradoPorOtroPercent - cerradoPorOtroPercentRounded, value: cerradoPorOtroPercentRounded }
                    ].sort((a, b) => Math.abs(b.decimal) - Math.abs(a.decimal));

                    if (decimals[0].key === 'abierto') {
                        abiertoPercentRounded += difference;
                    } else if (decimals[0].key === 'cerrado') {
                        cerradoPercentRounded += difference;
                    } else {
                        cerradoPorOtroPercentRounded += difference;
                    }
                }

                return {
                    idResponsable: datos.idUsuario,
                    responsable: datos.nombre.length > 12 ? datos.nombre.substring(0, 12) + '...' : datos.nombre,
                    fullResponsable: datos.nombre,
                    abierto: datos.abierto,
                    cerrado: datos.cerrado,
                    cerradoPorOtro: datos.cerradoPorOtro,
                    total: datos.total,
                    performance: datos.total > 0 ? Math.round(((datos.cerrado + datos.cerradoPorOtro) / datos.total) * 100) : 0,
                    abiertoPercent: abiertoPercentRounded,
                    cerradoPercent: cerradoPercentRounded,
                    cerradoPorOtroPercent: cerradoPorOtroPercentRounded,
                    abiertoPercentRounded,
                    cerradoPercentRounded,
                    cerradoPorOtroPercentRounded,
                    globalRank: globalIndex + 1,
                };
            });
    }, [data]);

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return allChartData;

        return allChartData.filter((item) => item.fullResponsable.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allChartData, searchTerm]);

    const chartData = useMemo(() => {
        const startIndex = currentPage * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const totalAssigned = useMemo(() => {
        return allChartData.reduce((sum, item) => sum + item.total, 0);
    }, [allChartData]);

    const totalByStatus = useMemo(() => {
        return allChartData.reduce((sum, item) => ({
            abierto: sum.abierto + item.abierto,
            cerrado: sum.cerrado + item.cerrado,
            cerradoPorOtro: sum.cerradoPorOtro + item.cerradoPorOtro,
        }), { abierto: 0, cerrado: 0, cerradoPorOtro: 0 });
    }, [allChartData]);

    const topResponsible = useMemo(() => {
        return allChartData.length > 0 ? allChartData[0] : null;
    }, [allChartData]);    // Custom tooltip component
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border-border rounded-lg border p-3 shadow-lg">
                    <p className="text-foreground font-semibold">{data.fullResponsable}</p>
                    <p className="text-muted-foreground text-xs">ID: {data.idResponsable}</p>
                    <p className="text-muted-foreground text-sm">
                        Total asignados: {data.total} • Performance: {data.performance}%
                    </p>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm">
                            <span className="inline-block w-3 h-3 bg-red-500 rounded mr-2"></span>
                            Abierto: {data.abierto} ({data.abiertoPercentRounded}%)
                        </p>
                        <p className="text-sm">
                            <span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>
                            Cerrado: {data.cerrado} ({data.cerradoPercentRounded}%)
                        </p>
                        <p className="text-sm">
                            <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-2"></span>
                            Cerrado por otro: {data.cerradoPorOtro} ({data.cerradoPorOtroPercentRounded}%)
                        </p>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">
                        Ranking: #{data.globalRank}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle>Distribución de Estados por Responsable de Cierre</CardTitle>
                            <CardDescription>
                                {searchTerm ? <>Encontrados {filteredData.length} responsables • </> : null}
                                Mostrando {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} de{' '}
                                {filteredData.length} responsables
                            </CardDescription>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar responsable..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent >
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="responsable"
                            type="category"
                            tickLine={false}
                            tickMargin={0}
                            axisLine={false}
                            width={100}
                            tick={{ fontSize: 11, fill: 'var(--foreground)' }}
                        />
                        <XAxis type="number" hide domain={[0, 100]} />
                        <ChartTooltip cursor={false} content={<CustomTooltip />} />

                        {/* Barras apiladas con porcentajes */}
                        <Bar dataKey="abiertoPercent" stackId="status" fill="var(--color-abierto)" radius={[4, 0, 0, 4]}>
                            <LabelList
                                dataKey="abiertoPercentRounded"
                                position="center"
                                className="fill-white text-xs font-medium"
                                formatter={(value: number) => value > 5 ? `${value}%` : ''}
                            />
                        </Bar>
                        <Bar dataKey="cerradoPercent" stackId="status" fill="var(--color-cerrado)">
                            <LabelList
                                dataKey="cerradoPercentRounded"
                                position="center"
                                className="fill-white text-xs font-medium"
                                formatter={(value: number) => value > 5 ? `${value}%` : ''}
                            />
                        </Bar>
                        <Bar dataKey="cerradoPorOtroPercent" stackId="status" fill="var(--color-cerradoPorOtro)" radius={[0, 4, 4, 0]}>
                            <LabelList
                                dataKey="cerradoPorOtroPercentRounded"
                                position="center"
                                className="fill-white text-xs font-medium"
                                formatter={(value: number) => value > 5 ? `${value}%` : ''}
                            />
                            <LabelList dataKey="total" position="right" offset={8} className="fill-foreground" fontSize={11} fontWeight="bold" />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {topResponsible &&
                        `${topResponsible.fullResponsable} lidera con ${topResponsible.performance}% de cierre (${topResponsible.total} reportes)`}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total asignados: {totalAssigned} •
                    Abiertos: {totalByStatus.abierto} •
                    Cerrados: {totalByStatus.cerrado} •
                    Cerrados por otro: {totalByStatus.cerradoPorOtro}
                </div>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Abierto</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Cerrado</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Cerrado por otro</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
