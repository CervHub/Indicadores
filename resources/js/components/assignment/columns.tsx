'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export type Assignment = {
    id: number;
    user_id: number;
    company_id: number;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        nombres: string;
        apellidos: string;
        doi: string;
        email: string;
    };
    company?: {
        id: number;
        nombre: string;
        ruc: string;
    };
};

export const getColumns = (handleAction: (action: string, id: number) => void): ColumnDef<Assignment>[] => [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.original.id,
    },
    {
        id: 'nombres',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nombres
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const user = row.original.user;
            return user ? user.nombres : 'N/A';
        },
        sortingFn: (rowA, rowB) => {
            const nameA = rowA.original.user?.nombres || '';
            const nameB = rowB.original.user?.nombres || '';
            return nameA.localeCompare(nameB);
        },
    },
    {
        id: 'apellidos',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Apellidos
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const user = row.original.user;
            return user ? user.apellidos : 'N/A';
        },
        sortingFn: (rowA, rowB) => {
            const nameA = rowA.original.user?.apellidos || '';
            const nameB = rowB.original.user?.apellidos || '';
            return nameA.localeCompare(nameB);
        },
    },
    {
        id: 'dni',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    DNI
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const user = row.original.user;
            return user ? user.doi : 'N/A';
        },
    },
    {
        id: 'empresa',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Empresa
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const company = row.original.company;
            return company ? company.nombre : 'N/A';
        },
        sortingFn: (rowA, rowB) => {
            const companyA = rowA.original.company?.nombre || '';
            const companyB = rowB.original.company?.nombre || '';
            return companyA.localeCompare(companyB);
        },
    },
    {
        id: 'ruc',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    RUC
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const company = row.original.company;
            return company ? company.ruc : 'N/A';
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Fecha Creación
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return formatDateTime(row.original.created_at);
        },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Fecha Modificación
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return formatDateTime(row.original.updated_at);
        },
    },
    {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
            const id = row.original.id;
            return (
                <div className="flex space-x-1">

                    <Button
                        aria-label="Eliminar"
                        className="h-7 bg-red-700 p-2 text-xs text-white hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-800"
                        onClick={() => handleAction('eliminar', id)}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            );
        },
    },
];
