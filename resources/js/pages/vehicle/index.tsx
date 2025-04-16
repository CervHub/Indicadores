import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CreateVehicle from './create';
import TableCard from './table';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Vehículos',
        href: '/vehiculos',
    },
];


export default function Vehicle() {
    const { vehicles, auth } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Función para manejar el clic en un elemento y la acción seleccionada
    const handleAction = (item: any, action: string) => {
        console.log('Elemento clickeado:', item);
        console.log('Acción seleccionada:', action);

        if (action === 'desvincular') {
            // Lógica para desvincular el vehículo
            console.log(`Desvinculando vehículo con ID: ${item.id}`);
        } else if (action === 'actualizar') {
            // Lógica para actualizar el vehículo
            console.log(`Actualizando vehículo con ID: ${item.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehículos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-start">
                    <Button className="w-auto" onClick={() => setIsDialogOpen(true)}>
                        Crear Vehículo
                    </Button>
                </div>
                <div className="flex-1">
                    {/* Pasar la función handleAction como prop a TableCard */}
                    <TableCard data={vehicles} onAction={handleAction} />
                </div>
            </div>
            <CreateVehicle isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
        </AppLayout>
    );
}
