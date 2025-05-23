import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CreateVehicle from './create';
import DestroyVehicle from './destroy';
import EditVehicle from './edit';
import LinkVehicle from './link';
import TableCard from './table';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Vehículos',
        href: '/vehiculos',
    },
];


export default function Vehicle() {
    const { vehicles, auth, company } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [destroyDialogOpen, setDestroyDialogOpen] = useState(false);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);


    console.log('Company', company);

    const handleAction = (item: any, action: string) => {
        if (action === 'desvincular') {
            setSelectedVehicle(item);
            setDestroyDialogOpen(true);
        } else if (action === 'actualizar') {
            setSelectedVehicle(item);
            setEditDialogOpen(true);
        } else if (action === 'vincular') {
            setSelectedVehicle(item);
            setLinkDialogOpen(true);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehículos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-start">
                    <Button className="w-auto" onClick={() => setIsDialogOpen(true)}>
                        Registrar Vehículo
                    </Button>
                </div>
                <div className="flex-1">
                    <TableCard data={vehicles} onAction={handleAction} />
                </div>
            </div>
            <CreateVehicle isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} companyId={auth.user.company_id}
                companyCode={company?.code}
            />
            {selectedVehicle && (
                <>
                    <EditVehicle
                        isDialogOpen={editDialogOpen}
                        setIsDialogOpen={setEditDialogOpen}
                        vehicle={selectedVehicle}
                        companyCode={company?.code}

                    />
                    <DestroyVehicle
                        isDialogOpen={destroyDialogOpen}
                        setIsDialogOpen={setDestroyDialogOpen}
                        vehicle={selectedVehicle}
                    />
                    <LinkVehicle
                        isDialogOpen={linkDialogOpen}
                        setIsDialogOpen={setLinkDialogOpen}
                        vehicle={selectedVehicle}
                        companyId={auth.user.company_id}
                    />
                </>
            )}
        </AppLayout>
    );
}
