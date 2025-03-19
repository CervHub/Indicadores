import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ingenieros de seguridad',
        href: '/contrata/personal',
    },
];

export default function Security() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personal" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Aquí puedes agregar componentes adicionales si es necesario */}
            </div>
        </AppLayout>
    );
}
