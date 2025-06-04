import LineChartComponent from '@/components/charts/line-chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Report } from '@/types';

// Dashboard Components
import ReportsSummaryCards from '@/components/dashboard/reports-summary-cards';
import ReportsStatusChart from '@/components/dashboard/reports-status-chart';
import FindingsByEventRiskChart from '@/components/dashboard/findings-by-event-risk-chart';
import ClosedByManagementChart from '@/components/dashboard/closed-by-management-chart';
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
                        <ReportsStatusChart filters={filters} />
                    </div>
                </div>

                {/* Row 2: Findings by Event/Risk and Closed by Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FindingsByEventRiskChart filters={filters} />
                    <ClosedByManagementChart filters={filters} />
                </div>
            </div>
        </AppLayout>
    );
}
