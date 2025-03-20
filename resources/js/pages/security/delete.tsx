import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type DeleteAccessForm = {
    id: string;
};

type DeleteAccessProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    selectedItem: {
        id: string;
        nombres: string;
        apellidos: string;
    };
};

export default function DeleteAccess({ isOpen = false, onOpenChange, selectedItem }: DeleteAccessProps) {
    const { data, setData, delete: destroy, processing, errors, reset } = useForm<Required<DeleteAccessForm>>({
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
        destroy(route('security-engineer.destroy', { id: data.id }), {
            onSuccess: (response) => {
                reset();
                setIsDialogOpen(false);
                if (onOpenChange) onOpenChange(false);
                console.log('Acceso eliminado exitosamente:', response);
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                console.log('Errores al eliminar el acceso:', errors);
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
                        <DialogTitle>Eliminar Acceso de Ingeniero de Seguridad</DialogTitle>
                        <DialogDescription>
                            ¿Está seguro de que desea eliminar el acceso de {selectedItem.nombres} {selectedItem.apellidos} como ingeniero de seguridad? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="delete" action={route('security-engineer.destroy', { id: data.id })}>
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
