import { Consolidated, getColumns } from '@/components/consolidated/columns';
import { DataTable } from '@/components/consolidated/data-table';
import useFlashMessages from '@/hooks/useFlashMessages';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CloseConsolidated from './close';
import CreateConsolidated from './create';
import OpenConsolidated from './open';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Consolidados',
        href: '/consolidated',
    },
];

export default function ConsolidatedDashboard() {
    const { consolidateds = [] } = usePage<{
        consolidateds: Consolidated[];
    }>().props;

    // Utiliza el hook personalizado para manejar los mensajes flash y de error
    useFlashMessages();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, so add 1

    const [modalOpen, setModalOpen] = useState(false);
    const [initialYear, setInitialYear] = useState<number>(currentYear);
    const [initialMonth, setInitialMonth] = useState<number>(currentMonth);
    const [openModal, setOpenModal] = useState(false);
    const [closeModal, setCloseModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Consolidated | null>(null);

    const handleActionClick = (id: string, action: string) => {
        const selectedConsolidated = consolidateds.find((consolidated) => consolidated.id === id);
        if (selectedConsolidated) {
            setSelectedItem(selectedConsolidated);
            switch (action) {
                case 'open':
                    console.log('Open consolidated: ', selectedConsolidated);
                    setOpenModal(true);
                    break;
                case 'close':
                    console.log('Close consolidated: ', selectedConsolidated);
                    setCloseModal(true);
                    break;
                case 'reconsolidate':
                    setModalOpen(true);
                    setInitialYear(selectedConsolidated.year);
                    setInitialMonth(selectedConsolidated.month);
                    break;
                default:
                    console.error('Unknown action: ', action);
            }
        } else {
            console.error('Consolidated not found for ID: ', id);
        }
    };

    const handleDonwloadClick = (id: string, uea: string) => {
        const selectedConsolidated = consolidateds.find((consolidated) => consolidated.id === id);
        if (selectedConsolidated) {
            const fileUrl = `${window.location.origin}/${selectedConsolidated[uea]}`;
            if (fileUrl) {
                console.log('File URL: ', fileUrl);
                fetch(fileUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = fileUrl.split('/').pop() || 'download';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        console.log('Download: ', selectedConsolidated, 'UEA: ', uea);
                    })
                    .catch((error) => console.error('Download error: ', error));
            } else {
                console.error('File URL not found for UEA: ', uea);
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Consolidados" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CreateConsolidated initialYear={initialYear} initialMonth={initialMonth} isOpen={modalOpen} onOpenChange={setModalOpen} />
                <div className="w-full max-w-full overflow-x-auto">
                    <DataTable columns={getColumns(handleActionClick, handleDonwloadClick)} data={consolidateds} />
                </div>
            </div>
            {selectedItem && (
                <>
                    <OpenConsolidated
                        isOpen={openModal}
                        onOpenChange={setOpenModal}
                        selectedItem={{ id: selectedItem.id, year: selectedItem.year, month: selectedItem.month.toString() }}
                    />
                    <CloseConsolidated
                        isOpen={closeModal}
                        onOpenChange={setCloseModal}
                        selectedItem={{ id: selectedItem.id, year: selectedItem.year, month: selectedItem.month.toString() }}
                    />
                </>
            )}
        </AppLayout>
    );
}
