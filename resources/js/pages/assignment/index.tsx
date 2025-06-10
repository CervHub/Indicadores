import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import CreateAssignment from './create';
import { DataTable } from '@/components/assignment/data-table';
import { getColumns } from '@/components/assignment/columns';
import DeleteAssignment from './delete';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Asignaciones',
        href: '/assignments',
    },
];

export default function AssignmentDashboard() {
    const { assignments, users, companies } = usePage<{
        assignments: any[];
        users: any[];
        companies: any[];
    }>().props;

    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleActionClick = useCallback(
        (action: string, id: number) => {
            const assignment = assignments.find(a => a.id === id);
            
            switch (action) {
                case 'editar':
                    // TODO: Abrir modal de edición
                    break;
                case 'eliminar':
                    console.log('Eliminar asignación:', assignment);
                    setSelectedAssignment(assignment);
                    setIsDeleteOpen(true);
                    break;
            }
        },
        [assignments],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Asignaciones" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <CreateAssignment users={users} companies={companies} />
                </div>
                <DataTable columns={getColumns(handleActionClick)} data={assignments} />
                
                {selectedAssignment && (
                    <DeleteAssignment
                        assignment={selectedAssignment}
                        isDialogOpen={isDeleteOpen}
                        setIsDialogOpen={setIsDeleteOpen}
                    />
                )}
            </div>
        </AppLayout>
    );
}
