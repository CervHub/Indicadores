'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download, Lock, RefreshCw, Unlock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { findFieldByValue, formatDateTime, months } from '@/lib/utils';

export type Consolidated = {
    id: string;
    user_id: string;
    year: number;
    month: number;
    is_closed: number;
    file_sx_ew: string;
    file_accumulation: string;
    file_concentrator: string;
    created_at: string;
    updated_at: string;
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

export const getColumns = (
    handleActionClick: (id: string, action: string) => void,
    handleDonwloadClick: (id: string, uea: string) => void,
): ColumnDef<Consolidated>[] => [
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
        header: 'Estado',
        cell: ({ row }) => (row.original.is_closed == 1 ? <Lock className="h-6 w-6" /> : <Unlock className="h-6 w-6" />),
    },
    {
        id: 'file_sx_ew',
        header: 'Lixiviacion',
        cell: ({ row }) => {
            const consolidated = row.original;
            return (
                <div className="text-center">
                    <Button onClick={() => handleDonwloadClick(consolidated.id, 'file_sx_ew')}>
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
    {
        id: 'file_accumulation',
        header: 'Acumulacion',
        cell: ({ row }) => {
            const consolidated = row.original;
            return (
                <div className="text-center">
                    <Button onClick={() => handleDonwloadClick(consolidated.id, 'file_accumulation')}>
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
    {
        id: 'file_concentrator',
        header: 'Concentradora',
        cell: ({ row }) => {
            const consolidated = row.original;
            return (
                <div className="text-center">
                    <Button onClick={() => handleDonwloadClick(consolidated.id, 'file_concentrator')}>
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
    {
        id: 'update_at',
        header: 'Actualizado',
        cell: ({ row }) => formatDateTime(row.original.updated_at),
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            const consolidated = row.original;

            return (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <Button variant="secondary" className="w-auto" onClick={() => handleActionClick(consolidated.id, 'reconsolidate')}>
                        <RefreshCw className="h-4" />
                        Actualizar
                    </Button>
                    <Button
                        variant={consolidated.is_closed == 1 ? 'default' : 'destructive'}
                        className="w-auto"
                        onClick={() => handleActionClick(consolidated.id, consolidated.is_closed == 1 ? 'open' : 'close')}
                    >
                        {consolidated.is_closed == 1 ? (
                            <>
                                <Unlock className="h-4" />
                                Abrir
                            </>
                        ) : (
                            <>
                                <Lock className="h-4" />
                                Cerrar
                            </>
                        )}
                    </Button>
                </div>
            );
        },
    },
];
