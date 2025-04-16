import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type CategoryCompanyForm = { nombre: string; group_id?: string }; // Agregado group_id opcional

interface CreateCategoryCompanyProps {
    categoryId: number;
    title: string;
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
    isCategorized: string | null;
    groups: any[];
}

export default function CreateCategoryCompany({
    categoryId,
    title,
    isDialogOpen,
    setIsDialogOpen,
    isCategorized,
    groups,
}: CreateCategoryCompanyProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<CategoryCompanyForm>>({ nombre: '', group_id: undefined });
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
        toast.error('Ocurrió un error al intentar crear la categoría de empresa.');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.category.admin.store', { category_id: currentCategoryId || 0 }), {
            onSuccess: handleSuccess,
            onError: handleError,
        });
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Crear {title}</DialogTitle>
                        <DialogDescription>Complete los campos para crear una nueva categoría de empresa.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3">
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
                        {isCategorized === '1' && (
                            <div className="grid gap-2">
                                <Label>Grupos disponibles:</Label>
                                <Select
                                    onValueChange={(value) => setData('group_id', value)} // Actualiza el estado con el group_id seleccionado
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un grupo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Grupos</SelectLabel>
                                            {groups.map((group) => (
                                                <SelectItem key={group.id} value={group.id.toString()}>
                                                    {group.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
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
