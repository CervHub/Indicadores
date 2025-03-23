import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type DeleteCompanyForm = {
    company_id: string;
    consolidated_id: string;
};

type DeleteCompanyProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    company: {
        id: string;
        nombre: string;
        ruc: string;
    };
    consolidated_id: string;
};

export default function DeleteCompany({ isOpen = false, onOpenChange, company, consolidated_id }: DeleteCompanyProps) {
    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
    } = useForm<Required<DeleteCompanyForm>>({
        company_id: company.id,
        consolidated_id: consolidated_id,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        setData('company_id', company.id);
        setData('consolidated_id', consolidated_id);
    }, [company, consolidated_id, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('consolidated.deleteCompany', { id: data.company_id }), {
            onSuccess: () => {
                reset();
                setIsDialogOpen(false);
                if (onOpenChange) onOpenChange(false);
            },
            onError: () => {
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
                        <DialogTitle>Eliminar Empresa</DialogTitle>
                        <DialogDescription className="text-justify">
                            ¿Está seguro de que desea eliminar la empresa <strong>{company.nombre}</strong> (RUC: <strong>{company.ruc}</strong>) del
                            consolidado? Esta acción no se puede deshacer. Además, se eliminarán los datos subidos de esta empresa para este mes y año
                            del consolidado y tendrás que reconsolidar para ver los cambios en los archivos Excel en la vista principal de
                            consolidados.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('consolidated.deleteCompany', { id: data.company_id })}>
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
