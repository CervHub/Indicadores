'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
    FileText, 
    CheckCircle, 
    Clock, 
    TrendingUp
} from 'lucide-react';
import { useMemo } from 'react';
import { LabelList, Pie, PieChart } from 'recharts';

interface ReportsOverviewCombinedProps {
    data?: any[];
}

const chartConfig: ChartConfig = {
    count: {
        label: 'Reportes',
    },
    abierto: {
        label: 'ABIERTO',
        color: '#ef4444', // red-500
    },
    cerrado: {
        label: 'CERRADO',
        color: '#22c55e', // green-500
    },
} satisfies ChartConfig;

export default function ReportsOverviewCombined({ data = [] }: ReportsOverviewCombinedProps) {
    const reportStats = useMemo(() => {
        const counts = {
            abierto: 0,
            cerrado: 0,
        };

        data.forEach((report) => {
            const status = report.estadoReporte?.toLowerCase();
            if (status === 'cerrado' || status === 'finalizado') {
                counts.cerrado++;
            } else {
                counts.abierto++;
            }
        });

        const total = counts.abierto + counts.cerrado;
        const closureRate = total > 0 ? ((counts.cerrado / total) * 100).toFixed(2) : '0.00';

        return {
            ...counts,
            total,
            closureRate: parseFloat(closureRate),
        };
    }, [data]);

    const chartData = useMemo(() => {
        const items = [
            {
                status: 'abierto',
                count: reportStats.abierto,
                fill: chartConfig.abierto.color,
            },
            {
                status: 'cerrado',
                count: reportStats.cerrado,
                fill: chartConfig.cerrado.color,
            },
        ];

        return items.filter(item => item.count > 0);
    }, [reportStats]);

    const topStatus = useMemo(() => {
        if (chartData.length === 0) return '';
        
        const maxItem = chartData.reduce((max, item) => 
            item.count > max.count ? item : max, chartData[0]
        );
        
        return chartConfig[maxItem.status as keyof typeof chartConfig]?.label || '';
    }, [chartData]);

    return (
        <Card className="col-span-full lg:col-span-2 border shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                    <FileText className="h-4 w-4 text-primary" />
                    Resumen de Reportes
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                    Vista general del estado y distribución de reportes
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Sección de tarjetas de resumen */}
                    <div className="space-y-4">
                        {/* Tarjetas principales */}
                        <div className="grid grid-cols-2 gap-2">
                            <Card className="border-border/30 bg-card hover:shadow-sm transition-shadow duration-200">
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground">Total</p>
                                            <p className="text-xl font-bold text-foreground">{reportStats.total}</p>
                                        </div>
                                        <div className="rounded-md bg-muted/50 p-1.5">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/30 bg-card hover:shadow-sm transition-shadow duration-200">
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground">Cerrados</p>
                                            <p className="text-xl font-bold text-foreground">{reportStats.cerrado}</p>
                                        </div>
                                        <div className="rounded-md bg-emerald-100/50 p-1.5">
                                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/30 bg-card hover:shadow-sm transition-shadow duration-200">
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground">Abiertos</p>
                                            <p className="text-xl font-bold text-foreground">{reportStats.abierto}</p>
                                        </div>
                                        <div className="rounded-md bg-red-100/50 p-1.5">
                                            <Clock className="h-4 w-4 text-red-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/30 bg-card hover:shadow-sm transition-shadow duration-200">
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground">% Cierre</p>
                                            <p className="text-xl font-bold text-foreground">{reportStats.closureRate}%</p>
                                        </div>
                                        <div className="rounded-md bg-violet-100/50 p-1.5">
                                            <TrendingUp className="h-4 w-4 text-violet-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Desglose detallado */}
                        <Card className="border-border/30 bg-card">
                            <CardContent className="p-3 space-y-3">
                                <h4 className="text-xs font-semibold text-foreground">Desglose por Estado</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md border border-border/20 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-1 mb-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartConfig.abierto.color }}></div>
                                            <span className="text-xs font-medium text-foreground">Abierto</span>
                                        </div>
                                        <span className="text-sm font-bold text-foreground">{reportStats.abierto}</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md border border-border/20 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-1 mb-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartConfig.cerrado.color }}></div>
                                            <span className="text-xs font-medium text-foreground">Cerrado</span>
                                        </div>
                                        <span className="text-sm font-bold text-foreground">{reportStats.cerrado}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sección del gráfico circular */}
                    <div className="flex flex-col space-y-3">
                        <div className="text-center space-y-1">
                            <h3 className="text-base font-semibold text-foreground">Distribución por Estado</h3>
                            <p className="text-xs text-muted-foreground">Representación visual de los estados</p>
                        </div>
                        {chartData.length > 0 ? (
                            <div className="space-y-3">
                                <ChartContainer
                                    config={chartConfig}
                                    className="mx-auto aspect-square max-h-[250px] [&_.recharts-pie-label-text]:fill-background"
                                >
                                    <PieChart>
                                        <ChartTooltip
                                            cursor={false}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    const percentage = reportStats.total > 0 ? 
                                                        ((data.count / reportStats.total) * 100).toFixed(2) : '0.00';
                                                    return (
                                                        <Card className="border-border/50 shadow-lg">
                                                            <CardContent className="p-3">
                                                                <div className="space-y-1">
                                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                        {chartConfig[data.status as keyof typeof chartConfig]?.label}
                                                                    </p>
                                                                    <p className="text-sm font-bold text-foreground">
                                                                        {data.count} reportes ({percentage}%)
                                                                    </p>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Pie
                                            data={chartData}
                                            dataKey="count"
                                            nameKey="status"
                                            innerRadius={60}
                                            outerRadius={120}
                                            paddingAngle={0}
                                            stroke="hsl(var(--background))"
                                            strokeWidth={2}
                                        >
                                            <LabelList
                                                dataKey="count"
                                                className="fill-background font-bold drop-shadow-sm"
                                                stroke="hsl(var(--foreground))"
                                                strokeWidth={0.3}
                                                fontSize={13}
                                                formatter={(value: number) => {
                                                    if (reportStats.total === 0) return '0';
                                                    const percentage = ((value / reportStats.total) * 100).toFixed(2);
                                                    return value > 0 ? `${value}\n${percentage}%` : '';
                                                }}
                                            />
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                                
                                <Card className="border-border/30 bg-muted/20">
                                    <CardContent className="p-3 text-center space-y-1">
                                        <div className="flex items-center justify-center gap-2 text-xs font-medium text-foreground">
                                            <span className="inline-flex items-center gap-1">
                                                {topStatus} es el estado más común
                                                <TrendingUp className="h-3 w-3 text-primary" />
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Análisis de {reportStats.total} reportes en total
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card className="border-dashed border-2 border-border/30">
                                <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
                                    <div className="text-center space-y-2">
                                        <FileText className="h-8 w-8 mx-auto opacity-40" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">No hay datos disponibles</p>
                                            <p className="text-xs text-muted-foreground/70">Los reportes aparecerán aquí cuando estén disponibles</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
