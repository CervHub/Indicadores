import { useEffect } from 'react';

import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { months } from '@/lib/utils';
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
    file: File | null;
};

export default function CreateAnnex() {
    const { contractorCompanyTypes, ueas, flash } = usePage<{
        contractorCompanyTypes: ContractorCompanyType[];
        ueas: Uea[];
        flash: { success?: string; error?: string };
    }>().props;

    useEffect(() => {
        console.log('Mensajes flash al iniciar:', flash);
    }, [flash]);

    const { data, setData, post, processing, errors, reset } = useForm<Required<ContractorForm>>({
        contractor_company_type_id: '',
        uea_id: '',
        year: '',
        month: '',
        file: null,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('annexes.store'), {
            onSuccess: (page) => {
                reset();
                setIsDialogOpen(false);
                console.log('Solicitud de creación exitosa:', page?.props?.flash);
            },
            onError: (erros) => {
                setIsDialogOpen(true);
                console.log('Errores en la solicitud de creación:', erros);
            },
        });
    };

    const isFormValid = () => {
        return (
            data.contractor_company_type_id &&
            data.uea_id &&
            data.year &&
            data.month &&
            data.file
        );
    };

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2">Agregar Anexos</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agregar Contratista</DialogTitle>
                        <DialogDescription>Complete los campos para agregar un nuevo contratista.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('contractor.store')} encType="multipart/form-data">
                        <div className="grid gap-2">
                            <Label htmlFor="contractor_company_type_id">Tipo de Cliente</Label>
                            <Select
                                required
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
                            <Select onValueChange={(value) => setData('uea_id', value)} value={data.uea_id}>
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
                            <Select onValueChange={(value) => setData('year', value)} value={data.year}>
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
                            <Select onValueChange={(value) => setData('month', value)} value={data.month}>
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
                                required
                                accept=".xlsx,.xls"
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
        </div>
    );
}
