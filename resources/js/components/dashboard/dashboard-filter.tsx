import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface FilterFormData {
    status: string;
    company: string;
    reportType: string;
    startDate: string;
    endDate: string;
}

interface DashboardFilterProps {
    companies: any[];
    titles: any[];
    onFiltersChange: (filters: FilterFormData) => void;
}

export default function DashboardFilter({ companies, titles, onFiltersChange }: DashboardFilterProps) {
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
    };    const handleApplyFilters = () => {
        console.log('Applied filters:', filters);
        
        // Notificar al componente padre sobre el cambio de filtros
        onFiltersChange(filters);
    };

    const handleResetFilters = () => {
        const now = new Date();
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        
        const resetFilters = {
            status: '',
            company: '',
            reportType: '',
            startDate: lastYear.toISOString().split('T')[0],
            endDate: now.toISOString().split('T')[0]
        };
        
        setFilters(resetFilters);
        onFiltersChange(resetFilters);
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
    );
}
