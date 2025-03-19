import { Contractor, getColumns } from '@/components/contractor/columns';
import { DataTable } from '@/components/contractor/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import CreateContractor from './create';

interface ContractorCompanyType {
    id: number;
    name: string;
    // otros campos relevantes
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contratistas',
        href: '/contractors',
    },
];

export default function ContractorDashboard() {
    const { contractors, contractorCompanyTypes } = usePage<{
        contractors: Contractor[];
        contractorCompanyTypes: ContractorCompanyType[];
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contratistas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CreateContractor />
                <DataTable columns={getColumns(contractorCompanyTypes)} data={contractors} />
            </div>
        </AppLayout>
    );
}
