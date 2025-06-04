import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface ReportsStatusChartProps {
    filters?: {
        status?: string;
        company?: string;
        reportType?: string;
        startDate?: string;
        endDate?: string;
    };
}

const chartConfig: ChartConfig = {
    abiertos: {
        label: 'Abiertos',
        color: 'hsl(var(--chart-1))',
    },
    visualizados: {
        label: 'Visualizados',
        color: 'hsl(var(--chart-2))',
    },
    cerrados: {
        label: 'Cerrados',
        color: 'hsl(var(--chart-3))',
    },
};

export default function ReportsStatusChart({ filters }: ReportsStatusChartProps) {
    // Synthetic data generation based on filters
    const generateChartData = () => {
        let baseData = [
            {
                month: 'Ene',
                abiertos: 45,
                visualizados: 30,
                cerrados: 65,
            },
            {
                month: 'Feb',
                abiertos: 52,
                visualizados: 35,
                cerrados: 58,
            },
            {
                month: 'Mar',
                abiertos: 38,
                visualizados: 42,
                cerrados: 70,
            },
            {
                month: 'Abr',
                abiertos: 61,
                visualizados: 28,
                cerrados: 55,
            },
            {
                month: 'May',
                abiertos: 49,
                visualizados: 38,
                cerrados: 62,
            },
            {
                month: 'Jun',
                abiertos: 55,
                visualizados: 33,
                cerrados: 68,
            },
        ];

        // Apply filters to modify data
        if (filters?.status) {
            baseData = baseData.map(item => {
                if (filters.status === 'abierto') {
                    return { ...item, visualizados: 0, cerrados: 0 };
                } else if (filters.status === 'visualizado') {
                    return { ...item, abiertos: 0, cerrados: 0 };
                } else if (filters.status === 'cerrado') {
                    return { ...item, abiertos: 0, visualizados: 0 };
                }
                return item;
            });
        }

        if (filters?.company) {
            baseData = baseData.map(item => ({
                ...item,
                abiertos: Math.floor(item.abiertos * 0.6),
                visualizados: Math.floor(item.visualizados * 0.6),
                cerrados: Math.floor(item.cerrados * 0.6),
            }));
        }

        if (filters?.reportType) {
            baseData = baseData.map(item => ({
                ...item,
                abiertos: Math.floor(item.abiertos * 0.4),
                visualizados: Math.floor(item.visualizados * 0.4),
                cerrados: Math.floor(item.cerrados * 0.4),
            }));
        }

        return baseData;
    };

    const chartData = generateChartData();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Estado de Reportes</CardTitle>
                <CardDescription>
                    Distribución mensual de reportes por estado
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <XAxis 
                                dataKey="month" 
                                tickLine={false}
                                axisLine={false}
                                className="text-xs"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                className="text-xs"
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Bar 
                                dataKey="abiertos" 
                                fill="var(--color-abiertos)" 
                                radius={[0, 0, 4, 4]}
                            />
                            <Bar 
                                dataKey="visualizados" 
                                fill="var(--color-visualizados)" 
                                radius={[0, 0, 4, 4]}
                            />
                            <Bar 
                                dataKey="cerrados" 
                                fill="var(--color-cerrados)" 
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
