import InspectionVehicle from '@/components/form/inpectionVehicle';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react'; // Importamos usePage de Inertia.js

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

const TYPE = 'trimestral';

export default function QuarterlyVehicleInspection() {
    const { causas, auth } = usePage<{
        causas: { id: string; nombre: string; group: string }[];
        auth: { user: { id: string; company_id: string; name: string; company: string } };
    }>().props;

    // Extraer id, company_id y name del usuario
    const userId = auth.user.id;
    const companyId = auth.user.company_id;
    const userName = auth.user.name;
    const company = auth.user.company;

    // Solo las 3 primeras causas
    const filteredCausas = causas.slice(0, 3).map(({ id, nombre, group }) => ({
        id,
        name: nombre,
        group,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inspección Vehicular Trimestral" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <InspectionVehicle causas={filteredCausas} type={TYPE} userId={userId} companyId={companyId} userName={userName} company={company} />
            </div>
        </AppLayout>
    );
}
