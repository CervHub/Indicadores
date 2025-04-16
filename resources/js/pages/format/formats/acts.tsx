import TemplateForm from '@/components/form/template';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const DEFAULT_COORDINATES = { lat: -17.270662, lng: -70.617886 };

const breadcrumbs = [
    { title: 'Gestión de Formatos', href: '/format' },
    { title: 'Actos subestándar', href: '/acts' },
];

const gerencias = [
    { id: 'gerencia1', name: 'Gerencia de Operaciones' },
    { id: 'gerencia2', name: 'Gerencia de Recursos Humanos' },
    { id: 'gerencia3', name: 'Gerencia de Finanzas' },
];

const empresas = [
    { id: 'empresa1', name: 'Empresa A' },
    { id: 'empresa2', name: 'Empresa B' },
    { id: 'empresa3', name: 'Empresa C' },
];

const causas = [
    { id: 'causa1', name: 'Causa 1' },
    { id: 'causa2', name: 'Causa 2' },
    { id: 'causa3', name: 'Causa 3' },
];

export default function Acts() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Actos subestándar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <TemplateForm
                    defaultCoordinates={DEFAULT_COORDINATES}
                    gerencias={gerencias}
                    empresas={empresas}
                    causas={causas}
                />
            </div>
        </AppLayout>
    );
}
