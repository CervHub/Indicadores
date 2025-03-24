import React, { useMemo } from 'react';
import { Annex } from '@/components/file-status/show/annex';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartComponentProps {
    data: {
        annex24: Annex[];
        annex25: Annex[];
        annex26: Annex[];
        annex27: Annex[];
    };
}

const chartConfig = {
    annex24: { label: 'Anexo 24', color: '#FF8A65' },
    annex25: { label: 'Anexo 25', color: '#FFD54F' },
    annex26: { label: 'Anexo 26', color: '#4DB6AC' },
    annex27: { label: 'Anexo 27', color: '#4FC3F7' },
};

function transformData(data: any) {
    const days = Array.from({ length: 22 }, (_, i) => `day${i + 1}`);
    const transformed = days.map((day, index) => ({
        day: `Día ${index + 1}`,
        annex24: data.annex24?.reduce((sum: number, item: any) => sum + (item[day] ? parseInt(item[day], 10) : 0), 0) || 0,
        annex25: data.annex25?.reduce((sum: number, item: any) => sum + (item[day] ? parseInt(item[day], 10) : 0), 0) || 0,
        annex26: data.annex26?.reduce((sum: number, item: any) => sum + (item[day] ? parseInt(item[day], 10) : 0), 0) || 0,
        annex27: data.annex27?.reduce((sum: number, item: any) => sum + (item[day] ? parseInt(item[day], 10) : 0), 0) || 0,
    }));
    return transformed;
}

function getheader(data: any) {
    const totalEmployees = data.minem_template1?.reduce((sum: number, item: any) => sum + (item.total_employees ? parseFloat(item.total_employees) : 0), 0) || 0;
    const totalHours = data.minem_template1?.reduce((sum: number, item: any) => sum + (item.total_hours_employees ? parseFloat(item.total_hours_employees) : 0), 0) || 0;
    return { totalEmployees, totalHours };
}

export default function ChartComponent({ data }: ChartComponentProps) {
    const chartData = useMemo(() => transformData(data), [data]);
    const header = useMemo(() => getheader(data), [data]);

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Resumen</CardTitle>
                    <CardDescription>Muestra un resumen general de los ANEXOS y MINEM.</CardDescription>
                </div>
                <div className="flex">
                    <div
                        data-active={true}
                        className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-3 py-1 text-left even:border-l sm:border-t-0 sm:border-l"
                    >
                        <span className="text-muted-foreground text-xs">T. Trab.</span>
                        <span className="text-lg leading-none font-bold sm:text-3xl">{header.totalEmployees}</span>
                    </div>
                    <div
                        data-active={true}
                        className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-3 py-1 text-left even:border-l sm:border-t-0 sm:border-l"
                    >
                        <span className="text-muted-foreground text-xs">H. de Tra.</span>
                        <span className="text-lg leading-none font-bold sm:text-3xl">{header.totalHours}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-1">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="day" tickMargin={8} minTickGap={32} />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        {Object.keys(chartConfig).map((key) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={chartConfig[key as keyof typeof chartConfig].color}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
