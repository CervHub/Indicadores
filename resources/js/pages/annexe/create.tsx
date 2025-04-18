import { useForm, usePage } from '@inertiajs/react';
import { FilePieChart, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { months } from '@/lib/utils';
import { toast } from 'sonner';
import DownloadContractFormat from './download';

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

interface CreateAnnexProps {
    rules: any; // Adjust the type as needed based on the structure of rules
}

export default function CreateAnnex({ rules }: CreateAnnexProps) {
    const { contractorCompanyTypes, ueas } = usePage<{
        contractorCompanyTypes: ContractorCompanyType[];
        ueas: Uea[];
    }>().props;

    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0'); // Mes actual (1-12) con formato de dos dígitos
    const [isOpenDownload, setIsOpenDownload] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<ContractorForm>>({
        contractor_company_type_id: '',
        uea_id: '',
        year: String(currentYear), // Año actual
        month: String(Number(currentMonth)), // Mes actual
        file: null,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                    setData('file', null); // Solo restablece el campo 'file'
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
                setData('file', null); // Solo restablece el campo 'file'
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
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <div className="flex justify-between">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2">Agregar Indicador</Button>
                    </DialogTrigger>
                    <Button className="ml-2" variant="warning" onClick={() => setIsOpenDownload(true)} disabled={processing}>
                        <FilePieChart className="mr-2 h-4 w-4" />
                        Formato
                    </Button>
                </div>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Agregar Indicador</DialogTitle>
                        <DialogDescription>Complete los campos para agregar un nuevo indicador.</DialogDescription>
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
            <DownloadContractFormat setIsDialogOpen={setIsOpenDownload} isDialogOpen={isOpenDownload} />
        </div>
    );
}
