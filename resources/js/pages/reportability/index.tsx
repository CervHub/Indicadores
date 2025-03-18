import { Reportability, getColumns } from '@/components/reportability/columns';
import { DataTable } from '@/components/reportability/data-table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { format } from 'date-fns';
import { CalendarIcon, FileTextIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reportabilidad',
        href: '/admin/reportability',
    },
];

export default function ReportabilityPage() {
    const { reportabilities } = usePage<{ reportabilities: Reportability[] }>().props;

    useEffect(() => {
        console.log('Reportabilities: ', JSON.stringify(reportabilities));
    }, [reportabilities]);

    const handleActionClick = (action: string, report: Reportability) => {
        if (action === 'detalle') {
            const urlDetalle = route('admin.reportability.detalle', { reportability_id: report.id });
            Inertia.visit(urlDetalle);
        } else if (action === 'pdf') {
            const urlPdf = route('company.reportability.download', { reportability_id: report.id });
            Inertia.visit(urlPdf);
        } else {
            console.log(`Action: ${action}, Report ID: ${report.id}`);
        }
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
                            <div className="flex items-end justify-between space-x-4">
                                <div className="flex space-x-4">
                                    <div className="flex flex-col">
                                        <h3>Desde</h3>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={'outline'} className="w-[240px] pl-3 text-left font-normal">
                                                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={setStartDate}
                                                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                    initialFocus
                                                    className="rounded-md border"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="flex flex-col">
                                        <h3>Hasta</h3>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={'outline'} className="w-[240px] pl-3 text-left font-normal">
                                                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={setEndDate}
                                                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                    initialFocus
                                                    className="rounded-md border"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <Button onClick={handleDownload} className="bg-green-500 text-white">
                                    <FileTextIcon className="mr-2 h-4 w-4" />
                                    Descargar Excel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <DataTable columns={getColumns(handleActionClick)} data={reportabilities} />
            </div>
        </AppLayout>
    );
}
