import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type ContractorForm = {
    ruc: string;
    nombre: string;
    descripcion: string;
    email: string;
};

export default function CreateContractor() {
    const { flash } = usePage<{
        flash: { success?: string };
    }>().props;

    const { data, setData, post, processing, errors, reset } = useForm<Required<ContractorForm>>({
        ruc: '',
        nombre: '',
        descripcion: '',
        email: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        setData('email', `${data.ruc}@code.com.pe`);
    }, [data.ruc]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.contractor.store'), {
            onSuccess: (page) => {
                const flash = page.props.flash;
                if (flash.success) {
                    setIsDialogOpen(false);
                    reset();
                    toast.success(flash.success);
                }
                if (flash.error) {
                    setIsDialogOpen(true);
                    toast.error(flash.error);
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                toast.error('Ocurrió un error al intentar crear el contratista.');
            },
        });
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2">Crear Empresa</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Crear Empresa</DialogTitle>
                        <DialogDescription>Complete los campos para crear una nueva empresa.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('admin.contractor.store')}>
                        <div className="grid gap-2">
                            <Label htmlFor="ruc">RUC</Label>
                            <Input
                                id="ruc"
                                type="text"
                                required
                                value={data.ruc}
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
                                value={data.nombre}
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
                                value={data.descripcion}
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
