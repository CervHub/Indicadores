import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface ClosedByManagementChartProps {
    filters?: {
        status?: string;
        company?: string;
        reportType?: string;
        startDate?: string;
        endDate?: string;
    };
}

const chartConfig: ChartConfig = {
    cerrados: {
        label: 'Reportes Cerrados',
        color: 'hsl(var(--chart-1))',
    },
};

export default function ClosedByManagementChart({ filters }: ClosedByManagementChartProps) {
    // Synthetic data generation based on filters
    const generateChartData = () => {
        let baseData = [
            {
                gerencia: 'Operaciones Mina',
                cerrados: 45,
            },
            {
                gerencia: 'Mantenimiento',
                cerrados: 38,
            },
            {
                gerencia: 'Seguridad y Salud',
                cerrados: 52,
            },
            {
                gerencia: 'Recursos Humanos',
                cerrados: 23,
            },
            {
                gerencia: 'Medio Ambiente',
                cerrados: 31,
            },
            {
                gerencia: 'Logística',
                cerrados: 19,
            },
            {
                gerencia: 'Administración',
                cerrados: 15,
            },
            {
                gerencia: 'Planta',
                cerrados: 42,
            },
        ];

        // Apply filters to modify data
        if (filters?.company) {
            baseData = baseData.map(item => ({
                ...item,
                cerrados: Math.floor(item.cerrados * 0.6),
            }));
        }

        if (filters?.reportType) {
            // Simulate different closure rates by management for different report types
            const multipliers: { [key: string]: number } = {
                'actos': 0.8,
                'incidentes': 1.2,
                'condiciones': 0.9,
                'inspeccion': 1.1,
            };
            
            const multiplier = multipliers[filters.reportType] || 1;
            baseData = baseData.map(item => ({
                ...item,
                cerrados: Math.floor(item.cerrados * multiplier),
            }));
        }

        // If status filter is not 'cerrado', show 0 values
        if (filters?.status && filters.status !== 'cerrado') {
            baseData = baseData.map(item => ({
                ...item,
                cerrados: 0,
            }));
        }

        // Sort by cerrados descending
        return baseData.sort((a, b) => b.cerrados - a.cerrados);
    };

    const chartData = generateChartData();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reportes Cerrados por Gerencia</CardTitle>
                <CardDescription>
                    Cantidad de reportes cerrados por cada gerencia
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
                                dataKey="gerencia" 
                                type="category" 
                                width={140}
                                tick={{ fontSize: 12 }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Bar 
                                dataKey="cerrados" 
                                fill="var(--color-cerrados)" 
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
