import { toast } from 'sonner';

export function handleFlashMessages(flash: { success?: string; error?: string }, fallbackSuccess = 'Operación realizada correctamente.', fallbackError = 'Ocurrió un error crítico al procesar la solicitud.') {
    if (flash?.success) {
        toast.success(flash.success);
    } else if (flash?.error) {
        toast.error(flash.error);
    } else {
        toast.success(fallbackSuccess);
    }
}

export function handleCriticalError() {
    toast.error('Ocurrió un error crítico al procesar la solicitud.');
}
