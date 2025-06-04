import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface FindingsByEventRiskChartProps {
    filters?: {
        status?: string;
        company?: string;
        reportType?: string;
        startDate?: string;
        endDate?: string;
    };
}

const chartConfig: ChartConfig = {
    bajo: {
        label: 'Riesgo Bajo',
        color: 'hsl(var(--chart-1))',
    },
    medio: {
        label: 'Riesgo Medio',
        color: 'hsl(var(--chart-2))',
    },
    alto: {
        label: 'Riesgo Alto',
        color: 'hsl(var(--chart-3))',
    },
    critico: {
        label: 'Riesgo Crítico',
        color: 'hsl(var(--chart-4))',
    },
};

export default function FindingsByEventRiskChart({ filters }: FindingsByEventRiskChartProps) {
    // Synthetic data generation based on filters
    const generateChartData = () => {
        let baseData = [
            {
                evento: 'Accidente de Trabajo',
                bajo: 15,
                medio: 32,
                alto: 28,
                critico: 8,
            },
            {
                evento: 'Incidente Ambiental',
                bajo: 25,
                medio: 18,
                alto: 12,
                critico: 5,
            },
            {
                evento: 'Condición Subestándar',
                bajo: 40,
                medio: 45,
                alto: 22,
                critico: 3,
            },
            {
                evento: 'Acto Subestándar',
                bajo: 35,
                medio: 28,
                alto: 15,
                critico: 7,
            },
            {
                evento: 'Cuasi Accidente',
                bajo: 20,
                medio: 25,
                alto: 18,
                critico: 12,
            },
            {
                evento: 'Falla de Equipo',
                bajo: 30,
                medio: 22,
                alto: 16,
                critico: 9,
            },
        ];

        // Apply filters to modify data
        if (filters?.company) {
            baseData = baseData.map(item => ({
                ...item,
                bajo: Math.floor(item.bajo * 0.7),
                medio: Math.floor(item.medio * 0.7),
                alto: Math.floor(item.alto * 0.7),
                critico: Math.floor(item.critico * 0.7),
            }));
        }

        if (filters?.reportType) {
            // Filter by specific report type
            const reportTypeMap: { [key: string]: string[] } = {
                'actos': ['Acto Subestándar'],
                'incidentes': ['Accidente de Trabajo', 'Incidente Ambiental', 'Cuasi Accidente'],
                'condiciones': ['Condición Subestándar', 'Falla de Equipo'],
            };

            const relevantEvents = reportTypeMap[filters.reportType] || [];
            if (relevantEvents.length > 0) {
                baseData = baseData.filter(item => relevantEvents.includes(item.evento));
            }
        }

        if (filters?.status === 'cerrado') {
            baseData = baseData.map(item => ({
                ...item,
                bajo: Math.floor(item.bajo * 0.8),
                medio: Math.floor(item.medio * 0.75),
                alto: Math.floor(item.alto * 0.7),
                critico: Math.floor(item.critico * 0.6),
            }));
        }

        return baseData;
    };

    const chartData = generateChartData();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Hallazgos por Evento No Deseado y Nivel de Riesgo</CardTitle>
                <CardDescription>
                    Distribución horizontal de hallazgos por tipo de evento y nivel de riesgo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={chartData}
                            layout="horizontal"
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis type="number" />
                            <YAxis 
                                dataKey="evento" 
                                type="category" 
                                width={120}
                                tick={{ fontSize: 12 }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Bar 
                                dataKey="bajo" 
                                stackId="a" 
                                fill="var(--color-bajo)" 
                            />
                            <Bar 
                                dataKey="medio" 
                                stackId="a" 
                                fill="var(--color-medio)" 
                            />
                            <Bar 
                                dataKey="alto" 
                                stackId="a" 
                                fill="var(--color-alto)" 
                            />
                            <Bar 
                                dataKey="critico" 
                                stackId="a" 
                                fill="var(--color-critico)" 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
