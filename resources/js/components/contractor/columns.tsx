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
export type Contractor = {
    id: string;
    name: string;
    business_name?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    city?: string;
    country?: string;
    ruc_number: string;
    contractor_company_type_id: string;
};

interface ContractorCompanyType {
    id: number;
    name: string;
}

export const getColumns = (contractorCompanyTypes: ContractorCompanyType[]): ColumnDef<Contractor>[] => [
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
        accessorKey: 'descripcion',
        header: 'Business Name',
    },
    {
        accessorKey: 'ruc',
        header: 'RUC Number',
    },
    {
        accessorKey: 'email',
        header: 'Contractor Company Type',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const contractor = row.original;

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(contractor.id)}>Copy contractor ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View contractor</DropdownMenuItem>
                        <DropdownMenuItem>Edit contractor</DropdownMenuItem>
                        <DropdownMenuItem>Delete contractor</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
