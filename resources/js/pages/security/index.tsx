import { DataTable } from '@/components/data-table';
import { getColumns } from '@/components/security/columns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import * as React from 'react';
import GrantPermission from './create'; // Import GrantPermission
import DeleteAccess from './delete'; // Import DeleteAccess
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ingenieros de seguridad',
        href: '/contrata/personal',
    },
];

export default function Security() {
    const { security_users, all_users, auth } = usePage().props;
    const [selectedPerson, setSelectedPerson] = React.useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const companyId = auth.user.company_id;
    const userOptions = all_users.map((user) => ({
        value: String(user.id),
        label: `${user.nombres} ${user.apellidos}`,
    }));

    const handleAction = (action: string, id: number) => {
        const person = security_users.find((p) => p.id === id);
        setSelectedPerson(person || null);

        if (action === 'eliminar') {
            setIsDeleteDialogOpen(true);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personal" />
            {companyId === '1' && (
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <GrantPermission data={userOptions} />
                    <DataTable columns={getColumns(handleAction)} data={security_users} />
                    {selectedPerson && (
                        <DeleteAccess isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} selectedItem={selectedPerson} />
                    )}
                </div>
            )}
        </AppLayout>
    );
}
