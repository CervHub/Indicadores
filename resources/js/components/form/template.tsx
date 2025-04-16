import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, CheckCircle, Flame, Loader2 } from 'lucide-react'; // Loader2 para animación
import React, { useId, useState } from 'react';
import { toast } from 'sonner';
import ImageDropZone from './image';
import MapSelector from './map';

export default function TemplateForm({
    defaultCoordinates,
    gerencias,
    empresas,
    causas,
}: {
    defaultCoordinates: { lat: number; lng: number };
    gerencias: { id: string; name: string }[];
    empresas: { id: string; name: string }[];
    causas: { id: string; name: string }[];
}) {
    const id = useId(); // Unique ID for the RadioGroup
    const [data, setData] = React.useState({
        eventDate: '',
        eventTime: '',
        management: '',
        company: '',
        causes: '',
        eventDescription: '',
        correctiveActions: '',
        riskLevel: 'low',
        location: '',
        signature: '',
        coordinates: defaultCoordinates,
        images: [] as string[],
    });

    const [loadingField, setLoadingField] = useState<string | null>(null); // Estado para manejar el campo en carga

    // Verifica si todos los campos requeridos están completos
    const isFormValid = () => {
        return (
            data.eventDate &&
            data.eventTime &&
            data.management &&
            data.company &&
            data.causes &&
            data.eventDescription &&
            data.correctiveActions &&
            data.riskLevel &&
            data.location &&
            data.signature
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) {
            toast.error('Por favor, complete todos los campos requeridos antes de enviar el formulario.');
            return;
        }
        console.log('Datos del formulario:', data);
        toast.success('Formulario enviado con éxito.');
    };

    const handleGenerate = async (field: string) => {
        setLoadingField(field); // Establece el campo en carga
        console.log(`Generando contenido con IA para: ${field}`);
        // Simula una llamada a IA con un retraso
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setData((prev) => ({
            ...prev,
            [field]: `Contenido generado automáticamente para ${field}`,
        }));
        setLoadingField(null); // Restablece el estado de carga
    };

    return (
        <form className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:px-[25rem]" onSubmit={handleSubmit}>
            {/* Fecha y hora del evento */}
            <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="event-date" className="mb-3">
                        Fecha del evento
                    </Label>
                    <Input type="date" id="event-date" value={data.eventDate} onChange={(e) => setData({ ...data, eventDate: e.target.value })} />
                </div>
                <div>
                    <Label htmlFor="event-time" className="mb-3">
                        Hora del evento
                    </Label>
                    <Input type="time" id="event-time" value={data.eventTime} onChange={(e) => setData({ ...data, eventTime: e.target.value })} />
                </div>
            </div>

            {/* Gerencia y empresa */}
            <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="management" className="mb-3">
                        Gerencia a reportar
                    </Label>
                    <Select onValueChange={(value) => setData({ ...data, management: value })} value={data.management}>
                        <SelectTrigger id="management">
                            <SelectValue placeholder="Seleccione una gerencia" />
                        </SelectTrigger>
                        <SelectContent>
                            {gerencias.map((gerencia) => (
                                <SelectItem key={gerencia.id} value={gerencia.id}>
                                    {gerencia.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="company" className="mb-3">
                        Empresa a reportar
                    </Label>
                    <Select onValueChange={(value) => setData({ ...data, company: value })} value={data.company}>
                        <SelectTrigger id="company">
                            <SelectValue placeholder="Seleccione una empresa" />
                        </SelectTrigger>
                        <SelectContent>
                            {empresas.map((empresa) => (
                                <SelectItem key={empresa.id} value={empresa.id}>
                                    {empresa.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Separador */}
            <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-700">De acuerdo a mi análisis, las causas fueron:</h3>
            </div>

            {/* Causas */}
            <div className="col-span-2">
                <Label htmlFor="causes" className="mb-3">
                    Causas
                </Label>
                <Select onValueChange={(value) => setData({ ...data, causes: value })} value={data.causes}>
                    <SelectTrigger id="causes">
                        <SelectValue placeholder="Seleccione una causa" />
                    </SelectTrigger>
                    <SelectContent>
                        {causas.map((causa) => (
                            <SelectItem key={causa.id} value={causa.id}>
                                {causa.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Descripción del evento */}
            <div className="relative col-span-2">
                <Label htmlFor="event-description" className="mb-3">
                    Descripción del evento
                </Label>
                <Textarea
                    id="event-description"
                    value={data.eventDescription}
                    onChange={(e) => setData({ ...data, eventDescription: e.target.value })}
                    disabled={loadingField === 'eventDescription'} // Deshabilita si está en carga
                    className="h-40" // Ajusta la altura del Textarea
                />
                <Button
                    type="button"
                    variant={'outline'}
                    className="absolute right-2 bottom-2 flex items-center justify-center p-2"
                    onClick={() => handleGenerate('eventDescription')}
                    disabled={loadingField === 'eventDescription'} // Deshabilita el botón si está en carga
                >
                    {loadingField === 'eventDescription' ? (
                        <Loader2 className="animate-spin text-gray-500" size={20} />
                    ) : (
                        <Flame className="text-gray-500" size={20} />
                    )}
                </Button>
            </div>

            {/* Acciones correctivas */}
            <div className="relative col-span-2">
                <Label htmlFor="corrective-actions" className="mb-3">
                    Acciones correctivas
                </Label>
                <Textarea
                    id="corrective-actions"
                    value={data.correctiveActions}
                    onChange={(e) => setData({ ...data, correctiveActions: e.target.value })}
                    disabled={loadingField === 'correctiveActions'} // Deshabilita si está en carga
                    className="h-40" // Ajusta la altura del Textarea
                />
                <Button
                    type="button"
                    variant={'outline'}
                    className="absolute right-2 bottom-2 flex items-center justify-center p-2"
                    onClick={() => handleGenerate('correctiveActions')}
                    disabled={loadingField === 'correctiveActions'} // Deshabilita el botón si está en carga
                >
                    {loadingField === 'correctiveActions' ? (
                        <Loader2 className="animate-spin text-gray-500" size={20} />
                    ) : (
                        <Flame className="text-gray-500" size={20} />
                    )}
                </Button>
            </div>

            {/* Nivel de riesgo */}
            <div className="col-span-2">
                <Label className="mb-3">Nivel del riesgo</Label>
                <RadioGroup
                    className="grid grid-cols-3 gap-4"
                    defaultValue={data.riskLevel}
                    onValueChange={(value) => setData({ ...data, riskLevel: value })}
                >
                    {/* Bajo */}
                    <div className="border-input has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-[state=checked]:border-red-500">
                        <RadioGroupItem id={`${id}-low`} value="low" className="sr-only" />
                        <CheckCircle className="text-green-500" size={24} aria-hidden="true" />
                        <label
                            htmlFor={`${id}-low`}
                            className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                        >
                            Bajo
                        </label>
                    </div>
                    {/* Medio */}
                    <div className="border-input has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-[state=checked]:border-red-500">
                        <RadioGroupItem id={`${id}-medium`} value="medium" className="sr-only" />
                        <AlertTriangle className="text-yellow-500" size={24} aria-hidden="true" />
                        <label
                            htmlFor={`${id}-medium`}
                            className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                        >
                            Medio
                        </label>
                    </div>
                    {/* Alto */}
                    <div className="border-input has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-[state=checked]:border-red-500">
                        <RadioGroupItem id={`${id}-high`} value="high" className="sr-only" />
                        <Flame className="text-red-500" size={24} aria-hidden="true" />
                        <label
                            htmlFor={`${id}-high`}
                            className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                        >
                            Alto
                        </label>
                    </div>
                </RadioGroup>
            </div>

            {/* Lugar y ubicación */}
            <div className="col-span-2">
                <Label htmlFor="location">Lugar y ubicación</Label>
                <Input type="text" id="location" value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} />
                <MapSelector
                    defaultCoordinates={defaultCoordinates}
                    coordinates={data.coordinates}
                    setCoordinates={(coords) => setData({ ...data, coordinates: coords, location: `Lat: ${coords.lat}, Lng: ${coords.lng}` })}
                />
            </div>

            {/* Imágenes adicionales */}
            <div className="col-span-2">
                <ImageDropZone
                    images={data.images}
                    onUpload={(files) => {
                        const newImages = files.map((file) => URL.createObjectURL(file));
                        setData((prev) => ({ ...prev, images: [...prev.images, ...newImages].slice(0, 4) }));
                    }}
                    onRemove={(index) => {
                        setData((prev) => {
                            const updatedImages = [...prev.images];
                            updatedImages.splice(index, 1);
                            return { ...prev, images: updatedImages };
                        });
                    }}
                    label="Imágenes adicionales"
                />
            </div>

            {/* Firma */}
            <div className="col-span-2">
                <ImageDropZone
                    images={data.signature ? [data.signature] : []}
                    maxImages={1}
                    onUpload={(files) => {
                        const newSignature = URL.createObjectURL(files[0]);
                        setData((prev) => ({ ...prev, signature: newSignature }));
                    }}
                    onRemove={() => setData((prev) => ({ ...prev, signature: '' }))}
                    label="Firma"
                />
            </div>

            {/* Botón de envío */}
            <div className="col-span-2">
                <Button type="submit" className="flex-start" disabled={!isFormValid()}>
                    Generar reporte
                </Button>
            </div>
        </form>
    );
}
