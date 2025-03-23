import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type DeleteFileStatusForm = {
    id: string;
};

type DeleteFileStatusProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    fileStatus: {
        id: string;
        nombre: string;
        ruc: string;
        company: string;
        uea: string;
        type: string;
        file_status_id: string;
    };
};

export default function DeleteFileStatus({ isOpen = false, onOpenChange, fileStatus }: DeleteFileStatusProps) {
    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
    } = useForm<Required<DeleteFileStatusForm>>({
        id: fileStatus.file_status_id,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        setData('id', fileStatus.file_status_id);
    }, [fileStatus, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('annexes.destroy', { annex: data.id }), {
            onSuccess: (response) => {
                console.log('Success:', response);
                reset();
                setIsDialogOpen(false);
                if (onOpenChange) onOpenChange(false);
            },
            onError: (errors) => {
                console.error('Errors:', errors);
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
                        <DialogTitle>Eliminar Excel Subidos</DialogTitle>
                        <DialogDescription className="text-justify">
                            Empresa: <strong>{fileStatus.company}</strong>, UEA: <strong>{fileStatus.uea}</strong>
                            ¿Está seguro de que desea eliminar los anexos y minem? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('annexes.destroy', { annex: data.id })}>
                        <div className="flex justify-end space-x-2">
                            <Button type="submit" className="mt-2" disabled={processing}>
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
