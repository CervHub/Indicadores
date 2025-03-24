'use client';

import axios from 'axios';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { usePage } from '@inertiajs/react';

import { months } from '@/lib/utils';

const initialChartConfig = {
    visitors: {
        label: 'Número de reporte',
    },
} satisfies ChartConfig;

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#FF6384'];

interface ChartCatProps {
    pageType: string;
    companies: { id: number; nombre: string }[];
    entities: { id: number; nombre: string }[];
    categoriesData: { category_company_id: string; nombre: string }[];
}

const buildChartData = (
    rawData: any[],
    categories: { category_company_id: string; nombre: string }[],
    month: string,
    status: string,
    company: string,
    entity: string,
) => {
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
    const newChartData = categories.map((category, index) => {
        const count = entityFilteredData.filter((item) => parseInt(item.category_company_id) === parseInt(category.id)).length;
        return {
            report: category.nombre,
            visitors: count,
            fill: colors[index % colors.length],
        };
    });

    return newChartData;
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

export function Generic({ title, pageType, companies, entities, categoriesData }: ChartCatProps) {
    const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = React.useState('all');
    const [selectedStatus, setSelectedStatus] = React.useState('all');
    const [selectedCompany, setSelectedCompany] = React.useState('all');
    const [selectedEntity, setSelectedEntity] = React.useState('all');
    const [rawData, setRawData] = React.useState<any[]>([]);
    const [chartData, setChartData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const companyId = usePage().props.auth.user.company_id ?? null;

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
                formData.append('tipo_reporte', pageType);

                if (companyId) {
                    formData.append('company_id', companyId.toString());
                    formData.append('company_report_id', companyId.toString());
                }

                const response = await axios.post(route('getReportsMetrics', { type: 'cat' }), formData);
                setRawData(response.data.data);
                setChartData(buildChartData(response.data.data, categoriesData, selectedMonth, selectedStatus, selectedCompany, selectedEntity));
            } catch (error) {
                console.error('Error fetching data:', error);
                setRawData([]);
                setChartData([{ report: 'Sin datos', visitors: 0, fill: '#CCCCCC' }]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedYear, categoriesData]);

    React.useEffect(() => {
        setChartData(buildChartData(rawData, categoriesData, selectedMonth, selectedStatus, selectedCompany, selectedEntity));
    }, [selectedMonth, selectedStatus, selectedCompany, selectedEntity, rawData, categoriesData]);

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

    // Ordenar chartData por cantidad de visitantes de mayor a menor
    const sortedChartData = [...chartData].sort((a, b) => b.visitors - a.visitors);
    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap justify-center gap-4 sm:justify-end">
                        <CustomSelect value={selectedYear} onValueChange={setSelectedYear} options={yearOptions} placeholder="Seleccione un año" />
                        <CustomSelect value={selectedMonth} onValueChange={setSelectedMonth} options={monthOptions} placeholder="Seleccione un mes" />
                        <CustomSelect
                            value={selectedStatus}
                            onValueChange={setSelectedStatus}
                            options={statusOptions}
                            placeholder="Seleccione un estado"
                        />
                        {!companyId && (
                            <CustomSelect
                                value={selectedCompany}
                                onValueChange={setSelectedCompany}
                                options={companyOptions}
                                placeholder="Seleccione una compañía"
                            />
                        )}
                        <CustomSelect
                            value={selectedEntity}
                            onValueChange={setSelectedEntity}
                            options={entityOptions}
                            placeholder="Seleccione una entidad"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="h-[500px]">
                    <CardHeader className="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 text-center sm:text-left">
                            <CardTitle>Reporte Anual</CardTitle>
                            <CardDescription>{ title }</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex h-full justify-center">
                        {loading ? (
                            <div className="flex justify-center">
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <ChartContainer config={initialChartConfig} className="mx-auto aspect-square h-full">
                                <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Pie data={sortedChartData} dataKey="visitors" nameKey="report" innerRadius={60} strokeWidth={5}>
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
                                </PieChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-2 m-0 h-[500px] p-0">
                    <div className="max-h-full overflow-y-auto rounded-sm">
                        <table className="min-w-full divide-y divide-gray-200 rounded-full dark:divide-gray-700">
                            <thead className="sticky top-0 rounded-full bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                    >
                                        Categoría
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                    >
                                        Total
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                    >
                                        Porcentaje
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 rounded-b-sm bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {sortedChartData.map((data, index) => (
                                    <tr key={index}>
                                        <td className="max-w-[300px] truncate px-2 py-1 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                            {data.report}
                                        </td>
                                        <td className="px-2 py-1 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{data.visitors}</td>
                                        <td className="px-2 py-1 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                            {totalVisitors === 0 ? '0%' : ((data.visitors / totalVisitors) * 100).toFixed(2) + '%'}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="sticky bottom-0 bg-gray-50 dark:bg-gray-800">
                                    <td className="px-2 py-1 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">Total</td>
                                    <td className="px-2 py-1 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{totalVisitors}</td>
                                    <td className="px-2 py-1 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">100%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
