import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type ContractorForm = {
    id: string;
    ruc: string | null;
    nombre: string | null;
    descripcion: string | null;
    email: string | null;
};

export default function EditContractor({
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

    const { data, setData, put, processing, errors, reset } = useForm<Required<ContractorForm>>({
        id: contractor?.id || '',
        ruc: contractor?.ruc || '',
        nombre: contractor?.nombre || '',
        descripcion: contractor?.descripcion || '',
        email: contractor?.email || '',
    });

    useEffect(() => {
        if (contractor) {
            setData({
                id: contractor.id,
                ruc: contractor.ruc,
                nombre: contractor.nombre,
                descripcion: contractor.descripcion,
                email: contractor.email,
            });
        }
    }, [contractor, setData]);

    useEffect(() => {
        setData('email', `${data.ruc}@code.com.pe`);
    }, [data.ruc]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (contractor) {
            put(route('admin.contractor.update', { contrata: contractor.id }), {
                onSuccess: (page) => {
                    const props = page.props as { flash: { success?: string } };
                    const success = props.flash.success;
                    const error = props.flash.error;

                    if (success) {
                        setIsDialogOpen(false);
                        toast.success(success);
                    }
                    if (error) {
                        toast.error(error);
                    }
                },
                onError: (errors) => {
                    setIsDialogOpen(true);
                    toast.error('Ocurrió un error al intentar actualizar la empresa.');
                },
            });
        }
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Empresa</DialogTitle>
                        <DialogDescription>Complete los campos para editar la  empresa.</DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={submit}
                        className="space-y-3"
                        method="post"
                        action={route('admin.contractor.update', { contrata: contractor?.id })}
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="ruc">RUC</Label>
                            <Input
                                id="ruc"
                                type="text"
                                required
                                value={data.ruc || ''}
                                onChange={(e) => setData('ruc', e.target.value)}
                                disabled={processing}
                                placeholder="RUC"
                            />
                            <InputError message={errors.ruc} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                type="text"
                                required
                                value={data.nombre || ''}
                                onChange={(e) => setData('nombre', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre"
                            />
                            <InputError message={errors.nombre} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Input
                                id="descripcion"
                                type="text"
                                required
                                value={data.descripcion || ''}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                disabled={processing}
                                placeholder="Descripción"
                            />
                            <InputError message={errors.descripcion} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="text" required value={`${data.ruc}@code.com.pe`} disabled placeholder="Email" />
                        </div>
                        <Button type="submit" className="mt-2 w-auto" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
