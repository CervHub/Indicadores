import { DataTable } from '@/components/file-status/data-table';
import { FileStatus, getColumns } from '@/components/file-status/columns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import CreateAnnex from './create';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Anexos',
        href: '/annexe',
    },
];

export default function ContractorDashboard() {
    const { fileStatuses, contractorCompanyTypes, ueas } = usePage<{
        contractorCompanyTypes: [];
        fileStatuses: FileStatus[];
        ueas: [];
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contratistas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CreateAnnex />
                <div className="w-full max-w-full overflow-x-auto">
                    <DataTable columns={getColumns(contractorCompanyTypes, ueas)} data={fileStatuses} />
                </div>
            </div>
        </AppLayout>
    );
}
