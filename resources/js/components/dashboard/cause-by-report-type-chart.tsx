'use client';

import { Report } from '@/types';
import { ChevronLeft, ChevronRight, Search, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Cell } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Input } from '@/components/ui/input';

interface CauseByReportTypeChartProps {
    data?: Report[];
}

const chartConfig: ChartConfig = {
    actos: {
        label: 'Actos',
        color: '#3b82f6', // Azul
    },
    condiciones: {
        label: 'Condiciones',
        color: '#f59e0b', // Naranja
    },
    incidentes: {
        label: 'Incidentes',
        color: '#10b981', // Verde
    },
    label: {
        color: 'var(--background)',
    },
} satisfies ChartConfig;

export default function CauseByReportTypeChart({ data = [] }: CauseByReportTypeChartProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm]);

    const allChartData = useMemo(() => {
        // Filter reports that have both cause and report type
        const reportesConCausa = data.filter((report) =>
            report.idCausa &&
            report.tipoReporte &&
            report.causaReporte &&
            ['actos', 'condiciones', 'incidentes'].includes(report.tipoReporte.toLowerCase())
        );

        // Separate data by report type
        const causasPorTipo: { [key: string]: { nombre: string; total: number; tipo: string } } = {};

        reportesConCausa.forEach((report) => {
            const idCausa = report.idCausa!.toString();
            const tipoReporte = report.tipoReporte!.toLowerCase();
            const nombreCausa = report.causaReporte!;

            // Create unique key combining cause ID and report type
            const key = `${idCausa}-${tipoReporte}`;

            if (!causasPorTipo[key]) {
                causasPorTipo[key] = {
                    nombre: nombreCausa,
                    total: 0,
                    tipo: tipoReporte
                };
            }

            causasPorTipo[key].total++;
        });

        // Convert to array and sort by total (descending)
        const sortedEntries = Object.entries(causasPorTipo).sort(([, a], [, b]) => {
            return b.total - a.total;
        });

        return sortedEntries.map(([key, datos], globalIndex) => {
            // Add prefix based on report type
            let prefix = '';
            let color = '';
            switch (datos.tipo) {
                case 'actos':
                    prefix = 'AS';
                    color = '#3b82f6'; // Blue
                    break;
                case 'condiciones':
                    prefix = 'CS';
                    color = '#f59e0b'; // Orange
                    break;
                case 'incidentes':
                    prefix = 'IS';
                    color = '#10b981'; // Green
                    break;
            }

            const fullCauseName = `${prefix} - ${datos.nombre}`;
            const shortCauseName = fullCauseName.length > 15 ? fullCauseName.substring(0, 15) + '...' : fullCauseName;

            return {
                key,
                causa: shortCauseName,
                fullCausa: fullCauseName,
                total: datos.total,
                tipo: datos.tipo,
                color: color,
                globalRank: globalIndex + 1,
            };
        });
    }, [data]);

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return allChartData;

        return allChartData.filter((item) => item.fullCausa.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allChartData, searchTerm]);

    const chartData = useMemo(() => {
        const startIndex = currentPage * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const totalReports = useMemo(() => {
        return allChartData.reduce((sum, item) => sum + item.total, 0);
    }, [allChartData]);

    const totalByType = useMemo(() => {
        return allChartData.reduce((sum, item) => {
            switch (item.tipo) {
                case 'actos':
                    sum.actos += item.total;
                    break;
                case 'condiciones':
                    sum.condiciones += item.total;
                    break;
                case 'incidentes':
                    sum.incidentes += item.total;
                    break;
            }
            return sum;
        }, { actos: 0, condiciones: 0, incidentes: 0 });
    }, [allChartData]);

    const topCause = useMemo(() => {
        return allChartData.length > 0 ? allChartData[0] : null;
    }, [allChartData]);

    // Custom tooltip component
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border-border rounded-lg border p-3 shadow-lg max-w-xs">
                    <p className="text-foreground font-semibold w-[100px] break-words leading-tight mb-2">
                        {data.fullCausa}
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Total reportes: {data.total}
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Tipo: {data.tipo.charAt(0).toUpperCase() + data.tipo.slice(1)}
                    </p>
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
                            <CardTitle>Distribución de Causas por Tipo de Reporte</CardTitle>
                            <CardDescription>
                                {searchTerm ? <>Encontradas {filteredData.length} causas • </> : null}
                                Mostrando {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} de{' '}
                                {filteredData.length} causas
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
                            placeholder="Buscar causa..."
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
                        height={Math.max(chartData.length * 60, 400)}
                        margin={{ left: 0, right: 60, top: 0, bottom: 0 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="causa"
                            type="category"
                            tickLine={false}
                            tickMargin={0}
                            axisLine={false}
                            width={120}
                            tick={{ fontSize: 10, fill: 'var(--foreground)' }}
                        />
                        <XAxis type="number" hide />
                        <ChartTooltip cursor={false} content={<CustomTooltip />} />

                        {/* Single bar with dynamic color based on type */}
                        <Bar
                            dataKey="total"
                            radius={[0, 4, 4, 0]}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList dataKey="total" position="right" offset={8} className="fill-foreground" fontSize={11} fontWeight="bold" />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {topCause &&
                        `${topCause.fullCausa} lidera con ${topCause.total} reportes`}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total reportes: {totalReports} •
                    Actos: {totalByType.actos} •
                    Condiciones: {totalByType.condiciones} •
                    Incidentes: {totalByType.incidentes}
                </div>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Actos (AS)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span>Condiciones (CS)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Incidentes (IS)</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
