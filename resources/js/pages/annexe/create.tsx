import { useForm } from '@inertiajs/react';
import { FilePieChart } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

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
}

interface Uea {
    id: number;
    name: string;
}

type ContractorForm = {
    contractor_company_type_id: string;
    uea_id: string;
    year: string;
    month: string;
    file: File | null;
};

interface CreateAnnexProps {
    contractorCompanyTypes: ContractorCompanyType[];
    ueas: Uea[];
}

export default function CreateAnnex({ contractorCompanyTypes, ueas }: CreateAnnexProps) {
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const [isOpenDownload, setIsOpenDownload] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm<Required<ContractorForm>>({
        contractor_company_type_id: '',
        uea_id: '',
        year: String(currentYear),
        month: String(Number(currentMonth)), // Mes actual
        file: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.contractor_company_type_id || !data.uea_id || !data.year || !data.month || !data.file) {
            toast.error('Por favor, complete todos los campos antes de enviar.', {
                duration: 20000,
                closeButton: true,
            });
            return;
        }

        post(route('annexes.store'), {
            onSuccess: (page) => {
                const flash = page.props?.flash as { success?: string; error?: string };
                if (flash?.success) {
                    toast.success(flash.success, {
                        duration: 20000,
                        closeButton: true,
                    });
                    reset();
                    setIsDialogOpen(false);
                } else if (flash?.error) {
                    setData('file', null);
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
                    if (fileInput) fileInput.value = ''; // Clear file input
                    toast.error(flash.error, {
                        duration: 20000,
                        closeButton: true,
                    });
                }
            },
            onError: () => {
                toast.error('Ocurrió un error al subir el archivo, intente de nuevo.', {
                    duration: 20000,
                    closeButton: true,
                });
            },
        });
    };

    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    return (
        <div>
            {contractorCompanyTypes && ueas && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <div className="mb-4 flex justify-between">
                        <DialogTrigger asChild>
                            <Button>Agregar Indicador</Button>
                        </DialogTrigger>
                        <Button className="ml-2" variant="warning" onClick={() => setIsOpenDownload(true)} disabled={processing}>
                            <FilePieChart className="mr-2 h-4 w-4" />
                            Formato
                        </Button>
                    </div>

                    <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle>Agregar Indicador</DialogTitle>
                            <DialogDescription>Complete los campos para agregar un nuevo indicador.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Tipo de Cliente</Label>
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
                            </div>

                            <div className="grid gap-2">
                                <Label>UEA</Label>
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
                            </div>

                            <div className="grid gap-2">
                                <Label>Año</Label>
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
                            </div>

                            <div className="grid gap-2">
                                <Label>Mes</Label>
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
                            </div>

                            <div className="grid gap-2">
                                <Label>Archivo</Label>
                                <Input type="file" accept=".xls,.xlsx" onChange={(e) => setData('file', e.target.files?.[0] || null)} />
                            </div>

                            <div className="text-right">
                                <Button type="submit" disabled={!data.file || processing}>
                                    {processing ? 'Subiendo...' : 'Subir'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            <DownloadContractFormat setIsDialogOpen={setIsOpenDownload} isDialogOpen={isOpenDownload} />
        </div>
    );
}
