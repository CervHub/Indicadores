import InspectionVehicle from '@/components/form/inpectionVehicle';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react'; // Importamos usePage de Inertia.js
import StatementDialog from './statement';
import { useState } from 'react';

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

    const [open, setOpen] = useState(true);

    // Variable para el área seleccionada (solo una)
    const [area, setArea] = useState<string>('');
    // Extraer id, company_id y name del usuario
    const userId = auth.user.id;
    const companyId = auth.user.company_id;
    const userName = auth.user.name;
    const company = auth.user.company;

    // Mapear todas las propiedades relevantes de cada causa
    const filteredCausas = causas.map(
        ({
            id,
            nombre,
            group,
            is_crane,
            is_for_mine,
            instruction,
            document_url,
            document_name,
            attribute_type,
            has_attributes,
            category_attributes,
        }) => ({
            id,
            name: nombre,
            group,
            is_crane,
            is_for_mine,
            instruction,
            document_url,
            document_name,
            attribute_type,
            has_attributes,
            category_attributes,
        })
    );

    console.log('Causas:', causas);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inspección Vehicular Trimestral" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <InspectionVehicle causas={filteredCausas} type={TYPE} userId={userId} companyId={companyId} userName={userName} company={company} area={area} />
            </div>
            <StatementDialog open={open} onOpenChange={setOpen} setArea={setArea} />

        </AppLayout>
    );
}
