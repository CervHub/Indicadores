import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type ManagementUpdateForm = {
    nombre: string;
    estado: string;
};

type ManagementUpdateProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    selectedItem: {
        id: string;
        name: string;
        estado: number | string;
    };
};

export default function ManagementUpdate({ isOpen = false, onOpenChange, selectedItem }: ManagementUpdateProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<ManagementUpdateForm>({
        nombre: '',
        estado: '1',
    });

    console.log('Selected Item:', selectedItem);

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (isDialogOpen && selectedItem) {
            setData({
                nombre: selectedItem.nombre || '',
                estado: selectedItem.estado?.toString() || '1',
            });
        }
    }, [isDialogOpen, selectedItem, setData]);

    useEffect(() => {
        setIsFormValid(data.nombre.trim() !== '');
    }, [data.nombre]);

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (onOpenChange) onOpenChange(open);
        
        if (!open) {
            reset();
            clearErrors();
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.management.update', { entity: selectedItem.id }), {
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
            onError: () => {
                toast.error('Ocurrió un error al actualizar la gerencia.');
                setIsDialogOpen(true);
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Actualizar Gerencia</DialogTitle>
                    <DialogDescription>
                        Modifique los campos para actualizar la gerencia.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-3">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre de la Gerencia *</Label>
                        <Input 
                            id="nombre" 
                            value={data.nombre} 
                            onChange={(e) => setData('nombre', e.target.value)} 
                            required 
                        />
                        <InputError message={errors.nombre} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="estado">Estado *</Label>
                        <Select value={data.estado} onValueChange={(value) => setData('estado', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Activa</SelectItem>
                                <SelectItem value="0">No Activa</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.estado} />
                    </div>
                    <Button type="submit" className="mt-2" disabled={processing || !isFormValid}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Actualizar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
