import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
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
    const [data, setData] = useState({
        plate: '',
        vehicleCode: '',
        department: '',
        shift: '',
        driver: userName,
        mileage: '',
        previousMileage: '', // <-- Nuevo campo para kilometraje anterior
        images: [] as string[],
        signature: '',
        observation: '',
        causas: causas.map((causa) => ({ id: causa.id, state: '' })),
        companyId,
        userId,
        userName,
        type_report: 'vehicular',
        type_inspection: 'pre-use',
        status: '',
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSearchingPlate, setIsSearchingPlate] = useState(false);

    const isFormValid = () => {
        const allCausasValid = data.causas.every((causa) => causa.state !== '');
        return (
            data.plate &&
            data.vehicleCode &&
            data.department &&
            data.shift &&
            data.mileage &&
            allCausasValid
        );
    };

    const handleCausaStateChange = (id: string, state: string) => {
        setData((prevData) => ({
            ...prevData,
            causas: prevData.causas.map((causa) => (causa.id === id ? { ...causa, state } : causa)),
        }));
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
                    department: responseData.company.nombre || '',
                    previousMileage: responseData.data.previous_mileage || '', // <-- Asigna el kilometraje anterior
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
                    previousMileage: '', // Limpia si no hay datos
                }));
            } else if (responseData.status === 'error') {
                toast.error(responseData.message || 'No se encontró información para la placa ingresada.');
                setData((prevData) => ({
                    ...prevData,
                    vehicleCode: '',
                    previousMileage: '',
                }));
            } else {
                toast.error('No se encontró información para la placa ingresada.');
                setData((prevData) => ({
                    ...prevData,
                    vehicleCode: '',
                    previousMileage: '',
                }));
            }
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error al buscar la placa.');
            setData((prevData) => ({
                ...prevData,
                vehicleCode: '',
                previousMileage: '',
            }));
        } finally {
            setIsSearchingPlate(false);
        }
    };

    // Calcula el status solo si todas las causas están marcadas
    const getStatus = () => {
        const allCausasValid = data.causas.every((causa) => causa.state !== '');
        if (!allCausasValid) return '';
        return data.causas.some((causa) => causa.state === 'Mal') ? 'Desaprobado' : 'Aprobado';
    };

    // Actualiza el status en el estado cada vez que cambian las causas
    React.useEffect(() => {
        const status = getStatus();
        setData((prevData) => ({
            ...prevData,
            status,
        }));
    }, [data.causas]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid()) {
            toast.error('Por favor, complete todos los campos requeridos antes de enviar el formulario.');
            return;
        }

        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch(route('web.v1.saveReport'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...data, status: getStatus() }), // previousMileage ya va incluido
            });

            if (!response.ok) {
                if (response.status === 422) {
                    const errorData = await response.json();
                    setErrors(errorData.errors || {});
                }
                throw new Error('Error al enviar el formulario.');
            }

            const responseData = await response.json();
            toast.success(responseData.message || 'Reporte generado con éxito.');
            setData((prevData) => ({
                ...prevData,
                plate: '',
                vehicleCode: '',
                department: '',
                shift: '',
                driver: userName,
                mileage: '',
                previousMileage: '', // <-- Reinicia el kilometraje anterior
                images: [],
                signature: '',
                observation: '',
                causas: causas.map((causa) => ({ id: causa.id, state: '' })),
            }));
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error al enviar el formulario. Intente de nuevo.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form className="grid grid-cols-1 gap-6 md:grid-cols-5" onSubmit={handleSubmit}>
            {/* Placa con botón de búsqueda */}
            <div className="col-span-4 flex items-end gap-2 md:col-span-1">
                <div className="flex-1">
                    <Label htmlFor="plate" className="mb-3">
                        Placa
                    </Label>
                    <Input
                        type="text"
                        id="plate"
                        value={data.plate}
                        onChange={(e) => setData((prevData) => ({ ...prevData, plate: e.target.value }))}
                    />
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
                    Código de Llamada
                </Label>
                <Input
                    disabled
                    type="text"
                    id="vehicle-code"
                    value={data.vehicleCode}
                    onChange={(e) => setData((prevData) => ({ ...prevData, vehicleCode: e.target.value }))}
                />
                {errors.vehicleCode && <p className="text-sm text-red-500">{errors.vehicleCode}</p>}
            </div>

            {/* Departamento/Sección */}
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="department" className="mb-3">
                    Empresa
                </Label>
                <Input
                    disabled
                    type="text"
                    id="department"
                    value={data.department}
                    onChange={(e) => setData((prevData) => ({ ...prevData, department: e.target.value }))}
                />
                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
            </div>

            {/* Turno */}
            <div className="col-span-4 md:col-span-1">
                <Label htmlFor="shift" className="mb-3">
                    Turno
                </Label>
                <Select onValueChange={(value) => setData((prevData) => ({ ...prevData, shift: value }))} value={data.shift}>
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

            {/* Kilometraje anterior */}
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="previousMileage" className="mb-3">
                    Kilometraje anterior
                </Label>
                <Input
                    type="number"
                    id="previousMileage"
                    value={data.previousMileage}
                    disabled
                />
            </div>

            {/* Kilometraje */}
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="mileage" className="mb-3">
                    Kilometraje
                </Label>
                <Input
                    type="number"
                    id="mileage"
                    value={data.mileage}
                    onChange={(e) => setData((prevData) => ({ ...prevData, mileage: e.target.value }))}
                />
                {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
            </div>

            {/* Tabla de causas */}
            <div className="col-span-full">
                <h3 className="mb-4 text-lg font-bold">Causas</h3>
                <div className="bg-background rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 border-b">
                                <TableHead className="h-9 w-7/10 border-r py-2" rowSpan={2}>
                                    Item
                                </TableHead>
                                <TableHead className="h-9 border-r py-2" colSpan={3}>
                                    Estado
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-muted/50 border-b">
                                <TableHead className="h-9 w-1/10 border-r py-2">Bien</TableHead>
                                <TableHead className="h-9 w-1/10 border-r py-2">Mal</TableHead>
                                <TableHead className="h-9 w-1/10 py-2">No Aplica</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {causas.map((causa) => (
                                <TableRow key={causa.id}>
                                    <TableCell className="border-r py-2 font-medium whitespace-normal">{causa.name}</TableCell>
                                    <TableCell className="text-center">
                                        <input
                                            type="radio"
                                            name={`estado-${causa.id}`}
                                            value="Bien"
                                            checked={data.causas.find((c) => c.id === causa.id)?.state === 'Bien'}
                                            onChange={() => handleCausaStateChange(causa.id, 'Bien')}
                                            className="w-6 h-6 accent-green-600 cursor-pointer"

                                        />
                                    </TableCell>
                                    <TableCell className="border-r border-l text-center">
                                        <input
                                            type="radio"
                                            name={`estado-${causa.id}`}
                                            value="Mal"
                                            checked={data.causas.find((c) => c.id === causa.id)?.state === 'Mal'}
                                            onChange={() => handleCausaStateChange(causa.id, 'Mal')}
                                            className="w-6 h-6 accent-red-500 cursor-pointer"
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <input
                                            type="radio"
                                            name={`estado-${causa.id}`}
                                            value="No Aplica"
                                            checked={data.causas.find((c) => c.id === causa.id)?.state === 'No Aplica'}
                                            onChange={() => handleCausaStateChange(causa.id, 'No Aplica')}
                                            className="w-6 h-6 accent-gray-600 cursor-pointer"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Observaciones */}
            <div className="col-span-full">
                <Label htmlFor="observation" className="mb-3">
                    Observaciones
                </Label>
                <Textarea
                    id="observation"
                    value={data.observation}
                    onChange={(e) => setData((prevData) => ({ ...prevData, observation: e.target.value }))}
                    placeholder="Escriba sus observaciones aquí..."
                />
                {errors.observation && <p className="text-sm text-red-500">{errors.observation}</p>}
            </div>

            {/* Estado final debajo de observaciones */}
            <div className="col-span-auto">
                <Label htmlFor="status" className="mb-3">
                    Estado final
                </Label>
                <Input
                    id="status"
                    value={getStatus()}
                    disabled
                    className={
                        getStatus() === 'Desaprobado'
                            ? 'text-red-600 font-bold'
                            : getStatus() === 'Aprobado'
                                ? 'text-green-600 font-bold'
                                : ''
                    }
                />
            </div>
            <br />
            {/* Imágenes adicionales */}
            {/* <div className="col-span-4">
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
            </div> */}

            {/* Firma */}
            {/* <div className="col-span-4">
                <ImageDropZone
                    images={data.signature ? [data.signature] : []}
                    maxImages={1}
                    onUpload={(files) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const base64Signature = reader.result as string;
                            const img = new Image();
                            img.src = base64Signature;
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                const maxWidth = 800; // Set the maximum width for the image
                                const scale = maxWidth / img.width;
                                canvas.width = maxWidth;
                                canvas.height = img.height * scale;
                                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                                const resizedBase64Signature = canvas.toDataURL('image/jpeg', 0.8); // Adjust quality if needed
                                setData((prevData) => ({ ...prevData, signature: resizedBase64Signature }));
                            };
                        };
                        reader.readAsDataURL(files[0]);
                    }}
                    onRemove={() => setData((prevData) => ({ ...prevData, signature: '' }))}
                    label="Firma"
                />
            </div> */}

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
