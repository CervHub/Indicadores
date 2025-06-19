import { Contractor, getColumns } from '@/components/contractor/columns';
import { DataTable } from '@/components/contractor/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
    const [isExporting, setIsExporting] = useState(false);

    const { contractors, contractorCompanyTypes, ueas } = usePage<{
        contractors: Contractor[];
        contractorCompanyTypes: ContractorCompanyType[];
        ueas: any[];
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

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await fetch(route('contractor.export'), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
            });

            if (!response.ok) {
                throw new Error('Error al descargar el archivo');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `empresas_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Archivo descargado exitosamente');
        } catch (error) {
            toast.error('Error al descargar el archivo Excel');
        } finally {
            setIsExporting(false);
        }
    };

    console.log('contractors', contractors);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contratistas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <CreateContractor
                        ueas={ueas}
                        companyType={contractorCompanyTypes}
                    />
                    <Button
                        onClick={handleExport}
                        variant="outline"
                        className="inline-flex items-center gap-2"
                        disabled={isExporting}
                    >
                        {isExporting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        {isExporting ? 'Descargando...' : 'Descargar Excel'}
                    </Button>
                </div>
                <DataTable columns={getColumns(handleActionClick, ueas)} data={contractors} ueas={ueas} />
            </div>
            {contractor && (
                <>
                    <EditContractor contractor={contractor} isDialogOpen={isEditDialogOpen} setIsDialogOpen={setIsEditDialogOpen}
                        ueas={ueas}
                        companyType={contractorCompanyTypes}
                    />
                    <DeleteContractor isDialogOpen={isDeleteDialogOpen} setIsDialogOpen={setIsDeleteDialogOpen} contractor={contractor} />
                    <ActivateContractor isDialogOpen={isActivateDialogOpen} setIsDialogOpen={setIsActivateDialogOpen} contractor={contractor} />
                    <ViewContractor isDialogOpen={isViewDialogOpen} setIsDialogOpen={setIsViewDialogOpen} contractor={contractor} />
                </>
            )}
        </AppLayout>
    );
}
