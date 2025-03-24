import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        setData('email', `${data.ruc}@cerv.com.pe`);
    }, [data.ruc]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.contractor.store'), {
            onSuccess: (response) => {
                reset();
                setIsDialogOpen(false);
                console.log('Solicitud de creación exitosa:', response);
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                console.log('Errores en la solicitud de creación:', errors);
            },
        });
    };

    return (
        <div>
            {flash?.success && <div className="mb-4 text-green-600">{flash.success}</div>}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2">Agregar Contratista</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agregar Contratista</DialogTitle>
                        <DialogDescription>Complete los campos para agregar un nuevo contratista.</DialogDescription>
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
                            <Input
                                id="email"
                                type="text"
                                required
                                value={`${data.ruc}@cerv.com.pe`}
                                disabled
                                placeholder="Email"
                            />
                        </div>
                        <Button type="submit" className="mt-2 w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
