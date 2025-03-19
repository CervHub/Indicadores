import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { months } from '@/lib/utils';

type ConsolidatedForm = {
    year: number;
    month: number;
    reconsolidated: true;
};

type ReConsolidatedProps = {
    initialYear: number;
    initialMonth: number;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
};

export default function ReConsolidated({ initialYear, initialMonth, isOpen = false, onOpenChange }: ReConsolidatedProps) {
    const { data, setData, post, processing, reset } = useForm<Required<ConsolidatedForm>>({
        year: initialYear,
        month: initialMonth,
        reconsolidated: true,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
    const submitButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        setData('year', initialYear);
        setData('month', initialMonth);
    }, [initialYear, initialMonth, setData]);

    useEffect(() => {
        if (isDialogOpen) {
            const timer = setTimeout(() => {
                submit();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isDialogOpen]);

    const submit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        post(route('consolidated.store'), {
            onSuccess: (response) => {
                reset();
                setIsDialogOpen(false);
                if (onOpenChange) onOpenChange(false);
                console.log('Solicitud de reconsolidación exitosa:', response);
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                console.log('Errores en la solicitud de reconsolidación:', errors);
            },
        });
    };

    return (
        <div>
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (onOpenChange) onOpenChange(open);
                }}
                // Prevent closing the dialog when clicking outside
                modal
            >
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Reconsolidando</DialogTitle>
                        <DialogDescription>
                            Reconsolidando para el mes de {months.find((m) => m.value === data.month)?.label} para el año de {data.year}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('consolidated.store')}>
                        <Button ref={submitButtonRef} type="submit" className="mt-2" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Reconsolidar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
