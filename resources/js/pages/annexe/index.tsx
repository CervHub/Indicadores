import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CreateAnnex from './create';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Anexos',
        href: '/annexe',
    },
];

export default function ContractorDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contratistas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CreateAnnex />
            </div>
        </AppLayout>
    );
}
