import { getColumns, Person } from '@/components/person/columns';
import { DataTable } from '@/components/person/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Company } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ActivatePerson from './activate';
import CreatePerson from './create';
import DeletePerson from './delete';
import EditPerson from './edit';
import ResetPassword from './reset';
import MassiveUpdate from './update';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Personal',
        href: '/contrata/personal',
    },
];

export default function ReportabilityPage() {
    const { people, roles, companies, auth } = usePage<{
        people: Person[],
        roles: any[],
        companies: Company[],
        auth: { user: { role_code: string } }
    }>().props;

    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

    const handleAction = (action: string, id: number) => {
        const person = people.find((p) => p.id === id);
        setSelectedPerson(person || null);

        if (action === 'editar') {
            setIsEditDialogOpen(true);
        } else if (action === 'eliminar') {
            setIsDeleteDialogOpen(true);
        } else if (action === 'activar') {
            setIsActivateDialogOpen(true);
        } else if (action === 'reset') {
            setIsResetDialogOpen(true);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personal" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    {auth.user.role_code !== 'SA' && <CreatePerson roles={roles} />}
                    {auth.user.role_code === 'SA' && <MassiveUpdate />}
                </div>
                <div className="w-full max-w-full overflow-x-auto">
                    <DataTable
                        columns={getColumns(handleAction, roles, auth.user.role_code)}
                        data={people}
                        roles={roles}
                        userRoleCode={auth.user.role_code}
                    />
                </div>
            </div>
            {selectedPerson && (
                <>
                    <EditPerson isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} person={selectedPerson} roles={roles} companies={companies} userRoleCode={auth.user.role_code} />
                    <DeletePerson isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} selectedItem={selectedPerson} />
                    <ActivatePerson isOpen={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen} selectedItem={selectedPerson} />
                    <ResetPassword isOpen={isResetDialogOpen} onOpenChange={setIsResetDialogOpen} selectedItem={selectedPerson} />
                </>
            )}
        </AppLayout>
    );
}
