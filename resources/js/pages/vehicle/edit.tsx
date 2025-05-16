import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useMemo, useEffect } from 'react';

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

type EditVehicleProps = {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    vehicle: VehicleForm & { id: number };
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
            <Input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={placeholder}
                required={required}
            />
        )}
        <InputError message={error} />
    </div>
);

const VEHICLE_TYPE_OPTIONS = [
    { value: 'Camioneta', label: 'Camioneta' },
    { value: 'Combi', label: 'Combi' },
    { value: 'Ambulancia', label: 'Ambulancia' },
    { value: 'Bus', label: 'Bus' },
    { value: 'Camión', label: 'Camión' },
    { value: 'Camión Grúa', label: 'Camión Grúa' },
    { value: 'Otros', label: 'Otros' },
];

export default function EditVehicle({ isDialogOpen, setIsDialogOpen, vehicle }: EditVehicleProps) {
    const { data, setData, put, processing, errors, reset } = useForm<Required<VehicleForm>>({
        code: vehicle.code ?? '',
        license_plate: vehicle.license_plate ?? '',
        brand: vehicle.brand ?? '',
        model: vehicle.model ?? '',
        color: vehicle.color ?? '',
        year: vehicle.year ?? '',
        engine_number: vehicle.engine_number ?? '',
        chassis_number: vehicle.chassis_number ?? '',
        type: vehicle.type ?? '',
        fuel_type: vehicle.fuel_type ?? '',
        seating_capacity: vehicle.seating_capacity ?? '',
        mileage: vehicle.mileage ?? '',
        is_active: vehicle.is_active ?? false,
        insurance_expiry_date: vehicle.insurance_expiry_date ?? '',
    });

    // Actualiza los datos del formulario cuando cambia el vehículo seleccionado
    useEffect(() => {
        setData({
            code: vehicle.code ?? '',
            license_plate: vehicle.license_plate ?? '',
            brand: vehicle.brand ?? '',
            model: vehicle.model ?? '',
            color: vehicle.color ?? '',
            year: vehicle.year ?? '',
            engine_number: vehicle.engine_number ?? '',
            chassis_number: vehicle.chassis_number ?? '',
            type: vehicle.type ?? '',
            fuel_type: vehicle.fuel_type ?? '',
            seating_capacity: vehicle.seating_capacity ?? '',
            mileage: vehicle.mileage ?? '',
            is_active: vehicle.is_active ?? false,
            insurance_expiry_date: vehicle.insurance_expiry_date ?? '',
        });
    }, [vehicle, setData]);

    const isFormValid = useMemo(() => {
        const requiredFields = ['type', 'code', 'brand', 'model', 'year'];
        return requiredFields.every((field) => data[field as keyof VehicleForm]?.toString().trim());
    }, [data]);

    const submit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            put(route('vehicle.update', { vehicle: vehicle.id }), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Vehículo actualizado exitosamente.');
                },
                onError: () => {
                    toast.error('Ocurrió un error al intentar actualizar el vehículo.');
                },
            });
        },
        [put, setIsDialogOpen, vehicle.id, data]
    );

    const formFields = [
        { id: 'license_plate', label: 'Placa', required: true, disabled: true },
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
                        <DialogTitle>Actualizar Vehículo</DialogTitle>
                        <DialogDescription>Modifique los campos permitidos y guarde los cambios.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                        <form id="vehicleEditForm" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                            {formFields.map(({ id, ...field }) => (
                                <FormField
                                    key={id}
                                    id={id}
                                    value={data[id as keyof VehicleForm]}
                                    onChange={(value) => setData(id as keyof VehicleForm, value)}
                                    error={errors[id as keyof VehicleForm]}
                                    disabled={processing || field.disabled}
                                    {...field}
                                />
                            ))}
                        </form>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            form="vehicleEditForm"
                            disabled={processing || !isFormValid}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                reset();
                                setIsDialogOpen(false);
                            }}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
