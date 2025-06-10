import { useForm, usePage } from '@inertiajs/react';
import { 
    AlertCircleIcon,
    FileArchiveIcon,
    FileIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    HeadphonesIcon,
    ImageIcon,
    LoaderCircle,
    Trash2Icon,
    UploadIcon,
    VideoIcon,
    XIcon
} from 'lucide-react';
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

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (file: File) => {
    const fileType = file.type;
    const fileName = file.name;

    const iconMap = {
        pdf: {
            icon: FileTextIcon,
            conditions: (type: string, name: string) =>
                type.includes("pdf") ||
                name.endsWith(".pdf") ||
                type.includes("word") ||
                name.endsWith(".doc") ||
                name.endsWith(".docx"),
        },
        archive: {
            icon: FileArchiveIcon,
            conditions: (type: string, name: string) =>
                type.includes("zip") ||
                type.includes("archive") ||
                name.endsWith(".zip") ||
                name.endsWith(".rar"),
        },
        excel: {
            icon: FileSpreadsheetIcon,
            conditions: (type: string, name: string) =>
                type.includes("excel") ||
                name.endsWith(".xls") ||
                name.endsWith(".xlsx"),
        },
        video: {
            icon: VideoIcon,
            conditions: (type: string) => type.includes("video/"),
        },
        audio: {
            icon: HeadphonesIcon,
            conditions: (type: string) => type.includes("audio/"),
        },
        image: {
            icon: ImageIcon,
            conditions: (type: string) => type.startsWith("image/"),
        },
    };

    for (const { icon: Icon, conditions } of Object.values(iconMap)) {
        if (conditions(fileType, fileName)) {
            return <Icon className="size-5 opacity-60" />;
        }
    }

    return <FileIcon className="size-5 opacity-60" />;
};

export default function CloseReport({ report_id, isDialogOpen, setIsDialogOpen }: CloseReportProps) {
    const { flash } = usePage<{
        flash: { success?: string };
    }>().props;

    const { data, setData, post, processing, reset } = useForm({
        descripcion: '',
        files: [] as File[],
    });

    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (data.files.length + acceptedFiles.length > 4) {
                setError('No puedes subir más de 4 archivos.');
                return;
            }
            setError(null);
            setData('files', [...data.files, ...acceptedFiles]);
        },
        [data.files, setData],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 4,
    });

    const removeFile = (index: number) => {
        setData('files', data.files.filter((_, i) => i !== index));
    };

    const clearFiles = () => {
        setData('files', []);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (data.files.length === 0) {
            setError('Debe subir al menos un archivo para cerrar el reporte.');
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

    const isImageFile = (file: File) => {
        return file.type.startsWith('image/');
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Cerrar Reporte</DialogTitle>
                        <DialogDescription>¿Está seguro de que desea cerrar este reporte?</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4" method="post" action={route('finish.store', { id: report_id })}>
                        <textarea
                            className="w-full rounded border p-3"
                            placeholder="Comentario"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            rows={3}
                        />
                        
                        <div className="flex flex-col gap-2">
                            <div
                                {...getRootProps()}
                                className={`border-input relative flex min-h-32 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors ${
                                    isDragActive ? 'bg-accent/50' : ''
                                } ${data.files.length > 0 ? '' : 'justify-center'}`}
                            >
                                <input {...getInputProps()} className="sr-only" />
                                
                                {data.files.length > 0 ? (
                                    <div className="flex w-full flex-col gap-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="truncate text-sm font-medium">
                                                Archivos ({data.files.length})
                                            </h3>
                                            <div className="flex gap-2">
                                                <Button type="button" variant="outline" size="sm" onClick={() => getRootProps().onClick}>
                                                    <UploadIcon className="-ms-0.5 size-3.5 opacity-60" />
                                                    Agregar
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" onClick={clearFiles}>
                                                    <Trash2Icon className="-ms-0.5 size-3.5 opacity-60" />
                                                    Eliminar todos
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {data.files.map((file, index) => (
                                                <div key={index} className="bg-background relative flex flex-col rounded-md border">
                                                    <div className="bg-accent flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit]">
                                                        {isImageFile(file) ? (
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={`preview ${index}`}
                                                                className="size-full rounded-t-[inherit] object-cover"
                                                            />
                                                        ) : (
                                                            getFileIcon(file)
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        size="icon"
                                                        className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                                                    >
                                                        <XIcon className="size-3.5" />
                                                    </Button>
                                                    <div className="flex min-w-0 flex-col gap-0.5 border-t p-3">
                                                        <p className="truncate text-[13px] font-medium">{file.name}</p>
                                                        <p className="text-muted-foreground truncate text-xs">{formatBytes(file.size)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                                        <div className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border">
                                            <UploadIcon className="size-4 opacity-60" />
                                        </div>
                                        <p className="mb-1.5 text-sm font-medium">Arrastra archivos aquí</p>
                                        <p className="text-muted-foreground text-xs">Máximo 4 archivos ∙ Hasta 5MB</p>
                                        <Button type="button" variant="outline" className="mt-4">
                                            <UploadIcon className="-ms-1 opacity-60" />
                                            Seleccionar archivos
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
                                    <AlertCircleIcon className="size-3 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <Button 
                            type="submit" 
                            className="mt-4 w-full" 
                            disabled={processing || !data.descripcion.trim() || data.files.length === 0}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Confirmar Cierre
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
