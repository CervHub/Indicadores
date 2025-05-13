import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox'; // Import Combobo
import { toast } from 'sonner';
import { handleCriticalError, handleFlashMessages } from '@/lib/handleFlashMessages';

type RoleForm = {
    userId: number | null;
    roleId: number | null;
};

type RolePermissionProps = {
    users: { value: string; label: string }[];
    roles: { value: string; label: string }[];
};

export default function RolePermission({ users: userOptions, roles: roleOptions }: RolePermissionProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RoleForm>>({
        userId: null,
        roleId: null,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('contrata.roles.store'), {
            onSuccess: (page) => {
                handleFlashMessages(page.props.flash);
                reset();
                setIsDialogOpen(false);
            },
            onError: () => {
                handleCriticalError();
                setIsDialogOpen(true);
            },
        });
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2" onClick={() => setIsDialogOpen(true)}>
                            Asignar Rol
                        </Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Asignar Rol</DialogTitle>
                        <DialogDescription>Seleccione un usuario y un rol para asignarlo.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('contrata.roles.store')}>
                        <div className="grid gap-2">
                            <Label htmlFor="user">Usuario</Label>
                            <Combobox
                                data={userOptions}
                                value={data.userId}
                                onChange={(value) => setData('userId', value)}
                                placeholder="Seleccione un usuario..."
                                className="w-full"
                            />
                            <InputError message={errors.userId} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Rol</Label>
                            <Combobox
                                data={roleOptions}
                                value={data.roleId}
                                onChange={(value) => setData('roleId', value)}
                                placeholder="Seleccione un rol..."
                                className="w-full"
                            />
                            <InputError message={errors.roleId} />
                        </div>
                        <Button type="submit" className="mt-2" disabled={processing || data.userId === null || data.roleId === null}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Asignar Rol
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
