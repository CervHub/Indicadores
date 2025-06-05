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
    const [loading, setLoading] = useState(false);

    // Función para hacer la llamada a la API
    const fetchDashboardData = async (filtersToApply: FilterFormData) => {
        try {
            setLoading(true);
            console.log('Aplicando filtros:', filtersToApply);

            const response = await axios.get(route('api.dashboard.index'), {
                params: filtersToApply
            });

            console.log('Respuesta de la API:', response.data);
            setData(response.data);
            console.log('Data actualizada en el estado principal:', response.data);

        } catch (error) {
            console.error('Error al obtener datos del dashboard:', error);
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

        setFilters(initialFilters);
        // Cargar datos iniciales
        fetchDashboardData(initialFilters);
    }, []);

    const handleFiltersChange = (newFilters: FilterFormData) => {
        setFilters(newFilters);
        console.log('Filtros actualizados en Dashboard:', newFilters);
        // Hacer la llamada a la API cuando cambien los filtros
        fetchDashboardData(newFilters);
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
                    <ReportsSummaryCards data={data.data} />
                    <div className='col-span-1 lg:col-span-3'>
                        <ReportsStatusChart data={data.data}/>
                    </div>
                </div>

                {/* Row 2: Findings by Event/Risk and Closed by Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ReportsRaisedAndClosurePercentageByDateChart data={data.data} />
                    <ClosedByManagementChart data={data.data} />
                </div>

                {/* Row 3: Closed by Responsible and Average Closure Days by Gravity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ClosedByResponsibleChart data={data.data} />
                    <AverageClosureDaysByGravityChart data={data.data} />
                </div>

                {/* Row 4: Status Distribution by Responsible and Closed by Reporter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ResponsibleStatusDistributionChart data={data.data} />
                    <ClosedByReporterChart data={data.data} />
                </div>

                {/* Row 5: Cause by Report Type and Reports Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <CauseByReportTypeChart data={data.data} />
                    <ReportsDetailTable data={data.data} />
                </div>
            </div>
        </AppLayout>
    );
}
