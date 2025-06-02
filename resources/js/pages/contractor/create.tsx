import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Trash2, Plus } from 'lucide-react'; // Importa Plus
import { FormEventHandler, useEffect, useState } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // <-- Agrega esta línea
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CreateContractorProps {
    ueas: any[];
    companyType: any[];
}

type ContractorForm = {
    ruc: string;
    nombre: string;
    descripcion: string;
    email: string;
    ueaCompanyTypes: UeaCompanyType[]; // Agrega aquí el nuevo campo
};

type UeaCompanyType = {
    ueaId: string;
    companyTypeId: string;
};

export default function CreateContractor({ ueas, companyType }: CreateContractorProps) {
    // Estado para los pares ueaId y companyTypeId
    const [ueaCompanyTypes, setUeaCompanyTypes] = useState<UeaCompanyType[]>([
        { ueaId: '', companyTypeId: '' },
    ]);

    const { flash } = usePage<{
        flash: { success?: string };
    }>().props;

    const { data, setData, post, processing, errors, reset } = useForm<Required<ContractorForm>>({
        ruc: '',
        nombre: '',
        descripcion: '',
        email: '',
        ueaCompanyTypes: [{ ueaId: '', companyTypeId: '' }],
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Sincroniza el array de configuraciones con el form
    useEffect(() => {
        setData('ueaCompanyTypes', ueaCompanyTypes);
    }, [ueaCompanyTypes]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.contractor.store'), {
            data: {
                ...data,
                ueaCompanyTypes, // enviar el array de pares
            },
            onSuccess: (page) => {
                const flash = page.props.flash;
                if (flash.success) {
                    setIsDialogOpen(false);
                    reset();
                    toast.success(flash.success);
                }
                if (flash.error) {
                    setIsDialogOpen(true);
                    toast.error(flash.error);
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                toast.error('Ocurrió un error al intentar crear el contratista.');
            },
        });
    };

    // Handlers para combos dinámicos
    const handleUeaChange = (idx: number, value: string) => {
        // No permitir que una UEA se repita en cualquier fila
        if (ueaCompanyTypes.some((item, i) => i !== idx && item.ueaId === value && value !== '')) {
            toast.warning('Ya seleccionaste esta UEA en otra fila.');
            return;
        }
        const newList = ueaCompanyTypes.map((item, i) =>
            i === idx ? { ...item, ueaId: value } : item
        );
        setUeaCompanyTypes(newList);
    };

    const handleCompanyTypeChange = (idx: number, value: string) => {
        // Ya no se valida repetidos para tipo de empresa
        const newList = ueaCompanyTypes.map((item, i) =>
            i === idx ? { ...item, companyTypeId: value } : item
        );
        setUeaCompanyTypes(newList);
    };

    const handleAddRow = () => {
        // No permitir agregar si ya existe una fila vacía
        if (ueaCompanyTypes.some(item => item.ueaId === '' && item.companyTypeId === '')) {
            toast.warning('Ya existe una fila vacía para completar.');
            return;
        }
        setUeaCompanyTypes((prev) => [...prev, { ueaId: '', companyTypeId: '' }]);
    };

    const handleRemoveRow = (idx: number) => {
        setUeaCompanyTypes((prev) => prev.filter((_, i) => i !== idx));
    };

    console.log('ueas', ueas);

    // Opciones para los combos
    const ueaOptions = ueas.map((u: any) => ({
        label: u.name || u.nombre || String(u.id),
        value: String(u.id), // Asegura que value sea string
    }));

    const companyTypeOptions = companyType.map((c: any) => ({
        label: c.name || c.nombre || String(c.id),
        value: String(c.id), // Asegura que value sea string
    }));

    // NUEVO: Opciones filtradas por fila para UEA
    const getFilteredUeaOptions = (idx: number) => {
        // Obtén los ueaId seleccionados en otras filas
        const selectedUeaIds = ueaCompanyTypes
            .filter((_, i) => i !== idx)
            .map(item => item.ueaId)
            .filter(Boolean);
        // Filtra las opciones para que no aparezcan las ya seleccionadas en otras filas
        return ueaOptions.filter(option => !selectedUeaIds.includes(option.value));
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2">Crear Empresa</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Crear Empresa</DialogTitle>
                        <DialogDescription>Complete los campos para crear una nueva empresa.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-auto">
                        <form onSubmit={submit} className="space-y-3" method="post" action={route('admin.contractor.store')}>
                            <div className="grid gap-2">
                                <Label htmlFor="ruc">RUC</Label>
                                <Input
                                    id="ruc"
                                    type="text"
                                    required
                                    value={data.ruc}
                                    onChange={(e) => setData('ruc', e.target.value)}
                                    disabled={processing}
                                    placeholder="RUC"
                                />
                                <InputError message={errors.ruc} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nombre">Nombre</Label>
                                <Input
                                    id="nombre"
                                    type="text"
                                    required
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value.toUpperCase())}
                                    disabled={processing}
                                    placeholder="Nombre"
                                />
                                <InputError message={errors.nombre} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    maxLength={150}
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    disabled={processing}
                                    placeholder="Descripción (máx. 150 caracteres)"
                                />
                                <InputError message={errors.descripcion} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="Email"
                                />
                                <InputError message={errors.email} />
                            </div>
                            {/* NUEVO: Combos dinámicos */}
                            <div className="space-y-2">
                                <Label>UEA y Tipo de Empresa</Label>
                                {ueaCompanyTypes.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-2 items-end"
                                    >
                                        <div className="flex-1">
                                            <Select
                                                value={item.ueaId ? String(item.ueaId) : undefined}
                                                onValueChange={(value) => handleUeaChange(idx, value)}
                                                disabled={processing}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione UEA..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getFilteredUeaOptions(idx).map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1">
                                            <Select
                                                value={item.companyTypeId ? String(item.companyTypeId) : undefined}
                                                onValueChange={(value) => handleCompanyTypeChange(idx, value)}
                                                disabled={processing}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione tipo..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {companyTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleRemoveRow(idx)}
                                            disabled={ueaCompanyTypes.length === 1}
                                            className="mt-1"
                                            style={{ width: 40, minWidth: 40, maxWidth: 40 }}
                                            aria-label="Eliminar"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={handleAddRow}
                                    className="mt-2"
                                    variant="primary"
                                    size="icon"
                                    aria-label="Agregar"
                                    disabled={ueaCompanyTypes.length >= 3}
                                >
                                    <Plus className="w-5 h-5" />
                                </Button>
                            </div>
                            <Button type="submit" className="mt-2 w-auto" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Guardar
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
