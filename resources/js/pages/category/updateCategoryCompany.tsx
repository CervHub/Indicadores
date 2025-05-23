import { useForm } from '@inertiajs/react';
import { LoaderCircle, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type OptionalConfigType = 'fecha' | 'entero' | 'texto' | 'conforme';
type AttributeType = 'fecha' | 'entero' | 'texto' | 'conforme';

type OptionalConfig = {
    nombre: string;
    tipo: OptionalConfigType;
};

type CategoryCompanyForm = {
    nombre: string;
    group_id?: string;
    is_required: boolean;
    is_for_mine?: boolean;
    has_attributes: boolean;
    attribute_type?: AttributeType;
    optional_configs?: OptionalConfig[];
    instruction?: string;
    has_document?: boolean;
    document_name?: string;
    document_url?: File | null;
};

interface UpdateCategoryCompanyProps {
    categoryId: number;
    title: string;
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
    isCategorized: string | null;
    groups: any[];
    item: {
        id: number;
        nombre: string;
        group_id?: string;
        is_required: boolean;
        is_for_mine?: boolean;
        has_attributes?: boolean;
        attribute_type?: AttributeType;
        optional_configs?: OptionalConfig[];
        instruction?: string;
        has_document?: boolean;
        document_name?: string;
        document_url?: string;
    } | null;
}

export default function UpdateCategoryCompany({
    categoryId,
    title,
    isDialogOpen,
    setIsDialogOpen,
    isCategorized,
    groups,
    item,
}: UpdateCategoryCompanyProps) {
    // Inicializa los atributos opcionales desde item.category_attributes si existen
    const initialOptionalConfigs =
        item?.category_attributes?.map((attr: any) => ({
            nombre: attr.name,
            tipo: attr.attribute_type,
        })) ?? item?.optional_configs ?? [];

    // Determina si debe estar seleccionado el checkbox de documento
    const initialHasDocument =
        (item?.has_document === true || item?.has_document === 1 || item?.has_document === "1") ||
        !!item?.document_url ||
        !!item?.document_name;

    const { data, setData, post, processing, errors, reset } = useForm<Required<CategoryCompanyForm>>({
        nombre: item?.nombre || '',
        group_id: item?.group_id ?? undefined,
        is_required: item?.is_required === 1 || item?.is_required === "1",
        is_for_mine: item?.is_for_mine === 1 || item?.is_for_mine === "1",
        has_attributes: item?.has_attributes === true || item?.has_attributes === 1 || item?.has_attributes === "1",
        attribute_type: item?.attribute_type ?? undefined,
        optional_configs: initialOptionalConfigs,
        instruction: item?.instruction ?? '',
        has_document: initialHasDocument,
        document_name: item?.document_name ?? '',
        document_url: null,
    });
    const [optionalConfigs, setOptionalConfigs] = useState<OptionalConfig[]>(initialOptionalConfigs);

    useEffect(() => {
        if (item) {
            const optConfigs =
                item.category_attributes?.map((attr: any) => ({
                    nombre: attr.name,
                    tipo: attr.attribute_type,
                })) ?? item.optional_configs ?? [];
            setData({
                nombre: item.nombre,
                group_id: item.group_id ?? undefined,
                is_required: item.is_required === 1 || item.is_required === "1",
                is_for_mine: item.is_for_mine === 1 || item.is_for_mine === "1",
                has_attributes: item.has_attributes === true || item.hasAttributes === 1 || item.has_attributes === "1",
                attribute_type: item.attribute_type ?? undefined,
                optional_configs: optConfigs,
                instruction: item.instruction ?? '',
                has_document:
                    (item.has_document === true || item.has_document === 1 || item.has_document === "1") ||
                    !!item.document_url ||
                    !!item.document_name,
                document_name: item.document_name ?? '',
                document_url: null,
            });
            setOptionalConfigs(optConfigs);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    // Sincroniza optionalConfigs con el formulario
    useEffect(() => {
        setData('optional_configs', optionalConfigs);
    }, [optionalConfigs]);

    // Limpia configs si cambia el tipo
    useEffect(() => {
        if (!data.has_attributes) {
            setOptionalConfigs([]);
        }
    }, [data.has_attributes]);

    // Si tiene atributos, setea el tipo a 'texto' (o el que prefieras) y deshabilita el select
    useEffect(() => {
        if (data.has_attributes) {
            setData('attribute_type', 'texto');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.has_attributes]);

    const handleSuccess = (page: any) => {
        const { success, error } = page.props.flash;
        if (success) {
            setIsDialogOpen(false);
            reset();
            toast.success(success);
        }
        if (error) {
            setIsDialogOpen(true);
            toast.error(error);
        }
    };

    const handleError = () => {
        setIsDialogOpen(true);
        toast.error('Ocurrió un error al intentar actualizar la categoría de empresa.');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!item) return;
        const formData = new FormData();

        formData.append('nombre', data.nombre);
        if (data.group_id) formData.append('group_id', data.group_id);
        formData.append('is_required', String(data.is_required));
        formData.append('is_for_mine', String(data.is_for_mine ?? false));
        formData.append('has_attributes', String(data.has_attributes));
        if (data.attribute_type) formData.append('attribute_type', data.attribute_type);
        if (data.instruction) formData.append('instruction', data.instruction);
        formData.append('has_document', String(data.has_document ?? false));
        if (data.document_name) formData.append('document_name', data.document_name);
        if (data.document_url) formData.append('document_url', data.document_url);

        // optional_configs
        if (data.optional_configs && data.optional_configs.length > 0) {
            formData.append('optional_configs', JSON.stringify(data.optional_configs));
        }

        post(route('admin.category.admin.update', { category_id: item.id }), {
            data: formData,
            onSuccess: handleSuccess,
            onError: handleError,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    // Funciones para manejar configuraciones opcionales
    const handleAddOptionalConfig = () => {
        setOptionalConfigs([...optionalConfigs, { nombre: '', tipo: '' as OptionalConfigType }]);
    };

    const handleChangeOptionalConfig = (idx: number, field: keyof OptionalConfig, value: string) => {
        const updated = optionalConfigs.map((cfg, i) => (i === idx ? { ...cfg, [field]: value as OptionalConfigType } : cfg));
        setOptionalConfigs(updated);
    };

    const handleRemoveOptionalConfig = (idx: number) => {
        setOptionalConfigs(optionalConfigs.filter((_, i) => i !== idx));
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar {title}</DialogTitle>
                        <DialogDescription>Modifique los campos para actualizar la categoría de empresa.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3">
                        <div className="grid gap-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                type="text"
                                required
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre"
                            />
                            <InputError message={errors.nombre} />
                        </div>
                        {isCategorized === '1' && (
                            <div className="grid gap-2">
                                <Label>Grupos disponibles:</Label>
                                <Select
                                    value={data.group_id}
                                    onValueChange={(value) => setData('group_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un grupo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Grupos</SelectLabel>
                                            {groups.map((group) => (
                                                <SelectItem key={group.id} value={group.id.toString()}>
                                                    {group.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="instruction">Instrucción</Label>
                            <Input
                                id="instruction"
                                type="text"
                                value={data.instruction ?? ''}
                                onChange={(e) => setData('instruction', e.target.value)}
                                disabled={processing}
                                placeholder="Ingrese una instrucción o comentario"
                            />
                        </div>
                        {/* Mostrar attribute_type solo si has_attributes es false */}
                        {!data.has_attributes && (
                            <div className="grid gap-2">
                                <Label htmlFor="attribute_type">Tipo de atributo</Label>
                                <Select
                                    value={data.attribute_type}
                                    onValueChange={(value) => setData('attribute_type', value as AttributeType)}
                                    disabled={processing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Tipos</SelectLabel>
                                            <SelectItem value="fecha">Fecha</SelectItem>
                                            <SelectItem value="entero">Entero</SelectItem>
                                            <SelectItem value="texto">Texto</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="flex items-center space-x-2">
                            <input
                                id="has_document"
                                type="checkbox"
                                checked={!!data.has_document}
                                onChange={(e) => setData('has_document', e.target.checked)}
                                disabled={processing}
                            />
                            <Label htmlFor="has_document">¿Requiere documento?</Label>
                        </div>
                        {data.has_document && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="document_name">Nombre del documento</Label>
                                    <Input
                                        id="document_name"
                                        type="text"
                                        value={data.document_name ?? ''}
                                        onChange={(e) => setData('document_name', e.target.value)}
                                        disabled={processing}
                                        placeholder="Nombre del documento"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="documento">Documento (opcional)</Label>
                                    {/* Si ya existe un documento, mostrar el nombre y un enlace */}
                                    {item?.document_url && (
                                        <div className="mb-2 text-xs text-gray-600">
                                            Documento actual:&nbsp;
                                            <a
                                                href={`/${item.document_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline text-blue-600"
                                            >
                                                {item.document_name || 'Ver documento'}
                                            </a>
                                        </div>
                                    )}
                                    <Input
                                        id="documento"
                                        name="document_url"
                                        type="file"
                                        onChange={(e) => setData('document_url', e.target.files?.[0] || null)}
                                        disabled={processing}
                                    />
                                </div>
                            </>
                        )}
                        <div className="flex items-center space-x-2">
                            <input
                                id="is_required"
                                type="checkbox"
                                checked={data.is_required}
                                onChange={(e) => setData('is_required', e.target.checked)}
                                disabled={processing}
                            />
                            <Label htmlFor="is_required">¿Solamente para grúa?</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                id="is_for_mine"
                                type="checkbox"
                                checked={data.is_for_mine}
                                onChange={(e) => setData('is_for_mine', e.target.checked)}
                                disabled={processing}
                            />
                            <Label htmlFor="is_for_mine">¿Solamente para mina?</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                id="has_attributes"
                                type="checkbox"
                                checked={data.has_attributes}
                                onChange={(e) => setData('has_attributes', e.target.checked)}
                                disabled={processing}
                            />
                            <Label htmlFor="has_attributes">¿Tiene atributos?</Label>
                        </div>
                        {/* Mostrar dinámicos solo si has_attributes es true */}
                        {data.has_attributes && (
                            <div className="mt-2 space-y-2">
                                <Label>Configuraciones de atributos</Label>
                                {optionalConfigs.map((cfg, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <Input
                                            placeholder="Nombre"
                                            value={cfg.nombre}
                                            onChange={(e) => handleChangeOptionalConfig(idx, 'nombre', e.target.value)}
                                            disabled={processing}
                                        />
                                        <Select
                                            value={cfg.tipo}
                                            onValueChange={(value) => handleChangeOptionalConfig(idx, 'tipo', value)}
                                            disabled={processing}
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue placeholder="Tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fecha">Fecha</SelectItem>
                                                <SelectItem value="entero">Entero</SelectItem>
                                                <SelectItem value="texto">Texto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleRemoveOptionalConfig(idx)}
                                            disabled={processing}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-1"
                                    onClick={handleAddOptionalConfig}
                                    disabled={processing}
                                >
                                    <Plus className="mr-1 h-4 w-4" /> Agregar atributo
                                </Button>
                            </div>
                        )}
                        <Button type="submit" className="mt-2 w-auto" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Actualizar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
