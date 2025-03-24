import { Contractor, getColumns } from '@/components/contractor/columns';
import { DataTable } from '@/components/contractor/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import ActivateContractor from './activate';
import CreateContractor from './create';
import DeleteContractor from './delete';
import EditContractor from './edit';
import ViewContractor from './view';

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
    const [contractor, setContractor] = useState<Contractor | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const { contractors } = usePage<{
        contractors: Contractor[];
        contractorCompanyTypes: ContractorCompanyType[];
    }>().props;

    const handleActionClick = useCallback(
        (id: string, action: string) => {
            const selectedContractor = contractors.find((contractor) => contractor.id === id) || null;
            setContractor(selectedContractor);

            if (action === 'edit') {
                setIsEditDialogOpen(true);
            } else if (action === 'delete') {
                setIsDeleteDialogOpen(true);
            } else if (action === 'activate') {
                setIsActivateDialogOpen(true);
            } else if (action === 'detail') {
                setIsViewDialogOpen(true);
            }
        },
        [contractors],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contratistas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CreateContractor />
                <DataTable columns={getColumns(handleActionClick)} data={contractors} />
            </div>
            {contractor && (
                <>
                    <EditContractor contractor={contractor} isDialogOpen={isEditDialogOpen} setIsDialogOpen={setIsEditDialogOpen} />
                    <DeleteContractor isDialogOpen={isDeleteDialogOpen} setIsDialogOpen={setIsDeleteDialogOpen} contractor={contractor} />
                    <ActivateContractor isDialogOpen={isActivateDialogOpen} setIsDialogOpen={setIsActivateDialogOpen} contractor={contractor} />
                    <ViewContractor isDialogOpen={isViewDialogOpen} setIsDialogOpen={setIsViewDialogOpen} contractor={contractor} />
                </>
            )}
        </AppLayout>
    );
}
