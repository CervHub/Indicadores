

import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useCallback } from 'react';

type DestroyVehicleProps = {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    vehicle: { id: number; license_plate: string; brand: string; model: string };
};

export default function DestroyVehicle({ isDialogOpen, setIsDialogOpen, vehicle }: DestroyVehicleProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            destroy(route('vehicle.destroy', { vehicle: vehicle.id }), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Vehículo desvinculado exitosamente.');
                },
                onError: () => {
                    toast.error('Ocurrió un error al intentar desvincular el vehículo.');
                },
            });
        },
        [destroy, setIsDialogOpen, vehicle.id]
    );

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="pb-3 sm:max-w-[350px]">
                <DialogHeader>
                    <DialogTitle>Desvincular Vehículo</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro que desea desvincular el vehículo <br /> <b>{vehicle.license_plate}</b> ({vehicle.brand} {vehicle.model})?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Desvincular
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
