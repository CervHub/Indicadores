import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type GroupForm = { name: string };

interface CreateGroupProps {
    categoryId: number;
    title: string;
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
}

export default function CreateGroup({ categoryId, title, isDialogOpen, setIsDialogOpen }: CreateGroupProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<GroupForm>>({ name: '' });
    const [currentCategoryId, setCurrentCategoryId] = useState(categoryId);

    useEffect(() => {
        setCurrentCategoryId(categoryId);
        reset(); // Reset the form when categoryId changes
    }, [categoryId]);

    const handleSuccess = (page: any) => {
        const { success, error } = page.props.flash;
        if (success) {
            setIsDialogOpen(false);
            reset();
            toast.success(success);
        }
        if (error) {
            setIsDialogOpen(true);
            toast.error(error);
        }
    };

    const handleError = () => {
        setIsDialogOpen(true);
        toast.error('Ocurrió un error al intentar crear el grupo.');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('group.store', { category_id: currentCategoryId || 0 }), {
            onSuccess: handleSuccess,
            onError: handleError,
        });
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>Complete los campos para crear un nuevo grupo.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre del grupo"
                            />
                            <InputError message={errors.name} />
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
