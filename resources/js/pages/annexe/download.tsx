import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DownloadContractFormat({ isDialogOpen, setIsDialogOpen }: { isDialogOpen: boolean; setIsDialogOpen: (open: boolean) => void }) {
    const [uea, setUea] = useState<string>(''); // Estado para la UEA seleccionada
    const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para el indicador de carga
    const [current, setCurrent] = useState(0); // Índice actual del carrusel

    // Diapositivas con imágenes y notas
    const slides = [
        { image: '/examples/02.png', note: 'Paso 1: Complete únicamente los campos resaltados en azul oscuro según el tipo de empresa.' },
        { image: '/examples/03.png', note: 'Paso 2: Al modificar los campos, los datos se actualizarán automáticamente en las demás hojas.' },
        { image: '/examples/01.png', note: 'Paso 3: Repita este proceso hasta completar todas las hojas del formato.' },
    ];

    const handleDownload = () => {
        if (!uea) {
            alert('Por favor, seleccione una UEA antes de descargar.');
            return;
        }

        setIsLoading(true); // Activar indicador de carga

        // Simular descarga con un timeout
        setTimeout(() => {
            const fileName = {
                ACUMULACION: 'Acumulacion.xlsx',
                CONCENTRADORA: 'Concentradora.xlsx',
                LIXIVIACION: 'Lixiviacion.xlsx',
            }[uea];

            if (fileName) {
                window.location.href = `/formats/${fileName}`;
            }

            setIsLoading(false); // Desactivar indicador de carga
        }, 2000); // Simulación de 2 segundos
    };

    const handlePrevious = () => {
        setCurrent((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
    };

    const handleNext = () => {
        setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Descargar Formato de Contratistas</DialogTitle>
                    <DialogDescription>Seleccione una UEA para descargar el formato correspondiente.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="grid gap-2">
                        <Label htmlFor="uea">UEA</Label>
                        <Select onValueChange={(value) => setUea(value)} value={uea}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione una UEA" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>UEA</SelectLabel>
                                    <SelectItem value="ACUMULACION">ACUMULACIÓN</SelectItem>
                                    <SelectItem value="CONCENTRADORA">CONCENTRADORA</SelectItem>
                                    <SelectItem value="LIXIVIACION">LIXIVIACIÓN</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {uea && (
                        <div className="mt-0 relative w-full max-w-full mx-auto">
                            <div className="overflow-hidden border rounded-lg relative">
                                <div
                                    className="flex transition-transform duration-300"
                                    style={{ transform: `translateX(-${current * 100}%)` }}
                                >
                                    {slides.map((slide, index) => (
                                        <div
                                            key={index}
                                            className="w-full flex-shrink-0 flex flex-col items-center justify-center bg-gray-100 relative"
                                        >
                                            <img
                                                src={slide.image}
                                                alt={`Slide ${index + 1}`}
                                                className="w-full h-auto object-cover"
                                            />
                                            <p className="absolute top-0 left-0 right-0 text-center text-sm text-white bg-black bg-opacity-50 py-2">
                                                {slide.note}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-center mt-2 gap-4">
                                <button
                                    onClick={handlePrevious}
                                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="py-2 text-center text-sm text-muted-foreground">
                                Paso {current + 1} de {slides.length}
                            </div>
                        </div>
                    )}
                    <Button onClick={handleDownload} disabled={!uea || isLoading} className=" w-auto">
                        {isLoading ? 'Descargando...' : 'Descargar Formato'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
