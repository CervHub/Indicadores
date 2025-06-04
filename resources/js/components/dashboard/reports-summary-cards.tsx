import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReportsSummaryCardsProps {
    filters?: {
        status?: string;
        company?: string;
        reportType?: string;
        startDate?: string;
        endDate?: string;
    };
}

export default function ReportsSummaryCards({ filters }: ReportsSummaryCardsProps) {
    // Synthetic data - in a real app this would come from an API call using the filters
    const generateSyntheticData = () => {
        // Base data
        let reportesGenerados = 245;
        let reportesCerrados = 180;
        
        // Apply filters to modify data (synthetic filtering)
        if (filters?.status) {
            if (filters.status === 'cerrado') {
                reportesGenerados = reportesCerrados;
            } else if (filters.status === 'abierto') {
                reportesGenerados = reportesGenerados - reportesCerrados;
                reportesCerrados = 0;
            }
        }
        
        if (filters?.company) {
            // Simulate company-specific data
            reportesGenerados = Math.floor(reportesGenerados * 0.6);
            reportesCerrados = Math.floor(reportesCerrados * 0.6);
        }
        
        if (filters?.reportType) {
            // Simulate report type filtering
            reportesGenerados = Math.floor(reportesGenerados * 0.4);
            reportesCerrados = Math.floor(reportesCerrados * 0.4);
        }
        
        return {
            reportesGenerados,
            reportesCerrados,
            porcentajeCierre: reportesGenerados > 0 ? Math.round((reportesCerrados / reportesGenerados) * 100) : 0
        };
    };

    const data = generateSyntheticData();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Reportes Generados
                    </CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.reportesGenerados}</div>
                    <p className="text-xs text-muted-foreground">
                        Total de reportes en el período seleccionado
                    </p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Reportes Cerrados
                    </CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.reportesCerrados}</div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>Porcentaje de cierre:</span>
                        <Badge variant={data.porcentajeCierre >= 70 ? "default" : "secondary"}>
                            {data.porcentajeCierre}%
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
