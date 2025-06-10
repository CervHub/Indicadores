import { Entity, getColumns, ActionType, HandleAction } from '@/components/entity/columns';
import { DataTable } from '@/components/entity/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import CreateManagement from './create';
import ManagementUpdate from './update';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gerencias',
        href: '/management',
    },
];

export default function Management() {
    const { entities } = usePage<{ entities: Entity[] }>().props;
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

    const handleAction: HandleAction = (action: ActionType, item: Entity) => {
        switch (action) {
            case 'edit':
                setSelectedEntity(item);
                setIsUpdateOpen(true);
                break;
            default:
                break;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerencias" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <CreateManagement />
                </div>
                <DataTable columns={getColumns(handleAction)} data={entities} />

                {selectedEntity && (
                    <ManagementUpdate
                        isOpen={isUpdateOpen}
                        onOpenChange={setIsUpdateOpen}
                        selectedItem={{
                            id: selectedEntity.id,
                            nombre: selectedEntity.nombre,
                            estado: selectedEntity.estado,
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}
