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
        second: '2-digit', // Agrega los segundos
        hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const get = (type: string) => parts.find((p) => p.type === type)?.value;

    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`;
}

export default function InspectionVehiclePreUse({
    causas,
    companyId,
    userId,
    userName,
    area
}: {
    causas: { id: string; name: string }[];
    companyId: string;
    userId: string;
    userName: string;
    area: string;
}) {
    const [data, setData] = useState({
        plate: '',
        vehicleCode: '',
        department: '',
        shift: getLimaDateTimeString(), // shift ahora es la hora actual
        driver: userName,
        mileage: '',
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
        area: area, // <-- inicializa con prop
    });

    // Sincroniza el área si cambia desde el prop (por ejemplo, después de cerrar el diálogo)
    React.useEffect(() => {
        setData(prev => ({
            ...prev,
            area: area,
        }));
    }, [area]);

    console.log('Area:', area);

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
        // Busca el nombre del item (causa) por id
        const causaItem = causas.find((c) => c.id === id);
        setData((prevData) => ({
            ...prevData,
            causas: prevData.causas.map((causa) =>
                causa.id === id
                    ? { ...causa, state, item: causaItem?.name || '' }
                    : causa
            ),
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

    // Calcula el status solo si todas las causas están marcadas
    const getStatus = () => {
        const allCausasValid = data.causas.every((causa) => causa.state !== '');
        if (!allCausasValid) return '';
        // Si existe al menos un "No Conforme", es "Desaprobado"
        return data.causas.some((causa) => causa.state === 'No Conforme') ? 'Desaprobado' : 'Aprobado';
    };

    // Actualiza el status en el estado cada vez que cambian las causas
    React.useEffect(() => {
        const status = getStatus();
        setData((prevData) => ({
            ...prevData,
            status,
        }));
    }, [data.causas]);

    // Actualiza la hora en vivo cada segundo
    React.useEffect(() => {
        const interval = setInterval(() => {
            setData((prevData) => ({
                ...prevData,
                shift: getLimaDateTimeString(),
            }));
        }, 1000); // cada segundo
        return () => clearInterval(interval);
    }, []);

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
                shift: getLimaDateTimeString(), // Reinicia a la hora actual
                driver: userName,
                mileage: '',
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
        <form className="grid grid-cols-4 gap-6 md:grid-cols-4 lg:grid-cols-5" onSubmit={handleSubmit}>
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

            {/* Turno (hora actual, solo lectura y en vivo) */}
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="shift" className="mb-3">
                    Hora actual
                </Label>
                <Input
                    id="shift"
                    type="datetime-local"
                    value={data.shift}
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
                                <TableHead className="h-9 w-9/10 border-r py-2">
                                    Item
                                </TableHead>
                                <TableHead className="h-9 w-1/10 py-2">
                                    Estado
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {causas.map((causa) => (
                                <TableRow key={causa.id}>
                                    <TableCell className="border-r py-2 font-medium whitespace-normal">{causa.name}</TableCell>
                                    <TableCell className="text-center">
                                        <Select
                                            value={data.causas.find((c) => c.id === causa.id)?.state || ''}
                                            onValueChange={(value) => handleCausaStateChange(causa.id, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Conforme">Conforme</SelectItem>
                                                <SelectItem value="No Conforme">No Conforme</SelectItem>
                                            </SelectContent>
                                        </Select>
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
