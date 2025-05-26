import InspectionVehiclePreUse from '@/components/form/inpectionPreUse';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import StatementDialog from './statement';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Formatos',
        href: '/format',
    },
    {
        title: 'Inspección Vehicular por Visita',
        href: '/daily-vehicle-inspection-visit',
    },
];

// Definición de la interfaz Causa
interface Causa {
    id: string;
    nombre: string;
}

export default function DailyVehicleInspection() {
    const { causas, auth } = usePage<{ causas: Causa[]; auth: { user: { id: string; company_id: string; name: string } } }>().props;
    const [open, setOpen] = useState(true);
    // Variable para el área seleccionada (solo una)
    const [area, setArea] = useState<string>('');
    // Extraer id, company_id y name del usuario
    const userId = auth.user.id;
    const companyId = auth.user.company_id;
    const userName = auth.user.name;

    // Formatear las causas para que tengan solo id y name
    const formattedCausas = causas.map((causa: Causa) => ({
        id: causa.id,
        name: causa.nombre,
    }));

    // Nuevo campo para indicar si es visita
    const isVisita = true;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inspección Vehicular por Visita" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <InspectionVehiclePreUse
                    causas={formattedCausas}
                    userId={userId}
                    userName={userName}
                    companyId={companyId}
                    area={area}
                    isVisita={isVisita}
                />
            </div>
            <StatementDialog open={open} onOpenChange={setOpen} setArea={setArea} />
        </AppLayout>
    );
}
