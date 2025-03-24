'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash, Eye, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

// Este tipo define la forma de nuestros datos.
export type Contractor = {
    id: string;
    ruc: string;
    nombre: string;
    email: string;
    estado: string; // Añadido el campo estado
};

export const getColumns = (handleActionClick: (id: string, action: string) => void): ColumnDef<Contractor>[] => [
    {
        accessorKey: 'nombre',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Nombre
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
    },
    {
        accessorKey: 'ruc',
        header: 'RUC',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const contractor = row.original;

            return (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => handleActionClick(contractor.id, 'detail')}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => handleActionClick(contractor.id, 'edit')}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    {contractor.estado === '0' ? (
                        <Button
                            variant="success"
                            className="h-8 w-8 p-0"
                            onClick={() => handleActionClick(contractor.id, 'activate')}
                        >
                            <CheckCircle className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => handleActionClick(contractor.id, 'delete')}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            );
        },
    },
];
