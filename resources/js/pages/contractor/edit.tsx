import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Trash2, Plus } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Combobox } from '@/components/ui/combobox';

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
        const newList = ueaCompanyTypes.map((item, i) =>
            i === idx ? { ...item, ueaId: value } : item
        );
        const current = newList[idx];
        if (
            current.companyTypeId &&
            newList.some(
                (item, i) =>
                    i !== idx &&
                    item.ueaId === value &&
                    item.companyTypeId === current.companyTypeId
            )
        ) {
            toast.warning('Ya existe esta configuración de UEA y Tipo de Empresa.');
            return;
        }
        setUeaCompanyTypes(newList);
    };

    const handleCompanyTypeChange = (idx: number, value: string) => {
        const newList = ueaCompanyTypes.map((item, i) =>
            i === idx ? { ...item, companyTypeId: value } : item
        );
        const current = newList[idx];
        if (
            current.ueaId &&
            newList.some(
                (item, i) =>
                    i !== idx &&
                    item.ueaId === current.ueaId &&
                    item.companyTypeId === value
            )
        ) {
            toast.warning('Ya existe esta configuración de UEA y Tipo de Empresa.');
            return;
        }
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
        label: u.name || u.nombre || u.id,
        value: u.id,
    }));

    const companyTypeOptions = companyType.map((c: any) => ({
        label: c.name || c.nombre || c.id,
        value: c.id,
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
                        {/* <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="text" required value={`${data.ruc}@code.com.pe`} disabled placeholder="Email" />
                        </div> */}
                        {/* NUEVO: Combos dinámicos */}
                        <div className="space-y-2">
                            <Label>UEA y Tipo de Empresa</Label>
                            {ueaCompanyTypes.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 items-end"
                                >
                                    <div>
                                        <Combobox
                                            data={ueaOptions}
                                            value={parseInt(item.ueaId)}
                                            onChange={(value) => handleUeaChange(idx, value)}
                                            placeholder="Seleccione UEA..."
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <Combobox
                                            data={companyTypeOptions}
                                            value={parseInt(item.companyTypeId)}
                                            onChange={(value) => handleCompanyTypeChange(idx, value)}
                                            placeholder="Seleccione tipo..."
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex justify-start items-end">
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
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={handleAddRow}
                                className="mt-2"
                                variant="primary"
                                size="icon"
                                aria-label="Agregar"
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
