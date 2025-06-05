import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { months } from '@/lib/utils';
import { toast } from 'sonner';

interface ContractorCompanyType {
    id: number;
    name: string;
    // otros campos relevantes
}

interface Uea {
    id: number;
    name: string;
    // otros campos relevantes
}

type ContractorForm = {
    contractor_company_type_id: string;
    uea_id: string;
    year: string;
    month: string;
    file?: File | null; // Hacer que el archivo sea opcional
};

interface ReloadProps {
    rules: any; // Ajustar el tipo según la estructura de las reglas
    selectedItem: ContractorForm; // Recibir el item seleccionado desde el padre
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
}

export default function Reload({ rules, selectedItem, isDialogOpen, setIsDialogOpen }: ReloadProps) {
    const { contractorCompanyTypes, ueas } = usePage<{
        contractorCompanyTypes: ContractorCompanyType[];
        ueas: Uea[];
    }>().props;

    const { data, setData, post, processing, errors, reset } = useForm<ContractorForm>({
        contractor_company_type_id: selectedItem.contractor_company_type_id,
        uea_id: selectedItem.uea_id,
        year: selectedItem.year,
        month: selectedItem.month,
        file: null,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setData({
            contractor_company_type_id: selectedItem.contractor_company_type_id,
            uea_id: selectedItem.uea_id,
            year: selectedItem.year,
            month: selectedItem.month,
            file: null,
        });
    }, [selectedItem, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('annexes.store'), {
            onSuccess: (page) => {
                const flash = page.props?.flash;
                if (flash.success) {
                    toast.success(flash.success, {
                        duration: 20000,
                        closeButton: true,
                    });
                    reset();
                    setIsDialogOpen(false);
                } else if (flash.error) {
                    setData('file', null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    toast.error(flash.error, {
                        duration: 20000,
                        closeButton: true,
                    });
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                toast.error('Ocurrió un error al subir el archivo, intente de nuevo.', {
                    duration: 20000,
                    closeButton: true,
                });
                setData('file', null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const isFormValid = () => {
        return data.contractor_company_type_id && data.uea_id && data.year && data.month && data.file;
    };

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Actualizar Indicador</DialogTitle>
                    <DialogDescription>Complete los campos para agregar un nuevo indicador.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-3" method="post" action={route('contractor.store')} encType="multipart/form-data">
                    <div className="grid gap-2">
                        <Label htmlFor="contractor_company_type_id">Tipo de Cliente</Label>
                        <Select
                            required
                            disabled
                            onValueChange={(value) => setData('contractor_company_type_id', value)}
                            value={data.contractor_company_type_id}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un tipo de cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Tipos de Cliente</SelectLabel>
                                    {contractorCompanyTypes.map((type) => (
                                        <SelectItem key={type.id} value={String(type.id)}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.contractor_company_type_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="uea_id">UEA</Label>
                        <Select disabled onValueChange={(value) => setData('uea_id', value)} value={data.uea_id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione una UEA" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>UEAs</SelectLabel>
                                    {ueas.map((uea) => (
                                        <SelectItem key={uea.id} value={String(uea.id)}>
                                            {uea.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.uea_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="year">Año</Label>
                        <Select disabled onValueChange={(value) => setData('year', value)} value={data.year}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un año" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Años</SelectLabel>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={String(year)}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.year} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="month">Mes</Label>
                        <Select disabled onValueChange={(value) => setData('month', value)} value={data.month}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un mes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Meses</SelectLabel>
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.month} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="file">Archivo</Label>
                        <Input
                            type="file"
                            id="file"
                            accept=".xlsx,.xls"
                            ref={fileInputRef}
                            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                        />
                        <InputError message={errors.file} />
                    </div>
                    <Button type="submit" className="mt-2" disabled={!isFormValid() || processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Guardar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
