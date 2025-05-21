'use client';
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    ueas?: { value: string; label: string }[]; // Opcional, para el select de UEA
}

export function DataTable<TData extends { uea?: string; company?: string; anexos?: any[] }, TValue>({
    columns,
    data,
    ueas = [],
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [ueaFilter, setUeaFilter] = React.useState<string>('__all__');
    const [companySearch, setCompanySearch] = React.useState<string>('');

    // Filtro personalizado por UEA (texto exacto) y búsqueda de compañía (texto libre)
    const filteredData = React.useMemo(() => {
        let filtered = data;
        if (ueaFilter && ueaFilter !== '__all__') {
            filtered = filtered.filter(row =>
                row.uea === ueaFilter
            );
        }
        if (companySearch && companySearch.trim() !== '') {
            const search = companySearch.trim().toLowerCase();
            filtered = filtered.filter(row =>
                row.company && row.company.toLowerCase().includes(search)
            );
        }
        return filtered;
    }, [data, ueaFilter, companySearch]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter,
        },
    });

    // Opciones de UEA únicas (por texto exacto)
    const ueaOptions = React.useMemo(() => {
        if (ueas && ueas.length > 0) {
            if (ueas[0] && 'name' in ueas[0]) {
                return ueas.map((u: any) => ({ value: u.name, label: u.name }));
            }
            return ueas;
        }
        const set = new Set<string>();
        data.forEach(row => {
            if (row.uea) set.add(row.uea);
        });
        return Array.from(set).map(u => ({ value: u, label: u }));
    }, [data, ueas]);

    return (
        <div>
            <div className="flex flex-wrap items-center py-4 gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm">UEA</label>
                    <Select value={ueaFilter} onValueChange={setUeaFilter}>
                        <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">Todas</SelectItem>
                            {ueaOptions.map((u) => (
                                <SelectItem key={u.value} value={u.value}>
                                    {u.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Input
                    placeholder="Buscar por Contrata..."
                    value={companySearch}
                    onChange={e => setCompanySearch(e.target.value)}
                    className="max-w-xs"
                />
            </div>
            <div className="grid grid-cols-1 rounded-md border">
                <Table className="text-xs">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    );
}
