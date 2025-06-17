import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    AlertCircleIcon,
    Trash2Icon,
    UploadIcon,
    XIcon,
    PenToolIcon,
    SaveIcon
} from 'lucide-react';

interface ImageDropProps {
    label: string;
    files: File[];
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
    error?: string | null;
    onError?: (error: string | null) => void;
    required?: boolean;
    pincel?: boolean; // Nuevo prop opcional
}

export default function ImageDrop({
    label,
    files,
    onFilesChange,
    maxFiles = 4,
    error,
    onError,
    required = false,
    pincel = false // default false
}: ImageDropProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [imageBase64, setImageBase64] = useState<string>('');
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{x: number, y: number} | null>(null);
    const [drawColor, setDrawColor] = useState<string>('#ff0000');
    const [drawWidth, setDrawWidth] = useState<number>(3);
    const [drawMode, setDrawMode] = useState<'draw'>('draw');
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Solo aceptar imágenes
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;
            const newFile = acceptedFiles[0];
            if (!newFile.type.startsWith('image/')) {
                onError?.('Solo se permiten imágenes.');
                return;
            }
            if (maxFiles === 1) {
                onError?.(null);
                onFilesChange([newFile]);
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImageBase64(e.target?.result as string);
                    setSelectedImageIndex(0);
                    setIsModalOpen(true);
                };
                reader.readAsDataURL(newFile);
                return;
            }
            if (files.length >= maxFiles) {
                onError?.(`No puedes subir más de ${maxFiles} imágenes.`);
                return;
            }
            onError?.(null);
            onFilesChange([...files, newFile]);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageBase64(e.target?.result as string);
                setSelectedImageIndex(files.length);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(newFile);
        },
        [files, maxFiles, onFilesChange, onError],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        multiple: false,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        }
    });

    const removeFile = (index: number, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }
        onFilesChange(files.filter((_, i) => i !== index));
    };

    const clearFiles = (event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }
        onFilesChange([]);
    };

    const openImageModal = async (index: number) => {
        const file = files[index];
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            setImageBase64(base64);
            setSelectedImageIndex(index);
            setIsModalOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImageIndex(null);
        setImageBase64('');
    };

    useEffect(() => {
        if (isModalOpen && imageBase64 && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Escalar la imagen para que el alto sea el original o 400px máximo
                const maxHeight = 400;
                let drawHeight = img.height;
                let drawWidth = img.width;
                let scale = 1;
                if (img.height > maxHeight) {
                    scale = maxHeight / img.height;
                    drawHeight = maxHeight;
                    drawWidth = img.width * scale;
                }
                // Ajustar para pantallas retina
                const dpr = window.devicePixelRatio || 1;
                canvas.width = drawWidth * dpr;
                canvas.height = drawHeight * dpr;
                canvas.style.width = `${drawWidth}px`;
                canvas.style.height = `${drawHeight}px`;
                ctx?.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
                ctx?.scale(dpr, dpr);
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                ctx?.drawImage(img, 0, 0, drawWidth, drawHeight);
            };
            img.src = imageBase64;
        }
    }, [isModalOpen, imageBase64]);

    // Precisión: obtener coordenadas relativas al canvas y considerar devicePixelRatio y escala
    const getRelativePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width) / dpr,
            y: (e.clientY - rect.top) * (canvas.height / rect.height) / dpr,
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isPaintingEnabled) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const { x, y } = getRelativePos(e);
            setLastPos({ x, y });
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(x, y);
            }
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isPaintingEnabled) return;
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { x, y } = getRelativePos(e);

        if (ctx && lastPos) {
            ctx.lineWidth = drawWidth;
            ctx.lineCap = 'round';
            ctx.strokeStyle = drawColor;
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
            setLastPos({ x, y });
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setLastPos(null);
    };

    // Borrar canvas (limpiar y volver a dibujar la imagen original)
    const clearCanvas = () => {
        if (!canvasRef.current || !imageBase64) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            // Mantener el mismo escalado que al cargar la imagen (máximo 400px alto)
            const maxHeight = 400;
            let drawHeight = img.height;
            let drawWidth = img.width;
            let scale = 1;
            if (img.height > maxHeight) {
                scale = maxHeight / img.height;
                drawHeight = maxHeight;
                drawWidth = img.width * scale;
            }
            const dpr = window.devicePixelRatio || 1;
            canvas.width = drawWidth * dpr;
            canvas.height = drawHeight * dpr;
            canvas.style.width = `${drawWidth}px`;
            canvas.style.height = `${drawHeight}px`;
            ctx?.setTransform(1, 0, 0, 1, 0, 0);
            ctx?.scale(dpr, dpr);
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            ctx?.drawImage(img, 0, 0, drawWidth, drawHeight);
        };
        img.src = imageBase64;
    };

    const saveEditedImage = () => {
        if (!canvasRef.current || selectedImageIndex === null) return;

        const canvas = canvasRef.current;
        canvas.toBlob((blob) => {
            if (blob) {
                const originalFile = files[selectedImageIndex];
                const editedFile = new File([blob], originalFile.name, {
                    type: originalFile.type,
                    lastModified: Date.now()
                });
                
                const newFiles = [...files];
                newFiles[selectedImageIndex] = editedFile;
                onFilesChange(newFiles);
                closeModal();
            }
        }, files[selectedImageIndex].type);
    };

    // Cambia el handler para prevenir el submit por defecto
    const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        saveEditedImage();
    };

    // Solo permitir pintar si pincel es true
    const [isPaintingEnabled, setIsPaintingEnabled] = useState<boolean>(!!pincel);

    useEffect(() => {
        setIsPaintingEnabled(!!pincel);
    }, [pincel]);

    // Solo mostrar el modal si pincel es true
    const shouldShowModal = isModalOpen && selectedImageIndex !== null && isPaintingEnabled;

    return (
        <div className="col-span-2">
            <Label className="mb-3">{label} {required && '*'}</Label>
            <div className="flex flex-col gap-2">
                <div
                    {...getRootProps()}
                    className={`border-input relative flex min-h-32 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors ${
                        isDragActive ? 'bg-accent/50' : ''
                    } ${files.length > 0 ? '' : 'justify-center'}`}
                >
                    <input {...getInputProps()} className="sr-only" />
                    {files.length > 0 ? (
                        <div className="flex w-full flex-col gap-3">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="truncate text-sm font-medium">
                                    {maxFiles === 1 ? label : `${label} (${files.length})`}
                                </h3>
                                <div className="flex gap-2">
                                    {maxFiles > 1 && (
                                        <Button type="button" variant="outline" size="sm" onClick={(e) => {
                                            e.stopPropagation();
                                            document.querySelector('input[type="file"]')?.click();
                                        }}>
                                            <UploadIcon className="-ms-0.5 size-3.5 opacity-60" />
                                            Agregar
                                        </Button>
                                    )}
                                    <Button type="button" variant="outline" size="sm" onClick={clearFiles}>
                                        <Trash2Icon className="-ms-0.5 size-3.5 opacity-60" />
                                        {maxFiles === 1 ? 'Eliminar' : 'Eliminar todos'}
                                    </Button>
                                </div>
                            </div>

                            <div className={`grid gap-4 ${maxFiles === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                {files.map((file, index) => (
                                    <div key={index} className="bg-background relative flex flex-col rounded-md border">
                                        <div 
                                            className="bg-accent flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-[inherit] cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openImageModal(index);
                                            }}
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`preview ${index}`}
                                                className="size-full rounded-t-[inherit] object-cover"
                                            />
                                        </div>
                                        {maxFiles > 1 && (
                                            <Button
                                                type="button"
                                                onClick={(e) => removeFile(index, e)}
                                                size="icon"
                                                className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                                            >
                                                <XIcon className="size-3.5" />
                                            </Button>
                                        )}
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
                            <p className="mb-1.5 text-sm font-medium">
                                {maxFiles === 1 ? `Arrastra tu ${label.toLowerCase()} aquí` : `Arrastra ${label.toLowerCase()} aquí`}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {maxFiles === 1 ? 'Solo 1 imagen' : `Máximo ${maxFiles} imágenes`} ∙ Hasta 5MB
                            </p>
                            <Button type="button" variant="outline" className="mt-4">
                                <UploadIcon className="-ms-1 opacity-60" />
                                {maxFiles === 1 ? `Seleccionar ${label.toLowerCase()}` : `Seleccionar ${label.toLowerCase()}`}
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

            {/* Modal para editar imagen */}
            {shouldShowModal && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg w-full h-full max-w-[95vw] max-h-[95vh] sm:max-w-4xl sm:max-h-[90vh] sm:w-auto sm:h-auto flex flex-col">
                        {/* Header del modal */}
                        <div className="flex items-center justify-between p-4 border-b shrink-0">
                            <h3 className="text-lg font-semibold">Editar imagen</h3>
                            <Button variant="ghost" size="sm" onClick={closeModal}>
                                <XIcon className="size-4" />
                            </Button>
                        </div>

                        {/* Controles solo pintar y limpiar */}
                        {isPaintingEnabled && (
                        <div className="flex items-center gap-4 px-4 py-2 border-b bg-gray-50 shrink-0 overflow-x-auto">
                            <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                                Color:
                                <input
                                    type="color"
                                    value={drawColor}
                                    onChange={e => setDrawColor(e.target.value)}
                                    className="w-6 h-6 p-0 border-none bg-transparent"
                                />
                            </label>
                            <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                                Grosor:
                                <input
                                    type="range"
                                    min={1}
                                    max={20}
                                    value={drawWidth}
                                    onChange={e => setDrawWidth(Number(e.target.value))}
                                    className="w-24"
                                />
                                <span>{drawWidth}px</span>
                            </label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearCanvas}
                                type="button"
                            >
                                <Trash2Icon className="size-4 mr-1" />
                                Limpiar
                            </Button>
                        </div>
                        )}

                        {/* Canvas para dibujar */}
                        <div className="flex-1 p-4 overflow-auto min-h-0">
                            <div className="flex justify-center items-center h-full">
                                <canvas
                                    ref={canvasRef}
                                    className="border rounded cursor-crosshair max-w-full max-h-full"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                            </div>
                            {isPaintingEnabled && (
                                <div className="text-center mt-4 text-sm text-gray-600 flex items-center justify-center gap-2">
                                    <PenToolIcon className="inline size-4" />
                                    Usa el mouse para pintar sobre la imagen
                                </div>
                            )}
                        </div>

                        {/* Footer del modal */}
                        <div className="flex items-center justify-end gap-2 p-4 border-t shrink-0">
                            <Button variant="outline" onClick={closeModal}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSaveClick}>
                                <SaveIcon className="size-4 mr-2" />
                                Guardar cambios
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}