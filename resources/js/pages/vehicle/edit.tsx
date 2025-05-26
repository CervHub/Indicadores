import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useMemo, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { VEHICLE_TYPE_OPTIONS } from '@/lib/utils';

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
    companyCode?: string;
};

const TIRE_COUNT_OPTIONS = [
    { value: "4", label: "4", img: "/images/neumaticos/01.png" },
    { value: "6", label: "6", img: "/images/neumaticos/02.png" },
    { value: "10", label: "10", img: "/images/neumaticos/03.png" },
    { value: "12", label: "12", img: "/images/neumaticos/04.png" },
    { value: "14", label: "14", img: "/images/neumaticos/05.png" },
];

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
    companyCode,
    custom,
    onCustomClick,
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
    companyCode?: string;
    custom?: boolean;
    onCustomClick?: () => void;
    rightElement?: React.ReactNode;
    rightLoading?: boolean;
}) => (
    <div className="grid gap-2">
        <Label htmlFor={id}>
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {id === "code" ? (
            <div className="relative flex items-center">
                <Input
                    id={id}
                    type="number"
                    value={value}
                    onChange={e => {
                        const val = e.target.value.replace(/\D/g, "");
                        onChange(val);
                    }}
                    disabled={disabled}
                    placeholder={placeholder || "Ingrese número"}
                    required={required}
                    min={1}
                    className="pr-20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-background px-2 py-0.5 rounded text-muted-foreground text-xs sm:text-sm font-mono border border-input">
                    {companyCode
                        ? `${companyCode}${value ? value.toString().padStart(3, "0") : "___"}`
                        : value
                            ? `COD${value.toString().padStart(3, "0")}`
                            : "COD___"}
                </span>
            </div>
        ) : options ? (
            id === "type" ? (
                <Combobox
                    data={options}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder || "Seleccione tipo..."}
                    className="w-full"
                    disabled={disabled}
                />
            ) : (
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
            )
        ) : custom && id === "tire_count" ? (
            <Input
                id="tire_count"
                value={value}
                placeholder="Seleccione..."
                readOnly
                onClick={onCustomClick}
                className="cursor-pointer bg-white"
                tabIndex={0}
                required={required}
                disabled={disabled}
            />
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

export default function EditVehicle({ isDialogOpen, setIsDialogOpen, vehicle, companyCode }: EditVehicleProps) {
    console.log('EditVehicle', vehicle);
    const { data, setData, put, processing, errors, reset } = useForm<Required<VehicleForm & { tire_count?: string; spare_tire_count?: string }>>({
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
        tire_count: (vehicle as any).tire_count ?? '',
        spare_tire_count: (vehicle as any).spare_tire_count ?? '',
    });

    const [tireModalOpen, setTireModalOpen] = useState(false);

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
            tire_count: (vehicle as any).tire_count ?? '',
            spare_tire_count: (vehicle as any).spare_tire_count ?? '',
        });
    }, [vehicle, setData]);

    const isFormValid = useMemo(() => {
        const requiredFields = ['type', 'code', 'brand', 'model', 'year', 'tire_count', 'spare_tire_count'];
        return requiredFields.every((field) => data[field as keyof typeof data]?.toString().trim());
    }, [data]);

    const submit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            put(route('vehicle.update', { vehicle: vehicle.id }), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    // reset(); // No reset para mantener datos si se reabre
                    toast.success('Vehículo actualizado exitosamente.');
                },
                onError: () => {
                    toast.error('Ocurrió un error al intentar actualizar el vehículo.');
                },
            });
        },
        [put, setIsDialogOpen, vehicle.id, data]
    );

    const selectedTireOption = TIRE_COUNT_OPTIONS.find(
        opt => opt.label === data['tire_count']
    );

    const formFields = [
        { id: 'license_plate', label: 'Placa', required: true, disabled: true },
        { id: 'type', label: 'Tipo', required: true, options: VEHICLE_TYPE_OPTIONS },
        { id: 'code', label: 'Código', required: true, companyCode },
        { id: 'brand', label: 'Marca', required: true },
        { id: 'model', label: 'Modelo', required: true },
        { id: 'color', label: 'Color', required: true },
        { id: 'year', label: 'Año', required: true, type: 'number' },
        { id: 'engine_number', label: 'N° Motor' },
        { id: 'chassis_number', label: 'N° Chasis' },
        { id: 'seating_capacity', label: 'N° Asientos s/Cond.', required: true, type: 'number' },
        { id: 'mileage', label: 'Kilometraje', required: true, type: 'number' },
        { id: 'tire_count', label: 'N° Neumáticos', custom: true, required: true, companyCode },
        { id: 'spare_tire_count', label: 'N° Neumáticos de repuesto', required: true, type: 'number' },
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
                            {formFields.map(({ id, custom, ...field }) =>
                                custom && id === 'tire_count' ? (
                                    <FormField
                                        key={id}
                                        id={id}
                                        value={data[id as keyof typeof data]}
                                        onChange={(value) => setData(id as keyof typeof data, value)}
                                        error={errors[id as keyof typeof data]}
                                        disabled={processing}
                                        required
                                        companyCode={companyCode}
                                        custom
                                        onCustomClick={() => setTireModalOpen(true)}
                                        {...field}
                                    />
                                ) : (
                                    <FormField
                                        key={id}
                                        id={id}
                                        value={data[id as keyof typeof data]}
                                        onChange={(value) => setData(id as keyof typeof data, value)}
                                        error={errors[id as keyof typeof data]}
                                        disabled={processing || field.disabled}
                                        companyCode={companyCode}
                                        {...field}
                                    />
                                )
                            )}
                        </form>
                        {selectedTireOption && (
                            <div className="flex justify-center mt-6">
                                <img
                                    src={selectedTireOption.img}
                                    alt={selectedTireOption.label}
                                    className="w-32 h-32 object-contain bg-white"
                                />
                            </div>
                        )}
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
            {/* Modal para seleccionar número de neumáticos */}
            <Dialog open={tireModalOpen} onOpenChange={setTireModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Seleccione el número de neumáticos</DialogTitle>
                    </DialogHeader>
                    <div
                        className="grid grid-cols-2 gap-4 py-2 max-h-80 overflow-y-auto"
                        style={{ scrollbarGutter: "stable" }}
                    >
                        {TIRE_COUNT_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                type="button"
                                className="flex flex-col items-center rounded p-2 bg-white hover:bg-accent focus:bg-accent focus:outline-none w-full"
                                onClick={() => {
                                    setData('tire_count', option.label);
                                    setTireModalOpen(false);
                                }}
                            >
                                <img
                                    src={option.img}
                                    alt={option.label}
                                    className="w-full h-auto object-contain"
                                    style={{ aspectRatio: "3/5", maxHeight: 220 }}
                                />
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
