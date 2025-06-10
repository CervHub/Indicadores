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
import { Combobox } from '@/components/ui/combobox';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData extends {
    id?: number;
    user?: {
        nombres?: string;
        apellidos?: string;
        doi?: string;
        email?: string;
    };
    company?: {
        nombre?: string;
        ruc?: string;
    };
}, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [userFilter, setUserFilter] = React.useState('');
    const [companyFilter, setCompanyFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

    // Opciones únicas para los filtros
    const userOptions = React.useMemo(() => {
        const users = new Set<string>();
        data.forEach(row => {
            if (row.user?.nombres && row.user?.apellidos) {
                const fullName = `${row.user.nombres} ${row.user.apellidos}`;
                if (fullName.trim()) { // Validar que no esté vacío
                    users.add(fullName);
                }
            }
        });
        return Array.from(users).map(user => ({ value: user, label: user }));
    }, [data]);

    const companyOptions = React.useMemo(() => {
        const companies = new Set<string>();
        data.forEach(row => {
            if (row.company?.nombre && row.company.nombre.trim()) { // Validar que no esté vacío
                companies.add(row.company.nombre);
            }
        });
        return Array.from(companies).map(company => ({ value: company, label: company }));
    }, [data]);

    // Filtro personalizado
    const filteredData = React.useMemo(() => {
        let filtered = data;

        // Filtro global de búsqueda
        if (globalFilter) {
            const filter = globalFilter.toLowerCase();
            filtered = filtered.filter((row) => {
                const searchFields = [
                    row.user?.nombres,
                    row.user?.apellidos,
                    row.user?.doi,
                    row.user?.email,
                    row.company?.nombre,
                    row.company?.ruc,
                ];

                return searchFields.some(field =>
                    field && field.toLowerCase().includes(filter)
                );
            });
        }

        // Filtro por usuario
        if (userFilter && userFilter !== '') {
            filtered = filtered.filter(row => {
                const userName = row.user ? `${row.user.nombres} ${row.user.apellidos}` : '';
                return userName === userFilter;
            });
        }

        // Filtro por empresa
        if (companyFilter && companyFilter !== '') {
            filtered = filtered.filter(row => row.company?.nombre === companyFilter);
        }

        return filtered;
    }, [data, globalFilter, userFilter, companyFilter]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: false,
        pageCount: undefined,
    });

    // Cuando cambie el pageSize desde el selector, actualiza el estado de paginación
    const handlePageSizeChange = (v: string) => {
        setPagination(prev => ({
            ...prev,
            pageSize: Number(v),
            pageIndex: 0, // Reinicia a la primera página
        }));
    };

    // Calcular los índices de los registros mostrados
    const totalRows = filteredData.length;
    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

    return (
        <div>
            {/* Filtros */}
            <div className="flex flex-wrap gap-4 py-4 items-end">
                <div className="flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                    <label className="text-sm mb-1">Buscar</label>
                    <Input
                        placeholder="Buscar en todos los campos..."
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-1 min-w-[180px] max-w-[250px]">
                    <label className="text-sm mb-1">Usuario</label>
                    <Combobox
                        data={userOptions}
                        value={userFilter}
                        onInputChange={(value) => setUserFilter(value)}
                        placeholder="Seleccionar usuario"
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-1 min-w-[180px] max-w-[250px]">
                    <label className="text-sm mb-1">Empresa</label>
                    <Combobox
                        data={companyOptions}
                        value={companyFilter}
                        onInputChange={(value) => setCompanyFilter(value)}
                        placeholder="Seleccionar empresa"
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-1 min-w-[100px] max-w-[120px]">
                    <label className="text-sm mb-1">Mostrar</label>
                    <Select value={pagination.pageSize.toString()} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
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
                                    <TableHead key={header.id} style={{ minWidth: '10px', maxWidth: '200px' }}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                                                minWidth: '10px',
                                                maxWidth: '200px',
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
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-2">
                <span className="text-xs text-muted-foreground">
                    Mostrando {startRow} a {endRow} de {totalRows} registros
                </span>
                <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Anterior
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
