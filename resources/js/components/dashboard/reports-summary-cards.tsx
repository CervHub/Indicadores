import { Card, CardContent } from '@/components/ui/card';
import { FileText, Eye, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';

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
                    counts.visualizados++;
                    break;
                case 'Cerrado':
                    counts.cerrados++;
                    break;
            }
        });

        return counts;
    }, [data]);

    return (
        <div className="flex flex-col gap-3 h-[200px]">
            <Card className="flex-1 flex flex-col justify-center">
                <CardContent className="">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-xs font-medium text-muted-foreground">Generados</span>
                        </div>
                        <div className="text-lg font-bold">{reportCounts.generados}</div>
                    </div>
                </CardContent>
            </Card>

            <Card className="flex-1 flex flex-col justify-center">
                <CardContent className="">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-orange-500" />
                            <span className="text-xs font-medium text-muted-foreground">Visualizados</span>
                        </div>
                        <div className="text-lg font-bold">{reportCounts.visualizados}</div>
                    </div>
                </CardContent>
            </Card>

            <Card className="flex-1 flex flex-col justify-center">
                <CardContent className="">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium text-muted-foreground">Cerrados</span>
                        </div>
                        <div className="text-lg font-bold">{reportCounts.cerrados}</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
