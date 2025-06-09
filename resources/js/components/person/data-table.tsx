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
    roles: any[];
    userRoleCode?: string;
}

export function DataTable<TData extends {
    id?: number;
    nombres?: string;
    apellidos?: string;
    email?: string;
    telefono?: string | null;
    cargo?: string;
    estado?: string;
    role_id?: number;
    doi?: string;
    company_name?: string;
    company_ruc?: string;
}, TValue>({
    columns,
    data,
    roles,
    userRoleCode,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [roleFilter, setRoleFilter] = React.useState<string>('__all__');
    const [estadoFilter, setEstadoFilter] = React.useState<string>('__all__');
    const [rucFilter, setRucFilter] = React.useState<string>('');
    const [companyFilter, setCompanyFilter] = React.useState<string>('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

    // Opciones únicas para los selects
    const roleOptions = React.useMemo(() => {
        const usedRoleIds = new Set<number>();
        data.forEach(row => {
            if (row.role_id) usedRoleIds.add(row.role_id);
        });
        return roles.filter(role => usedRoleIds.has(role.id));
    }, [data, roles]);

    const estadoOptions = React.useMemo(() => {
        const set = new Set<string>();
        data.forEach(row => {
            if (row.estado) set.add(row.estado);
        });
        return Array.from(set);
    }, [data]);

    // Opciones únicas para RUC y empresa (solo para SA)
    const rucOptions = React.useMemo(() => {
        if (userRoleCode !== 'SA') return [];
        const set = new Set<string>();
        data.forEach(row => {
            if (row.company_ruc) set.add(row.company_ruc);
        });
        return Array.from(set).map(ruc => ({ value: ruc, label: ruc }));
    }, [data, userRoleCode]);

    const companyOptions = React.useMemo(() => {
        if (userRoleCode !== 'SA') return [];
        const set = new Set<string>();
        data.forEach(row => {
            if (row.company_name) set.add(row.company_name);
        });
        return Array.from(set).map(company => ({ value: company, label: company }));
    }, [data, userRoleCode]);

    // Filtro personalizado
    const filteredData = React.useMemo(() => {
        let filtered = data;
        // Filtro global de búsqueda
        if (globalFilter) {
            const filter = globalFilter.toLowerCase();
            filtered = filtered.filter((row) => {
                const role = roles.find(r => r.id === row.role_id);
                const searchFields = [
                    row.nombres,
                    row.apellidos,
                    row.email,
                    row.telefono,
                    row.cargo,
                    role?.nombre,
                    row.doi,
                ];

                // Add company fields to search if user is SA
                if (userRoleCode === 'SA') {
                    searchFields.push(row.company_name, row.company_ruc);
                }

                return searchFields.some(field => 
                    field && field.toLowerCase().includes(filter)
                );
            });
        }
        
        // Filtro por rol
        if (roleFilter !== '__all__') {
            const selectedRole = roles.find(r => r.nombre === roleFilter);
            if (selectedRole) {
                filtered = filtered.filter(row => row.role_id === selectedRole.id);
            }
        }
        
        // Filtro por estado
        if (estadoFilter !== '__all__') {
            filtered = filtered.filter(row => row.estado === estadoFilter);
        }

        // Filtros adicionales para SA
        if (userRoleCode === 'SA') {
            // Filtro por RUC
            if (rucFilter) {
                filtered = filtered.filter(row => row.company_ruc === rucFilter);
            }
            
            // Filtro por empresa
            if (companyFilter) {
                filtered = filtered.filter(row => row.company_name === companyFilter);
            }
        }
        
        return filtered;
    }, [data, globalFilter, roleFilter, estadoFilter, rucFilter, companyFilter, roles, userRoleCode]);

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
            {/* Filtros en grid para responsive */}
            <div className={`grid gap-4 py-4 w-full ${userRoleCode === 'SA' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'}`}>
                <div className="flex flex-col gap-1">
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
                    <span className="text-xs text-muted-foreground mt-1">registros</span>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm mb-1">Buscar</label>
                    <Input
                        placeholder="Buscar en todos los campos..."
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm mb-1">Rol</label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">Todos</SelectItem>
                            {roleOptions.map((role) => (
                                <SelectItem key={role.id} value={role.nombre}>{role.nombre}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm mb-1">Estado</label>
                    <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">Todos</SelectItem>
                            {estadoOptions.map((estado) => (
                                <SelectItem key={estado} value={estado}>
                                    {estado === '1' ? 'Activo' : 'No Activo'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {userRoleCode === 'SA' && (
                    <>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm mb-1">RUC</label>
                            <Combobox
                                data={rucOptions}
                                value={rucFilter}
                                onChange={setRucFilter}
                                onInputChange={value => {
                                    if (!value) setRucFilter('');
                                }}
                                placeholder="Seleccione RUC..."
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm mb-1">Empresa</label>
                            <Combobox
                                data={companyOptions}
                                value={companyFilter}
                                onChange={setCompanyFilter}
                                onInputChange={value => {
                                    if (!value) setCompanyFilter('');
                                }}
                                placeholder="Seleccione empresa..."
                                className="w-full"
                            />
                        </div>
                    </>
                )}
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
