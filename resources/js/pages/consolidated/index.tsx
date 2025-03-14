import { Consolidated, getColumns } from '@/components/consolidated/columns';
import { DataTable } from '@/components/consolidated/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import CreateConsolidated from './create';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Consolidados',
        href: '/consolidated',
    },
];

export default function ConsolidatedDashboard() {
    const { consolidateds = [] } = usePage<{
        consolidateds: Consolidated[];
    }>().props;

    console.log(consolidateds);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Consolidados" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CreateConsolidated />
                <div className="w-full max-w-full overflow-x-auto">
                    <DataTable columns={getColumns()} data={consolidateds} />
                </div>
            </div>
        </AppLayout>
    );
}
