import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useCallback, useEffect } from 'react';

type LinkVehicleProps = {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    vehicle: { id: number; license_plate: string; brand: string; model: string };
    companyId: number | string;
};

export default function LinkVehicle({ isDialogOpen, setIsDialogOpen, vehicle, companyId }: LinkVehicleProps) {
    const { data, setData, post, processing, reset } = useForm<{ id: number | null; company_id: number | string | null }>({
        id: null,
        company_id: null,
    });

    // Setea id y company_id cada vez que cambia el vehicle
    useEffect(() => {
        setData({
            id: vehicle?.id ?? null,
            company_id: companyId ?? null,
        });

    }, [vehicle, companyId, setData, reset]);

    const handleLink = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            post(route('vehicle.link'), {
                data,
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Vehículo vinculado exitosamente.');
                },
                onError: () => {
                    toast.error('Ocurrió un error al intentar vincular el vehículo.');
                },
            });
        },
        [post, setIsDialogOpen, data]
    );

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="pb-3 sm:max-w-[350px]">
                <DialogHeader>
                    <DialogTitle>Vincular Vehículo</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro que desea vincular el vehículo <br /> <b>{vehicle.license_plate}</b> ({vehicle.brand} {vehicle.model})?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="default"
                        onClick={handleLink}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Vincular
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={processing}
                    >
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
