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

type CategoryCompanyForm = { nombre: string; group_id?: string; is_required: boolean };

interface UpdateCategoryCompanyProps {
    categoryId: number;
    title: string;
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
    isCategorized: string | null;
    groups: any[];
    item: {
        id: number;
        nombre: string;
        group_id?: string;
        is_required: boolean;
    } | null;
}

export default function UpdateCategoryCompany({
    categoryId,
    title,
    isDialogOpen,
    setIsDialogOpen,
    isCategorized,
    groups,
    item,
}: UpdateCategoryCompanyProps) {
    const { data, setData, put, processing, errors, reset } = useForm<Required<CategoryCompanyForm>>({
        nombre: item?.nombre || '',
        group_id: item?.group_id ?? undefined,
        is_required: item?.is_required === 1 || item?.is_required === "1",
    });

    useEffect(() => {
        if (item) {
            setData({
                nombre: item.nombre,
                group_id: item.group_id ?? undefined,
                is_required: item.is_required === 1 || item.is_required === "1",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

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
        toast.error('Ocurrió un error al intentar actualizar la categoría de empresa.');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!item) return;
        put(route('admin.category.admin.update', { category_id: item.id }), {
            onSuccess: handleSuccess,
            onError: handleError,
            preserveScroll: true,
        });
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar {title}</DialogTitle>
                        <DialogDescription>Modifique los campos para actualizar la categoría de empresa.</DialogDescription>
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
                                    value={data.group_id}
                                    onValueChange={(value) => setData('group_id', value)}
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
                        <div className="flex items-center space-x-2">
                            <input
                                id="is_required"
                                type="checkbox"
                                checked={data.is_required}
                                onChange={(e) => setData('is_required', e.target.checked)}
                                disabled={processing}
                            />
                            <Label htmlFor="is_required">¿Es requerido?</Label>
                        </div>
                        <Button type="submit" className="mt-2 w-auto" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Actualizar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
