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
    generado: {
        label: 'Generado',
        color: '#ef4444', // Rojo
    },
    visualizado: {
        label: 'Visualizado',
        color: '#f59e0b', // Amarillo/Naranja
    },
    cerrado: {
        label: 'Cerrado',
        color: '#10b981', // Verde
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
        // Get all reports that have a responsible person assigned (idUsuarioReporta)
        const reportesAsignados = data.filter((report) => report.idUsuarioReporta);

        const responsableData: { [key: string]: { generado: number; visualizado: number; cerrado: number; total: number; nombre: string } } = {};

        // Count reports by responsible ID and status
        reportesAsignados.forEach((report) => {
            const idResponsable = report.idUsuarioReporta!.toString();
            // Use nombreUsuarioReporta or fallback to nombreUsuarioCierre or a default name
            const nombreResponsable = report.nombreUsuarioReporta || report.nombreUsuarioCierre || `Usuario ${idResponsable}`;
            const estado = report.estadoReporte?.toLowerCase();

            if (!responsableData[idResponsable]) {
                responsableData[idResponsable] = {
                    generado: 0,
                    visualizado: 0,
                    cerrado: 0,
                    total: 0,
                    nombre: nombreResponsable
                };
            }

            responsableData[idResponsable].total++;

            if (estado === 'generado') {
                responsableData[idResponsable].generado++;
            } else if (estado === 'visualizado') {
                responsableData[idResponsable].visualizado++;
            } else if (estado === 'cerrado') {
                responsableData[idResponsable].cerrado++;
            }

            // Debug log for inconsistent data
            const currentData = responsableData[idResponsable];
            const calculatedTotal = currentData.generado + currentData.visualizado + currentData.cerrado;
            if (calculatedTotal !== currentData.total) {
                console.warn(`Data inconsistency for user ${idResponsable}:`, {
                    total: currentData.total,
                    calculated: calculatedTotal,
                    generado: currentData.generado,
                    visualizado: currentData.visualizado,
                    cerrado: currentData.cerrado,
                    estado: estado,
                    reportId: report.id
                });
            }
        });

        console.log('Grouped data:', responsableData);

        // Sort by total assigned reports (descending)
        const sortedEntries = Object.entries(responsableData).sort(([, a], [, b]) => {
            return b.total - a.total;
        });

        return sortedEntries
            .map(([idResponsable, datos], globalIndex) => {
                // Verify totals match before calculating percentages
                const calculatedTotal = datos.generado + datos.visualizado + datos.cerrado;
                if (calculatedTotal !== datos.total) {
                    console.error(`Final data inconsistency for user ${idResponsable}:`, datos);
                    // Fix the total to match calculated values
                    datos.total = calculatedTotal;
                }

                // Calculate exact percentages that sum to 100%
                const generadoPercent = datos.total > 0 ? (datos.generado / datos.total) * 100 : 0;
                const visualizadoPercent = datos.total > 0 ? (datos.visualizado / datos.total) * 100 : 0;
                const cerradoPercent = datos.total > 0 ? (datos.cerrado / datos.total) * 100 : 0;

                // Round percentages but ensure they sum to 100%
                let generadoPercentRounded = Math.round(generadoPercent);
                let visualizadoPercentRounded = Math.round(visualizadoPercent);
                let cerradoPercentRounded = Math.round(cerradoPercent);

                // Adjust rounding to ensure sum equals 100%
                const totalRounded = generadoPercentRounded + visualizadoPercentRounded + cerradoPercentRounded;
                const difference = 100 - totalRounded;

                if (difference !== 0 && datos.total > 0) {
                    // Find the percentage with the largest decimal part to adjust
                    const decimals = [
                        { key: 'generado', decimal: generadoPercent - generadoPercentRounded, value: generadoPercentRounded },
                        { key: 'visualizado', decimal: visualizadoPercent - visualizadoPercentRounded, value: visualizadoPercentRounded },
                        { key: 'cerrado', decimal: cerradoPercent - cerradoPercentRounded, value: cerradoPercentRounded }
                    ].sort((a, b) => Math.abs(b.decimal) - Math.abs(a.decimal));

                    // Adjust the percentage with the largest decimal difference
                    if (decimals[0].key === 'generado') {
                        generadoPercentRounded += difference;
                    } else if (decimals[0].key === 'visualizado') {
                        visualizadoPercentRounded += difference;
                    } else {
                        cerradoPercentRounded += difference;
                    }
                }

                const result = {
                    idResponsable,
                    responsable: datos.nombre.length > 12 ? datos.nombre.substring(0, 12) + '...' : datos.nombre,
                    fullResponsable: datos.nombre,
                    generado: datos.generado,
                    visualizado: datos.visualizado,
                    cerrado: datos.cerrado,
                    total: datos.total,
                    generadoPercent: generadoPercentRounded,
                    visualizadoPercent: visualizadoPercentRounded,
                    cerradoPercent: cerradoPercentRounded,
                    generadoPercentRounded,
                    visualizadoPercentRounded,
                    cerradoPercentRounded,
                    globalRank: globalIndex + 1,
                };

                console.log(`User ${datos.nombre}:`, {
                    total: result.total,
                    generado: result.generado,
                    visualizado: result.visualizado,
                    cerrado: result.cerrado,
                    percentages: `${result.generadoPercentRounded}% + ${result.visualizadoPercentRounded}% + ${result.cerradoPercentRounded}% = ${result.generadoPercentRounded + result.visualizadoPercentRounded + result.cerradoPercentRounded}%`
                });

                return result;
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
            generado: sum.generado + item.generado,
            visualizado: sum.visualizado + item.visualizado,
            cerrado: sum.cerrado + item.cerrado,
        }), { generado: 0, visualizado: 0, cerrado: 0 });
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
                    <p className="text-muted-foreground text-sm">
                        Total asignados: {data.total}
                    </p>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm">
                            <span className="inline-block w-3 h-3 bg-red-500 rounded mr-2"></span>
                            Generado: {data.generado} ({data.generadoPercentRounded}%)
                        </p>
                        <p className="text-sm">
                            <span className="inline-block w-3 h-3 bg-amber-500 rounded mr-2"></span>
                            Visualizado: {data.visualizado} ({data.visualizadoPercentRounded}%)
                        </p>
                        <p className="text-sm">
                            <span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>
                            Cerrado: {data.cerrado} ({data.cerradoPercentRounded}%)
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
                            <CardTitle>Distribución de Estados por Responsable</CardTitle>
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
            <CardContent className="max-h-[600px] overflow-y-auto">
                <ChartContainer config={chartConfig} className="w-full">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        // height={Math.max(chartData.length * 80, 400)}
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
                        <Bar dataKey="generadoPercent" stackId="status" fill="var(--color-generado)" radius={[4, 0, 0, 4]}>
                            <LabelList
                                dataKey="generadoPercentRounded"
                                position="center"
                                className="fill-white text-xs font-medium"
                                formatter={(value: number) => value > 5 ? `${value}%` : ''}
                            />
                        </Bar>
                        <Bar dataKey="visualizadoPercent" stackId="status" fill="var(--color-visualizado)">
                            <LabelList
                                dataKey="visualizadoPercentRounded"
                                position="center"
                                className="fill-white text-xs font-medium"
                                formatter={(value: number) => value > 5 ? `${value}%` : ''}
                            />
                        </Bar>
                        <Bar dataKey="cerradoPercent" stackId="status" fill="var(--color-cerrado)" radius={[0, 4, 4, 0]}>
                            <LabelList
                                dataKey="cerradoPercentRounded"
                                position="center"
                                className="fill-white text-xs font-medium"
                                formatter={(value: number) => value > 5 ? `${value}%` : ''}
                            />
                            <LabelList dataKey="total" position="right" offset={8} className="fill-foreground" fontSize={11} fontWeight="bold" />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">                <div className="flex gap-2 leading-none font-medium">
                    {topResponsible &&
                        `${topResponsible.fullResponsable} lidera con ${topResponsible.total} reportes asignados`}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total asignados: {totalAssigned} •
                    Generados: {totalByStatus.generado} •
                    Visualizados: {totalByStatus.visualizado} •
                    Cerrados: {totalByStatus.cerrado}
                </div>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Generado</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-amber-500 rounded"></div>
                        <span>Visualizado</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Cerrado</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
