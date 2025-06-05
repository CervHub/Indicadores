'use client';

import { Report } from '@/types';
import { ChevronLeft, ChevronRight, Search, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Input } from '@/components/ui/input';

interface ClosedByResponsibleChartProps {
    data?: Report[];
}

const chartConfig: ChartConfig = {
    cerrados: {
        label: 'Reportes Cerrados',
        color: '#10b981', // Verde base
    },
    label: {
        color: 'var(--background)',
    },
} satisfies ChartConfig;

export default function ClosedByResponsibleChart({ data = [] }: ClosedByResponsibleChartProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm]);

    const allChartData = useMemo(() => {
        // Group by idUsuarioCierre and nombreUsuarioCierre pair
        const responsableData: { [key: string]: { cerrados: number; noCerrados: number; total: number; idUsuario: string; nombre: string } } = {};

        data.forEach((report) => {
            const idUsuario = report.idUsuarioCierre || 'sin-id';
            const nombre = report.nombreUsuarioCierre || 'Sin encargado de cierre';
            const key = `${idUsuario}-${nombre}`;

            if (!responsableData[key]) {
                responsableData[key] = {
                    cerrados: 0,
                    noCerrados: 0,
                    total: 0,
                    idUsuario,
                    nombre
                };
            }

            responsableData[key].total += 1;

            if (report.estadoReporte?.toLowerCase() === 'cerrado') {
                responsableData[key].cerrados += 1;
            } else {
                responsableData[key].noCerrados += 1;
            }
        });

        const sortedEntries = Object.entries(responsableData)
            .sort(([, a], [, b]) => b.cerrados - a.cerrados);

        const totalEntries = sortedEntries.length;

        const generateColor = (index: number, total: number) => {
            const intensity = index / Math.max(total - 1, 1);
            const startR = 127, startG = 29, startB = 29;
            const endR = 254, endG = 242, endB = 242;
            const r = Math.round(startR + (endR - startR) * intensity);
            const g = Math.round(startG + (endG - startG) * intensity);
            const b = Math.round(startB + (endB - startB) * intensity);
            return `rgb(${r}, ${g}, ${b})`;
        };

        return sortedEntries
            .map(([key, datos], globalIndex) => ({
                responsable: datos.nombre.length > 10 ? datos.nombre.substring(0, 10) + '...' : datos.nombre,
                fullResponsable: datos.nombre,
                idUsuario: datos.idUsuario,
                cerrados: datos.cerrados,
                noCerrados: datos.noCerrados,
                total: datos.total,
                ratio: `${datos.cerrados}/${datos.total}`,
                porcentaje: datos.total > 0 ? Math.round((datos.cerrados / datos.total) * 100) : 0,
                fill: generateColor(globalIndex, totalEntries),
                globalRank: globalIndex + 1,
            }));
    }, [data]);

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return allChartData;

        return allChartData.filter((item) => item.fullResponsable.toLowerCase().includes(searchTerm.toLowerCase()));
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

    const totalAssigned = useMemo(() => {
        return allChartData.reduce((sum, item) => sum + item.total, 0);
    }, [allChartData]);

    const topResponsible = useMemo(() => {
        return allChartData.length > 0 ? allChartData[0] : null;
    }, [allChartData]);

    const withoutResponsible = useMemo(() => {
        const sinEncargado = allChartData.find((item) => item.idUsuario === 'sin-id');
        return sinEncargado ? sinEncargado.total : 0;
    }, [allChartData]);

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border-border rounded-lg border p-3 shadow-lg">
                    <p className="text-foreground font-semibold">{data.fullResponsable}</p>
                    <p className="text-muted-foreground text-xs">ID: {data.idUsuario}</p>
                    <p className="text-muted-foreground text-sm">
                        Cerrados: {data.cerrados} de {data.total} ({data.porcentaje}%)
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
                            <CardTitle>Responsable de Cierre</CardTitle>
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
                                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="flex items-center px-2 text-sm">
                                    {currentPage + 1} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage === totalPages - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="relative max-w-sm">
                        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                        <Input
                            placeholder="Buscar responsable..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        // height={Math.max(chartData.length * 80, 400)}
                        margin={{ left: 0, right: 80, top: 0, bottom: 0 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="responsable"
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
                    {topResponsible &&
                        `${topResponsible.fullResponsable} lidera con ${topResponsible.ratio} reportes (${topResponsible.porcentaje}%)`}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Total: {totalClosed}/{totalAssigned} reportes cerrados ({Math.round((totalClosed / totalAssigned) * 100)}%) • Sin encargado:{' '}
                    {withoutResponsible}
                </div>
            </CardFooter>
        </Card>
    );
}
