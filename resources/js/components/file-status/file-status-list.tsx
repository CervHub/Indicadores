'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime, months } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download } from 'lucide-react';

// Este tipo define la forma de nuestros datos.
export type FileStatus = {
    id: number;
    contractor_company_id: string;
    contractor_company_type_id: string;
    uea_id: string;
    user_id: string;
    month: string;
    year: string;
    file: string;
    is_old: number;
    created_at: string;
    updated_at: string;
};

interface ContractorCompanyType {
    id: number;
    name: string;
}

interface Uea {
    id: number;
    name: string;
}

export const getColumns = (contractorCompanyTypes: ContractorCompanyType[], ueas: Uea[]): ColumnDef<FileStatus>[] => [
    {
        accessorKey: 'contractor_company_type_id',
        header: 'T. Cliente',
        cell: ({ row }) => {
            const type = contractorCompanyTypes.find((type) => type.id === Number(row.original.contractor_company_type_id));
            return type ? type.name : 'Unknown';
        },
    },
    {
        accessorKey: 'uea_id',
        header: 'UEA',
        cell: ({ row }) => {
            const uea = ueas.find((uea) => uea.id === Number(row.original.uea_id));
            return uea ? uea.name : 'Unknown';
        },
    },
    {
        accessorKey: 'month',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Mes
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const month = months.find((month) => Number(month.value) === Number(row.original.month));
            return month ? month.label : 'Unknown';
        },
    },
    {
        accessorKey: 'year',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Año
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'is_old',
        header: 'Ultima Versión',
        cell: ({ row }) => {
            return <Badge variant={row.original.is_old == 1 ? 'warning' : 'success'}>{row.original.is_old == 1 ? 'No' : 'Si'}</Badge>;
        },
    },
    {
        accessorKey: 'F. Creación',
        header: 'F. Creación',
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return formatDateTime(date);
        },
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            const fileStatus = row.original;

            const handleDownloadClick = (file: string) => {
                console.log(`Downloading file from: ${window.location.origin}/${file}`);
            };

            const fileUrl = `${window.location.origin}/${fileStatus.file}`;

            return (
                <div>
                    <a href={fileUrl} download onClick={() => handleDownloadClick(fileStatus.file)}>
                        <Button variant="destructive" size="sm" className="ml-2">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar
                        </Button>
                    </a>
                </div>
            );
        },
    },
];
