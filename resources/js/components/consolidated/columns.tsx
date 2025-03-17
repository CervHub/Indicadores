'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { findFieldByValue, months } from '@/lib/utils';

export type Consolidated = {
    id: string;
    user_id: string;
    year: number;
    month: number;
    is_closed: boolean;
    file_sx_ew: string;
    file_accumulation: string;
    file_concentrator: string;
};

const renderTooltip = (field: string, value: string) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <span>{value}</span>
            </TooltipTrigger>
            <TooltipContent>
                <p>{field}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export const getColumns = (onReconsolidateClick: (id: string) => void): ColumnDef<Consolidated>[] => [
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
        accessorKey: 'month',
        header: 'Month',
        cell: ({ row }) => findFieldByValue(months, 'value', row.original.month, 'label') || 'N/A',
    },
    {
        accessorKey: 'is_closed',
        header: 'Cerrado',
        cell: ({ row }) => <Badge variant={row.original.is_closed ? 'destructive' : 'default'}>{row.original.is_closed ? 'Yes' : 'No'}</Badge>,
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            const consolidated = row.original;

            return (
                <div className="flex space-x-2">
                    <Button onClick={() => downloadFile(consolidated.file_sx_ew)}>
                        <Download className="mr-2 h-4 w-4" />
                        Lixiviacion
                    </Button>
                    <Button onClick={() => downloadFile(consolidated.file_accumulation)}>
                        <Download className="mr-2 h-4 w-4" />
                        Acumulacion
                    </Button>
                    <Button onClick={() => downloadFile(consolidated.file_concentrator)}>
                        <Download className="mr-2 h-4 w-4" />
                        Concentradora
                    </Button>
                    <Button variant="secondary" onClick={() => onReconsolidateClick(consolidated.id)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reconsolidar
                    </Button>
                    <Button variant="destructive" onClick={() => downloadWinrar(consolidated.id)}>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar WinRAR
                    </Button>
                </div>
            );
        },
    },
];

const downloadFile = (filePath: string) => {
    const origin = window.location.origin;
    const fullPath = `${origin}/${filePath}`;
    console.log(`Downloading file from: ${fullPath}`);
    const link = document.createElement('a');
    link.href = fullPath;
    link.download = filePath.split('/').pop() || 'default_filename';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const downloadWinrar = (id: string) => {
    const origin = window.location.origin;
    const fullPath = `${origin}/consolidated/download/${id}`;
    console.log(`Downloading WinRAR from: ${fullPath}`);
    const link = document.createElement('a');
    link.href = fullPath;
    link.download = `consolidated_${id}.rar`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
