'use client';

import { Report } from '@/types';
import { ChevronLeft, ChevronRight, Search, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Input } from '@/components/ui/input';

interface ClosedByReporterChartProps {
    data?: Report[];
}

const chartConfig: ChartConfig = {
    cerrados: {
        label: 'Reportes Cerrados',
        color: '#8b5cf6', // Púrpura base
    },
    label: {
        color: 'var(--background)',
    },
} satisfies ChartConfig;

export default function ClosedByReporterChart({ data = [] }: ClosedByReporterChartProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm]);

    const allChartData = useMemo(() => {
        // Group by idUsuarioReporta and nombreUsuarioReporta pair
        const reporterData: { [key: string]: { cerrados: number; total: number; idUsuario: string; nombre: string } } = {};

        data.forEach((report) => {
            const idUsuario = report.idUsuarioReporta || 'sin-id';
            const nombre = report.nombreUsuarioReporta || 'Sin usuario reportante';
            const key = `${idUsuario}-${nombre}`;

            if (!reporterData[key]) {
                reporterData[key] = {
                    total: 0,
                    cerrados: 0,
                    idUsuario,
                    nombre
                };
            }
            reporterData[key].total++;

            // Count closed reports
            if (report.estadoReporte?.toLowerCase() === 'cerrado') {
                reporterData[key].cerrados++;
            }
        });

        // Sort by total reports (descending) then by closed reports (descending)
        const sortedEntries = Object.entries(reporterData).sort(([, a], [, b]) => {
            if (b.total !== a.total) return b.total - a.total;
            return b.cerrados - a.cerrados;
        });

        const totalEntries = sortedEntries.length;

        // Generate purple gradient colors
        const generateColor = (index: number, total: number) => {
            if (total === 1) return '#8b5cf6';
            const intensity = index / Math.max(1, total - 1);
            const startR = 196, startG = 164, startB = 255;
            const endR = 109, endG = 40, endB = 217;
            const r = Math.round(startR + (endR - startR) * intensity);
            const g = Math.round(startG + (endG - startG) * intensity);
            const b = Math.round(startB + (endB - startB) * intensity);
            return `rgb(${r}, ${g}, ${b})`;
        };

        return sortedEntries
            .map(([key, datos], globalIndex) => ({
                reporter: datos.nombre.length > 10 ? datos.nombre.substring(0, 10) + '...' : datos.nombre,
                fullReporter: datos.nombre,
                idUsuario: datos.idUsuario,
                cerrados: datos.cerrados,
                total: datos.total,
                ratio: `${datos.cerrados}/${datos.total}`,
                porcentaje: datos.total > 0 ? Math.round((datos.cerrados / datos.total) * 100) : 0,
                fill: generateColor(globalIndex, totalEntries),
                globalRank: globalIndex + 1,
            }));
    }, [data]);

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return allChartData;

        return allChartData.filter((item) => item.fullReporter.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allChartData, searchTerm]);

    const chartData = useMemo(() => {
        const startIndex = currentPage * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage)
            .map(item => ({
                ...item,
                // Mantener el color original basado en el ranking global
                fill: item.fill
            }));
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const totalClosed = useMemo(() => {
        return allChartData.reduce((sum, item) => sum + item.cerrados, 0);
    }, [allChartData]);

    const totalReported = useMemo(() => {
        return allChartData.reduce((sum, item) => sum + item.total, 0);
    }, [allChartData]);

    const topReporter = useMemo(() => {
        return allChartData.length > 0 ? allChartData[0] : null;
    }, [allChartData]);

    const withoutReporter = useMemo(() => {
        const sinReporter = allChartData.find((item) => item.idUsuario === 'sin-id');
        return sinReporter ? sinReporter.total : 0;
    }, [allChartData]);    // Custom tooltip component
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border-border rounded-lg border p-3 shadow-lg">
                    <p className="text-foreground font-semibold">{data.fullReporter}</p>
                    <p className="text-muted-foreground text-xs">ID: {data.idUsuario}</p>
                    <p className="text-muted-foreground text-sm">
                        Reportados: {data.total} • Cerrados: {data.cerrados} ({data.porcentaje}%)
                    </p>
                    <p className="text-muted-foreground text-sm">
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
                            <CardTitle>Usuario que Reporta</CardTitle>
                            <CardDescription>
                                {searchTerm ? <>Encontrados {filteredData.length} usuarios • </> : null}
                                Mostrando {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} de{' '}
                                {filteredData.length} usuarios
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
                            placeholder="Buscar usuario reportante..."
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
                        height={Math.max(chartData.length * 80, 400)}
                        margin={{ left: 0, right: 80, top: 0, bottom: 0 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="reporter"
                            type="category"
                            tickLine={false}
                            tickMargin={0}
                            axisLine={false}
                            width={75}
                            tick={{ fontSize: 11, fill: 'var(--foreground)' }}
                        />
                        <XAxis dataKey="cerrados" type="number" hide />
                        <ChartTooltip cursor={false} content={<CustomTooltip />} />
                        <Bar dataKey="cerrados" layout="vertical" radius={4}>
                            <LabelList dataKey="ratio" position="right" offset={8} className="fill-foreground" fontSize={11} fontWeight="bold" />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {topReporter &&
                        `${topReporter.fullReporter} lidera con ${topReporter.ratio} reportes (${topReporter.porcentaje}%)`}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total reportados: {totalReported} • Total cerrados: {totalClosed}
                    {withoutReporter > 0 && ` • Sin reportante: ${withoutReporter}`}
                </div>
            </CardFooter>
        </Card>
    );
}
