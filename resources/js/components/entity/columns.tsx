'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

// Este tipo define la forma de nuestros datos.
export type Entity = {
    id: string;
    name: string;
    estado: number;
};

export const getColumns = (): ColumnDef<Entity>[] => [
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
            return <Badge variant={estado === 1 ? 'default' : 'destructive'}>{estado === 1 ? 'Activa' : 'No Activa'}</Badge>;
        },
    },
];
