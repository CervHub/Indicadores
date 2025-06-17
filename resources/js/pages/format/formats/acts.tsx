import TemplateForm from '@/components/form/template';
import AppLayout from '@/layouts/app-layout';
import { Auth, User } from '@/types';
import { Head } from '@inertiajs/react';

const DEFAULT_COORDINATES = { lat: -17.270662, lng: -70.617886 };

const breadcrumbs = [
    { title: 'Gestión de Formatos', href: '/format' },
    { title: 'Actos subestándar', href: '/acts' },
];

export default function Acts(props: any) {
    const { causas, companies, managements, auth } = props;

    // Extraer solo id y name
    const filteredCausas = causas.map((causa: any) => ({ id: causa.id, name: causa.nombre.toUpperCase() }));
    const filteredCompanies = companies.map((company: any) => ({ id: company.id, name: company.nombre.toUpperCase() }));

    const managementsWithoutOtros = managements.filter((management: any) => !management.nombre.toUpperCase().includes('OTROS'));
    const otrosManagement = managements.find((management: any) => management.nombre.toUpperCase().includes('OTROS'));
    const filteredManagements = [
        ...managementsWithoutOtros.map((management: any) => ({ id: management.id, name: management.nombre.toUpperCase() })),
        ...(otrosManagement ? [{ id: otrosManagement.id, name: otrosManagement.nombre.toUpperCase() }] : [])
    ];

    // Obtener user_id y company_id del usuario autenticado
    const user: User = auth?.user;
    const user_id = user?.id?.toString() ?? '';
    const company_id = user?.company_id?.toString() ?? '';

    console.log('User ID:', user_id);
    console.log('Company ID:', company_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Actos subestándar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="w-full sm:w-lg mx-auto">
                    <TemplateForm
                        defaultCoordinates={DEFAULT_COORDINATES}
                        gerencias={filteredManagements}
                        empresas={filteredCompanies}
                        causas={filteredCausas}
                        user_id={user_id}
                        company_id={company_id}
                        tipo_reporte='actos'
                    />
                </div>
            </div>
        </AppLayout>
    );
}
