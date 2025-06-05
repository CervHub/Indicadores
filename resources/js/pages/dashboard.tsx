import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Report } from '@/types';

// Dashboard Components
import ReportsSummaryCards from '@/components/dashboard/reports-summary-cards';
import ReportsStatusChart from '@/components/dashboard/reports-status-chart';
import ReportsRaisedAndClosurePercentageByDateChart from '@/components/dashboard/reports-raised-and-closure-percentage-by-date-chart';
import ClosedByManagementChart from '@/components/dashboard/closed-by-management-chart';
import ClosedByResponsibleChart from '@/components/dashboard/closed-by-responsible-chart';
import AverageClosureDaysByGravityChart from '@/components/dashboard/average-closure-days-by-gravity-chart';
import ClosedByReporterChart from '@/components/dashboard/closed-by-reporter-chart';
import ResponsibleStatusDistributionChart from '@/components/dashboard/responsible-status-distribution-chart';
import CauseByReportTypeChart from '@/components/dashboard/cause-by-report-type-chart';
import ReportsDetailTable from '@/components/dashboard/reports-detail-table';
import DashboardFilter from '@/components/dashboard/dashboard-filter';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    companies: any[];
    entities: any[];
    titles: any[];
}

interface FilterFormData {
    status: string;
    company: string;
    reportType: string;
    startDate: string;
    endDate: string;
}



interface DashboardData {
    success?: boolean;
    data?: Report[];
}

export default function Dashboard({ companies, entities, titles }: DashboardProps) {
    const [filters, setFilters] = useState<FilterFormData>({
        status: '',
        company: '',
        reportType: '',
        startDate: '',
        endDate: ''
    });

    const [data, setData] = useState<DashboardData>({});
    const [filteredData, setFilteredData] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);

    // Función para aplicar filtros locales a los datos
    const applyLocalFilters = (rawData: Report[], currentFilters: FilterFormData): Report[] => {
        if (!rawData || !Array.isArray(rawData)) return [];

        return rawData.filter(report => {
            // Filtro por estado
            if (currentFilters.status && currentFilters.status !== 'Todos') {
                if (currentFilters.status === 'Generado') {
                    // Para "Generado", incluir reportes con estado "Generado" Y también los null/undefined
                    if (report.estadoReporte !== 'Generado' && report.estadoReporte !== null && report.estadoReporte !== undefined && report.estadoReporte !== '') {
                        return false;
                    }
                } else {
                    // Para otros estados, filtrar exactamente
                    if (report.estadoReporte !== currentFilters.status) {
                        return false;
                    }
                }
            }

            // Filtro por compañía
            if (currentFilters.company && report.idEmpresaReportada !== currentFilters.company) {
                return false;
            }

            // Filtro por tipo de reporte
            if (currentFilters.reportType && currentFilters.reportType !== 'Todos' && report.tipoReporte !== currentFilters.reportType) {
                return false;
            }

            return true;
        });
    };

    // Función para hacer la llamada a la API
    const fetchDashboardData = async (filtersToApply: FilterFormData) => {
        try {
            setLoading(true);
            console.log('🔍 Aplicando filtros a la API:', filtersToApply);

            const response = await axios.get(route('api.dashboard.index'), {
                params: filtersToApply
            });

            console.log('📥 Respuesta de la API:', response.data);
            console.log('📊 Cantidad de reportes recibidos:', response.data.data?.length || 0);
            setData(response.data);

            // Aplicar filtros locales a los datos recibidos
            const filtered = applyLocalFilters(response.data.data || [], filtersToApply);
            setFilteredData(filtered);

            console.log('✅ Data actualizada en el estado principal:', response.data);
            console.log('🎯 Data filtrada localmente (cantidad):', filtered.length);
            console.log('🎯 Data filtrada localmente (contenido):', filtered);

        } catch (error) {
            console.error('Error al obtener datos del dashboard:', error);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    // Inicializar filtros con fechas por defecto
    useEffect(() => {
        const now = new Date();
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

        const initialFilters = {
            status: '',
            company: '',
            reportType: '',
            startDate: lastYear.toISOString().split('T')[0],
            endDate: now.toISOString().split('T')[0]
        };

        console.log('🚀 Inicializando Dashboard con filtros por defecto:', initialFilters);
        setFilters(initialFilters);
        // Cargar datos iniciales
        fetchDashboardData(initialFilters);
    }, []);

    const handleFiltersChange = (newFilters: FilterFormData) => {
        const previousFilters = filters;
        setFilters(newFilters);
        console.log('🔄 Filtros actualizados en Dashboard:', newFilters);
        console.log('🔄 Filtros anteriores:', previousFilters);

        // Verificar si cambiaron las fechas para decidir si hacer llamada a la API
        const datesChanged =
            previousFilters.startDate !== newFilters.startDate ||
            previousFilters.endDate !== newFilters.endDate;

        if (datesChanged) {
            // Si cambiaron las fechas, hacer llamada a la API
            console.log('📅 Las fechas cambiaron, consultando API...');
            console.log('📅 Fecha anterior: startDate =', previousFilters.startDate, ', endDate =', previousFilters.endDate);
            console.log('📅 Fecha nueva: startDate =', newFilters.startDate, ', endDate =', newFilters.endDate);
            fetchDashboardData(newFilters);
        } else {
            // Si solo cambiaron otros filtros, aplicar filtrado local
            console.log('🏠 Solo cambiaron filtros locales, aplicando filtrado...');
            console.log('🏠 Filtros que cambiaron (sin fechas):', {
                status: previousFilters.status !== newFilters.status ? { anterior: previousFilters.status, nuevo: newFilters.status } : 'sin cambio',
                company: previousFilters.company !== newFilters.company ? { anterior: previousFilters.company, nuevo: newFilters.company } : 'sin cambio',
                reportType: previousFilters.reportType !== newFilters.reportType ? { anterior: previousFilters.reportType, nuevo: newFilters.reportType } : 'sin cambio'
            });
            console.log('🏠 Data disponible para filtrar (cantidad):', data.data?.length || 0);
            const filtered = applyLocalFilters(data.data || [], newFilters);
            setFilteredData(filtered);
            console.log('🏠 Data filtrada localmente (cantidad):', filtered.length);
            console.log('🏠 Data filtrada localmente (contenido):', filtered);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 pt-0">
                <DashboardFilter
                    companies={companies}
                    titles={titles}
                    onFiltersChange={handleFiltersChange}
                />

                {/* Row 1: Reports Summary Cards and Status Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <ReportsSummaryCards data={filteredData} />
                    <div className='col-span-1 lg:col-span-3'>
                        <ReportsStatusChart data={filteredData} />
                    </div>
                </div>

                {/* Row 4: Status Distribution by Responsible and Closed by Reporter */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <ReportsRaisedAndClosurePercentageByDateChart data={filteredData} />
                    <ClosedByManagementChart data={filteredData} />
                    <ClosedByResponsibleChart data={filteredData} />
                    <AverageClosureDaysByGravityChart data={filteredData} />
                    <ResponsibleStatusDistributionChart data={filteredData} />
                    <ClosedByReporterChart data={filteredData} />
                    <CauseByReportTypeChart data={filteredData} />
                    <div className='col-span-1 lg:col-span-2'>
                        <ReportsDetailTable data={filteredData} />
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
