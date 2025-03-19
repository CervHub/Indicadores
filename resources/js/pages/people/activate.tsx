import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type ActivatePersonForm = {
    id: string;
};

type ActivatePersonProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    selectedItem: {
        id: string;
        nombres: string;
        apellidos: string;
    };
};

export default function ActivatePerson({ isOpen = false, onOpenChange, selectedItem }: ActivatePersonProps) {
    const {
        data,
        setData,
        put: activate,
        processing,
        errors,
        reset,
    } = useForm<Required<ActivatePersonForm>>({
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
        activate(route('contrata.personal.activate', { personal: data.id }), {
            onSuccess: (response) => {
                reset();
                setIsDialogOpen(false);
                if (onOpenChange) onOpenChange(false);
                console.log('Activación exitosa:', response);
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                console.log('Errores en la activación:', errors);
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
                        <DialogTitle>Activar Personal</DialogTitle>
                        <DialogDescription>
                            ¿Está seguro de que desea activar a {selectedItem.nombres} {selectedItem.apellidos}?
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="put" action={route('contrata.personal.activate', { personal: data.id })}>
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
