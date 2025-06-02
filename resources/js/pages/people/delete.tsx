import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { toast } from 'sonner';

type DeletePersonForm = {
    id: number;
};

type DeletePersonProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    selectedItem: {
        id: number;
        nombres: string;
        apellidos: string;
    };
};

export default function DeletePerson({ isOpen = false, onOpenChange, selectedItem }: DeletePersonProps) {
    const {
        data,
        setData,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm<Required<DeletePersonForm>>({
        id: selectedItem.id,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsFormValid(data.id !== 0);
    }, [data]);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        setData('id', selectedItem.id);
    }, [selectedItem, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('contrata.personal.destroy', { personal: data.id }), {
            onSuccess: (page) => {
                const flash = page.props.flash as any;

                if (flash?.success) {
                    toast.success(flash.success);
                    setIsDialogOpen(false);
                    if (onOpenChange) onOpenChange(false);
                }

                if (flash?.error) {
                    toast.error(flash.error);
                    setIsDialogOpen(true);
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                toast.error('Ocurrió un error al eliminar el personal.');
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
                        <DialogTitle>Eliminar Personal</DialogTitle>
                        <DialogDescription>
                            ¿Está seguro de que desea eliminar a {selectedItem.nombres} {selectedItem.apellidos}? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="delete" action={route('contrata.personal.destroy', { personal: data.id })}>
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
