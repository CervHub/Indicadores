import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox'; // Import Combobox

type PermissionForm = {
    userId: number | null;
};

type GrantPermissionProps = {
    data: { value: string; label: string }[];
};

export default function GrantPermission({ data: userOptions }: GrantPermissionProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<PermissionForm>>({
        userId: null,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('security-engineer.store'), {
            onSuccess: (response) => {
                reset();
                setIsDialogOpen(false);
                console.log('Permiso otorgado exitosamente:', response);
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                console.log('Errores al otorgar permiso:', errors);
            },
        });
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2" onClick={() => setIsDialogOpen(true)}>
                            Otorgar Permiso
                        </Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Otorgar Permiso</DialogTitle>
                        <DialogDescription>Seleccione un usuario para otorgarle permisos como Ingeniero de seguridad.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('security-engineer.store')}>
                        <div className="grid gap-2">
                            <Label htmlFor="user">Usuario</Label>
                            <Combobox
                                data={userOptions}
                                value={data.userId}
                                onChange={(value) => setData('userId', value)}
                                placeholder="Seleccione un usuario..."
                                className="w-[300px]"
                            />
                            <InputError message={errors.userId} />
                        </div>
                        <Button type="submit" className="mt-2" disabled={processing || data.userId === null}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Otorgar Permiso
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
