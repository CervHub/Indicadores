import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export default function useFlashMessages() {
    const { flash, error } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            console.log('Flash success:', flash.success);
            toast.success(flash.success);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            console.log('Flash error:', flash.error);
            toast.error(flash.error);
        }
    }, [flash?.error]);

    useEffect(() => {
        if (error) {
            console.log('Error:', error);
            toast.error(error);
        }
    }, [error]);
}
