'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type Company = {
    id: string;
    nombre: string;
    ruc: string;
    estado: string;
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

export const getColumns = (handleActionClick: (id: string, action: string) => void): ColumnDef<Company>[] => [
    {
        accessorKey: 'nombre',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'ruc',
        header: 'RUC',
        cell: ({ row }) => row.original.ruc || 'N/A',
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => (
            <Badge variant={row.original.estado == '1' ? 'success' : 'destructive'}>{row.original.estado == '1' ? 'Activa' : 'Inactiva'}</Badge>
        ),
    },
    // {
    //     id: 'actions',
    //     header: 'Acciones',
    //     cell: ({ row }) => {
    //         const company = row.original;

    //         return (
    //             <div className="flex gap-2">
    //                 <Button
    //                     aria-label="Eliminar"
    //                     className="h-7 bg-red-700 p-2 text-xs text-white hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-800"
    //                     onClick={() => handleActionClick(company, 'e-c')}
    //                 >
    //                     <Trash2 className="h-3 w-3" />
    //                 </Button>
    //             </div>
    //         );
    //     },
    // },
];
