import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from '@inertiajs/react'; // Importamos useForm para manejar el envío de datos
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

type Causa = { id: string; name: string; group: string };

const vehicleTypes = {
    camioneta: 'Camioneta',
    combi: 'Combi',
    ambulancia: 'Ambulancia',
    bus: 'Bus',
    camión: 'Camión',
    'camión grúa': 'Camión Grúa',
    otros: 'Otros',
};

export default function InspectionVehicle({
    causas,
    type,
    userId,
    companyId,
    userName,
    company,
}: {
    causas: Causa[];
    type: string;
    userId: string;
    companyId: string;
    userName: string;
    company: string;
}) {
    const { data, setData, reset } = useForm({
        plate: '',
        type: '',
        brand: '',
        model: '',
        engineNumber: '',
        year: '',
        company: '',
        driver: '',
        licenseNumber: '',
        generalState: '',
        vehicleCode: '',
        images: [] as string[],
        signature: '',
        result: '',
        inspectionDate: getLimaDateTimeString(),
        companyId,
        userId,
        userName,
        type_report: 'vehicular',
        type_inspection: type,
        causas: causas.map((causa) => ({ id: causa.id, state: '', observation: '' })),
    });

    const [causaStates, setCausaStates] = useState(causas.map((causa) => ({ id: causa.id, state: '', observation: '' })));
    const [isSearchingPlate, setIsSearchingPlate] = useState(false);
    const [isSearchingLicense, setIsSearchingLicense] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calcula el resultado automáticamente
    const getAutoResult = () => {
        if (causaStates.some((c) => c.state === 'Mal')) return 'Desaprobado';
        if (causaStates.every((c) => c.state)) return 'Aprobado';
        return '';
    };

    // Actualiza el resultado automáticamente cuando cambian las causas
    React.useEffect(() => {
        setData('result', getAutoResult());
    }, [causaStates]);

    // Solo permite enviar si todas las causas tienen estado y el resultado está calculado
    const isFormValid = () => {
        return (
            data.plate &&
            data.type &&
            data.brand &&
            data.model &&
            data.engineNumber &&
            data.year &&
            data.company &&
            getAutoResult() &&
            causaStates.every((c) => c.state)
        );
    };

    const handleCausaStateChange = (id: string, state: string, observation: string) => {
        const updatedCausaStates = causaStates.map((causa) =>
            causa.id === id
                ? {
                    ...causa,
                    state: state || causa.state,
                    observation,
                }
                : causa,
        );
        setCausaStates(updatedCausaStates);
        setData('causas', updatedCausaStates);
    };

    const handleSearchPlate = async () => {
        if (!data.plate) {
            toast.error('Por favor, ingrese una placa para buscar.');
            return;
        }

        setIsSearchingPlate(true);
        toast.info('Buscando información para la placa...', { duration: 3000 });

        try {
            const response = await fetch(route('web.v1.searchVehiclesForInspection', { license_plate: data.plate, company_id: companyId }));
            const responseData = await response.json();

            if (response.ok && responseData.status === 'success' && responseData.data) {
                setData((prevData) => ({
                    ...prevData,
                    vehicleCode: responseData.data.code || '',
                    type: responseData.data.type || '',
                    brand: responseData.data.brand || '',
                    model: responseData.data.model || '',
                    engineNumber: responseData.data.engine_number || '',
                    year: responseData.data.year || '',
                    company: responseData.company.nombre || '',
                }));
                toast.success('Información del vehículo cargada con éxito.');
            } else if (responseData.status === 'warning') {
                toast.warning(
                    responseData.message || 'El vehículo no está vinculado a la empresa seleccionada.',
                    { duration: 10000 }
                );
                setData((prevData) => ({
                    ...prevData,
                    vehicleCode: '',
                }));
            } else if (responseData.status === 'error') {
                toast.error(responseData.message || 'No se encontró información para la placa ingresada.');
                setData((prevData) => ({
                    ...prevData,
                    vehicleCode: '',
                }));
            } else {
                toast.error('No se encontró información para la placa ingresada.');
                setData((prevData) => ({
                    ...prevData,
                    vehicleCode: '',
                }));
            }
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error al buscar la placa.');
            setData((prevData) => ({
                ...prevData,
                vehicleCode: '',
            }));
        } finally {
            setIsSearchingPlate(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid()) {
            toast.error('Por favor, complete todos los campos requeridos antes de enviar el formulario.');
            return;
        }

        setIsSubmitting(true); // Activar el preload del botón

        try {
            const response = await fetch(route('web.v1.saveReport'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    causas: causaStates, // Incluir los estados de las causas en el envío
                }),
            });

            if (!response.ok) {
                if (response.status === 422) {
                    const errorData = await response.json();
                    toast.error('Errores de validación en el formulario.');
                    console.error(errorData.errors);
                } else {
                    throw new Error('Error al guardar el reporte.');
                }
            } else {
                const responseData = await response.json();
                toast.success(responseData.message || 'Reporte guardado con éxito.');
                reset(); // Resetear el formulario
                setCausaStates(causas.map((causa) => ({ id: causa.id, state: '', observation: '' }))); // Resetear las causas
            }
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error al guardar el reporte. Intente de nuevo.');
        } finally {
            setIsSubmitting(false); // Desactivar el preload del botón
        }
    };

    const groupedCausas = causas.reduce(
        (groups, causa) => {
            if (!groups[causa.group]) {
                groups[causa.group] = [];
            }
            groups[causa.group].push(causa);
            return groups;
        },
        {} as Record<string, Causa[]>,
    );

    return (
        <form className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" onSubmit={handleSubmit}>
            {/* Placa */}
            <div className="">
                <Label htmlFor="plate" className="mb-3">
                    Placa
                </Label>
                <div className="relative flex items-center gap-2">
                    <Input type="text" id="plate" value={data.plate || ''} onChange={(e) => setData('plate', e.target.value)} className="flex-1" />
                    <Button
                        variant={'outline'}
                        type="button"
                        onClick={handleSearchPlate}
                        className="flex items-center px-2"
                        disabled={isSearchingPlate}
                    >
                        {isSearchingPlate ? (
                            <span className="loader h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></span>
                        ) : (
                            <Search className="h-5 w-5 text-gray-500" />
                        )}
                    </Button>
                </div>
            </div>


            {/* Código Autogenerado */}
            <div className="">
                <Label htmlFor="vehicleCode" className="mb-3">
                    Código de llamada
                </Label>
                <Input type="text" id="vehicleCode" value={data.vehicleCode || ''} disabled />
            </div>

            {/* Tipo */}
            <div className="">
                <Label htmlFor="type" className="mb-3">
                    Tipo
                </Label>
                <Select value={data.type} disabled>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(vehicleTypes).map(([key, label]) => (
                            <SelectItem key={label} value={label}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Marca */}
            <div className="">
                <Label htmlFor="brand" className="mb-3">
                    Marca
                </Label>
                <Input type="text" id="brand" value={data.brand || ''} disabled />
            </div>

            {/* Modelo */}
            <div className="">
                <Label htmlFor="model" className="mb-3">
                    Modelo
                </Label>
                <Input type="text" id="model" value={data.model || ''} disabled />
            </div>

            {/* Nº Motor */}
            <div className="">
                <Label htmlFor="engineNumber" className="mb-3">
                    Nº Motor
                </Label>
                <Input type="text" id="engineNumber" value={data.engineNumber || ''} disabled />
            </div>

            {/* Año */}
            <div className="">
                <Label htmlFor="year" className="mb-3">
                    Año
                </Label>
                <Input type="text" id="year" value={data.year || ''} disabled />
            </div>


            {/* Empresa */}
            <div className="">
                <Label htmlFor="company" className="mb-3">
                    Empresa
                </Label>
                <Input type="text" id="company" value={data.company || ''} disabled />
            </div>
            {/* Tabla de causas */}
            <div className="col-span-full">
                <h3 className="mb-4 text-lg font-bold">Causas</h3>
                <div className="bg-background overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 border-b">
                                <TableHead className="h-8 border-r py-2" rowSpan={2} style={{ width: '50%' }}>
                                    Item
                                </TableHead>
                                <TableHead className="h-8 border-r py-2" colSpan={3}>
                                    Estado
                                </TableHead>
                                <TableHead className="h-8 border-l py-2" rowSpan={2} style={{ width: '20%' }}>
                                    Observaciones
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-muted/50 border-b">
                                <TableHead className="h-8 border-r py-2" style={{ width: '10%' }}>
                                    Bien
                                </TableHead>
                                <TableHead className="h-8 border-r py-2" style={{ width: '10%' }}>
                                    Mal
                                </TableHead>
                                <TableHead className="h-8 py-2" style={{ width: '10%' }}>
                                    No Aplica
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(groupedCausas).map(([group, groupCausas]) => (
                                <React.Fragment key={group}>
                                    <TableRow className="bg-muted/50">
                                        <TableCell colSpan={5} className="text-center font-bold">
                                            {group}
                                        </TableCell>
                                    </TableRow>
                                    {groupCausas.map((causa) => (
                                        <TableRow key={causa.id}>
                                            <TableCell className="border-r py-1 font-medium whitespace-normal">{causa.name}</TableCell>
                                            <TableCell className="text-center">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`estado-${causa.id}`}
                                                        value="Bien"
                                                        checked={causaStates.find((c) => c.id === causa.id)?.state === 'Bien'}
                                                        onChange={() => handleCausaStateChange(causa.id, 'Bien', '')}
                                                        className="w-6 h-6 accent-green-600 cursor-pointer"
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell className="border-r border-l text-center">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`estado-${causa.id}`}
                                                        value="Mal"
                                                        checked={causaStates.find((c) => c.id === causa.id)?.state === 'Mal'}
                                                        onChange={() => handleCausaStateChange(causa.id, 'Mal', '')}
                                                        className="w-6 h-6 accent-red-500 cursor-pointer"
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`estado-${causa.id}`}
                                                        value="No Aplica"
                                                        checked={causaStates.find((c) => c.id === causa.id)?.state === 'No Aplica'}
                                                        onChange={() => handleCausaStateChange(causa.id, 'No Aplica', '')}
                                                        className="w-6 h-6 accent-gray-600 cursor-pointer"
                                                    />
                                                </label>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="text"
                                                    value={causaStates.find((c) => c.id === causa.id)?.observation || ''}
                                                    onChange={(e) => handleCausaStateChange(causa.id, '', e.target.value)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Imágenes adicionales */}
            <div className="col-span-full">
                <ImageDropZone
                    images={data.images}
                    onUpload={(files) => {
                        files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const base64Image = reader.result as string;
                                const img = new Image();
                                img.src = base64Image;
                                img.onload = () => {
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    const maxWidth = 800; // Set the maximum width for the image
                                    const scale = maxWidth / img.width;
                                    canvas.width = maxWidth;
                                    canvas.height = img.height * scale;
                                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                                    const resizedBase64Image = canvas.toDataURL('image/jpeg', 0.8); // Adjust quality if needed
                                    setData((prevData) => ({
                                        ...prevData,
                                        images: [...prevData.images, resizedBase64Image].slice(0, 4),
                                    }));
                                };
                            };
                            reader.readAsDataURL(file);
                        });
                    }}
                    onRemove={(index) => {
                        const updatedImages = data.images.filter((_, i) => i !== index);
                        setData((prevData) => ({ ...prevData, images: updatedImages }));
                    }}
                    label="Imágenes adicionales"
                />
            </div>

            {/* Inspeccionado por */}
            <div className="col-span-2">
                <Label htmlFor="inspectedBy" className="mb-3">
                    Inspeccionado por
                </Label>
                <Input type="text" id="inspectedBy" value={userName} disabled />
            </div>

            {/* Aprobado/Desaprobado */}
            <div className="flex flex-col justify-center h-full">
                <Label htmlFor="result" className="mb-3">
                    Resultado
                </Label>
                <Input
                    type="text"
                    id="result"
                    value={getAutoResult()}
                    disabled
                    className={
                        getAutoResult() === 'Desaprobado'
                            ? 'text-red-600 font-bold'
                            : getAutoResult() === 'Aprobado'
                            ? 'text-green-600 font-bold'
                            : ''
                    }
                />
            </div>

            {/* Botón de envío */}
            <div className="col-span-full flex">
                <Button type="submit" className="flex items-center" disabled={!isFormValid() || isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <span className="loader mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></span>
                            Generando reporte...
                        </>
                    ) : (
                        'Generar reporte'
                    )}
                </Button>
            </div>
        </form>
    );
}
