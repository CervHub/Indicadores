import { DataTable } from '@/components/data-table';
import { getColumns } from '@/components/roles/columns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import * as React from 'react';
import RolePermission from './create'; // Import RolePermission
import RoleDelete from './delete'; // Import RoleDelete
import RoleUpdate from './update'; // Import RoleUpdate

// Define interfaces for roles, company ID, and users
interface Role {
    id: number;
    nombre: string;
}

interface Auth {
    user: {
        company_id: string;
    };
}

interface User {
    id: number;
    nombres: string;
    apellidos: string;
}

interface RoleUser {
    user_id: number;
    role_id: number;
    user_name: string;
    role_name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/contrata/personal',
    },
];

export default function Roles() {
    const { roles, users, auth, roleUsers } = usePage<{ roles: Role[]; users: User[]; auth: Auth; roleUsers: RoleUser[] }>().props;
    const [selectedPerson, setSelectedPerson] = React.useState<RoleUser | null>(null); // Update type to RoleUser
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = React.useState(false);
    const companyId = auth.user.company_id;

    const handleAction = (action: string, roleUser: RoleUser) => {
        setSelectedPerson(roleUser); // Set the selected RoleUser object

        if (action === 'eliminar') {
            console.log('Delete action triggered for:', roleUser);
            setIsDeleteDialogOpen(true);
        } else if (action === 'editar') {
            console.log('Update action triggered for:', roleUser);
            setIsUpdateDialogOpen(true);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            {companyId === '1' && (
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <RolePermission users={users.map(user => ({ value: user.id.toString(), label: `${user.nombres} ${user.apellidos}` }))}
                        roles={roles.map(role => ({ value: role.id.toString(), label: role.nombre }))} />
                    <DataTable columns={getColumns(handleAction)} data={roleUsers} />
                    {selectedPerson && (
                        <>
                            <RoleDelete isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} selectedItem={selectedPerson} />
                            <RoleUpdate isOpen={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen} selectedItem={selectedPerson} roles={roles.map(role => ({ value: role.id.toString(), label: role.nombre }))} />
                        </>
                    )}
                </div>
            )}
        </AppLayout>
    );
}