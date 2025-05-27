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
}

export function DataTable<TData extends {
    placa?: string;
    codigo?: string | null;
    nombre_company?: string;
    pre_use_estado?: string | null;
    pre_use_status?: string | null;
    pre_use_visit_estado?: string | null;
    pre_use_visit_status?: string | null;
    trimestral_estado?: string | null;
    trimestral_status?: string | null;
    semestral_estado?: string | null;
    semestral_status?: string | null;
    anual_estado?: string | null;
    anual_status?: string | null;
    // ...otros campos si es necesario...
}, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

    // Filtros de búsqueda por Placa y Empresa Vinculada y filtros individuales
    const [placaSearch, setPlacaSearch] = React.useState('');
    const [empresaSearch, setEmpresaSearch] = React.useState('');
    const [globalStatus, setGlobalStatus] = React.useState<string>('__all__');
    const [inspectionColumnFilters, setInspectionColumnFilters] = React.useState<{ [key: string]: string }>({});
    const [mainColumnFilters, setMainColumnFilters] = React.useState<{ [key: string]: string }>({});

    // Opciones únicas para los selects de empresa vinculada (para combobox)
    const empresaVinculadaOptions = React.useMemo(() => {
        const set = new Set<string>();
        data.forEach(row => {
            if (row.nombre_company) set.add(row.nombre_company);
        });
        return Array.from(set);
    }, [data]);

    // Opciones únicas para los selects de placa y código (no usados como select, pero pueden ser útiles si se requiere)
    // const placaOptions = React.useMemo(() => {
    //     const set = new Set<string>();
    //     data.forEach(row => {
    //         if (row.placa) set.add(row.placa);
    //     });
    //     return Array.from(set);
    // }, [data]);
    // const codigoOptions = React.useMemo(() => {
    //     const set = new Set<string>();
    //     data.forEach(row => {
    //         if (row.codigo) set.add(row.codigo);
    //     });
    //     return Array.from(set);
    // }, [data]);

    // Filtro personalizado por búsqueda de Placa, Empresa Vinculada, status global, status por columna y filtros principales
    const filteredData = React.useMemo(() => {
        let filtered = data;
        // Filtros por inputs principales
        if (mainColumnFilters['placa']) {
            filtered = filtered.filter(row =>
                (row.placa ?? '').toLowerCase().includes(mainColumnFilters['placa'].toLowerCase())
            );
        }
        if (mainColumnFilters['codigo']) {
            filtered = filtered.filter(row =>
                (row.codigo ?? '').toLowerCase().includes(mainColumnFilters['codigo'].toLowerCase())
            );
        }
        if (mainColumnFilters['nombre_company']) {
            filtered = filtered.filter(row =>
                (row.nombre_company ?? '').toLowerCase().includes(mainColumnFilters['nombre_company'].toLowerCase())
            );
        }
        // Filtros de búsqueda por Placa y Empresa Vinculada (legacy, puedes eliminar si solo usas los de arriba)
        if (placaSearch) {
            filtered = filtered.filter(row =>
                (row.placa ?? '').toLowerCase().includes(placaSearch.toLowerCase())
            );
        }
        if (empresaSearch) {
            filtered = filtered.filter(row =>
                (row.nombre_company ?? '').toLowerCase().includes(empresaSearch.toLowerCase())
            );
        }
        // Filtro global de status (afecta todas las inspecciones)
        if (globalStatus !== '__all__') {
            filtered = filtered.filter(row => {
                return (
                    (row.pre_use_status?.toLowerCase() === globalStatus.toLowerCase()) ||
                    (row.pre_use_visit_status?.toLowerCase() === globalStatus.toLowerCase()) ||
                    (row.trimestral_status?.toLowerCase() === globalStatus.toLowerCase()) ||
                    (row.semestral_status?.toLowerCase() === globalStatus.toLowerCase()) ||
                    (row.anual_status?.toLowerCase() === globalStatus.toLowerCase())
                );
            });
        }
        // Filtros individuales por columna
        Object.entries(inspectionColumnFilters).forEach(([key, status]) => {
            if (status !== '__all__') {
                filtered = filtered.filter(row =>
                    ((row as any)[key]?.toLowerCase?.() ?? '') === status.toLowerCase()
                );
            }
        });
        return filtered;
    }, [
        data,
        mainColumnFilters,
        placaSearch,
        empresaSearch,
        globalStatus,
        inspectionColumnFilters,
    ]);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 w-full">
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
            </div>
            <div className="grid grid-cols-1 rounded-md border">
                <Table className="text-xs">
                    <TableHeader>
                        {/* Fila de inputs de filtro por texto para placa, código y empresa; selects para inspecciones */}
                        <TableRow>
                            {table.getHeaderGroups()[0].headers.map((header) => {
                                const colKey = header.column.id;
                                // Placa
                                if (colKey === 'placa') {
                                    return (
                                        <TableHead key={header.id} style={{ minWidth: '10px', maxWidth: '150px', background: '#f9fafb' }}>
                                            <Input
                                                value={mainColumnFilters['placa'] ?? ''}
                                                onChange={e =>
                                                    setMainColumnFilters(prev => ({
                                                        ...prev,
                                                        placa: e.target.value,
                                                    }))
                                                }
                                                placeholder="Buscar placa"
                                                className="w-28 h-7 text-xs"
                                            />
                                        </TableHead>
                                    );
                                }
                                // Código de Vehículo
                                if (colKey === 'codigo') {
                                    return (
                                        <TableHead key={header.id} style={{ minWidth: '10px', maxWidth: '150px', background: '#f9fafb' }}>
                                            <Input
                                                value={mainColumnFilters['codigo'] ?? ''}
                                                onChange={e =>
                                                    setMainColumnFilters(prev => ({
                                                        ...prev,
                                                        codigo: e.target.value,
                                                    }))
                                                }
                                                placeholder="Buscar código"
                                                className="w-28 h-7 text-xs"
                                            />
                                        </TableHead>
                                    );
                                }
                                // Empresa Vinculada
                                if (colKey === 'nombre_company') {
                                    return (
                                        <TableHead key={header.id} style={{ minWidth: '10px', maxWidth: '150px', background: '#f9fafb' }}>
                                            <Input
                                                value={mainColumnFilters['nombre_company'] ?? ''}
                                                onChange={e =>
                                                    setMainColumnFilters(prev => ({
                                                        ...prev,
                                                        nombre_company: e.target.value,
                                                    }))
                                                }
                                                placeholder="Buscar empresa"
                                                className="w-28 h-7 text-xs"
                                            />
                                        </TableHead>
                                    );
                                }
                                // Inspecciones
                                if (
                                    colKey === 'pre_use_estado' ||
                                    colKey === 'pre_use_visit_estado' ||
                                    colKey === 'trimestral_estado' ||
                                    colKey === 'semestral_estado' ||
                                    colKey === 'anual_estado'
                                ) {
                                    let statusKey = '';
                                    if (colKey === 'pre_use_estado') statusKey = 'pre_use_status';
                                    if (colKey === 'pre_use_visit_estado') statusKey = 'pre_use_visit_status';
                                    if (colKey === 'trimestral_estado') statusKey = 'trimestral_status';
                                    if (colKey === 'semestral_estado') statusKey = 'semestral_status';
                                    if (colKey === 'anual_estado') statusKey = 'anual_status';
                                    return (
                                        <TableHead key={header.id} style={{ minWidth: '10px', maxWidth: '150px', background: '#f9fafb' }}>
                                            <Select
                                                value={inspectionColumnFilters[statusKey] ?? '__all__'}
                                                onValueChange={v =>
                                                    setInspectionColumnFilters(prev => ({
                                                        ...prev,
                                                        [statusKey]: v,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="w-24 h-7 text-xs">
                                                    <SelectValue placeholder="Todos" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__all__">Todos</SelectItem>
                                                    <SelectItem value="aprobado">Aprobado</SelectItem>
                                                    <SelectItem value="rechazado">Rechazado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableHead>
                                    );
                                }
                                // Celda vacía para otras columnas
                                return <TableHead key={header.id} />;
                            })}
                        </TableRow>
                        {/* Fila de headers normales */}
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const colKey = header.column.id;
                                    if (
                                        colKey === 'pre_use_estado' ||
                                        colKey === 'pre_use_visit_estado' ||
                                        colKey === 'trimestral_estado' ||
                                        colKey === 'semestral_estado' ||
                                        colKey === 'anual_estado'
                                    ) {
                                        let label = '';
                                        if (colKey === 'pre_use_estado') label = 'Ins. Diaria';
                                        if (colKey === 'pre_use_visit_estado') label = 'Ins. Diaria Visita';
                                        if (colKey === 'trimestral_estado') label = 'Ins. Trimestral';
                                        if (colKey === 'semestral_estado') label = 'Ins. Semestral';
                                        if (colKey === 'anual_estado') label = 'Ins. Anual';
                                        return (
                                            <TableHead key={header.id} style={{ minWidth: '10px', maxWidth: '150px' }}>
                                                {label}
                                            </TableHead>
                                        );
                                    }
                                    return (
                                        <TableHead key={header.id} style={{ minWidth: '10px', maxWidth: '150px' }}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
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
                                                maxWidth: '150px',
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-2">
                <span className="text-xs text-muted-foreground">
                    Mostrando {startRow} a {endRow} de {totalRows} registros
                </span>
                <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
