import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react'; // Importamos Link de Inertia.js
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Formatos',
        href: '/format',
    },
    {
        title: 'Condiciones subestándar',
        href: '/conditions',
    },
];

export default function Conditions() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Condiciones subestándar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4"></div>
        </AppLayout>
    );
}
