'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDateTime, months } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download, FileText } from 'lucide-react';

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
    annex24: string;
    annex25: string;
    annex26: string;
    annex27: string;
    annex28: string;
    annex30: string;
    minem_template_1: string;
    minem_template_2: string;
    minem_template1: object;
    minem_template2: object;
    is_old: boolean;
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

const getBadgeVariant = (percentage: number) => {
    if (percentage === 0) return 'destructive';
    if (percentage === 100) return 'default';
    return 'secondary';
};

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
                    Year
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'annexes',
        header: 'Anexos',
        cell: ({ row }) => {
            const annexes = [
                row.original.annex24,
                row.original.annex25,
                row.original.annex26,
                row.original.annex27,
                row.original.annex28,
                row.original.annex30,
            ];
            const completed = annexes.filter((annex) => annex === 'true' || annex === '1').length;
            const percentage = ((completed / annexes.length) * 100).toFixed(0);
            const variant = getBadgeVariant(Number(percentage));
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge variant={variant}>{`${percentage}%`}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Annex 24: {row.original.annex24}</p>
                            <p>Annex 25: {row.original.annex25}</p>
                            <p>Annex 26: {row.original.annex26}</p>
                            <p>Annex 27: {row.original.annex27}</p>
                            <p>Annex 28: {row.original.annex28}</p>
                            <p>Annex 30: {row.original.annex30}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: 'minem_templates',
        header: 'Minems',
        cell: ({ row }) => {
            const templates = [row.original.minem_template_1, row.original.minem_template_2];
            const completed = templates.filter((template) => template === 'true' || template === '1').length;
            const percentage = ((completed / templates.length) * 100).toFixed(0);
            const variant = getBadgeVariant(Number(percentage));
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge variant={variant}>{`${percentage}%`}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Minem Template 1: {row.original.minem_template_1}</p>
                            <p>Minem Template 2: {row.original.minem_template_2}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
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
                    <Link href={route('annexes.show', { annex: fileStatus.id })}>
                        <Button variant="default" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Detalle
                        </Button>
                    </Link>
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
