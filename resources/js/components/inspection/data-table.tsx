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

// Opciones para tipo de inspección y estado
const TIPO_INSPECCION_OPTIONS = [
    { value: 'all', label: 'Todos' },
    { value: 'Inspección Diaria Pre-Uso', label: 'Inspección Diaria Pre-Uso' },
    { value: 'Inspección Trimestral', label: 'Inspección Trimestral' },
    { value: 'Inspección Semestral', label: 'Inspección Semestral' },
    { value: 'Inspección Anual', label: 'Inspección Anual' },
];

const ESTADO_OPTIONS = [
    { value: 'all', label: 'Todos' },
    { value: 'Generado', label: 'Generado' },
    { value: 'Revisado', label: 'Revisado' },
    { value: 'Finalizado', label: 'Finalizado' },
];

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'fecha_evento', desc: true }
    ]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [filters, setFilters] = React.useState({
        tipo_inspeccion_descripcion: 'all',
        nombre_usuario: '',
        nombre_empresa: '',
        estado: 'all',
    });

    // Filtro personalizado para los campos seleccionados
    const filteredData = React.useMemo(() => {
        return data.filter((row: any) => {
            const matchesTipo = filters.tipo_inspeccion_descripcion !== 'all'
                ? row.tipo_inspeccion_descripcion === filters.tipo_inspeccion_descripcion
                : true;
            const matchesUsuario = filters.nombre_usuario
                ? row.nombre_usuario?.toLowerCase().includes(filters.nombre_usuario.toLowerCase())
                : true;
            const matchesEmpresa = filters.nombre_empresa
                ? row.nombre_empresa?.toLowerCase().includes(filters.nombre_empresa.toLowerCase())
                : true;
            const matchesEstado = filters.estado !== 'all'
                ? row.estado === filters.estado
                : true;
            return matchesTipo && matchesUsuario && matchesEmpresa && matchesEstado;
        });
    }, [data, filters]);

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

    return (
        <div>
            {/* Filtros de búsqueda */}
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:gap-4">
                <div>
                    <label className="block text-xs font-semibold mb-1">Tipo Inspección</label>
                    <Select
                        value={filters.tipo_inspeccion_descripcion}
                        onValueChange={value => setFilters(f => ({ ...f, tipo_inspeccion_descripcion: value }))}
                    >
                        <SelectTrigger className="w-48 text-xs">
                            <SelectValue placeholder="Tipo Inspección" />
                        </SelectTrigger>
                        <SelectContent>
                            {TIPO_INSPECCION_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1">Usuario</label>
                    <Input
                        type="text"
                        className="text-xs"
                        placeholder="Buscar usuario"
                        value={filters.nombre_usuario}
                        onChange={e => setFilters(f => ({ ...f, nombre_usuario: e.target.value }))}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1">Empresa</label>
                    <Input
                        type="text"
                        className="text-xs"
                        placeholder="Buscar empresa"
                        value={filters.nombre_empresa}
                        onChange={e => setFilters(f => ({ ...f, nombre_empresa: e.target.value }))}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1">Estado</label>
                    <Select
                        value={filters.estado}
                        onValueChange={value => setFilters(f => ({ ...f, estado: value }))}
                    >
                        <SelectTrigger className="w-32 text-xs">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {ESTADO_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
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
                                    <TableHead
                                        key={header.id}
                                        style={{
                                            minWidth:
                                                header.column.columnDef.minSize && header.column.columnDef.minSize !== 0
                                                    ? header.column.columnDef.minSize
                                                    : 'auto',
                                            maxWidth:
                                                header.column.columnDef.maxSize && header.column.columnDef.maxSize !== 0
                                                    ? header.column.columnDef.maxSize
                                                    : 'auto',
                                        }}
                                    >
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
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
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
