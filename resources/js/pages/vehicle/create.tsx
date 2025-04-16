import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
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
    chasis_number: string;
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

export default function CreateVehicle({ isDialogOpen, setIsDialogOpen }: CreateVehicleProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<VehicleForm>>({
        code: '',
        license_plate: '',
        brand: '',
        model: '',
        color: '',
        year: '',
        engine_number: '',
        chasis_number: '',
        type: '',
        fuel_type: '',
        seating_capacity: '',
        mileage: '',
        is_active: false,
        insurance_expiry_date: '',
    });

    const [search, setSearch] = useState(false);

    const handleConsult = useCallback(() => {
        if (!data.license_plate.trim()) {
            toast.error('Por favor, ingrese la placa del vehículo.');
            return;
        }

        setSearch(true);
        toast.info('El vehículo no existe. Puede llenar los datos manualmente.');
    }, [data.license_plate]);

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
            options: [
                { value: 'camioneta', label: 'Camioneta' },
                { value: 'combi', label: 'Combi' },
                { value: 'ambulancia', label: 'Ambulancia' },
                { value: 'bus', label: 'Bus' },
                { value: 'camion', label: 'Camión' },
                { value: 'camion_grua', label: 'Camión Grúa' },
                { value: 'otros', label: 'Otros' },
            ],
        },
        { id: 'code', label: 'Código', required: true },
        { id: 'brand', label: 'Marca', required: true },
        { id: 'model', label: 'Modelo', required: true },
        { id: 'year', label: 'Año', required: true, type: 'number' },
        { id: 'color', label: 'Color' },
        { id: 'engine_number', label: 'Número de Motor' },
        { id: 'chasis_number', label: 'Número de Chasis' },
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
                        <DialogTitle>Crear Vehículo</DialogTitle>
                        <DialogDescription>Complete los campos para crear un nuevo vehículo.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                        <form id="vehicleForm" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                            {formFields.map(({ id, ...field }) =>
                                (!search && id === 'license_plate') || search ? (
                                    <FormField
                                        key={id}
                                        id={id}
                                        value={data[id as keyof VehicleForm]}
                                        onChange={(value) => setData(id as keyof VehicleForm, value)}
                                        error={errors[id as keyof VehicleForm]}
                                        disabled={processing}
                                        {...field}
                                    />
                                ) : null,
                            )}
                        </form>
                    </div>
                    <DialogFooter>
                        {!search ? (
                            <Button type="button" onClick={handleConsult} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Consultar
                            </Button>
                        ) : (
                            <Button type="submit" form="vehicleForm" disabled={processing || !isFormValid}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Guardar
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
