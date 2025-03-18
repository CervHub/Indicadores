import { getColumns, Person } from '@/components/person/columns';
import { DataTable } from '@/components/reportability/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import CreatePerson from './create';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Personal',
        href: '/contrata/personal',
    },
];

export default function ReportabilityPage() {
    const { people } = usePage<{ reportabilities: Person[] }>().props;

    console.log('People: ', people);

    const handleAction = (action: string, id: number) => {
        console.log(`Action: ${action}, ID: ${id}`);
        // Aquí puedes agregar la lógica adicional que necesites
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personal" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CreatePerson />
                <div className="w-full max-w-full overflow-x-auto">
                    <DataTable columns={getColumns(handleAction)} data={people} />
                </div>
            </div>
        </AppLayout>
    );
}
