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
import { CalendarIcon, FileTextIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reportabilidad',
        href: '/admin/reportability',
    },
];

export default function ReportabilityPage() {
    const { reportabilities } = usePage<{ reportabilities: Reportability[] }>().props;

    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());

    const handleDownload = () => {
        console.log('Download Excel');
        // Aquí puedes agregar la lógica para generar o descargar el Excel
    };

    const renderDatePicker = (label: string, date: Date | undefined, setDate: (date: Date | undefined) => void) => (
        <div className="flex flex-col">
            <h3>{label}</h3>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full pl-3 text-left font-normal md:w-[240px]">
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                        className="rounded-md border"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportabilidad" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-12 gap-4">
                    <Card className="col-span-12">
                        <CardHeader>
                            <CardTitle>Seleccionar Fechas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row justify-between">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {renderDatePicker('Desde', startDate, setStartDate)}
                                    {renderDatePicker('Hasta', endDate, setEndDate)}
                                </div>
                                <div className="flex items-end mt-4 md:mt-0">
                                    <Button onClick={handleDownload} className="w-full md:w-auto bg-green-500 text-white">
                                        <FileTextIcon className="mr-2 h-4 w-4" />
                                        Descargar Excel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <DataTable columns={getColumns()} data={reportabilities} />
            </div>
        </AppLayout>
    );
}
