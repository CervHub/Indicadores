import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'sonner';

export default function DownloadContractFormat({
    isDialogOpen,
    setIsDialogOpen,
}: {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
}) {
    const [uea, setUea] = useState<string>(''); // Estado para la UEA seleccionada
    const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para el indicador de carga
    const [current, setCurrent] = useState(0); // Índice actual del carrusel

    // Diapositivas con imágenes y notas
    const slides = [
        { image: '/examples/02.png', note: 'Paso 1: Complete únicamente los campos resaltados en azul oscuro según el tipo de empresa.' },
        { image: '/examples/03.png', note: 'Paso 2: Al modificar los campos, los datos se actualizarán automáticamente en las demás hojas.' },
        { image: '/examples/01.png', note: 'Paso 3: Repita este proceso hasta completar todas las hojas del formato.' },
    ];

    const handleDownload = async () => {
        if (!uea) {
            toast.error('Por favor, seleccione una UEA antes de descargar.');
            return;
        }

        setIsLoading(true); // Activar indicador de carga

        const ueaCode = {
            ACUMULACION: 'SPCAT',
            CONCENTRADORA: 'SPCCT',
            LIXIVIACION: 'SPCLX',
        }[uea];

        if (ueaCode) {
            try {
                // Realizar la solicitud al backend
                const response = await fetch(`/format/download/${ueaCode}`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error('Error al descargar el archivo.');
                }

                // Generar un UID único
                const uid = Date.now(); // Puedes usar cualquier método para generar un UID único
                const uniqueFileName = `${uea}_${uid}`;

                // Crear un blob para descargar el archivo
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = uniqueFileName; // Usar el nombre del archivo con UID
                document.body.appendChild(link);
                link.click();
                link.remove();

                toast.success('Archivo descargado exitosamente.');
            } catch (error) {
                toast.error('Hubo un error al intentar descargar el archivo.');
            } finally {
                setIsLoading(false); // Desactivar indicador de carga
            }
        }
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
                        <div className="relative mx-auto mt-0 w-full max-w-full">
                            <div className="relative overflow-hidden rounded-lg border">
                                <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${current * 100}%)` }}>
                                    {slides.map((slide, index) => (
                                        <div
                                            key={index}
                                            className="relative flex w-full flex-shrink-0 flex-col items-center justify-center bg-gray-100"
                                        >
                                            <img src={slide.image} alt={`Slide ${index + 1}`} className="h-auto w-full object-cover" />
                                            <p className="bg-opacity-50 absolute top-0 right-0 left-0 bg-black py-2 text-center text-sm text-white">
                                                {slide.note}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2 flex justify-center gap-4">
                                <button
                                    onClick={handlePrevious}
                                    className="flex items-center justify-center rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex items-center justify-center rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="text-muted-foreground py-2 text-center text-sm">
                                Paso {current + 1} de {slides.length}
                            </div>
                        </div>
                    )}
                    <Button onClick={handleDownload} disabled={!uea || isLoading} className="w-auto">
                        {isLoading ? 'Descargando...' : 'Descargar Formato'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
