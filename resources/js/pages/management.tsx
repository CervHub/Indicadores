import { Entity, getColumns } from '@/components/entity/columns';
import { DataTable } from '@/components/entity/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Management',
        href: '/management',
    },
];

export default function Management() {
    const { entities } = usePage<{ entities: Entity[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DataTable columns={getColumns()} data={entities} />
            </div>
        </AppLayout>
    );
}
