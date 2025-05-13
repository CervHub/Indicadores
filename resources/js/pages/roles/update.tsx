import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { handleCriticalError, handleFlashMessages } from '@/lib/handleFlashMessages';

type RoleUpdateForm = {
    roleId: number | null;
};

type RoleUpdateProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    selectedItem: {
        user_id: string;
        role_id: string;
        user_name: string;
        role_name: string;
    };
    roles: { value: string; label: string }[];
};

export default function RoleUpdate({ isOpen = false, onOpenChange, selectedItem, roles: roleOptions }: RoleUpdateProps) {
    const { data, setData, put, processing, errors, reset } = useForm<Required<RoleUpdateForm>>({
        roleId: null,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        console.log('Selected item:', selectedItem);
        console.log('Roles:', roleOptions);
        setData('roleId', selectedItem.role_id); // Reset roleId whenever the dialog opens
    }, [isDialogOpen, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('contrata.roles.update', { id: selectedItem.user_id }), {
            onSuccess: (page) => {
                handleFlashMessages(page.props.flash);
                reset();
                setIsDialogOpen(false);
                if (onOpenChange) onOpenChange(false);
            },
            onError: () => {
                handleCriticalError();
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
                        <DialogTitle>Actualizar Rol</DialogTitle>
                        <DialogDescription>
                            Seleccione un nuevo rol para <strong>{selectedItem.user_name}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('contrata.roles.update', { id: selectedItem.user_id })}>
                        <div className="grid gap-2">
                            <Label htmlFor="user_name">Usuario</Label>
                            <Input
                                id="user_name"
                                type="text"
                                value={selectedItem.user_name}
                                readOnly
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Rol</Label>
                            <Combobox
                                data={roleOptions}
                                value={data.roleId}
                                onChange={(value) => {
                                    setData('roleId', value); // Update roleId on selection change
                                }}
                                placeholder="Seleccione un rol..."
                                className="w-full"
                            />
                            <InputError message={errors.roleId} />
                        </div>
                        <Button type="submit" className="mt-2" disabled={processing || data.roleId === null}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Actualizar Rol
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
