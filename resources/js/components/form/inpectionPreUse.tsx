import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import ImageDropZone from './image';
function getLimaDateTimeString() {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Lima',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const get = (type: string) => parts.find((p) => p.type === type)?.value;

    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

export default function InspectionVehiclePreUse({
    causas,
    companyId,
    userId,
    userName,
}: {
    causas: { id: string; name: string }[];
    companyId: string;
    userId: string;
    userName: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        plate: '',
        vehicleCode: '',
        department: '',
        date: getLimaDateTimeString(), // ✅ Fecha y hora actual en formato Lima
        shift: '',
        driver: userName,
        mileage: '',
        recordNumber: '',
        images: [] as string[],
        signature: '',
        observations: '',
        causas: causas.map((causa) => ({ id: causa.id, state: '' })),
        companyId, // Agregar companyId al formulario
        userId, // Agregar userId al formulario
        userName, // Agregar userName al formulario
        type_report: 'vehicular', // Agregar tipo de reporte
        type_inspection: 'pre-use', // Agregar tipo de inspección
    });

    const [isSearchingPlate, setIsSearchingPlate] = useState(false); // Estado para manejar el preload

    const isFormValid = () => {
        const allCausasValid = data.causas.every((causa) => causa.state !== '');
        return (
            data.plate &&
            data.vehicleCode &&
            data.department &&
            data.date &&
            data.shift &&
            data.driver &&
            data.mileage &&
            data.recordNumber &&
            allCausasValid &&
            data.signature
        );
    };

    const handleCausaStateChange = (id: string, state: string) => {
        setData(
            'causas',
            data.causas.map((causa) => (causa.id === id ? { ...causa, state } : causa)),
        );
    };

    const handleSearchPlate = () => {
        if (!data.plate) {
            toast.error('Por favor, ingrese una placa para buscar.');
            return;
        }

        setIsSearchingPlate(true); // Activar el estado de búsqueda
        toast.info('Buscando información para la placa...', { duration: 3000 }); // Mostrar toast

        fetch(route('web.v1.searchVehicles', { plate: data.plate }))
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al buscar la placa.');
                }
                return response.json();
            })
            .then((response) => {
                const vehicleData = response.data;
                if (vehicleData) {
                    setData('vehicleCode', vehicleData.code || '');
                    toast.success('Información del vehículo cargada con éxito.');
                } else {
                    toast.error('No se encontró información para la placa ingresada.');
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error('Ocurrió un error al buscar la placa.');
            })
            .finally(() => {
                setIsSearchingPlate(false); // Desactivar el estado de búsqueda
            });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) {
            toast.error('Por favor, complete todos los campos requeridos antes de enviar el formulario.');
            return;
        }

        post(route('web.v1.saveReport'), {
            onSuccess: (page) => {
                const flash = page.props.flash as { success?: string; error?: string };
                if (flash.success) {
                    toast.success(flash.success);
                    reset(); // Resetear el formulario
                    setData(
                        'causas',
                        causas.map((causa) => ({ id: causa.id, state: '' })),
                    ); // Resetear las causas
                } else if (flash.error) {
                    toast.error(flash.error);
                }
            },
            onError: () => {
                toast.error('Ocurrió un error al enviar el formulario. Intente de nuevo.');
            },
        });
    };

    return (
        <form className="grid grid-cols-1 gap-6 md:grid-cols-4" onSubmit={handleSubmit}>
            {/* Placa con botón de búsqueda */}
            <div className="col-span-4 flex items-end gap-2 md:col-span-1">
                <div className="flex-1">
                    <Label htmlFor="plate" className="mb-3">
                        Placa
                    </Label>
                    <Input type="text" id="plate" value={data.plate} onChange={(e) => setData('plate', e.target.value)} />
                    {errors.plate && <p className="text-sm text-red-500">{errors.plate}</p>}
                </div>
                <Button
                    type="button"
                    variant={'outline'}
                    onClick={handleSearchPlate}
                    className="mt-6 h-10"
                    disabled={isSearchingPlate} // Deshabilitar el botón mientras se busca
                >
                    {isSearchingPlate ? (
                        <span className="loader h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></span>
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Código de vehículo */}
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="vehicle-code" className="mb-3">
                    Código de vehículo
                </Label>
                <Input readOnly type="text" id="vehicle-code" value={data.vehicleCode} onChange={(e) => setData('vehicleCode', e.target.value)} />
                {errors.vehicleCode && <p className="text-sm text-red-500">{errors.vehicleCode}</p>}
            </div>

            {/* Departamento/Sección */}
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="department" className="mb-3">
                    Dpto/Sección
                </Label>
                <Input type="text" id="department" value={data.department} onChange={(e) => setData('department', e.target.value)} />
                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
            </div>

            {/* Fecha */}
            <div className="col-span-4 md:col-span-1">
                <Label htmlFor="date" className="mb-3">
                    Fecha
                </Label>
                <Input type="datetime-local" id="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            {/* Turno */}
            <div className="col-span-4 md:col-span-1">
                <Label htmlFor="shift" className="mb-3">
                    Turno
                </Label>
                <Select onValueChange={(value) => setData('shift', value)} value={data.shift}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione un turno" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Mañana">Mañana</SelectItem>
                        <SelectItem value="Tarde">Tarde</SelectItem>
                        <SelectItem value="Noche">Noche</SelectItem>
                    </SelectContent>
                </Select>
                {errors.shift && <p className="text-sm text-red-500">{errors.shift}</p>}
            </div>

            {/* Conductor */}
            <div className="col-span-4 md:col-span-1">
                <Label htmlFor="driver" className="mb-3">
                    Conductor
                </Label>
                <Input type="text" id="driver" value={data.driver} onChange={(e) => setData('driver', e.target.value)} />
                {errors.driver && <p className="text-sm text-red-500">{errors.driver}</p>}
            </div>

            {/* Kilometraje */}
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="mileage" className="mb-3">
                    Kilometraje
                </Label>
                <Input type="number" id="mileage" value={data.mileage} onChange={(e) => setData('mileage', e.target.value)} />
                {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
            </div>

            {/* Registro N~ */}
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="record-number" className="mb-3">
                    Registro N°
                </Label>
                <Input type="text" id="record-number" value={data.recordNumber} onChange={(e) => setData('recordNumber', e.target.value)} />
                {errors.recordNumber && <p className="text-sm text-red-500">{errors.recordNumber}</p>}
            </div>

            {/* Tabla de causas */}
            <div className="col-span-4">
                <h3 className="mb-4 text-lg font-bold">Causas</h3>
                <div className="bg-background overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 border-b">
                                <TableHead className="h-9 border-r py-2" rowSpan={2} style={{ width: '70%' }}>
                                    Item
                                </TableHead>
                                <TableHead className="h-9 border-r py-2" colSpan={3}>
                                    Estado
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-muted/50 border-b">
                                <TableHead className="h-9 border-r py-2" style={{ width: '10%' }}>
                                    Bien
                                </TableHead>
                                <TableHead className="h-9 border-r py-2" style={{ width: '10%' }}>
                                    Mal
                                </TableHead>
                                <TableHead className="h-9 py-2" style={{ width: '10%' }}>
                                    No Aplica
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {causas.map((causa) => (
                                <TableRow key={causa.id}>
                                    <TableCell className="border-r py-2 font-medium">{causa.name}</TableCell>
                                    <TableCell className="text-center">
                                        <input
                                            type="radio"
                                            name={`estado-${causa.id}`}
                                            value="Bien"
                                            checked={data.causas.find((c) => c.id === causa.id)?.state === 'Bien'}
                                            onChange={() => handleCausaStateChange(causa.id, 'Bien')}
                                        />
                                    </TableCell>
                                    <TableCell className="border-r border-l text-center">
                                        <input
                                            type="radio"
                                            name={`estado-${causa.id}`}
                                            value="Mal"
                                            checked={data.causas.find((c) => c.id === causa.id)?.state === 'Mal'}
                                            onChange={() => handleCausaStateChange(causa.id, 'Mal')}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <input
                                            type="radio"
                                            name={`estado-${causa.id}`}
                                            value="No Aplica"
                                            checked={data.causas.find((c) => c.id === causa.id)?.state === 'No Aplica'}
                                            onChange={() => handleCausaStateChange(causa.id, 'No Aplica')}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Observaciones */}
            <div className="col-span-4">
                <Label htmlFor="observations" className="mb-3">
                    Observaciones
                </Label>
                <Textarea
                    id="observations"
                    value={data.observations}
                    onChange={(e) => setData('observations', e.target.value)}
                    placeholder="Escriba sus observaciones aquí..."
                />
                {errors.observations && <p className="text-sm text-red-500">{errors.observations}</p>}
            </div>

            {/* Imágenes adicionales */}
            <div className="col-span-4">
                <ImageDropZone
                    images={data.images}
                    onUpload={(files) => {
                        files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const base64Image = reader.result as string;
                                setData('images', [...data.images, base64Image].slice(0, 4));
                            };
                            reader.readAsDataURL(file);
                        });
                    }}
                    onRemove={(index) => {
                        const updatedImages = data.images.filter((_, i) => i !== index);
                        setData('images', updatedImages);
                    }}
                    label="Imágenes adicionales"
                />
            </div>

            {/* Firma */}
            <div className="col-span-4">
                <ImageDropZone
                    images={data.signature ? [data.signature] : []}
                    maxImages={1}
                    onUpload={(files) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const base64Signature = reader.result as string;
                            setData('signature', base64Signature);
                        };
                        reader.readAsDataURL(files[0]);
                    }}
                    onRemove={() => setData('signature', '')}
                    label="Firma"
                />
            </div>

            {/* Botón de envío */}
            <div className="col-span-4">
                <Button type="submit" className="flex-start" disabled={!isFormValid() || processing}>
                    {processing ? (
                        <span className="loader h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></span>
                    ) : (
                        'Generar reporte'
                    )}
                </Button>
            </div>
        </form>
    );
}
