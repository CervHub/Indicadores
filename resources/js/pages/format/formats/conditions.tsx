import TemplateForm from '@/components/form/template';
import AppLayout from '@/layouts/app-layout';
import { Auth, User } from '@/types';
import { Head } from '@inertiajs/react';

const DEFAULT_COORDINATES = { lat: -17.270662, lng: -70.617886 };
const breadcrumbs = [
    { title: 'Gestión de Formatos', href: '/format' },
    { title: 'Condiciones subestándar', href: '/conditions' },
];

export default function Conditions(props: any) {
    const { causas, companies, managements, auth } = props;

    // Extraer solo id y name en mayúsculas
    const filteredCausas = causas
        ?.filter((causa: any) => causa && causa.id && causa.nombre)
        .map((causa: any) => ({ id: causa.id, name: causa.nombre.toUpperCase() })) ?? [];

    const filteredCompanies = companies
        ?.filter((company: any) => company && company.id && company.nombre)
        .map((company: any) => ({ id: company.id, name: company.nombre.toUpperCase() })) ?? [];

    const managementsWithoutOtros = managements
        ?.filter((management: any) => management && management.nombre && !management.nombre.toUpperCase().includes('OTROS')) ?? [];
    const otrosManagement = managements
        ?.find((management: any) => management && management.nombre && management.nombre.toUpperCase().includes('OTROS'));
    const filteredManagements = [
        ...managementsWithoutOtros.map((management: any) => ({ id: management.id, name: management.nombre.toUpperCase() })),
        ...(otrosManagement ? [{ id: otrosManagement.id, name: otrosManagement.nombre.toUpperCase() }] : [])
    ];

    // Obtener user_id y company_id del usuario autenticado
    const user: User = auth?.user;
    const user_id = user?.id?.toString() ?? '';
    const company_id = user?.company_id?.toString() ?? '';

    // Detectar dispositivo/computadora
    const device = typeof window !== 'undefined' ? window.navigator.userAgent : '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Condiciones subestándar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="w-full sm:w-lg mx-auto">
                    <TemplateForm
                        defaultCoordinates={DEFAULT_COORDINATES}
                        gerencias={filteredManagements}
                        empresas={filteredCompanies}
                        causas={filteredCausas}
                        user_id={user_id}
                        company_id={company_id}
                        tipo_reporte='condiciones'
                    />
                </div>
            </div>
        </AppLayout>
    );
}
