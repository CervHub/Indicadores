import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';

import { toast } from 'sonner';

type AssignmentForm = {
    user_id: string;
    company_id: string;
};

type CreateAssignmentProps = {
    users: any[];
    companies: any[];
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
};

export default function CreateAssignment({ users, companies, isOpen = false, onOpenChange }: CreateAssignmentProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<AssignmentForm>({
        user_id: '',
        company_id: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        // Check if required fields are filled
        setIsFormValid(data.user_id !== '' && data.company_id !== '');
    }, [data.user_id, data.company_id]);

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
        post(route('assignments.store'), {
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
                toast.error('Ocurrió un error al crear la asignación.');
            },
        });
    };

    const userOptions = users.map((user: any) => ({
        label: `${user.nombre_completo} (${user.doi})`,
        value: String(user.id),
    }));

    const companyOptions = companies.map((company: any) => ({
        label: company.nombre,
        value: String(company.id),
    }));

    return (
        <div>
            <Dialog
                open={isDialogOpen}
                onOpenChange={handleDialogChange}
            >
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2">Crear Asignación</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Crear Asignación</DialogTitle>
                        <DialogDescription>Complete los campos para crear una nueva asignación.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('assignments.store')}>
                        <div className="grid gap-2">
                            <Label htmlFor="user_id">Usuario *</Label>
                            <Combobox
                                data={userOptions}
                                value={data.user_id}
                                onChange={(value) => setData('user_id', value)}
                                placeholder="Seleccionar usuario"
                                className="w-full"
                                disabled={processing}
                            />
                            <InputError message={errors.user_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="company_id">Empresa *</Label>
                            <Combobox
                                data={companyOptions}
                                value={data.company_id}
                                onChange={(value) => setData('company_id', value)}
                                placeholder="Seleccionar empresa"
                                className="w-full"
                                disabled={processing}
                            />
                            <InputError message={errors.company_id} />
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
