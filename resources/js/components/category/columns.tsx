'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

export interface CategoryCompany {
    id: number;
    nombre: string;
    category_id: number;
}

export interface Category {
    id: number;
    nombre: string;
    category_companies: CategoryCompany[];
}

export const getColumns = (handleActionClick: (item: CategoryCompany, action: string) => void): ColumnDef<CategoryCompany>[] => [
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
    // {
    //     id: 'actions',
    //     header: 'Acciones',
    //     cell: ({ row }) => {
    //         const categoryCompany = row.original;
    //         return (
    //             <div className="flex space-x-2">
    //                 <Button variant="warning" className="h-8 w-8 p-0" onClick={() => handleActionClick(categoryCompany, 'edit')}>
    //                     <Edit className="h-4 w-4" />
    //                 </Button>
    //                 <Button variant="destructive" className="h-8 w-8 p-0" onClick={() => handleActionClick(categoryCompany, 'delete')}>
    //                     <Trash className="h-4 w-4" />
    //                 </Button>
    //             </div>
    //         );
    //     },
    // },
];
