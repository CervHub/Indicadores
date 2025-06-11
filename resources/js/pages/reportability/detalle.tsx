import Stepper from '@/components/stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { formatDateTime, formatDateTimeLocal } from '@/lib/utils';
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
    const { reportability_id, reportability, isSecurityEngineer, canCloseReport, module, moduleReview } = usePage<{
        reportability_id: number;
        reportability: any;
        isSecurityEngineer: boolean;
        canCloseReport: boolean;
        module: any;
        moduleReview: any;
    }>().props;

    console.log('Module:', module);
    console.log('ReportabilityPage', reportability_id, reportability, isSecurityEngineer, canCloseReport);
    console.log('Module Review:', moduleReview);

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
            case 'Visualizado':
                return 1;
            case 'Cerrado':
            case 'Finalizado':
                return 2;
            default:
                return 0;
        }
    }

    function getDisplayState(estado: string) {
        return (estado === 'Cerrado' || estado === 'Finalizado') ? 'Cerrado' : 'Abierto';
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
                    <div className="col-span-12 flex h-full flex-col gap-4 md:col-span-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones del Reporte</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Una vez cerrado el reporte, no podrá ser modificado. Asegúrese de que toda la información esté correcta antes de proceder.
                                </p>
                                <div className="flex gap-2">

                                    <Button
                                        variant="destructive"
                                        onClick={() => setIsDialogOpen(true)}
                                        disabled={!canCloseReport || reportability.estado === 'Cerrado' || reportability.estado === 'Finalizado' || !isSecurityEngineer}
                                    >
                                        Cerrar Reporte
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="flex flex-1 flex-col">
                            <CardHeader>
                                <CardTitle>Detalles del reporte</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 space-y-1">
                                {/* <Stepper currentStep={currentStep} currentState={reportability.estado} /> */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="estado">Estado</Label>
                                        <Input id="estado" type="text" value={getDisplayState(reportability.estado)} readOnly />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="tipo_reporte">Tipo de Reporte</Label>
                                        <Input id="tipo_reporte" type="text" value={reportability.tipo_reporte} readOnly />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="company_name">Compañía</Label>
                                    <Input id="company_name" type="text" value={reportability.company_name} readOnly />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="company_report_name">Compañía Reportada</Label>
                                    <Input id="company_report_name" type="text" value={reportability.company_report_name} readOnly />
                                </div>
                                {reportability.encargado_cierre && (
                                    <div className="space-y-1">
                                        <Label htmlFor="encargado_cierre">Encargado de Cierre</Label>
                                        <Input id="encargado_cierre" type="text" value={reportability.encargado_cierre} readOnly />
                                    </div>
                                )}
                                {moduleReview?.user && (
                                    <div className="space-y-1">
                                        <Label htmlFor="cerrado_por">Cerrado por</Label>
                                        <Input id="cerrado_por" type="text" value={`${moduleReview.user.nombres} ${moduleReview.user.apellidos}`} readOnly />
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="fecha_evento">Fecha de Evento</Label>
                                        <Input id="fecha_evento" type="text" value={formatDateTimeLocal(reportability.fecha_evento)} readOnly />
                                    </div>
                                    {reportability.report_closed_at && (
                                        <div className="space-y-1">
                                            <Label htmlFor="fecha_cierre">Fecha de Cierre</Label>
                                            <Input id="fecha_cierre" type="text" value={formatDateTime(reportability.report_closed_at)} readOnly />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        {(module?.deleted_at || module?.delete_reason) && (
                            <Card className="border-red-200 bg-red-50">
                                <CardHeader>
                                    <CardTitle className="text-red-700">Información de Eliminación</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2 space-y-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        {module?.delete_reason && (
                                            <div className="space-y-1">
                                                <Label htmlFor="delete_reason">Motivo de Eliminación</Label>
                                                <Input id="delete_reason" type="text" value={module.delete_reason} readOnly />
                                            </div>
                                        )}
                                        {module?.deleted_at && (
                                            <div className="space-y-1">
                                                <Label htmlFor="deleted_at">Fecha de Eliminación</Label>
                                                <Input id="deleted_at" type="text" value={formatDateTime(module.deleted_at)} readOnly />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
            <CloseReport report_id={reportability_id} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
        </AppLayout>
    );
}
