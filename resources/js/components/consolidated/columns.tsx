'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Este tipo define la forma de nuestros datos.
export type Consolidated = {
    id: string;
    user_id: string;
    year: number;
    month: number;
    is_closed: boolean;
    file_sx_ew: string;
    file_accumulation: string;
    file_concentrator: string;
};

export const getColumns = (): ColumnDef<Consolidated>[] => [
    {
        accessorKey: 'user_id',
        header: 'User ID',
    },
    {
        accessorKey: 'year',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Year
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
    },
    {
        accessorKey: 'month',
        header: 'Month',
    },
    {
        accessorKey: 'is_closed',
        header: 'Is Closed',
        cell: ({ row }) => (row.original.is_closed ? 'Yes' : 'No'),
    },
    {
        accessorKey: 'file_sx_ew',
        header: 'File SX EW',
    },
    {
        accessorKey: 'file_accumulation',
        header: 'File Accumulation',
    },
    {
        accessorKey: 'file_concentrator',
        header: 'File Concentrator',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const consolidated = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(consolidated.id)}>Copy ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
