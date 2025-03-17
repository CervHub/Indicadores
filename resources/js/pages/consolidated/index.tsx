import { Consolidated, getColumns } from '@/components/consolidated/columns';
import { DataTable } from '@/components/consolidated/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
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

    const [modalOpen, setModalOpen] = useState(false);
    const [initialYear, setInitialYear] = useState<number>(0);
    const [initialMonth, setInitialMonth] = useState<number>(0);

    const handleReconsolidateClick = (id: string) => {
        console.log(`Reconsolidar consolidado con ID: ${id}`);
        const consolidated = consolidateds.find((c) => c.id === id);
        console.log(`Reconsolidado:`, consolidated);
        if (consolidated) {
            setInitialYear(consolidated.year);
            setInitialMonth(consolidated.month);
            setModalOpen(true);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Consolidados" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CreateConsolidated initialYear={initialYear} initialMonth={initialMonth} isOpen={modalOpen} onOpenChange={setModalOpen} />
                <div className="w-full max-w-full overflow-x-auto">
                    <DataTable columns={getColumns(handleReconsolidateClick)} data={consolidateds} />
                </div>
            </div>
        </AppLayout>
    );
}
