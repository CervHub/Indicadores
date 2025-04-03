import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Asegúrate de importar el componente Input
import { toast } from 'sonner';

export default function UpdateContractFormat({ isDialogOpen, setIsDialogOpen }: { isDialogOpen: boolean; setIsDialogOpen: (open: boolean) => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.file) {
            toast.error('Por favor, seleccione un archivo antes de enviar.');
            return;
        }

        const formData = new FormData();
        formData.append('file', data.file);

        post(route('consolidated.updateFormatContract'), {
            data: formData,
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Limpiar el campo de archivo
                }
                toast.success('El formato de contratistas se actualizó correctamente.');
            },
            onError: () => {
                toast.error('Ocurrió un error al intentar actualizar el formato.');
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Actualizar Formato de Contratistas</DialogTitle>
                    <DialogDescription>Seleccione un archivo para actualizar el formato de contratistas.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-3">
                    <div className="grid gap-2">
                        <Label htmlFor="file">Archivo</Label>
                        <Input
                            type="file"
                            id="file"
                            required
                            accept=".xlsx,.xls"
                            ref={fileInputRef}
                            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                        />
                        <InputError message={errors.file} />
                    </div>
                    <Button ref={fileInputRef} type="submit" className="mt-2" disabled={processing || !data.file}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Actualizar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
