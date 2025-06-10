'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit } from 'lucide-react';

// Este tipo define la forma de nuestros datos.
export type Entity = {
    id: string;
    nombre: string;
    estado: number | string;
    updated_at: string;
};

export type ActionType = 'edit' | 'delete' | 'view';

export type HandleAction = (action: ActionType, item: Entity) => void;

export const getColumns = (handleAction?: HandleAction): ColumnDef<Entity>[] => [
    {
        accessorKey: 'orden',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Orden
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.index + 1, // Orden ficticio basado en el índice de la fila
    },
    {
        accessorKey: 'nombre',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
            const estado = row.original.estado;
            const isActive = estado === 1 || estado === '1';
            return <Badge variant={isActive ? 'default' : 'destructive'}>{isActive ? 'Activa' : 'No Activa'}</Badge>;
        },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Fecha de Modificación
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.original.updated_at);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            const entity = row.original;
            
            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleAction?.('edit', entity)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
