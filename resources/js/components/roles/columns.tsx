'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';

export type RoleUser = {
    user_id: number;
    role_id: number;
    user_name: string;
    role_name: string;
    created_at: string; // Add created_at field
    updated_at: string; // Add updated_at field
    doi: string; // Add doi field
};

export const getColumns = (handleAction: (action: string, id: number) => void): ColumnDef<RoleUser>[] => [
    {
        accessorKey: 'user_name',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Usuario
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.original.user_name,
    },
    {
        accessorKey: 'doi',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    DNI
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.original.doi,
    },
    {
        accessorKey: 'role_name',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Rol
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.original.role_name,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Fecha y Hora de Creación
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            // Convert UTC to Peruvian timezone (UTC-5)
            const peruTime = new Date(date.getTime() - 5 * 60 * 60 * 1000);
            return peruTime.toLocaleString('es-PE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            });
        },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Última Actualización
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.original.updated_at);
            // Convert UTC to Peruvian timezone (UTC-5)
            const peruTime = new Date(date.getTime() - 5 * 60 * 60 * 1000);
            return peruTime.toLocaleString('es-PE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            });
        },
    },
    {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
            const roleUser = row.original; // Use the entire row object
            return (
                <div className="flex flex-wrap space-x-2">
                    <Button
                        aria-label="Editar"
                        className="h-7 bg-blue-700 p-2 text-xs text-white hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-800"
                        onClick={() => handleAction('editar', roleUser)}
                    >
                        <Edit className="h-3 w-3" /> {/* Icono de editar */}
                    </Button>
                    <Button
                        aria-label="Eliminar"
                        className="h-7 bg-red-700 p-2 text-xs text-white hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-800"
                        onClick={() => handleAction('eliminar', roleUser)}
                    >
                        <Trash2 className="h-3 w-3" /> {/* Icono de eliminar */}
                    </Button>
                </div>
            );
        },
    },
];
