import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, BarChart3 } from 'lucide-react';
import { useMemo } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface ReportsSummaryCardsProps {
    data?: any[];
}

export default function ReportsSummaryCards({ data = [] }: ReportsSummaryCardsProps) {
    const reportCounts = useMemo(() => {
        const counts = {
            generados: 0,
            visualizados: 0,
            cerrados: 0
        };

        data.forEach(report => {
            switch (report.estadoReporte) {
                case 'Generado':
                    counts.generados++;
                    break;
                case 'Visualizado':
                case 'Revisado':
                    counts.visualizados++;
                    break;
                case 'Cerrado':
                case 'Finalizado':
                    counts.cerrados++;
                    break;
            }
        });

        return {
            ...counts,
            abierto: counts.generados + counts.visualizados,
            total: counts.generados + counts.visualizados + counts.cerrados
        };
    }, [data]);

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-3 h-[200px]">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Card className="flex-1 flex flex-col justify-center cursor-help">
                            <CardContent className="">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-orange-500" />
                                        <span className="text-xs font-medium text-muted-foreground">Abierto</span>
                                    </div>
                                    <div className="text-lg font-bold">{reportCounts.abierto}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="text-sm">
                            <p>Sin revisar: {reportCounts.generados} (No vistos ni cerrados por Ing. de Seguridad)</p>
                            <p>Revisados: {reportCounts.visualizados} (Visualizados por Ing. de Seguridad)</p>
                        </div>
                    </TooltipContent>
                </Tooltip>

                <Card className="flex-1 flex flex-col justify-center">
                    <CardContent className="">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-xs font-medium text-muted-foreground">Cerrados</span>
                            </div>
                            <div className="text-lg font-bold" title="Reportes donde el Ing. de Seguridad ya tomó cartas en el asunto">{reportCounts.cerrados}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col justify-center">
                    <CardContent className="">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-blue-500" />
                                <span className="text-xs font-medium text-muted-foreground">Total Reportes</span>
                            </div>
                            <div className="text-lg font-bold" title="Todos los reportes en el rango de fecha seleccionado">{reportCounts.total}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
}
