import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

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

export default function CreateConsolidated() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11

    const { data, setData, post, processing, errors, reset } = useForm<Required<ConsolidatedForm>>({
        year: currentYear,
        month: currentMonth,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(true);
    const submitButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setIsFormValid(data.year !== 0 && data.month !== 0);
    }, [data]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('consolidated.store'), {
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

    const years = Array.from({ length: currentYear - 2023 + 1 }, (_, i) => 2023 + i);

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
                <div className="flex justify-start">
                    <DialogTrigger asChild>
                        <Button className="inline-block px-4 py-2" onClick={() => setIsDialogOpen(true)}>
                            Crear Consolidado
                        </Button>
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
                            <Select onValueChange={(value) => setData('year', Number(value))} value={String(data.year)}>
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
                            <Select onValueChange={(value) => setData('month', Number(value))} value={String(data.month)}>
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
                        <Button ref={submitButtonRef} type="submit" className="mt-2" disabled={processing || !isFormValid}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Generar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
