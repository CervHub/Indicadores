import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { findFieldByValue, months } from '@/lib/utils';

import { toast } from 'sonner';

type ConsolidatedForm = {
    id: string;
};

type OpenConsolidatedProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    selectedItem: {
        id: string;
        year: number;
        month: string;
    };
};

export default function OpenConsolidated({ isOpen = false, onOpenChange, selectedItem }: OpenConsolidatedProps) {
    const { flash } = usePage<{
        flash: { success?: string };
    }>().props;

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
        patch(route('consolidated.open', { id: data.id }), {
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

                toast.error('Ocurrió un error al abrir el consolidado');
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
                        <DialogTitle>Abrir Consolidado</DialogTitle>
                        <DialogDescription>
                            ¿Está seguro de que desea abrir el consolidado para el mes de{' '}
                            {findFieldByValue(months, 'value', selectedItem.month, 'label')} del año {selectedItem.year}?
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('consolidated.open', { id: data.id })}>
                        <div className="flex justify-end space-x-2">
                            <Button type="submit" className="mt-2" disabled={processing || !isFormValid}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Abrir
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
