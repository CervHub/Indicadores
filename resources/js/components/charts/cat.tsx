'use client';

import axios from 'axios';
import * as React from 'react';
import { Label, Legend, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { months } from '@/lib/utils';

const initialChartConfig = {
    visitors: {
        label: 'Número de reporte',
    },
} satisfies ChartConfig;

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#FF6384'];

interface ChartCatProps {
    titles: { [key: string]: string };
    companies: { id: number; nombre: string }[];
    entities: { id: number; nombre: string }[];
}

const buildChartData = (rawData: any[], titles: { [key: string]: string }, month: string, status: string, company: string, entity: string) => {
    const filteredData =
        month === 'all'
            ? rawData
            : rawData.filter((item) => {
                  const reportMonth = new Date(item.fecha_reporte).getMonth() + 1;
                  return reportMonth.toString() === month || reportMonth === parseInt(month);
              });

    const statusFilteredData = status === 'all' ? filteredData : filteredData.filter((item) => item.estado === status);
    const companyFilteredData = company === 'all' ? statusFilteredData : statusFilteredData.filter((item) => item.company_id.toString() === company);
    const entityFilteredData = entity === 'all' ? companyFilteredData : companyFilteredData.filter((item) => item.gerencia.toString() === entity);

    const newChartData = Object.keys(titles).map((key, index) => {
        const count = entityFilteredData.filter((item) => item.tipo_reporte === key).length;
        return {
            report: key,
            visitors: count,
            fill: colors[index % colors.length],
        };
    });

    console.log('filteredData:', filteredData);
    console.log('newChartData:', newChartData);
    console.log('Month:', month);
    console.log('Status:', status);
    console.log('Company:', company);
    console.log('Entity:', entity);
    console.log('rawData:', rawData);

    return newChartData.every((item) => item.visitors === 0) ? [{ report: 'Sin datos', visitors: 0, fill: '#CCCCCC' }] : newChartData;
};

interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    placeholder: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onValueChange, options, placeholder }) => (
    <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-auto rounded-lg">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
            {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                    {option.label}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);

export function ChartCat({ titles, companies, entities }: ChartCatProps) {
    const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = React.useState('all');
    const [selectedStatus, setSelectedStatus] = React.useState('all');
    const [selectedCompany, setSelectedCompany] = React.useState('all');
    const [selectedEntity, setSelectedEntity] = React.useState('all');
    const [rawData, setRawData] = React.useState<any[]>([]);
    const [chartData, setChartData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    const years = React.useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: currentYear - 2022 }, (_, i) => (2023 + i).toString());
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('year', selectedYear);

                const response = await axios.post(route('getReportsMetrics', { type: 'cat' }), formData);
                setRawData(response.data.data);
                setChartData(buildChartData(response.data.data, titles, selectedMonth, selectedStatus, selectedCompany, selectedEntity));
            } catch (error) {
                console.error('Error fetching data:', error);
                setRawData([]);
                setChartData([{ report: 'Sin datos', visitors: 0, fill: '#CCCCCC' }]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedYear, titles]);

    React.useEffect(() => {
        setChartData(buildChartData(rawData, titles, selectedMonth, selectedStatus, selectedCompany, selectedEntity));
    }, [selectedMonth, selectedStatus, selectedCompany, selectedEntity, rawData, titles]);

    const yearOptions = years.map((year) => ({ value: year, label: year }));
    const monthOptions = [{ value: 'all', label: 'Todos' }, ...months];
    const statusOptions = [
        { value: 'all', label: 'Todos' },
        { value: 'Generado', label: 'Generado' },
        { value: 'Finalizado', label: 'Finalizado' },
    ];
    const companyOptions = [
        { value: 'all', label: 'Todas las compañías' },
        ...companies.map((company) => ({ value: company.id.toString(), label: company.nombre })),
    ];
    const entityOptions = [
        { value: 'all', label: 'Todas las entidades' },
        ...entities.map((entity) => ({ value: entity.id.toString(), label: entity.nombre })),
    ];

    const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0);

    return (
        <Card>
            <CardHeader className="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 text-center sm:text-left">
                    <CardTitle>Pie Chart - Donut with Text</CardTitle>
                    <CardDescription>Reporte de seguridad</CardDescription>
                </div>
                <div className="flex flex-wrap justify-center gap-4 sm:justify-end">
                    <CustomSelect
                        value={selectedYear}
                        onValueChange={setSelectedYear}
                        options={yearOptions}
                        placeholder="Seleccione un año"
                    />
                    <CustomSelect
                        value={selectedMonth}
                        onValueChange={setSelectedMonth}
                        options={monthOptions}
                        placeholder="Seleccione un mes"
                    />
                    <CustomSelect
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                        options={statusOptions}
                        placeholder="Seleccione un estado"
                    />
                    <CustomSelect
                        value={selectedCompany}
                        onValueChange={setSelectedCompany}
                        options={companyOptions}
                        placeholder="Seleccione una compañía"
                    />
                    <CustomSelect
                        value={selectedEntity}
                        onValueChange={setSelectedEntity}
                        options={entityOptions}
                        placeholder="Seleccione una entidad"
                    />
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {loading ? (
                    <div className="flex h-[320px] items-center justify-center">
                        <span>Loading...</span>
                    </div>
                ) : (
                    <ChartContainer config={initialChartConfig} className="mx-auto aspect-square max-h-[250px]">
                        <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie data={chartData} dataKey="visitors" nameKey="report" innerRadius={60} strokeWidth={5}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                        {totalVisitors.toLocaleString()}
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
                )}
            </CardContent>
        </Card>
    );
}
