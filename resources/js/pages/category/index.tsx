import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestion de Seguridad y Salud Ocupacional',
        href: '/admin/category',
    },
];

export default function Security() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion SSO" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Aquí puedes agregar componentes adicionales si es necesario */}
            </div>
        </AppLayout>
    );
}
