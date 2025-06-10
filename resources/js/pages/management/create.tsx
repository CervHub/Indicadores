import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { toast } from 'sonner';
type ManagementForm = {
    nombre: string;
};

type CreateManagementProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
};

export default function CreateManagement({ isOpen = false, onOpenChange }: CreateManagementProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<ManagementForm>({
        nombre: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        // Check if required field is filled
        setIsFormValid(data.nombre.trim() !== '');
    }, [data.nombre]);

    // Reset form when dialog closes
    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (onOpenChange) onOpenChange(open);

        // Reset form when dialog closes
        if (!open) {
            reset();
            clearErrors();
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.management.store'), {
            onSuccess: (page) => {
                const flash = page.props.flash as any;

                if (flash?.success) {
                    toast.success(flash.success);
                    reset();
                    clearErrors();
                    setIsDialogOpen(false);
                    if (onOpenChange) onOpenChange(false);
                }

                if (flash?.error) {
                    toast.error(flash.error);
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                toast.error('Ocurrió un error al crear la gerencia.');
            },
        });
    };

    return (
        <div>
            <Dialog
                open={isDialogOpen}
                onOpenChange={handleDialogChange}
            >
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2">Crear Gerencia</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Crear Gerencia</DialogTitle>
                        <DialogDescription>Complete el campo para crear una nueva gerencia.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('admin.management.store')}>
                        <div className="grid gap-2">
                            <Label htmlFor="nombre">Nombre de la Gerencia *</Label>
                            <Input id="nombre" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} required />
                            <InputError message={errors.nombre} />
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
