import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { VehicleColumns } from '@/components/vehiclesall/vehicle-columns';
import { DataTable } from '@/components/vehiclesall/data-table';

const breadcrumbs = [
    {
        title: 'Gestión de Vehículos',
        href: '/vehiculos',
    },
];

export default function VehicleAll() {
    const { vehicles } = usePage().props;
    console.log('Vehicles:', vehicles);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehículos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex-1">
                    <DataTable columns={VehicleColumns} data={vehicles ?? []} />
                </div>
            </div>
        </AppLayout>
    );
}
