import { useForm } from '@inertiajs/react';
import { LoaderCircle, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type VehicleForm = {
    code: string;
    license_plate: string;
    brand: string;
    model: string;
    color: string;
    year: string;
    engine_number: string;
    chassis_number: string;
    type: string;
    fuel_type: string;
    seating_capacity: string;
    mileage: string;
    is_active: boolean;
    insurance_expiry_date: string;
};

type CreateVehicleProps = {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    companyId: string;
};

const FormField = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    disabled,
    required = false,
    options,
    rightElement,
    rightLoading = false,
}: {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    options?: { value: string; label: string }[];
    rightElement?: React.ReactNode;
    rightLoading?: boolean;
}) => (
    <div className="grid gap-2">
        <Label htmlFor={id}>
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {options ? (
            <Select onValueChange={onChange} value={value} disabled={disabled}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        ) : (
            id === 'license_plate' ? (
                <div className="flex">
                    <Input
                        id={id}
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        placeholder={placeholder}
                        required={required}
                        className="rounded-r-none"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={rightElement as any}
                        disabled={disabled || rightLoading}
                        className="rounded-l-none border-l-0"
                        tabIndex={-1}
                    >
                        {rightLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                </div>
            ) : (
                <Input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder={placeholder}
                    required={required}
                />
            )
        )}
        <InputError message={error} />
    </div>
);

// Opciones de tipo de vehículo en un array para fácil mantenimiento
const VEHICLE_TYPE_OPTIONS = [
    { value: 'Camioneta', label: 'Camioneta' },
    { value: 'Combi', label: 'Combi' },
    { value: 'Ambulancia', label: 'Ambulancia' },
    { value: 'Bus', label: 'Bus' },
    { value: 'Camión', label: 'Camión' },
    { value: 'Camión Grúa', label: 'Camión Grúa' },
    { value: 'Otros', label: 'Otros' },
];

export default function CreateVehicle({ isDialogOpen, setIsDialogOpen, companyId }: CreateVehicleProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<VehicleForm>>({
        code: '',
        license_plate: '',
        brand: '',
        model: '',
        color: '',
        year: '',
        engine_number: '',
        chassis_number: '',
        type: '',
        fuel_type: '',
        seating_capacity: '',
        mileage: '',
        is_active: false,
        insurance_expiry_date: '',
    });

    const [searched, setSearched] = useState(false);
    const [canRegister, setCanRegister] = useState(true);
    const [searching, setSearching] = useState(false);

    const handleConsult = useCallback(async () => {
        if (!data.license_plate.trim()) {
            toast.error('Por favor, ingrese la placa del vehículo.');
            return;
        }

        setSearching(true);
        try {
            const url = route('web.v1.searchVehicles', { license_plate: data.license_plate.trim(), company_id: companyId });
            const response = await fetch(
                url,
                { method: 'GET', headers: { 'Accept': 'application/json' } }
            );
            const result = await response.json();

            setSearched(true);

            if (response.ok && result.status === 'success' && result.data) {
                setCanRegister(true);
                setData({
                    ...data,
                    code: result.data.code ?? '',
                    license_plate: result.data.license_plate ?? '',
                    brand: result.data.brand ?? '',
                    model: result.data.model ?? '',
                    color: result.data.color ?? '',
                    year: result.data.year ?? '',
                    engine_number: result.data.engine_number ?? '',
                    chassis_number: result.data.chassis_number ?? result.data.chassis_number ?? '',
                    type: result.data.type ?? '',
                    fuel_type: result.data.fuel_type ?? '',
                    seating_capacity: result.data.seating_capacity ?? '',
                    mileage: result.data.mileage ?? '',
                    is_active: result.data.is_active === '1' || result.data.is_active === 1,
                    insurance_expiry_date: result.data.insurance_expiry_date ?? '',
                });
                toast.success('Vehículo encontrado y datos cargados.');
            } else if (result.status === 'warning' && result.data && result.data.company) {
                setCanRegister(false);
                toast.warning(
                    `El vehículo ya se encuentra vinculado a otra empresa (${result.data.company.name ?? ''}, RUC: ${result.data.company.ruc ?? ''}). Comuníquese con la empresa para que lo desvincule antes de continuar.`,
                    { duration: 10000 }
                );
                setData({
                    ...data,
                    code: result.data.vehicle?.code ?? '',
                    license_plate: result.data.vehicle?.license_plate ?? '',
                    brand: result.data.vehicle?.brand ?? '',
                    model: result.data.vehicle?.model ?? '',
                    color: result.data.vehicle?.color ?? '',
                    year: result.data.vehicle?.year ?? '',
                    engine_number: result.data.vehicle?.engine_number ?? '',
                    chassis_number: result.data.vehicle?.chassis_number ?? result.data.vehicle?.chassis_number ?? '',
                    type: result.data.vehicle?.type ?? '',
                    fuel_type: result.data.vehicle?.fuel_type ?? '',
                    seating_capacity: result.data.vehicle?.seating_capacity ?? '',
                    mileage: result.data.vehicle?.mileage ?? '',
                    is_active: result.data.vehicle?.is_active === '1' || result.data.vehicle?.is_active === 1,
                    insurance_expiry_date: result.data.vehicle?.insurance_expiry_date ?? '',
                });
            } else if (result.status === 'error' && (response.status === 404 || response.status === 202)) {
                setCanRegister(true);
                toast.info(result.message || 'El vehículo no se encuentra registrado. Debe completar todos los campos para registrarlo.');
            } else {
                setCanRegister(false);
                toast.error(result.message || 'Error al consultar el vehículo.');
            }
        } catch (error) {
            setSearched(true);
            setCanRegister(false);
            toast.error('Error al consultar el vehículo.');
        } finally {
            setSearching(false);
        }
    }, [data, setData, companyId]);

    const isFormValid = useMemo(() => {
        const requiredFields = ['license_plate', 'type', 'code', 'brand', 'model', 'year'];

        // Validate required fields and ensure year and mileage are numbers
        const areRequiredFieldsValid = requiredFields.every((field) => data[field as keyof VehicleForm]?.trim());

        return areRequiredFieldsValid;
    }, [data]);

    const submit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            post(route('vehicle.store'), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                    toast.success('Vehículo creado exitosamente.');
                },
                onError: () => {
                    toast.error('Ocurrió un error al intentar crear el vehículo.');
                },
            });
        },
        [post, setIsDialogOpen, reset],
    );

    const formFields = [
        { id: 'license_plate', label: 'Placa', required: true },
        {
            id: 'type',
            label: 'Tipo',
            required: true,
            options: VEHICLE_TYPE_OPTIONS,
        },
        { id: 'code', label: 'Código', required: true },
        { id: 'brand', label: 'Marca', required: true },
        { id: 'model', label: 'Modelo', required: true },
        { id: 'year', label: 'Año', required: true, type: 'number' },
        { id: 'color', label: 'Color' },
        { id: 'engine_number', label: 'Número de Motor' },
        { id: 'chassis_number', label: 'Número de Chasis' },
        { id: 'fuel_type', label: 'Tipo de Combustible' },
        { id: 'seating_capacity', label: 'Capacidad de Asientos' },
        { id: 'mileage', label: 'Kilometraje', type: 'number' },
        { id: 'insurance_expiry_date', label: 'Fecha de Vencimiento del Seguro', type: 'date' },
    ];

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="pb-3 sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Registrar Vehículo</DialogTitle>
                        <DialogDescription>Complete los campos para registrar un vehículo.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                        <form id="vehicleForm" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                            {formFields.map(({ id, ...field }) =>
                                id === 'license_plate' ? (
                                    <FormField
                                        key={id}
                                        id={id}
                                        value={data[id as keyof VehicleForm]}
                                        onChange={(value) => {
                                            setData(id as keyof VehicleForm, value);
                                            setSearched(false);
                                            setCanRegister(true);
                                        }}
                                        error={errors[id as keyof VehicleForm]}
                                        disabled={processing}
                                        {...field}
                                        rightElement={handleConsult}
                                        rightLoading={searching}
                                    />
                                ) : (
                                    <FormField
                                        key={id}
                                        id={id}
                                        value={data[id as keyof VehicleForm]}
                                        onChange={(value) => setData(id as keyof VehicleForm, value)}
                                        error={errors[id as keyof VehicleForm]}
                                        disabled={processing || !searched}
                                        {...field}
                                    />
                                )
                            )}
                        </form>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            form="vehicleForm"
                            disabled={processing || !isFormValid || !searched || !canRegister}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                reset();
                                setSearched(false);
                                setCanRegister(true);
                            }}
                            disabled={processing}
                        >
                            Limpiar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
