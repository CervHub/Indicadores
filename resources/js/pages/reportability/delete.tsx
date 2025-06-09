import { useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, LoaderCircle, XCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Reportability } from '@/components/reportability/columns';

import { toast } from 'sonner';

type DeleteReportProps = {
    report_id: string;
    reportData: Reportability | null;
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
};

export default function DeleteReport({ report_id, reportData, isDialogOpen, setIsDialogOpen }: DeleteReportProps) {
    const { flash } = usePage<{
        flash: { success?: string; error?: string };
    }>().props;

    const { data, setData, post, processing, reset } = useForm({
        motivo: '',
    });

    const [error, setError] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!data.motivo.trim()) {
            setError('Debe indicar el motivo para eliminar el reporte.');
            return;
        }
        
        setError(null);
        post(route('admin.reportability.delete', { reportability_id: report_id }), {
            onSuccess: (page) => {
                const flash = page.props.flash;

                if (flash.success) {
                    toast.success(flash.success);
                    setIsDialogOpen(false);
                    reset();
                }

                if (flash.error) {
                    toast.error(flash.error);
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                toast.error('Ocurrió un error al eliminar el reporte.');
            },
        });
    };

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'Generado':
            case 'Abierto':
                return <Badge variant="destructive">Abierto</Badge>;
            case 'Visualizado':
            case 'Revisado':
                return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Revisado</Badge>;
            case 'Finalizado':
            case 'Cerrado':
                return <Badge variant="secondary" className="bg-green-100 text-green-800">Cerrado</Badge>;
            default:
                return <Badge variant="outline">{estado}</Badge>;
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                            <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle>Eliminar Reporte</DialogTitle>
                            <DialogDescription>
                                Esta acción no se puede deshacer.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                
                {reportData && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Reporte #{reportData.id}</span>
                                {getEstadoBadge(reportData.estado)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Tipo:</span> {reportData.tipo_reporte}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Empresa que reporta:</span> {reportData.company_name}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Empresa que cierra:</span> {reportData.company_report_name}
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="motivo" className="text-sm font-medium">
                                    Motivo de eliminación <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="motivo"
                                    placeholder="Indique el motivo..."
                                    value={data.motivo}
                                    onChange={(e) => setData('motivo', e.target.value)}
                                    className="min-h-[80px] resize-none"
                                    required
                                />
                            </div>
                            
                            {error && (
                                <Alert className="border-red-200 bg-red-50 py-2">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-sm text-red-800">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            <div className="flex gap-2 pt-2">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => setIsDialogOpen(false)}
                                    disabled={processing}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="destructive"
                                    className="flex-1" 
                                    disabled={processing || !data.motivo.trim()}
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                            Eliminando...
                                        </>
                                    ) : (
                                        'Eliminar'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
