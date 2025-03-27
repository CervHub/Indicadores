import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { toast } from 'sonner';
type PersonForm = {
    doi: string;
    email: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    cargo: string;
};

type CreatePersonProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
};

export default function CreatePerson({ isOpen = false, onOpenChange }: CreatePersonProps) {
    const { data, setData, post, processing, errors, reset } = useForm<PersonForm>({
        doi: '',
        email: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        cargo: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        // Check if required fields are filled
        setIsFormValid(data.doi.trim() !== '' && data.nombres.trim() !== '' && data.apellidos.trim() !== '');
    }, [data.doi, data.nombres, data.apellidos]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('contrata.personal.store'), {
            onSuccess: (page) => {
                const flash = page.props.flash;

                if (flash.success) {
                    toast.success(flash.success);
                    setIsDialogOpen(false);
                    reset();
                    if (onOpenChange) onOpenChange(false);
                }

                if (flash.error) {
                    toast.error(flash.error);
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);

                toast.error('Ocurrió un error al crear la persona.');
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
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2">Crear Persona</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Crear Persona</DialogTitle>
                        <DialogDescription>Complete los campos para crear una nueva persona.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('contrata.personal.store')}>
                        <div className="grid gap-2">
                            <Label htmlFor="doi">DOI</Label>
                            <Input id="doi" value={data.doi} onChange={(e) => setData('doi', e.target.value)} />
                            <InputError message={errors.doi} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nombres">Nombres</Label>
                            <Input id="nombres" value={data.nombres} onChange={(e) => setData('nombres', e.target.value)} />
                            <InputError message={errors.nombres} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="apellidos">Apellidos</Label>
                            <Input id="apellidos" value={data.apellidos} onChange={(e) => setData('apellidos', e.target.value)} />
                            <InputError message={errors.apellidos} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} />
                            <InputError message={errors.telefono} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cargo">Cargo</Label>
                            <Input id="cargo" value={data.cargo} onChange={(e) => setData('cargo', e.target.value)} />
                            <InputError message={errors.cargo} />
                        </div>
                        <Button type="submit" className="mt-2" disabled={processing || !isFormValid}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Crear
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
