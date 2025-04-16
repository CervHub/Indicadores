import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

type CategoryForm = { nombre: string; is_categorized: boolean; is_risk: boolean };

export default function CreateCategory() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<CategoryForm>>({
        nombre: '',
        is_categorized: false,
        is_risk: false,
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        toast.error('Ocurrió un error al intentar crear la categoría.');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.category.store'), {
            onSuccess: handleSuccess,
            onError: handleError,
        });
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2">Crear Categoría</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Crear Categoría</DialogTitle>
                        <DialogDescription>Complete los campos para crear una nueva categoría.</DialogDescription>
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
                        <div className="grid gap-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_categorized"
                                    checked={data.is_categorized}
                                    onCheckedChange={(checked) => setData('is_categorized', !!checked)}
                                    disabled={processing}
                                />
                                <Label htmlFor="is_categorized">¿Está categorizado?</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_risk"
                                    checked={data.is_risk}
                                    onCheckedChange={(checked) => setData('is_risk', !!checked)}
                                    disabled={processing}
                                />
                                <Label htmlFor="is_risk">¿Es de evaluación?</Label>
                            </div>
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
