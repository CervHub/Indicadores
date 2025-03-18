import { Reportability, getColumns } from '@/components/reportability/columns';
import { DataTable } from '@/components/reportability/data-table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, FileTextIcon, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reportabilidad',
        href: '/admin/reportability',
    },
    {
        title: 'Detalle',
        href: '/admin/reportability/detalle',
    },
];

export default function ReportabilityPage() {
    const { reportabilities } = usePage<{ reportabilities: Reportability[] }>().props;

    useEffect(() => {
        console.log('Reportabilities: ', JSON.stringify(reportabilities));
    }, [reportabilities]);

    const handleActionClick = (action: string, report: Reportability) => {
        console.log(`Action: ${action}, Report ID: ${report.id}`);
        // Aquí puedes agregar la lógica adicional para manejar las acciones
    };

    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());

    const handleDownload = () => {
        console.log('Download Excel');
        // Aquí puedes agregar la lógica para generar o descargar el Excel
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportabilidad" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-12 gap-4">

                    <Card className="col-span-12 md:col-span-12">
                        <CardHeader>
                            <CardTitle>Seleccionar Fechas</CardTitle>
                        </CardHeader>
                        <CardContent>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
