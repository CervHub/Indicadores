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
    brand?: string;
    model?: string;
    license_plate?: string;
    code?: string | null;
    vehicle_companies?: { company?: { nombre?: string, code?: string }, code?: string, created_at?: string }[];
}, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [gerenciaFilter, setGerenciaFilter] = React.useState<string>('__all__');
    // const [tipoReporteFilter, setTipoReporteFilter] = React.useState<string>('__all__');
    // const [empresaGeneradoraFilter, setEmpresaGeneradoraFilter] = React.useState('');
    // const [empresaReportadaFilter, setEmpresaReportadaFilter] = React.useState('');
    // const [estadoFilter, setEstadoFilter] = React.useState<string>('__all__');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

    // Opciones únicas para los selects
    const gerenciaOptions = React.useMemo(() => {
        const set = new Set<string>();
        data.forEach(row => {
            if (row.gerencia_name) set.add(row.gerencia_name);
        });
        return Array.from(set);
    }, [data]);

    // const tipoReporteOptions = React.useMemo(() => {
    //     const set = new Set<string>();
    //     data.forEach(row => {
    //         if (row.tipo_reporte) set.add(row.tipo_reporte);
    //     });
    //     return Array.from(set);
    // }, [data]);

    // const estadoOptions = React.useMemo(() => {
    //     const set = new Set<string>();
    //     data.forEach(row => {
    //         if (row.estado) set.add(row.estado);
    //     });
    //     return Array.from(set);
    // }, [data]);

    // Opciones únicas para empresa generadora y reportada (para combobox)
    const empresaGeneradoraOptions = React.useMemo(() => {
        const set = new Set<string>();
        data.forEach(row => {
            if (row.company_name) set.add(row.company_name);
        });
        return Array.from(set).map(e => ({ value: e, label: e }));
    }, [data]);
    const empresaReportadaOptions = React.useMemo(() => {
        const set = new Set<string>();
        data.forEach(row => {
            if (row.company_report_name) set.add(row.company_report_name);
        });
        return Array.from(set).map(e => ({ value: e, label: e }));
    }, [data]);

    // const ultimaEmpresaOptions = React.useMemo(() => {
    //     const set = new Set<string>();
    //     data.forEach(row => {
    //         const companies = row.vehicle_companies ?? [];
    //         if (companies.length) {
    //             // Ordenar y tomar la más reciente
    //             const sorted = [...companies].sort((a, b) =>
    //                 (b.created_at ?? '') > (a.created_at ?? '') ? 1 : -1
    //             );
    //             const nombre = sorted[0]?.company?.nombre;
    //             if (nombre) set.add(nombre);
    //         }
    //     });
    //     return Array.from(set).map(e => ({ value: e, label: e }));
    // }, [data]);

    // Filtros de búsqueda por Placa y Última Empresa Vinculada
    const [placaSearch, setPlacaSearch] = React.useState('');
    const [ultimaEmpresaSearch, setUltimaEmpresaSearch] = React.useState('');

    // Opciones únicas para última empresa vinculada
    const ultimaEmpresaOptions = React.useMemo(() => {
        const set = new Set<string>();
        data.forEach(row => {
            const companies = row.vehicle_companies ?? [];
            if (companies.length) {
                const sorted = [...companies].sort((a, b) =>
                    (b.created_at ?? '') > (a.created_at ?? '') ? 1 : -1
                );
                const nombre = sorted[0]?.company?.nombre;
                if (nombre) set.add(nombre);
            }
        });
        return Array.from(set).map(e => ({ value: e, label: e }));
    }, [data]);

    // Filtro personalizado por gerencia, tipo reporte, empresa generadora, empresa reportada, estado y última empresa vinculada
    const filteredData = React.useMemo(() => {
        let filtered = data;
        if (gerenciaFilter !== '__all__') {
            filtered = filtered.filter(row => row.gerencia_name === gerenciaFilter);
        }
        // if (tipoReporteFilter !== '__all__') {
        //     filtered = filtered.filter(row => row.tipo_reporte === tipoReporteFilter);
        // }
        // if (empresaGeneradoraFilter) {
        //     filtered = filtered.filter(row =>
        //         row.company_name === empresaGeneradoraFilter
        //     );
        // }
        // if (empresaReportadaFilter) {
        //     filtered = filtered.filter(row =>
        //         row.company_report_name === empresaReportadaFilter
        //     );
        // }
        // if (estadoFilter !== '__all__') {
        //     filtered = filtered.filter(row => row.estado === estadoFilter);
        // }
        // Filtro por búsqueda de Placa
        if (placaSearch) {
            filtered = filtered.filter(row =>
                (row.license_plate ?? '').toLowerCase().includes(placaSearch.toLowerCase())
            );
        }
        // Filtro por búsqueda de Última Empresa Vinculada
        if (ultimaEmpresaSearch) {
            filtered = filtered.filter(row => {
                const companies = row.vehicle_companies ?? [];
                if (!companies.length) return false;
                const sorted = [...companies].sort((a, b) =>
                    (b.created_at ?? '') > (a.created_at ?? '') ? 1 : -1
                );
                const nombre = sorted[0]?.company?.nombre ?? '';
                return nombre.toLowerCase().includes(ultimaEmpresaSearch.toLowerCase());
            });
        }

        return filtered;
    }, [
        data,
        gerenciaFilter,
        placaSearch,
        ultimaEmpresaSearch,
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 py-4 w-full">
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
                    <label className="text-sm mb-1">Gerencia</label>
                    <Select value={gerenciaFilter} onValueChange={setGerenciaFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">Todas</SelectItem>
                            {gerenciaOptions.map((g) => (
                                <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Elimina los filtros de tipo reporte, empresa generadora, empresa reportada, estado */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm mb-1">Buscar Placa</label>
                    <Input
                        value={placaSearch}
                        onChange={e => setPlacaSearch(e.target.value)}
                        placeholder="Placa..."
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm mb-1">Empresa </label>
                    <Combobox
                        data={ultimaEmpresaOptions}
                        value={ultimaEmpresaSearch}
                        onChange={setUltimaEmpresaSearch}
                        placeholder="Seleccione o escriba empresa..."
                        className="w-full"
                        onInputChange={value => {
                            if (!value) setUltimaEmpresaSearch('');
                        }}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 rounded-md border">
                <Table className="text-xs">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} style={{ minWidth: '10px', maxWidth: '150px' }}>
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
