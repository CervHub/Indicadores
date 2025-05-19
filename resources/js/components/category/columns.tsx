'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CategoryCompany {
    id: number;
    nombre: string;
    category_id: number;
    group_id?: number;
}

export interface Group {
    id: number;
    name: string;
    category_id: number;
}

export interface Category {
    id: number;
    nombre: string;
    category_companies: CategoryCompany[];
    is_categorized: string;
    is_risk: string;
    groups: Group[];
}

export const getColumns = (
    handleActionClick: (item: CategoryCompany, action: string) => void,
    groups: Group[]
): ColumnDef<CategoryCompany>[] => [
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            const categoryCompany = row.original;
            return (
                <div className="flex space-x-2">
                    <Button
                        variant="warning"
                        className="h-8 w-8 p-0"
                        onClick={() => handleActionClick(categoryCompany, 'edit')}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    {/* <Button
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => handleActionClick(categoryCompany, 'delete')}
                    >
                        <Trash className="h-4 w-4" />
                    </Button> */}
                </div>
            );
        },
    },
    {
        accessorKey: 'nombre',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Nombre
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: 'group',
        header: 'Group',
        cell: ({ row }) => {
            const categoryCompany = row.original;
            const group = groups.find((g) => g.id === Number(categoryCompany.group_id));
            return <span>{group?.name || '-'}</span>;
        },
    },
];