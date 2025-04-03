import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Importar íconos de Lucide

export default function DownloadContractFormat({ isDialogOpen, setIsDialogOpen }: { isDialogOpen: boolean; setIsDialogOpen: (open: boolean) => void }) {
    const [uea, setUea] = useState<string>(''); // Estado para la UEA seleccionada
    const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para el indicador de carga
    const [current, setCurrent] = useState(0); // Índice actual del carrusel

    // Diapositivas con imágenes y notas
    const slides = [
        { image: '/examples/01.png', note: 'Paso 1: Seleccione la opción adecuada.' },
        { image: '/examples/02.png', note: 'Paso 2: Complete los datos requeridos.' },
        { image: '/examples/03.png', note: 'Paso 3: Confirme y descargue el formato.' },
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
            <DialogContent className="sm:max-w-[425px]">
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
                    <Button onClick={handleDownload} disabled={!uea || isLoading} className="mt-2">
                        {isLoading ? 'Descargando...' : 'Descargar Formato'}
                    </Button>
                    {uea && (
                        <div className="mt-4 relative w-full max-w-xs mx-auto">
                            <div className="overflow-hidden border rounded-lg">
                                <div
                                    className="flex transition-transform duration-300"
                                    style={{ transform: `translateX(-${current * 100}%)` }}
                                >
                                    {slides.map((slide, index) => (
                                        <div
                                            key={index}
                                            className="w-full flex-shrink-0 flex flex-col items-center justify-center h-64 bg-gray-100"
                                        >
                                            <img
                                                src={slide.image}
                                                alt={`Slide ${index + 1}`}
                                                className="w-full h-40 object-contain"
                                            />
                                            <p className="mt-2 text-center text-sm text-gray-700">{slide.note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 flex space-x-2">
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
                                Slide {current + 1} of {slides.length}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
