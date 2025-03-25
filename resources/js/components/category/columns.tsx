'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CategoryCompany {
    id: number;
    name: string;
    category_id: number;
}

interface Category {
    id: number;
    name: string;
    category_companies: CategoryCompany[];
}

export const getColumns = (handleActionClick: (id: number, action: string) => void): ColumnDef<CategoryCompany>[] => [
    {
        accessorKey: 'name',
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
        accessorKey: 'category_id',
        header: 'Category ID',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const categoryCompany = row.original;

            return (
                <div className="flex space-x-2">
                    <Button variant="secondary" className="h-8 w-8 p-0" onClick={() => handleActionClick(categoryCompany.id, 'detail')}>
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="warning" className="h-8 w-8 p-0" onClick={() => handleActionClick(categoryCompany.id, 'edit')}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" className="h-8 w-8 p-0" onClick={() => handleActionClick(categoryCompany.id, 'delete')}>
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
