import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Trash2, Plus } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type UeaCompanyType = {
    ueaId: string;
    companyTypeId: string;
};

type ContractorForm = {
    id: string;
    code: string; // Agrega el campo code
    ruc: string | null;
    nombre: string | null;
    descripcion: string | null;
    email: string | null;
    ueaCompanyTypes: UeaCompanyType[];
};

export default function EditContractor({
    contractor,
    isDialogOpen,
    setIsDialogOpen,
    ueas,
    companyType,
}: {
    contractor: any; // Puede ser ContractorForm | null, pero para acceder a .uea lo dejamos any
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    ueas: any[];
    companyType: any[];
}) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    // Inicializa el estado local de ueaCompanyTypes a partir de contractor.uea
    const [ueaCompanyTypes, setUeaCompanyTypes] = useState<UeaCompanyType[]>([]);

    // Inicializa el form
    const { data, setData, put, processing, errors, reset } = useForm<Required<ContractorForm>>({
        id: contractor?.id || '',
        code: contractor?.code || '', // Inicializa code
        ruc: contractor?.ruc || '',
        nombre: contractor?.nombre || '',
        descripcion: contractor?.descripcion || '',
        email: contractor?.email || '',
        ueaCompanyTypes: [],
    });

    // Cuando cambia el contractor, inicializa los combos
    useEffect(() => {
        if (contractor) {
            setData({
                id: contractor.id,
                code: contractor.code || '', // Asigna code
                ruc: contractor.ruc,
                nombre: contractor.nombre,
                descripcion: contractor.descripcion,
                email: contractor.email,
                ueaCompanyTypes: contractor.uea?.map((item: any) => ({
                    ueaId: String(item.uea_id),
                    companyTypeId: String(item.activity_id),
                })) || [{ ueaId: '', companyTypeId: '' }],
            });
            setUeaCompanyTypes(
                contractor.uea?.map((item: any) => ({
                    ueaId: String(item.uea_id),
                    companyTypeId: String(item.activity_id),
                })) || [{ ueaId: '', companyTypeId: '' }]
            );
        }
    }, [contractor, setData]);

    // Sincroniza el array de configuraciones con el form
    useEffect(() => {
        setData('ueaCompanyTypes', ueaCompanyTypes);
    }, [ueaCompanyTypes, setData]);

    useEffect(() => {
        setData('email', `${data.ruc}@code.com.pe`);
    }, [data.ruc, setData]);

    // Handlers para combos dinámicos (igual que en create)
    const handleUeaChange = (idx: number, value: string) => {
        // No permitir que una UEA se repita en cualquier fila
        if (ueaCompanyTypes.some((item, i) => i !== idx && item.ueaId === value && value !== '')) {
            toast.warning('Ya seleccionaste esta UEA en otra fila.');
            // Limpia el seleccionado si es duplicado
            const newList = ueaCompanyTypes.map((item, i) =>
                i === idx ? { ...item, ueaId: '' } : item
            );
            setUeaCompanyTypes(newList);
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
        if (ueaCompanyTypes.some(item => item.ueaId === '' && item.companyTypeId === '')) {
            toast.warning('Ya existe una fila vacía para completar.');
            return;
        }
        setUeaCompanyTypes((prev) => [...prev, { ueaId: '', companyTypeId: '' }]);
    };

    const handleRemoveRow = (idx: number) => {
        setUeaCompanyTypes((prev) => prev.filter((_, i) => i !== idx));
    };

    // Opciones para los combos
    const ueaOptions = ueas.map((u: any) => ({
        label: u.name || u.nombre || String(u.id),
        value: String(u.id),
    }));

    const companyTypeOptions = companyType.map((c: any) => ({
        label: c.name || c.nombre || String(c.id),
        value: String(c.id),
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (contractor) {
            put(route('admin.contractor.update', { contrata: contractor.id }), {
                data: {
                    ...data,
                    ueaCompanyTypes,
                },
                onSuccess: (page) => {
                    const props = page.props as { flash: { success?: string } };
                    const success = props.flash.success;
                    const error = props.flash.error;

                    if (success) {
                        setIsDialogOpen(false);
                        toast.success(success);
                    }
                    if (error) {
                        toast.error(error);
                    }
                },
                onError: (errors) => {
                    setIsDialogOpen(true);
                    toast.error('Ocurrió un error al intentar actualizar la empresa.');
                },
            });
        }
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Editar Empresa</DialogTitle>
                        <DialogDescription>Complete los campos para editar la empresa.</DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={submit}
                        className="space-y-3"
                        method="post"
                        action={route('admin.contractor.update', { contrata: contractor?.id })}
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="ruc">RUC</Label>
                            <Input
                                id="ruc"
                                type="text"
                                required
                                value={data.ruc || ''}
                                onChange={(e) => setData('ruc', e.target.value)}
                                disabled={processing}
                                placeholder="RUC"
                            />
                            <InputError message={errors.ruc} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="code">Código</Label>
                            <Input
                                id="code"
                                type="text"
                                required
                                value={data.code || ''}
                                onChange={(e) => setData('code', e.target.value)}
                                disabled={processing}
                                placeholder="Código o correlativo"
                            />
                            <InputError message={errors.code} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                type="text"
                                required
                                value={data.nombre || ''}
                                onChange={(e) => setData('nombre', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre"
                            />
                            <InputError message={errors.nombre} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Input
                                id="descripcion"
                                type="text"
                                required
                                value={data.descripcion || ''}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                disabled={processing}
                                placeholder="Descripción"
                            />
                            <InputError message={errors.descripcion} />
                        </div>
                        {/* NUEVO: Combos dinámicos */}
                        <div className="space-y-2">
                            <Label>UEA y Tipo de Empresa</Label>
                            {ueaCompanyTypes.map((item, idx) => {
                                // Calcula las opciones disponibles para este select
                                const selectedUeaIds = ueaCompanyTypes
                                    .filter((_, i) => i !== idx)
                                    .map((it) => it.ueaId)
                                    .filter(Boolean);
                                const availableUeaOptions = ueaOptions.filter(
                                    (option) =>
                                        !selectedUeaIds.includes(option.value) ||
                                        option.value === item.ueaId // Permite mantener la seleccionada
                                );
                                return (
                                    <div
                                        key={idx}
                                        className="flex gap-2 items-end"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <Select
                                                value={item.ueaId ? String(item.ueaId) : undefined}
                                                onValueChange={(value) => handleUeaChange(idx, value)}
                                                disabled={processing}
                                            >
                                                <SelectTrigger className="w-full min-w-0">
                                                    <SelectValue
                                                        placeholder="Seleccione UEA..."
                                                        className="truncate"
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableUeaOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Select
                                                value={item.companyTypeId ? String(item.companyTypeId) : undefined}
                                                onValueChange={(value) => handleCompanyTypeChange(idx, value)}
                                                disabled={processing}
                                            >
                                                <SelectTrigger className="w-full min-w-0">
                                                    <SelectValue
                                                        placeholder="Seleccione tipo..."
                                                        className="truncate"
                                                    />
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
                                );
                            })}
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
                </DialogContent>
            </Dialog>
        </div>
    );
}
