import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import CreateCategory from './create';

interface CategoryCompany {
    id: number;
    name: string;
    category_id: number;
}

interface Category {
    id: number;
    name: string;
    category_companies: CategoryCompany[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestion de Seguridad y Salud Ocupacional',
        href: '/admin/category',
    },
];

export default function Security() {
    const { categories } = usePage<{ categories: Category[] }>().props;
    console.log('Categories:', categories);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion SSO" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CreateCategory />
            </div>
        </AppLayout>
    );
}
