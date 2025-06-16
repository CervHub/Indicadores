import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: 'idle' | 'submitting';
    onConfirm: () => void;
    title?: string;
}

export default function ReportModal({
    isOpen,
    onClose,
    status,
    onConfirm,
    title
}: ReportModalProps) {
    const getContent = () => {
        switch (status) {
            case 'submitting':
                return {
                    title: 'Enviando reporte...',
                    icon: <Loader2 className="animate-spin text-blue-500" size={48} />,
                    showButtons: false
                };
            default:
                return {
                    title: title || '¿Está seguro de que desea enviar este reporte?',
                    icon: <AlertTriangle className="text-yellow-500" size={48} />,
                    showButtons: true,
                    buttonText: 'Continuar'
                };
        }
    };

    const content = getContent();

    return (
        <Dialog open={isOpen} onOpenChange={status === 'submitting' ? undefined : onClose}>
            <DialogContent className="max-w-sm text-center flex flex-col items-center justify-center">
                {content.icon}
                {content.title && <DialogTitle className="mx-auto mb-0 text-center w-full">{content.title}</DialogTitle>}
                {content.showButtons && (
                    <div className="w-full flex justify-center gap-4 mt-0">
                        <Button onClick={onConfirm} className="w-32">{content.buttonText || 'Continuar'}</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
