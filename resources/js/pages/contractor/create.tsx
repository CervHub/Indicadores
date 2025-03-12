import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContractorCompanyType {
    id: number;
    name: string;
    // otros campos relevantes
}

type ContractorForm = {
    name: string;
    business_name: string;
    ruc_number: string;
    contractor_company_type_id: string;
};

export default function CreateContractor() {
    const { contractorCompanyTypes, flash } = usePage<{
        contractorCompanyTypes: ContractorCompanyType[];
        flash: { success?: string };
    }>().props;

    const { data, setData, post, processing, errors, reset } = useForm<Required<ContractorForm>>({
        name: '',
        business_name: '',
        ruc_number: '',
        contractor_company_type_id: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('contractor.store'), {
            onSuccess: (response) => {
                reset();
                setIsDialogOpen(false);
                console.log('Solicitud de creación exitosa:', response);
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                console.log('Errores en la solicitud de creación:', errors);
            },
        });
    };

    return (
        <div>
            {flash?.success && <div className="mb-4 text-green-600">{flash.success}</div>}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2">Agregar Contratista</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agregar Contratista</DialogTitle>
                        <DialogDescription>Complete los campos para agregar un nuevo contratista.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('contractor.store')}>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="business_name">Nombre Comercial</Label>
                            <Input
                                id="business_name"
                                type="text"
                                required
                                value={data.business_name}
                                onChange={(e) => setData('business_name', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre Comercial"
                            />
                            <InputError message={errors.business_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ruc_number">Número de RUC</Label>
                            <Input
                                id="ruc_number"
                                type="text"
                                required
                                value={data.ruc_number}
                                onChange={(e) => setData('ruc_number', e.target.value)}
                                disabled={processing}
                                placeholder="Número de RUC"
                            />
                            <InputError message={errors.ruc_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contractor_company_type_id">Tipo de Cliente</Label>
                            <Select onValueChange={(value) => setData('contractor_company_type_id', value)} value={data.contractor_company_type_id}>
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
                        <Button type="submit" className="mt-2 w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
