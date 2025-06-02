import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { toast } from 'sonner';

type ResetPasswordForm = {
    id: number;
};

type ResetPasswordProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    selectedItem: {
        id: number;
        nombres: string;
        apellidos: string;
        doi: string; // DNI del usuario
    };
};

export default function ResetPassword({ isOpen = false, onOpenChange, selectedItem }: ResetPasswordProps) {
    const {
        data,
        setData,
        post: resetPassword,
        processing,
        errors,
        reset,
    } = useForm<Required<ResetPasswordForm>>({
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
        resetPassword(route('contrata.password.reset', { personal: data.id }), {
            onSuccess: (page) => {
                const flash = page.props.flash;

                if (flash.success) {
                    toast.success(flash.success);
                    setIsDialogOpen(false);
                    if (onOpenChange) onOpenChange(false);
                }

                if (flash.error) {
                    toast.error(flash.error);
                    setIsDialogOpen(true);
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);

                toast.error('Ocurrió un error al restablecer la contraseña. Por favor, inténtelo de nuevo.');
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
                        <DialogTitle>Restablecer Contraseña</DialogTitle>
                        <DialogDescription>
                            ¿Está seguro de que desea restablecer la contraseña de {selectedItem.nombres} {selectedItem.apellidos} al DNI ({selectedItem.doi})?
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('contrata.password.reset', { personal: data.id })}>
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
