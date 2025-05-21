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

export function DataTable<TData extends { nombre?: string; ruc?: string; estado?: string; anexos?: any[] }, TValue>({
    columns,
    data,
    ueas = [],
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [estadoFilter, setEstadoFilter] = React.useState<string>('__all__');
    const [ueaFilter, setUeaFilter] = React.useState<string>('__all__');

    // Filtro personalizado por nombre, ruc, estado y uea
    const filteredData = React.useMemo(() => {
        let filtered = data;
        if (globalFilter) {
            const filter = globalFilter.toLowerCase();
            filtered = filtered.filter((row) =>
                (row.nombre && row.nombre.toLowerCase().includes(filter)) ||
                (row.ruc && row.ruc.toLowerCase().includes(filter))
            );
        }
        if (estadoFilter && estadoFilter !== '__all__') {
            filtered = filtered.filter(row => row.estado === estadoFilter);
        }
        if (ueaFilter && ueaFilter !== '__all__') {
            filtered = filtered.filter(row =>
                Array.isArray(row.anexos) &&
                row.anexos.some((u: any) => String(u.uea) === ueaFilter)
            );
        }
        return filtered;
    }, [data, globalFilter, estadoFilter, ueaFilter]);

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

    // Opciones de estado únicas
    const estadoOptions = React.useMemo(() => {
        const estados = Array.from(new Set(data.map(row => row.estado).filter(Boolean)));
        return estados;
    }, [data]);

    console.log('UEA Options:', ueas);
    // Opciones de UEA únicas (por nombre)
    const ueaOptions = React.useMemo(() => {
        if (ueas && ueas.length > 0) {
            // Si las ueas tienen {id, name,...}, usar solo el nombre
            if (ueas[0] && 'name' in ueas[0]) {
                return ueas.map((u: any) => ({ value: u.name, label: u.name }));
            }
            return ueas;
        }
        // Si no se pasa ueas, calcular de los anexos
        const set = new Set<string>();
        data.forEach(row => {
            if (Array.isArray(row.anexos)) {
                row.anexos.forEach((anexo: any) => {
                    if (anexo.uea) set.add(anexo.uea);
                });
            }
        });
        return Array.from(set).map(u => ({ value: u, label: u }));
    }, [data, ueas]);

    return (
        <div>
            <div className="flex flex-wrap items-center py-4 gap-4">
                <Input
                    placeholder="Filtrar por nombre o RUC..."
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                    <label className="text-sm">Estado</label>
                    <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                        <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">Todos</SelectItem>
                            {estadoOptions.map((estado) => (
                                <SelectItem key={estado} value={String(estado)}>
                                    {estado}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
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
