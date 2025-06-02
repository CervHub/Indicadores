'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, CheckCircle, Edit, Key, Trash2 } from 'lucide-react';

export type Person = {
    id: number;
    doi: string;
    email: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    estado: string;
    created_at: string;
    updated_at: string;
    cargo: string;
    role_id: number;
    role?: {
        id: number;
        nombre: string;
        code: string;
    };
};

export const getColumns = (handleAction: (action: string, id: number) => void): ColumnDef<Person>[] => [
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
        id: 'nombre_completo',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nombre Completo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return `${row.original.nombres} ${row.original.apellidos}`;
        },
        sortingFn: (rowA, rowB) => {
            const nameA = `${rowA.original.nombres} ${rowA.original.apellidos}`;
            const nameB = `${rowB.original.nombres} ${rowB.original.apellidos}`;
            return nameA.localeCompare(nameB);
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'role',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Rol
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const role = row.original.role;
            return role?.nombre || 'Sin rol';
        },
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
            const date = new Date(row.original.updated_at);
            return date.toLocaleString('es-ES');
        },
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
            const estado = row.original.estado;
            return <Badge variant={estado === '1' ? 'default' : 'destructive'}>{estado === '1' ? 'Activo' : 'No Activo'}</Badge>;
        },
    },
    {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
            const id = row.original.id;
            const estado = row.original.estado;
            return (
                <div className="flex flex-wrap space-x-2">
                    <Button
                        aria-label="Restablecer Contraseña"
                        className="h-7 bg-blue-700 p-2 text-xs text-white hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-800"
                        onClick={() => handleAction('reset', id)}
                    >
                        <Key className="h-3 w-3" /> {/* Ícono de Lucide React */}
                    </Button>
                    <Button
                        aria-label="Editar"
                        className="h-7 bg-yellow-700 p-2 text-xs text-white hover:bg-yellow-900 dark:bg-yellow-600 dark:hover:bg-yellow-800"
                        onClick={() => handleAction('editar', id)}
                    >
                        <Edit className="h-3 w-3" />
                    </Button>
                    {estado !== '1' && (
                        <Button
                            aria-label="Activar"
                            className="h-7 bg-green-700 p-2 text-xs text-white hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-800"
                            onClick={() => handleAction('activar', id)}
                        >
                            <CheckCircle className="h-3 w-3" />
                        </Button>
                    )}
                    {estado === '1' && (
                        <Button
                            aria-label="Eliminar"
                            className="h-7 bg-red-700 p-2 text-xs text-white hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-800"
                            onClick={() => handleAction('eliminar', id)}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            );
        },
    },
];
