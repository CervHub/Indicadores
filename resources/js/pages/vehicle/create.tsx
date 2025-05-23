import { useForm } from '@inertiajs/react';
import { LoaderCircle, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { VEHICLE_TYPE_OPTIONS } from '@/lib/utils';
import SlideScale from './SlideScale';

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
    seating_capacity: string;
    mileage: string;
    is_active: boolean;
    insurance_expiry_date: string;
    tire_count: string;
    spare_tire_count: string;
};

type CreateVehicleProps = {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    companyId: string;
    companyCode: string;
};

const TIRE_COUNT_OPTIONS = [
    { value: "4", label: "4", img: "/images/neumaticos/01.png" },
    { value: "6", label: "6", img: "/images/neumaticos/02.png" },
    { value: "10", label: "10", img: "/images/neumaticos/03.png" },
    // { value: "12-I", label: "12-I", img: "/images/neumaticos/04.png" },
    // { value: "12-II", label: "12-II", img: "/images/neumaticos/05.png" },
    // { value: "10-II", label: "10-II", img: "/images/neumaticos/06.png" },
    // { value: "14-I", label: "14-I", img: "/images/neumaticos/07.png" },
    // { value: "14-II", label: "14-II", img: "/images/neumaticos/08.png" },
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
    rightElement,
    rightLoading = false,
    companyCode, // <-- agregar aquí
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
    companyCode?: string; // <-- agregar aquí
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
        ) : id === 'license_plate' ? (
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
        )}
        <InputError message={error} />
    </div>
);

export default function CreateVehicle({ isDialogOpen, setIsDialogOpen, companyId, companyCode }: CreateVehicleProps) {
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
        seating_capacity: '',
        mileage: '',
        is_active: false,
        insurance_expiry_date: '',
        tire_count: '',
        spare_tire_count: '',
    });

    const [searched, setSearched] = useState(false);
    const [canRegister, setCanRegister] = useState(true);
    const [searching, setSearching] = useState(false);
    const [tireModalOpen, setTireModalOpen] = useState(false);
    // Nuevo: guardar la opción seleccionada (objeto completo)
    const selectedTireOption = TIRE_COUNT_OPTIONS.find(
        opt => opt.label === data['tire_count' as keyof VehicleForm]
    );

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
        const requiredFields = [
            'license_plate',
            'type',
            'code',
            'brand',
            'model',
            'year',
            'color',
            'seating_capacity',
            'mileage',
            'tire_count',
            'spare_tire_count'
        ];

        // Validate required fields and ensure year and mileage are numbers
        const areRequiredFieldsValid = requiredFields.every((field) => data[field as keyof VehicleForm]?.toString().trim());

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
        { id: 'type', label: 'Tipo', required: true, options: VEHICLE_TYPE_OPTIONS },
        { id: 'code', label: 'Código', required: true, companyCode }, // pasar companyCode aquí
        { id: 'brand', label: 'Marca', required: true },
        { id: 'model', label: 'Modelo', required: true },
        { id: 'color', label: 'Color', required: true },
        { id: 'year', label: 'Año', required: true, type: 'number' },
        { id: 'engine_number', label: 'N° Motor' },
        { id: 'chassis_number', label: 'N° Chasis' },
        { id: 'seating_capacity', label: 'N° Asientos s/Cond.', required: true, type: 'number' },
        { id: 'mileage', label: 'Kilometraje', required: true, type: 'number' },
        { id: 'tire_count', label: 'N° Neumáticos', custom: true, required: true },
        { id: 'spare_tire_count', label: 'N° Repuesto', required: true, type: 'number' },
        // insurance_expiry_date is not shown in the form as per previous requirements
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
                        <form id="vehicleForm" onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
                            {formFields.map(({ id, custom, ...field }) =>
                                custom && id === 'tire_count' ? (
                                    <div key={id} className="grid gap-2">
                                        <Label htmlFor="tire_count">N° Neumáticos</Label>
                                        <Input
                                            id="tire_count"
                                            value={data.tire_count}
                                            placeholder="Seleccione..."
                                            readOnly
                                            onClick={() => setTireModalOpen(true)}
                                            className="cursor-pointer bg-white"
                                            tabIndex={0}
                                            required
                                        />
                                    </div>
                                ) : id === 'license_plate' ? (
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
                                        disabled={processing || (id !== 'license_plate' && !searched)}
                                        {...field}
                                    />
                                )
                            )}
                        </form>
                        {/* Imagen de perfil de neumático seleccionada al final */}
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
