import { FileStatus, getColumns } from '@/components/file-status/columns';
import { DataTable } from '@/components/file-status/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CreateAnnex from './create';
import Reload from './reload';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Indicadores',
        href: '/annexe',
    },
];

export default function ContractorDashboard() {
    const { fileStatuses, contractorCompanyTypes, ueas, rules, company } = usePage<{
        contractorCompanyTypes: [];
        fileStatuses: FileStatus[];
        ueas: [];
        rules: [];
        company: any
    }>().props;

    const [selectedItem, setSelectedItem] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contratistas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Render CreateAnnex only when contractorCompanyTypes and ueas are available */}
                {contractorCompanyTypes.length > 0 && ueas.length > 0 && <CreateAnnex contractorCompanyTypes={contractorCompanyTypes} ueas={ueas} company={company} />}
                <div className="w-full max-w-full overflow-x-auto">
                    <DataTable columns={getColumns(contractorCompanyTypes, ueas, handleSelectItem)} data={fileStatuses} />
                </div>
            </div>
            {selectedItem && <Reload rules={rules} selectedItem={selectedItem} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />}
        </AppLayout>
    );
}
