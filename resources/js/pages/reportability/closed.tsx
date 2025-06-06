import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { toast } from 'sonner';

type CloseReportProps = {
    report_id: string;
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
};

export default function CloseReport({ report_id, isDialogOpen, setIsDialogOpen }: CloseReportProps) {
    const { flash } = usePage<{
        flash: { success?: string };
    }>().props;

    const { data, setData, post, processing, reset } = useForm({
        descripcion: '',
        images: [] as File[],
    });

    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (data.images.length + acceptedFiles.length > 4) {
                setError('No puedes subir más de 4 imágenes.');
                return;
            }
            setError(null);
            setData('images', [...data.images, ...acceptedFiles]);
        },
        [data.images, setData],
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxFiles: 4,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Validación: al menos una imagen es requerida
        if (data.images.length === 0) {
            setError('Debe subir al menos una imagen para cerrar el reporte.');
            return;
        }
        
        setError(null);
        post(route('finish.store', { id: report_id }), {
            onSuccess: (page) => {
                const flash = page.props.flash;

                if (flash.success) {
                    toast.success(flash.success);
                    setIsDialogOpen(false);
                    reset();
                }

                if (flash.error) {
                    toast.error(flash.error);
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                toast.error('Ocurrió un error al cerrar el reporte.');
            },
        });
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cerrar Reporte</DialogTitle>
                        <DialogDescription>¿Está seguro de que desea cerrar este reporte?</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('finish.store', { id: report_id })}>
                        <textarea
                            className="w-full rounded border p-2"
                            placeholder="Comentario"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                        />
                        <div {...getRootProps({ className: 'dropzone' })} className="border-2 border-dashed p-4 text-center">
                            <input {...getInputProps()} />
                            <p>Arrastra y suelta hasta 4 imágenes aquí, o haz clic para seleccionar imágenes</p>
                        </div>
                        {error && <div className="text-red-600">{error}</div>}
                        <div className="mt-2">
                            {data.images.length > 0 && (
                                <div>
                                    <h4>Imágenes seleccionadas:</h4>
                                    <ul className="grid grid-cols-2 gap-2">
                                        {data.images.map((file, index) => (
                                            <li key={index} className="relative">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`preview ${index}`}
                                                    className="h-32 w-full rounded object-cover"
                                                />
                                                <span
                                                    className="absolute top-0 right-0 cursor-pointer rounded-full bg-red-600 px-2 text-white"
                                                    onClick={() => {
                                                        setData(
                                                            'images',
                                                            data.images.filter((_, i) => i !== index),
                                                        );
                                                    }}
                                                >
                                                    x
                                                </span>
                                                <p className="mt-1 text-center text-xs">{file.name}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <Button type="submit" className="mt-2 w-full" disabled={processing || !data.descripcion.trim() || data.images.length === 0}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Confirmar Cierre
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
