import Stepper from '@/components/stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { formatDateTime } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import CloseReport from './closed';

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
    const { reportability_id, reportability, isSecurityEngineer } = usePage<{
        reportability_id: number;
        reportability: any;
        isSecurityEngineer: boolean;
    }>().props;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);
    const [currentStep, setCurrentStep] = useState(getCurrentStep(reportability.estado));

    const urlPdf = route('company.reportability.download', { reportability_id });

    const handleLoad = () => {
        setLoading(false);
        setError(null);
    };

    const handleError = () => {
        setLoading(false);
        setError('No se pudo cargar el PDF');
    };

    useEffect(() => {
        setIframeKey((prevKey) => prevKey + 1);
        setCurrentStep(getCurrentStep(reportability.estado));
    }, [reportability.estado]);

    function getCurrentStep(estado: string) {
        switch (estado) {
            case 'Generado':
                return 0;
            case 'Revisado':
                return 1;
            case 'Finalizado':
                return 2;
            default:
                return 0;
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportabilidad" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid h-full grid-cols-12 gap-4">
                    <Card className="col-span-12 h-full md:col-span-8">
                        <CardHeader>
                            <CardTitle>Reporte</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading && <p>Cargando PDF...</p>}
                            {error && <p>{error}</p>}
                            <iframe
                                key={iframeKey}
                                src={urlPdf}
                                width="100%"
                                height="759"
                                onLoad={handleLoad}
                                onError={handleError}
                                style={{ display: loading || error ? 'none' : 'block' }}
                            />
                        </CardContent>
                    </Card>
                    <Card className="col-span-12 flex h-full flex-col justify-between md:col-span-4">
                        <div>
                            <CardHeader>
                                <CardTitle>Detalles del reporte</CardTitle>
                            </CardHeader>
                            <br />
                            <CardContent className="flex flex-col gap-2 space-y-2">
                                <Stepper currentStep={currentStep} />
                                <div className="space-y-2 d-none">
                                    <Label htmlFor="estado">Estado</Label>
                                    <Input id="estado" type="text" value={reportability.estado} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tipo_reporte">Tipo de Reporte</Label>
                                    <Input id="tipo_reporte" type="text" value={reportability.tipo_reporte} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company_name">Compañía</Label>
                                    <Input id="company_name" type="text" value={reportability.company_name} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company_report_name">Compañía Reportada</Label>
                                    <Input id="company_report_name" type="text" value={reportability.company_report_name} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fecha_reporte">Fecha de Reporte</Label>
                                    <Input id="fecha_reporte" type="text" value={formatDateTime(reportability.fecha_reporte)} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fecha_evento">Fecha de Evento</Label>
                                    <Input id="fecha_evento" type="text" value={formatDateTime(reportability.fecha_evento)} disabled />
                                </div>
                            </CardContent>
                        </div>
                        <CardContent>
                            <Button
                                variant="destructive"
                                className="mt-4 w-auto"
                                onClick={() => setIsDialogOpen(true)}
                                disabled={reportability.estado === 'Finalizado' || !isSecurityEngineer}
                            >
                                Finalizar Reporte
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <CloseReport report_id={reportability_id} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
        </AppLayout>
    );
}
