import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Check, X, Circle, Square, ArrowRight, Pencil } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';

interface ImageAnnotationModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageFile: File | null;
    onSave: (annotatedFile: File) => void;
}

export default function ImageAnnotationModal({
    isOpen,
    onClose,
    imageFile,
    onSave
}: ImageAnnotationModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingTool, setDrawingTool] = useState<'circle' | 'square' | 'arrow' | 'pen'>('circle');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (isOpen && imageFile && canvasRef.current) {
            loadImageToCanvas();
        }
    }, [isOpen, imageFile]);

    const loadImageToCanvas = () => {
        if (!imageFile || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            // Set canvas size to image size
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw the image
            ctx.drawImage(img, 0, 0);
            setImageLoaded(true);
        };
        
        img.src = URL.createObjectURL(imageFile);
    };

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getMousePos(e);
        setIsDrawing(true);
        setStartPoint(pos);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        if (drawingTool === 'pen') {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const currentPos = getMousePos(e);

        if (drawingTool === 'pen') {
            ctx.lineTo(currentPos.x, currentPos.y);
            ctx.stroke();
        }
    };

    const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !startPoint || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const endPos = getMousePos(e);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;

        switch (drawingTool) {
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(endPos.x - startPoint.x, 2) + Math.pow(endPos.y - startPoint.y, 2)
                );
                ctx.beginPath();
                ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
                break;

            case 'square':
                const width = endPos.x - startPoint.x;
                const height = endPos.y - startPoint.y;
                ctx.strokeRect(startPoint.x, startPoint.y, width, height);
                break;

            case 'arrow':
                // Draw arrow line
                ctx.beginPath();
                ctx.moveTo(startPoint.x, startPoint.y);
                ctx.lineTo(endPos.x, endPos.y);
                ctx.stroke();

                // Draw arrow head
                const angle = Math.atan2(endPos.y - startPoint.y, endPos.x - startPoint.x);
                const headLength = 20;
                
                ctx.beginPath();
                ctx.moveTo(endPos.x, endPos.y);
                ctx.lineTo(
                    endPos.x - headLength * Math.cos(angle - Math.PI / 6),
                    endPos.y - headLength * Math.sin(angle - Math.PI / 6)
                );
                ctx.moveTo(endPos.x, endPos.y);
                ctx.lineTo(
                    endPos.x - headLength * Math.cos(angle + Math.PI / 6),
                    endPos.y - headLength * Math.sin(angle + Math.PI / 6)
                );
                ctx.stroke();
                break;
        }

        setIsDrawing(false);
        setStartPoint(null);
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas || !imageFile) return;

        canvas.toBlob((blob) => {
            if (blob) {
                const annotatedFile = new File([blob], imageFile.name, {
                    type: 'image/png',
                    lastModified: Date.now()
                });
                onSave(annotatedFile);
                onClose();
            }
        }, 'image/png');
    };

    const handleClose = () => {
        setImageLoaded(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Anotar imagen</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    {/* Tool selector */}
                    <div className="flex gap-2 p-2 bg-gray-100 rounded-lg">
                        <Button
                            type="button"
                            variant={drawingTool === 'circle' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDrawingTool('circle')}
                        >
                            <Circle className="w-4 h-4 mr-1" />
                            Círculo
                        </Button>
                        <Button
                            type="button"
                            variant={drawingTool === 'square' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDrawingTool('square')}
                        >
                            <Square className="w-4 h-4 mr-1" />
                            Cuadrado
                        </Button>
                        <Button
                            type="button"
                            variant={drawingTool === 'arrow' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDrawingTool('arrow')}
                        >
                            <ArrowRight className="w-4 h-4 mr-1" />
                            Flecha
                        </Button>
                        <Button
                            type="button"
                            variant={drawingTool === 'pen' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDrawingTool('pen')}
                        >
                            <Pencil className="w-4 h-4 mr-1" />
                            Dibujo libre
                        </Button>
                    </div>

                    {/* Canvas */}
                    <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
                        <canvas
                            ref={canvasRef}
                            className="max-w-full max-h-96 border border-gray-300 cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            style={{ display: imageLoaded ? 'block' : 'none' }}
                        />
                        {!imageLoaded && (
                            <div className="flex items-center justify-center w-96 h-96 bg-gray-200 rounded">
                                Cargando imagen...
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose}>
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={!imageLoaded}>
                        <Check className="w-4 h-4 mr-1" />
                        Guardar anotación
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
