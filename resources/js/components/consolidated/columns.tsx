'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download, Lock, RefreshCw, Unlock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { findFieldByValue, months } from '@/lib/utils';

export type Consolidated = {
    id: string;
    user_id: string;
    year: number;
    month: number;
    is_closed: number;
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
        header: 'Cerrado',
        cell: ({ row }) => (
            <Badge variant={row.original.is_closed == 1 ? 'destructive' : 'default'}>{row.original.is_closed == 1 ? 'Yes' : 'No'}</Badge>
        ),
    },
    {
        id: 'downloads',
        header: 'Descargas',
        cell: ({ row }) => {
            const consolidated = row.original;

            return (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <Button onClick={() => handleDonwloadClick(consolidated.id, 'file_sx_ew')}>
                        <Download className="mr-2 h-4 w-4" />
                        Lixiviacion
                    </Button>
                    <Button onClick={() => handleDonwloadClick(consolidated.id, 'file_accumulation')}>
                        <Download className="mr-2 h-4 w-4" />
                        Acumulacion
                    </Button>
                    <Button onClick={() => handleDonwloadClick(consolidated.id, 'file_concentrator')}>
                        <Download className="mr-2 h-4 w-4" />
                        Concentradora
                    </Button>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            const consolidated = row.original;

            return (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <Button variant="secondary" onClick={() => handleActionClick(consolidated.id, 'reconsolidate')}>
                        <RefreshCw className="h-4 w-4" />
                        Actualizar
                    </Button>
                    <Button
                        variant={consolidated.is_closed == 1 ? 'default' : 'destructive'}
                        onClick={() => handleActionClick(consolidated.id, consolidated.is_closed == 1 ? 'open' : 'close')}
                    >
                        {consolidated.is_closed == 1 ? (
                            <>
                                <Unlock className="h-4 w-4" />
                                Abrir
                            </>
                        ) : (
                            <>
                                <Lock className="h-4 w-4" />
                                Cerrar
                            </>
                        )}
                    </Button>
                </div>
            );
        },
    },
];
