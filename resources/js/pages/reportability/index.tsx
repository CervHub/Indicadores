import { Reportability, getColumns } from '@/components/reportability/columns';
import { DataTable } from '@/components/reportability/data-table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
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
    const { reportabilities, isSecurityEngineer } = usePage<{ reportabilities: Reportability[] }>().props;

    const [startDate, setStartDate] = useState<Date | undefined>(subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());
    const [isLoading, setIsLoading] = useState(false); // Estado de carga

    const handleDownload = async () => {
        if (startDate && endDate) {
            setIsLoading(true); // Iniciar carga
            const start = format(startDate, 'yyyy-MM-dd');
            const end = format(endDate, 'yyyy-MM-dd');
            const url = `/reportability/download/${start}/${end}`;
            try {
                const response = await axios.get(url, { responseType: 'blob' });
                const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', `reportability_${start}_to_${end}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                toast.success('Archivo descargado correctamente');
            } catch (error) {
                toast.error('Error al descargar el archivo');
                console.error('Error downloading the file', error);
            } finally {
                setIsLoading(false); // Finalizar carga
            }
        } else {
            console.error('Start date and end date must be selected');
        }
    };

    const renderDatePicker = (label: string, date: Date | undefined, setDate: (date: Date | undefined) => void) => (
        <div className="flex flex-col">
            <h3>{label}</h3>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full pl-3 text-left font-normal md:w-[240px]">
                        {date ? format(date, 'PPP', { locale: es }) : <span>Pick a date</span>}
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
                            <div className="flex flex-col justify-between md:flex-row">
                                <div className="flex flex-col gap-4 lg:flex-row">
                                    {renderDatePicker('Desde', startDate, setStartDate)}
                                    {renderDatePicker('Hasta', endDate, setEndDate)}
                                </div>
                                <div className="mt-4 flex items-end md:mt-0">
                                    <Button
                                        onClick={handleDownload}
                                        className="w-full bg-green-500 text-white md:w-auto"
                                        disabled={isLoading} // Deshabilitar botón durante la carga
                                    >
                                        {isLoading ? 'Generando...' : (
                                            <>
                                                <FileTextIcon className="mr-2 h-4 w-4" />
                                                Descargar Excel
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <DataTable columns={getColumns(isSecurityEngineer)} data={reportabilities} />
            </div>
        </AppLayout>
    );
}
