import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, Loader2, XCircle, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: 'idle' | 'submitting' | 'success' | 'error';
    onConfirm: () => void;
    errorMessage?: string;
    title?: string;
    description?: string;
}

export default function ReportModal({
    isOpen,
    onClose,
    status,
    onConfirm,
    errorMessage,
    title,
    description
}: ReportModalProps) {
    const getContent = () => {
        switch (status) {
            case 'submitting':
                return {
                    title: 'Enviando reporte...',
                    description: 'Por favor espere mientras procesamos su reporte.',
                    icon: <Loader2 className="animate-spin text-blue-500" size={48} />,
                    showButtons: false
                };
            case 'success':
                return {
                    title: title || 'Reporte enviado exitosamente',
                    description: description || 'Su reporte ha sido procesado y guardado correctamente.',
                    icon: <CheckCircle className="text-green-500" size={48} />,
                    showButtons: true,
                    buttonText: 'Continuar'
                };
            case 'error':
                return {
                    title: 'Error al enviar reporte',
                    description: errorMessage || 'Ha ocurrido un error al procesar su reporte. Por favor, intente nuevamente.',
                    icon: <XCircle className="text-red-500" size={48} />,
                    showButtons: true,
                    buttonText: 'Aceptar'
                };
            default:
                return {
                    title: 'Confirmar envío de reporte',
                    description: '¿Está seguro de que desea enviar este reporte? Esta acción no se puede deshacer.',
                    icon: <AlertTriangle className="text-yellow-500" size={48} />,
                    showButtons: true
                };
        }
    };

    const content = getContent();

    return (
        <Dialog open={isOpen} onOpenChange={status === 'submitting' ? undefined : onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center">
                    {content.icon && (
                        <div className="flex justify-center mb-4">
                            {content.icon}
                        </div>
                    )}
                    <DialogTitle>{content.title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {content.description}
                    </DialogDescription>
                </DialogHeader>

                {content.showButtons && (
                    <DialogFooter className="flex justify-center gap-2">
                        {status === 'idle' && (
                            <>
                                <Button variant="outline" onClick={onClose}>
                                    Cancelar
                                </Button>
                                <Button onClick={onConfirm}>
                                    Confirmar envío
                                </Button>
                            </>
                        )}
                        {(status === 'success' || status === 'error') && (
                            <Button onClick={onClose} className="w-full">
                                {content.buttonText}
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
