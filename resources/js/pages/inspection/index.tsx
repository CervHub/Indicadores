import { getColumns } from '@/components/inspection/columns';
import { DataTable } from '@/components/inspection/data-table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, ReportabilityVehicle } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios'; // Import axios
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, FileTextIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner'; // Import toast

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reportabilidad',
        href: '/admin/reportability',
    },
];


export default function ReportabilityPage() {
    const { inspectionVehicles, isSecurityEngineer } = usePage<{ inspectionVehicles: ReportabilityVehicle[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportabilidad de inspecciones" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={getColumns(isSecurityEngineer)} data={inspectionVehicles} />

            </div>
        </AppLayout>
    );
}
