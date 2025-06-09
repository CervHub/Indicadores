'use client';

import { Report } from '@/types';
import { ChevronLeft, ChevronRight, Search, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClosedByResponsibleChartProps {
    data?: Report[];
}

const chartConfig: ChartConfig = {
    cerrados: {
        label: 'Reportes Cerrados',
        color: '#10b981',
    },
    label: {
        color: 'var(--background)',
    },
} satisfies ChartConfig;

export default function ClosedByCompanyChart({ data = [] }: ClosedByResponsibleChartProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'reporta' | 'reportada'>('reporta');
    const itemsPerPage = 10;

    // Reset pagination when search or filter changes
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm, filterType]);

    const allChartData = useMemo(() => {
        // Group by company based on filter type
        const companyData: { [key: string]: { cerrados: number; noCerrados: number; total: number; idEmpresa: string; nombre: string } } = {};

        data.forEach((report) => {
            const idEmpresa = filterType === 'reporta' ? report.idEmpresaReporta : report.idEmpresaReportada;
            const nombre = filterType === 'reporta' ? report.nombreEmpresaReporta : report.nombreEmpresaReportada;
            const key = `${idEmpresa}-${nombre}`;

            if (!companyData[key]) {
                companyData[key] = {
                    cerrados: 0,
                    noCerrados: 0,
                    total: 0,
                    idEmpresa: idEmpresa || 'sin-id',
                    nombre: nombre || 'Sin empresa'
                };
            }

            companyData[key].total += 1;

            if (report.estadoReporte?.toLowerCase() === 'cerrado') {
                companyData[key].cerrados += 1;
            } else {
                companyData[key].noCerrados += 1;
            }
        });

        const sortedEntries = Object.entries(companyData)
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
                empresa: datos.nombre.length > 15 ? datos.nombre.substring(0, 15) + '...' : datos.nombre,
                fullEmpresa: datos.nombre,
                idEmpresa: datos.idEmpresa,
                cerrados: datos.cerrados,
                noCerrados: datos.noCerrados,
                total: datos.total,
                ratio: `${datos.cerrados}/${datos.total}`,
                porcentaje: datos.total > 0 ? Math.round((datos.cerrados / datos.total) * 100) : 0,
                fill: generateColor(globalIndex, totalEntries),
                globalRank: globalIndex + 1,
            }));
    }, [data, filterType]);

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return allChartData;

        return allChartData.filter((item) => item.fullEmpresa.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allChartData, searchTerm]);

    const chartData = useMemo(() => {
        const startIndex = currentPage * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage)
            .map(item => ({
                ...item,
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

    const topCompany = useMemo(() => {
        return allChartData.length > 0 ? allChartData[0] : null;
    }, [allChartData]);

    const withoutCompany = useMemo(() => {
        const sinEmpresa = allChartData.find((item) => item.idEmpresa === 'sin-id');
        return sinEmpresa ? sinEmpresa.total : 0;
    }, [allChartData]);

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border-border rounded-lg border p-3 shadow-lg">
                    <p className="text-foreground font-semibold">{data.fullEmpresa}</p>
                    <p className="text-muted-foreground text-xs">ID: {data.idEmpresa}</p>
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
                            <CardTitle>
                                {filterType === 'reporta' 
                                    ? 'Reportes Abiertos por Empresa' 
                                    : 'Reportes por Empresa Encargada de Cierre'
                                }
                            </CardTitle>
                            <CardDescription className='w-[300px]'>
                                {filterType === 'reporta' 
                                    ? 'Muestra todos los reportes abiertos por cada empresa y cuántos han sido cerrados'
                                    : 'Muestra los reportes asignados a cada empresa encargada de cierre y cuántos han cerrado'
                                }
                                {searchTerm && (
                                    <> • Encontradas {filteredData.length} empresas</>
                                )}
                                <br />
                                Mostrando {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} de{' '}
                                {filteredData.length} empresas
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
                    <div className="flex gap-4">
                        <div className="relative max-w-sm flex-1">
                            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                            <Input
                                placeholder="Buscar empresa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={filterType} onValueChange={(value: 'reporta' | 'reportada') => setFilterType(value)}>
                            <SelectTrigger className="w-[260px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="reporta">
                                    <div className="flex flex-col">
                                        <span>Empresa que Reporta</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="reportada">
                                    <div className="flex flex-col">
                                        <span>Empresa Encargada de Cierre</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 0, right: 80, top: 0, bottom: 0 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="empresa"
                            type="category"
                            tickLine={false}
                            tickMargin={0}
                            axisLine={false}
                            width={120}
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
                    {topCompany && (
                        <>
                            {filterType === 'reporta' 
                                ? `${topCompany.fullEmpresa} es quien más reporta con ${topCompany.ratio} reportes (${topCompany.porcentaje}% cerrados)`
                                : `${topCompany.fullEmpresa} tiene mejor tasa de cierre con ${topCompany.ratio} reportes (${topCompany.porcentaje}% cerrados)`
                            }
                        </>
                    )}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    {filterType === 'reporta' 
                        ? `Total de reportes abiertos: ${totalAssigned} | Reportes cerrados: ${totalClosed} (${Math.round((totalClosed / totalAssigned) * 100)}%)`
                        : `Total de reportes asignados para cierre: ${totalAssigned} | Reportes cerrados: ${totalClosed} (${Math.round((totalClosed / totalAssigned) * 100)}%)`
                    }
                    {withoutCompany > 0 && ` • Sin empresa: ${withoutCompany}`}
                </div>
            </CardFooter>
        </Card>
    );
}
