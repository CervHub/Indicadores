import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react'; // Importamos useForm para manejar el envío de datos
import { router } from '@inertiajs/react';
import { Search, FileText, Download, Info } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import ImageDropZone from './image';
import { VEHICLE_TYPE_OPTIONS } from '@/lib/utils';
import {
    Causa,
    useCausasState,
    CausasTableWithModal,
} from './causasVehicle';

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
        mileage: '', // <-- Change to English: mileage
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
        causas: causas.map((causa) => ({ id: causa.id, name: causa.name, state: '', observation: '' })),
        status: '',
    });

    // Causas state y modal centralizado
    const {
        causaStates,
        setCausaStates,
        extraFormData,
        setExtraFormData,
        modalOpen,
        setModalOpen,
        modalAttributes,
        setModalAttributes,
        modalTitle,
        setModalTitle,
        modalCausaId,
        setModalCausaId,
    } = useCausasState(causas);

    const [isSearchingPlate, setIsSearchingPlate] = useState(false);
    const [isSearchingLicense, setIsSearchingLicense] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calcula el resultado automáticamente
    const getAutoResult = () => {
        if (causaStates.some((c) => c.state === 'No Conforme')) return 'Desaprobado';
        if (causaStates.every((c) => c.state)) return 'Aprobado';
        return '';
    };

    // Actualiza el resultado y status automáticamente cuando cambian las causas
    React.useEffect(() => {
        setData('result', getAutoResult());
        setData('status', getAutoResult()); // <-- Actualiza status también
    }, [causaStates]);

    // Solo permite enviar si todas las causas tienen estado, el resultado está calculado y todos los formularios extra requeridos están completos
    const isFormValid = () => {
        // Verifica si todos los formularios extra requeridos están completos
        const allExtraFormsComplete = causas.every((causa) => {
            if (!causa.has_attributes || !causa.category_attributes) return true;
            const formState = extraFormData[causa.id] || {};
            return causa.category_attributes.every(attr => !!formState[attr.id]);
        });

        return (
            data.plate &&
            data.type &&
            data.brand &&
            data.model &&
            data.engineNumber &&
            data.year &&
            data.company &&
            getAutoResult() &&
            causaStates.every((c) => c.state) &&
            allExtraFormsComplete
        );
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

        setIsSubmitting(true);

        try {
            // Combina causas y extraFormData para enviar ambos, incluyendo id, valor y nombre del atributo
            const causasWithForm = causaStates.map(causa => {
                const extraForm = extraFormData[causa.id] || {};
                // Para cada atributo, agrega id, valor y nombre
                let attributes: { id: string | number, value: any, name: string }[] = [];
                const causaObj = causas.find(c => c.id === causa.id);
                if (causaObj && causaObj.category_attributes) {
                    attributes = causaObj.category_attributes.map(attr => ({
                        id: attr.id,
                        value: extraForm[attr.id] ?? '',
                        name: attr.name,
                    }));
                }
                return {
                    ...causa,
                    extraForm: attributes,
                };
            });

            const response = await fetch(route('web.v1.saveReport'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    causas: causasWithForm,
                    status: getAutoResult(),
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
                reset();
                setCausaStates(causas.map((causa) => ({ id: causa.id, state: '', observation: '' })));
                // Redirige con Inertia a admin.reportability
                router.visit(route('admin.reportability'));
            }
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error al guardar el reporte. Intente de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Agrupa causas por grupo
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
        <>
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
                            {VEHICLE_TYPE_OPTIONS.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
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
                {/* Mileage (Kilometraje) */}
                <div className="">
                    <Label htmlFor="mileage" className="mb-3">
                        Kilometraje
                    </Label>
                    <Input
                        type="number"
                        id="mileage"
                        value={data.mileage || ''}
                        onChange={e => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 7); // solo dígitos, máx 7
                            setData('mileage', value);
                        }}
                        min={0}
                        max={9999999}
                        placeholder="Ingrese el kilometraje"
                    />
                </div>
                {/* Tabla de causas */}
                <div className="col-span-full">
                    <h3 className="mb-4 text-lg font-bold">Causas</h3>
                    <div className="bg-background overflow-hidden rounded-md border">
                        <CausasTableWithModal
                            causas={causas}
                            causaStates={causaStates}
                            setCausaStates={setCausaStates}
                            extraFormData={extraFormData}
                            setExtraFormData={setExtraFormData}
                            groupedCausas={groupedCausas}
                            modalOpen={modalOpen}
                            setModalOpen={setModalOpen}
                            modalAttributes={modalAttributes}
                            setModalAttributes={setModalAttributes}
                            modalTitle={modalTitle}
                            setModalTitle={setModalTitle}
                            modalCausaId={modalCausaId}
                            setModalCausaId={setModalCausaId}
                        />
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
        </>
    );
}
