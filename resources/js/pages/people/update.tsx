import { useForm } from '@inertiajs/react';
import { LoaderCircle, Upload } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { toast } from 'sonner';

type MassiveUpdateForm = {
    file: File | null;
};

type MassiveUpdateProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
};

export default function MassiveUpdate({ isOpen = false, onOpenChange }: MassiveUpdateProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<MassiveUpdateForm>({
        file: null,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
    const [fileName, setFileName] = useState<string>('');

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    // Reset form when dialog closes
    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (onOpenChange) onOpenChange(open);

        // Reset form when dialog closes
        if (!open) {
            reset();
            clearErrors();
            setFileName('');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('file', file);
        setFileName(file ? file.name : '');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!data.file) {
            toast.error('Por favor seleccione un archivo.');
            return;
        }

        post(route('contrata.personal.update.massive'), {
            forceFormData: true,
            onSuccess: (page) => {
                const flash = page.props.flash as any;

                if (flash?.success) {
                    toast.success(flash.success);
                    reset();
                    clearErrors();
                    setFileName('');
                    setIsDialogOpen(false);
                    if (onOpenChange) onOpenChange(false);
                }

                if (flash?.error) {
                    toast.error(flash.error);
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                toast.error('Ocurrió un error al procesar el archivo.');
            },
        });
    };

    return (
        <div>
            <Dialog
                open={isDialogOpen}
                onOpenChange={handleDialogChange}
            >
                <div className="flex justify-end">
                    <DialogTrigger asChild>
                        <Button variant="outline" className="inline-flex items-center gap-2 px-4 py-2">
                            <Upload className="h-4 w-4" />
                            Registro Masivo
                        </Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Registro Masivo</DialogTitle>
                        <DialogDescription>
                            Suba un archivo Excel para realizar una actualización masiva de personal.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4" method="post" action={route('contrata.personal.update.massive')}>
                        <div className="grid gap-2">
                            <Label htmlFor="file">Archivo Excel</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    className="cursor-pointer"
                                />
                            </div>
                            {fileName && (
                                <p className="text-sm text-muted-foreground">
                                    Archivo seleccionado: {fileName}
                                </p>
                            )}
                            <InputError message={errors.file} />
                        </div>
                        
                        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                            <p className="font-medium mb-1">Instrucciones:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>El archivo debe estar en formato Excel (.xlsx, .xls) o CSV</li>
                                <li>Asegúrese de que las columnas estén correctamente estructuradas</li>
                                <li>Revise los datos antes de procesar el archivo</li>
                            </ul>
                        </div>

                        <Button type="submit" className="w-full" disabled={processing || !data.file}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            {processing ? 'Procesando...' : 'Subir Archivo'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
