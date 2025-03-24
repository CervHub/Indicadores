import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type ContractorForm = {
    id: string;
    ruc: string | null;
    nombre: string | null;
    descripcion: string | null;
    email: string | null;
    password: string | null;
};

export default function DeleteContractor({
    contractor,
    isDialogOpen,
    setIsDialogOpen,
}: {
    contractor: ContractorForm | null;
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
}) {
    const { flash } = usePage<{
        flash: { success?: string };
    }>().props;

    const { data, setData, post, processing, reset } = useForm<Required<ContractorForm>>({
        id: contractor?.id || '',
        ruc: contractor?.ruc || '',
        nombre: contractor?.nombre || '',
        descripcion: contractor?.descripcion || '',
        email: contractor?.email || '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (contractor) {
            post(route('admin.contractor.destroy', { contrata: contractor.id }), {
                onSuccess: (response) => {
                    reset();
                    setIsDialogOpen(false);
                    console.log('Solicitud de eliminación exitosa:', response);
                },
                onError: (errors) => {
                    setIsDialogOpen(true);
                    console.log('Errores en la solicitud de eliminación:', errors);
                },
            });
        }
    };

    return (
        <div>
            {flash?.success && <div className="mb-4 text-green-600">{flash.success}</div>}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Eliminar Contratista</DialogTitle>
                        <DialogDescription>
                            ¿Está seguro de que desea eliminar este contratista?
                            <br />
                            <strong>Nombre:</strong> {contractor?.nombre}
                            <br />
                            <strong>RUC:</strong> {contractor?.ruc}
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={submit}
                        className="space-y-3"
                        method="post"
                        action={route('admin.contractor.destroy', { contrata: contractor?.id })}
                    >
                        <Button type="submit" className="mt-2 w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Confirmar Eliminación
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
