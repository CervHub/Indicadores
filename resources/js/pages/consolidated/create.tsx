import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { months } from '@/lib/utils';

type ConsolidatedForm = {
    year: number;
    month: number;
};

type CreateConsolidatedProps = {
    initialYear?: number;
    initialMonth?: number;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
};

export default function CreateConsolidated({ initialYear = 0, initialMonth = 0, isOpen = false, onOpenChange }: CreateConsolidatedProps) {
    const { flash } = usePage<{
        flash: { success?: string };
    }>().props;

    const { data, setData, post, processing, errors, reset } = useForm<Required<ConsolidatedForm>>({
        year: initialYear,
        month: initialMonth,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsFormValid(data.year !== 0 && data.month !== 0);
    }, [data]);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setData('year', initialYear);
            setData('month', initialMonth);
        }
    }, [initialYear, initialMonth, isOpen, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('consolidated.store'), {
            onSuccess: (response) => {
                reset();
                setIsDialogOpen(false);
                if (onOpenChange) onOpenChange(false);
                console.log('Solicitud de creación exitosa:', response);
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                console.log('Errores en la solicitud de creación:', errors);
            },
        });
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2023 + 1 }, (_, i) => 2023 + i);

    return (
        <div>
            {flash?.success && <div className="mb-4 text-green-600">{flash.success}</div>}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (onOpenChange) onOpenChange(open);
                }}
            >
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2">Crear Consolidado</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Crear Consolidado</DialogTitle>
                        <DialogDescription>Complete los campos para crear un nuevo consolidado.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('consolidated.store')}>
                        <div className="grid gap-2">
                            <Label htmlFor="year">Año</Label>
                            <Select onValueChange={(value) => setData('year', Number(value))} value={data.year ? String(data.year) : ''}>
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
                            <Select onValueChange={(value) => setData('month', Number(value))} value={data.month ? String(data.month) : ''}>
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
                        <Button type="submit" className="mt-2" disabled={processing || !isFormValid}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Generar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
