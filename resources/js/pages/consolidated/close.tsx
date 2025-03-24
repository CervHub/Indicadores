import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { findFieldByValue, months } from '@/lib/utils';
import { toast } from 'sonner';
type ConsolidatedForm = {
    id: string;
};

type CloseConsolidatedProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    selectedItem: {
        id: string;
        year: number;
        month: string;
    };
};

export default function CloseConsolidated({ isOpen = false, onOpenChange, selectedItem }: CloseConsolidatedProps) {
    const { data, setData, patch, processing, errors, reset } = useForm<Required<ConsolidatedForm>>({
        id: selectedItem.id,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsFormValid(data.id !== '0');
    }, [data]);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        setData('id', selectedItem.id);
    }, [selectedItem, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('consolidated.close', { id: data.id }), {
            onSuccess: (page) => {
                const flash = page.props.flash;
                if (flash.success) {
                    setIsDialogOpen(false);
                    reset();
                    toast.success(flash.success);

                    if (onOpenChange) onOpenChange(false);
                }
                if (flash.error) {
                    setIsDialogOpen(false);
                    toast.error(flash.error);
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                toast.error('Ocurrió un error al cerrar el consolidado');
            },
        });
    };

    return (
        <div>
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (onOpenChange) onOpenChange(open);
                }}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cerrar Consolidado</DialogTitle>
                        <DialogDescription>
                            ¿Está seguro de que desea cerrar el consolidado para el mes de{' '}
                            {findFieldByValue(months, 'value', selectedItem.month, 'label')} del año {selectedItem.year}? Las empresas contratistas ya
                            no podrán subir información.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('consolidated.close', { id: data.id })}>
                        <div className="flex justify-end space-x-2">
                            <Button type="submit" className="mt-2" disabled={processing || !isFormValid}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Aceptar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
