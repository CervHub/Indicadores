import InspectionVehiclePreUse from '@/components/form/inpectionPreUse';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Formatos',
        href: '/format',
    },
    {
        title: 'Inspección Vehicular Diaria',
        href: '/daily-vehicle-inspection',
    },
];

// Definición de la interfaz Causa
interface Causa {
    id: string;
    nombre: string;
}

export default function DailyVehicleInspection() {
    const { causas, auth } = usePage<{ causas: Causa[]; auth: { user: { id: string; company_id: string; name: string } } }>().props;

    // Extraer id, company_id y name del usuario
    const userId = auth.user.id;
    const companyId = auth.user.company_id;
    const userName = auth.user.name;

    // Formatear las causas para que tengan solo id y name
    const formattedCausas = causas.map((causa: Causa) => ({
        id: causa.id,
        name: causa.nombre,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inspección Vehicular Diaria" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <InspectionVehiclePreUse causas={formattedCausas} userId={userId} userName={userName} companyId={companyId} />
            </div>
        </AppLayout>
    );
}
