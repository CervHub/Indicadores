import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { getVehicleColumns } from '@/components/vehiclesall/vehicle-columns';
import { DataTable } from '@/components/vehiclesall/data-table';

const breadcrumbs = [
    {
        title: 'Gestión de Vehículos',
        href: '/vehiculos',
    },
];

export default function VehicleAll() {
    const { vehicles } = usePage().props;

    function handleAction(placa: string, action: 'ver' | 'descargar_qr') {
        console.log(`Acción: ${action} para el vehículo con placa: ${placa}`);
        if (action === 'ver') {
            alert(`Ver vehículo: ${placa}`);
        } else if (action === 'descargar_qr') {
            alert(`Descargar QR para: ${placa}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehículos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex-1">
                    <DataTable columns={getVehicleColumns(handleAction)} data={vehicles ?? []} />
                </div>
            </div>
        </AppLayout>
    );
}
