import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { handleCriticalError, handleFlashMessages } from '@/lib/handleFlashMessages';

type RoleDeleteForm = {
    id: string;
};

type RoleDeleteProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    selectedItem: {
        user_id: string;
        user_name: string;
        role_name: string;
    };
};

export default function RoleDelete({ isOpen = false, onOpenChange, selectedItem }: RoleDeleteProps) {
    const { data, setData, delete: destroy, processing, errors, reset } = useForm<Required<RoleDeleteForm>>({
        id: selectedItem.user_id,
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
        setData('id', selectedItem.user_id);
    }, [selectedItem, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('contrata.roles.destroy', { id: data.id }), {
            onSuccess: (page) => {
                handleFlashMessages(page.props.flash);
                reset();
                setIsDialogOpen(false);
                if (onOpenChange) onOpenChange(false);
            },
            onError: () => {
                handleCriticalError();
                setIsDialogOpen(true);
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
                        <DialogTitle>Eliminar Rol</DialogTitle>
                        <DialogDescription>
                            ¿Está seguro de que desea eliminar el rol de <strong>{selectedItem.role_name}</strong> asignado a <strong>{selectedItem.user_name}</strong>? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="delete" action={route('contrata.roles.destroy', { id: data.id })}>
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
