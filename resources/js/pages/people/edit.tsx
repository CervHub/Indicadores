import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PersonForm = {
    id: number;
    doi: string;
    email: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    cargo: string;
};

type EditPersonProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    person?: PersonForm;
};

export default function EditPerson({ isOpen = false, onOpenChange, person }: EditPersonProps) {
    const { data, setData, put, processing, errors, reset } = useForm<PersonForm>({
        id: person?.id || 0,
        doi: person?.doi || '',
        email: person?.email || '',
        nombres: person?.nombres || '',
        apellidos: person?.apellidos || '',
        telefono: person?.telefono || '',
        cargo: person?.cargo || '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (person) {
            setData({
                id: person.id,
                doi: person.doi,
                email: person.email,
                nombres: person.nombres,
                apellidos: person.apellidos,
                telefono: person.telefono,
                cargo: person.cargo,
            });
        }
    }, [person, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('contrata.personal.update', person?.id), {
            onSuccess: (response) => {
                reset();
                setIsDialogOpen(false);
                if (onOpenChange) onOpenChange(false);
                console.log('Solicitud de actualización exitosa:', response);
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                console.log('Errores en la solicitud de actualización:', errors);
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
                        <DialogTitle>Editar Persona</DialogTitle>
                        <DialogDescription>Complete los campos para editar la persona.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('contrata.personal.update', person?.doi)}>
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
                        <Button type="submit" className="mt-2" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Actualizar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
