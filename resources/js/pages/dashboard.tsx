import LineChartComponent from '@/components/charts/line-chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

// Dashboard Components
import ReportsSummaryCards from '@/components/dashboard/reports-summary-cards';
import ReportsStatusChart from '@/components/dashboard/reports-status-chart';
import FindingsByEventRiskChart from '@/components/dashboard/findings-by-event-risk-chart';
import ClosedByManagementChart from '@/components/dashboard/closed-by-management-chart';

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

export default function Dashboard({ companies, entities, titles }: DashboardProps) {
    const [filters, setFilters] = useState<FilterFormData>({
        status: '',
        company: '',
        reportType: '',
        startDate: '',
        endDate: ''
    });

    // Initialize with last year date range
    useEffect(() => {
        const now = new Date();
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        
        setFilters(prev => ({
            ...prev,
            startDate: lastYear.toISOString().split('T')[0],
            endDate: now.toISOString().split('T')[0]
        }));
    }, []);

    const handleFilterChange = (key: keyof FilterFormData, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleApplyFilters = () => {
        // This function will be used to apply filters to charts
        console.log('Applied filters:', filters);
        // TODO: Apply filters to charts
    };

    const handleResetFilters = () => {
        const now = new Date();
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        
        setFilters({
            status: '',
            company: '',
            reportType: '',
            startDate: lastYear.toISOString().split('T')[0],
            endDate: now.toISOString().split('T')[0]
        });
    };

    const statusOptions = [
        { label: 'Abierto', value: 'abierto' },
        { label: 'Visualizado', value: 'visualizado' },
        { label: 'Cerrado', value: 'cerrado' }
    ];

    const companyOptions = companies.map(company => ({
        label: company.name || company.nombre || 'Empresa',
        value: company.id?.toString() || ''
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 pt-0">
                <div className="sticky top-10 z-10 bg-white p-3">
                    <h2 className="text-lg font-semibold mb-3">Filtros</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleApplyFilters(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Estado</label>
                                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((status, index) => (
                                            <SelectItem key={index} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Empresa</label>
                                <Combobox
                                    data={companyOptions}
                                    value={filters.company}
                                    onChange={(value) => handleFilterChange('company', value)}
                                    placeholder="Seleccionar empresa"
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium">Tipo de reporte</label>
                                <Select value={filters.reportType} onValueChange={(value) => handleFilterChange('reportType', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(titles).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Fecha Desde</label>
                                <Input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Fecha Hasta</label>
                                <Input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <Button type="submit">
                                Aplicar Filtros
                            </Button>
                            <Button type="button" variant="outline" onClick={handleResetFilters}>
                                Limpiar Filtros
                            </Button>
                        </div>
                    </form>
                </div>
                
                {/* Row 1: Reports Summary Cards and Status Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ReportsSummaryCards filters={filters} />
                    <ReportsStatusChart filters={filters} />
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
