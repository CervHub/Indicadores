import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react'; // Importamos Link de Inertia.js
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Formatos',
        href: '/format',
    },
    {
        title: 'Inspección Vehicular Trimestral',
        href: '/quarterly-vehicle-inspection',
    },
];

export default function QuarterlyVehicleInspection() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inspección Vehicular Trimestral" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4"></div>
        </AppLayout>
    );
}
