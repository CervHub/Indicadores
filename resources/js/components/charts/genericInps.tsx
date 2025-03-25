'use client';

import axios from 'axios';
import * as React from 'react';
import { Label, Pie, PieChart, Legend } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { usePage } from '@inertiajs/react';

import { months } from '@/lib/utils';

const chartConfig: ChartConfig = {
    otros: {
        label: 'Otros',
        color: 'hsl(var(--chart-1))',
    },
    comites: {
        label: 'Comités',
        color: 'hsl(var(--chart-2))',
    },
    planeada: {
        label: 'Planeada',
        color: 'hsl(var(--chart-3))',
    },
    no_planeada: {
        label: 'No Planeada',
        color: 'hsl(var(--chart-4))',
    },
};

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

const initializeYearData = (year: number) => {
    return Array.from({ length: 365 }, (_, i) => {
        const date = new Date(year, 0, i + 1);
        return {
            date: date.toISOString().split('T')[0],
            otros: 0,
            comites: 0,
            planeada: 0,
            no_planeada: 0,
        };
    });
};

const calculateTotals = (data) => {
    return data.reduce(
        (acc, item) => {
            acc.otros += item.otros;
            acc.comites += item.comites;
            acc.planeada += item.planeada;
            acc.no_planeada += item.no_planeada;
            return acc;
        },
        { otros: 0, comites: 0, planeada: 0, no_planeada: 0 },
    );
};

const GenericInps: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [yearMetricsUrl, setYearMetricsUrl] = React.useState('');
    const [selectedYear, setSelectedYear] = React.useState(currentYear.toString());
    const [selectedMonth, setSelectedMonth] = React.useState('all');
    const [selectedType, setSelectedType] = React.useState('all');
    const [chartData, setChartData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const years = React.useMemo(() => {
        const yearsArray = [];
        for (let year = 2023; year <= currentYear; year++) {
            yearsArray.push(year.toString());
        }
        return yearsArray;
    }, [currentYear]);

    const filteredData = React.useMemo(() => {
        return chartData.filter((item) => {
            const date = new Date(item.date);
            const yearMatches = date.getFullYear().toString() === selectedYear;
            const monthMatches = selectedMonth === 'all' || (date.getMonth() + 1).toString() === selectedMonth;
            return yearMatches && monthMatches;
        });
    }, [chartData, selectedYear, selectedMonth]);

    const totals = React.useMemo(() => calculateTotals(filteredData), [filteredData]);

    const { props } = usePage<{ auth: { user: { role_id: string; company: string } } }>();
    const company_id = props.auth.user.company_id || 'all';

    React.useEffect(() => {
        const url = route('year.metrics.inspeccion', { company_id, year: selectedYear });
        setYearMetricsUrl(url);
    }, [selectedYear, company_id]);

    React.useEffect(() => {
        if (yearMetricsUrl) {
            setLoading(true);
            axios
                .get(yearMetricsUrl)
                .then((response) => {
                    console.log('Response:', response);
                    const yearData = initializeYearData(Number(selectedYear));
                    response.data.events.forEach((event) => {
                        const date = event.fecha_evento;
                        let reportType = event.tipo_inspeccion;
                        if (!reportType || reportType === 'OTROS') {
                            reportType = 'otros';
                        } else if (reportType === 'NO PLANEADA') {
                            reportType = 'no_planeada';
                        } else {
                            reportType = reportType.toLowerCase();
                        }
                        const dayData = yearData.find((d) => d.date === date);
                        if (dayData) {
                            dayData[reportType]++;
                        }
                    });
                    setChartData(yearData);
                })
                .catch((error) => {
                    console.error('Error fetching metrics data:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [yearMetricsUrl, selectedYear]);

    const pieData = Object.keys(totals).map((key, index) => ({
        name: chartConfig[key].label,
        value: totals[key],
        fill: colors[index % colors.length],
    }));

    const totalReports = pieData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Reporte general Anual</CardTitle>
                    <CardDescription>Visualiza todos los reportes generados en la plataforma por todas las contratas.</CardDescription>
                </div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a year">
                        <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {years.map((year) => (
                            <SelectItem key={year} value={year} className="rounded-lg">
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a month">
                        <SelectValue placeholder="Select a month" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="rounded-lg">
                            Todos
                        </SelectItem>
                        {months.map((month) => (
                            <SelectItem key={month.value} value={month.value} className="rounded-lg">
                                {month.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[220px] rounded-lg sm:ml-auto" aria-label="Select a type">
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="rounded-lg">
                            Todos
                        </SelectItem>
                        {Object.keys(chartConfig).map((key) => (
                            <SelectItem key={key} value={key} className="rounded-lg">
                                {chartConfig[key].label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {loading ? (
                    <div className="flex h-[320px] items-center justify-center">
                        <span>Loading...</span>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex justify-around">
                            {Object.keys(totals).map((key, index) => (
                                <div key={index}>
                                    <strong>{chartConfig[key].label}:</strong> {totals[key]}
                                </div>
                            ))}
                        </div>
                        <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                                return (
                                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                            {totalReports.toLocaleString()}
                                                        </tspan>
                                                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                            Número de reporte
                                                        </tspan>
                                                    </text>
                                                );
                                            }
                                        }}
                                    />
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ChartContainer>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default GenericInps;
