'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download, Eye, Lock, RefreshCw, Unlock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { findFieldByValue, formatDateTime, months } from '@/lib/utils';
import { Link } from '@inertiajs/react';

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
    roleCode: string,
): ColumnDef<Consolidated>[] => {
    const columns: ColumnDef<Consolidated>[] = [
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
            cell: ({ row }) => <Button variant="ghost">{findFieldByValue(months, 'value', row.original.month, 'label') || 'N/A'}</Button>,
        },
        {
            accessorKey: 'is_closed',
            header: 'Estado',
            cell: ({ row }) => (
                <Button variant="ghost" className={`icon-background ${row.original.is_closed == 1 ? 'closed' : 'open'}`}>
                    {row.original.is_closed == 1 ? <Lock className="h-8 w-8" /> : <Unlock className="h-8 w-8" />}
                </Button>
            ),
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
                    <div className="flex gap-2">
                        {roleCode === 'CA' && (
                            <>
                                <Button
                                    variant="secondary"
                                    className="w-auto"
                                    onClick={() => handleActionClick(consolidated.id, 'reconsolidate')}
                                    disabled={consolidated.is_closed == 1}
                                >
                                    <RefreshCw className="h-4" />
                                </Button>
                                <Button
                                    variant={consolidated.is_closed == 1 ? 'default' : 'destructive'}
                                    className="w-auto"
                                    onClick={() => handleActionClick(consolidated.id, consolidated.is_closed == 1 ? 'open' : 'close')}
                                >
                                    {consolidated.is_closed == 1 ? <Unlock className="h-4" /> : <Lock className="h-4" />}
                                </Button>
                            </>
                        )}
                        <Link href={route('consolidated.show', { id: consolidated.id })}>
                            <Button variant="secondary" className="w-auto">
                                <Eye className="h-4" />
                            </Button>
                        </Link>
                    </div>
                );
            },
        },
    ];

    // Solo agrega las columnas de archivos si el rol es CA
    if (roleCode === 'CA') {
        columns.splice(3, 0,
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
            }
        );
    }

    return columns;
};
