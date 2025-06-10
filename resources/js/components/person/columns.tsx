'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, CheckCircle, Edit, Key, Trash2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
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
    company_id?: string;
    company_name?: string;
    company_ruc?: string;
    role?: {
        id: number;
        nombre: string;
        code: string;
    };
};

export const getColumns = (handleAction: (action: string, id: number) => void, roles: any[], userRoleCode?: string): ColumnDef<Person>[] => {
    const baseColumns: ColumnDef<Person>[] = [
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
            accessorKey: 'role_id',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Rol
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const roleId = row.original.role_id;
                const role = roles.find(r => r.id === roleId);
                return role?.nombre || 'Sin rol';
            },
            sortingFn: (rowA, rowB) => {
                const roleA = roles.find(r => r.id === rowA.original.role_id);
                const roleB = roles.find(r => r.id === rowB.original.role_id);
                const nameA = roleA?.nombre || 'Sin rol';
                const nameB = roleB?.nombre || 'Sin rol';
                return nameA.localeCompare(nameB);
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
    ];

    // Add company columns only for SA role
    if (userRoleCode === 'SA') {
        baseColumns.push(
            {
                accessorKey: 'company_ruc',
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            RUC
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => row.original.company_ruc || 'Sin RUC',
            },
            {
                accessorKey: 'company_name',
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Empresa
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => row.original.company_name || 'Sin empresa',
            }
        );
    }

    // Add remaining columns
    baseColumns.push(
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
                    <div className="flex space-x-1">
                        <Button
                            aria-label="Restablecer Contraseña"
                            className="h-7 bg-blue-700 p-2 text-xs text-white hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-800"
                            onClick={() => handleAction('reset', id)}
                        >
                            <Key className="h-3 w-3" />
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
        }
    );

    return baseColumns;
};
