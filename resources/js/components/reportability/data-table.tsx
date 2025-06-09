'use client';
import {
    ColumnDef,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData extends {
    id?: number | string;
    gerencia_name?: string;
    tipo_reporte?: string;
    fecha_evento?: string;
    generado_por?: string;
    encargado_cierre?: string;
    company_name?: string;
    company_report_name?: string;
    estado?: string;
    report_closed_at?: string;
    deleted_at?: string | null;
}, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    // Configuración por defecto de visibilidad de columnas
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        id: true,
        gerencia_name: true,
        tipo_reporte: true,
        fecha_evento: true,
        generado_por: false,
        encargado_cierre: true,
        company_name: false,
        company_report_name: false,
        estado: true,
        report_closed_at: true,
        deleted_at: false,
        acciones: true,
    });
    const [idReporteFilter, setIdReporteFilter] = React.useState('');
    const [gerenciaFilter, setGerenciaFilter] = React.useState<string>('__all__');
    const [tipoReporteFilter, setTipoReporteFilter] = React.useState<string>('__all__');
    const [generadoPorFilter, setGeneradoPorFilter] = React.useState('');
    const [encargadoCierreFilter, setEncargadoCierreFilter] = React.useState('');
    const [empresaGeneradoraFilter, setEmpresaGeneradoraFilter] = React.useState('');
    const [empresaReportadaFilter, setEmpresaReportadaFilter] = React.useState('');
    const [estadoFilter, setEstadoFilter] = React.useState<string>('__all__');
    const [showDeleted, setShowDeleted] = React.useState('activos');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

    // Filtros de rango de fechas
    const [fechaEventoDesde, setFechaEventoDesde] = React.useState('');
    const [fechaEventoHasta, setFechaEventoHasta] = React.useState('');
    const [fechaCierreDesde, setFechaCierreDesde] = React.useState('');
    const [fechaCierreHasta, setFechaCierreHasta] = React.useState('');

    // Mapeo de nombres de columnas para mostrar en español
    const columnLabels: Record<string, string> = {
        id: 'ID',
        gerencia_name: 'Gerencia',
        tipo_reporte: 'Tipo de reporte',
        fecha_evento: 'Fecha de evento',
        generado_por: 'Reportado por',
        encargado_cierre: 'Encargado de cierre',
        company_name: 'Empresa que reporta',
        company_report_name: 'Empresa reportada',
        estado: 'Estado del reporte',
        report_closed_at: 'Fecha de cierre',
        deleted_at: 'Fecha de eliminación',
        acciones: 'Acciones',
    };

    // Opciones únicas para los selects
    const gerenciaOptions = React.useMemo(() => {
        const set = new Set<string>();
        data.forEach(row => {
            if (row.gerencia_name) set.add(row.gerencia_name);
        });
        return Array.from(set);
    }, [data]);

    const tipoReporteOptions = React.useMemo(() => {
        const set = new Set<string>();
        data.forEach(row => {
            if (row.tipo_reporte) set.add(row.tipo_reporte);
        });
        return Array.from(set);
    }, [data]);

    const estadoOptions = React.useMemo(() => {
        const set = new Set<string>();
        data.forEach(row => {
            if (row.estado) set.add(row.estado);
        });
        return Array.from(set);
    }, [data]);

    const generadoPorOptions = React.useMemo(() => {
        const set = new Set<string>();
        data.forEach(row => {
            if (row.generado_por) set.add(row.generado_por);
        });
        return Array.from(set).map(e => ({ value: e, label: e }));
    }, [data]);

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

    const encargadoCierreOptions = React.useMemo(() => {
        const set = new Set<string>();
        data.forEach(row => {
            if (row.encargado_cierre && row.encargado_cierre !== '-' && row.encargado_cierre.trim() !== '') {
                set.add(row.encargado_cierre);
            }
        });
        return Array.from(set).map(e => ({ value: e, label: e }));
    }, [data]);

    // Filtro personalizado por todos los campos
    const filteredData = React.useMemo(() => {
        let filtered = data;
        
        // Filtro por estado de eliminación
        filtered = filtered.filter(row => {
            const isDeleted = row.deleted_at !== null && row.deleted_at !== undefined;
            if (showDeleted === 'eliminados') {
                return isDeleted;
            } else {
                return !isDeleted;
            }
        });
        
        if (idReporteFilter) {
            filtered = filtered.filter(row =>
                (row.id?.toString() ?? '').toLowerCase().includes(idReporteFilter.toLowerCase())
            );
        }
        
        if (gerenciaFilter !== '__all__') {
            filtered = filtered.filter(row => row.gerencia_name === gerenciaFilter);
        }
        
        if (tipoReporteFilter !== '__all__') {
            filtered = filtered.filter(row => row.tipo_reporte === tipoReporteFilter);
        }
        
        if (generadoPorFilter) {
            filtered = filtered.filter(row =>
                row.generado_por === generadoPorFilter
            );
        }
        
        if (encargadoCierreFilter) {
            filtered = filtered.filter(row =>
                row.encargado_cierre === encargadoCierreFilter
            );
        }
        
        if (empresaGeneradoraFilter) {
            filtered = filtered.filter(row =>
                row.company_name === empresaGeneradoraFilter
            );
        }
        
        if (empresaReportadaFilter) {
            filtered = filtered.filter(row =>
                row.company_report_name === empresaReportadaFilter
            );
        }
        
        if (estadoFilter !== '__all__') {
            filtered = filtered.filter(row => row.estado === estadoFilter);
        }

        // Filtros de rango de fechas para fecha de evento
        if (fechaEventoDesde || fechaEventoHasta) {
            filtered = filtered.filter(row => {
                if (!row.fecha_evento) return false;
                const fechaEvento = new Date(row.fecha_evento);
                const desde = fechaEventoDesde ? new Date(fechaEventoDesde) : null;
                const hasta = fechaEventoHasta ? new Date(fechaEventoHasta) : null;
                
                if (desde && hasta) {
                    return fechaEvento >= desde && fechaEvento <= hasta;
                } else if (desde) {
                    return fechaEvento >= desde;
                } else if (hasta) {
                    return fechaEvento <= hasta;
                }
                return true;
            });
        }

        // Filtros de rango de fechas para fecha de cierre
        if (fechaCierreDesde || fechaCierreHasta) {
            filtered = filtered.filter(row => {
                if (!row.report_closed_at) return false;
                const fechaCierre = new Date(row.report_closed_at);
                const desde = fechaCierreDesde ? new Date(fechaCierreDesde) : null;
                const hasta = fechaCierreHasta ? new Date(fechaCierreHasta) : null;
                
                if (desde && hasta) {
                    return fechaCierre >= desde && fechaCierre <= hasta;
                } else if (desde) {
                    return fechaCierre >= desde;
                } else if (hasta) {
                    return fechaCierre <= hasta;
                }
                return true;
            });
        }
        
        return filtered;
    }, [data, showDeleted, idReporteFilter, gerenciaFilter, tipoReporteFilter, generadoPorFilter, encargadoCierreFilter, empresaGeneradoraFilter, empresaReportadaFilter, estadoFilter, fechaEventoDesde, fechaEventoHasta, fechaCierreDesde, fechaCierreHasta]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            pagination,
            columnVisibility,
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
        <div className='grid grid-cols-1 gap-4 p-4'>
            {/* Filtros en flex para responsive */}
            <div className="flex flex-wrap gap-4 py-4 w-full">
                {/* Select para mostrar eliminados o activos */}
                <div className="flex flex-col gap-1 min-w-[150px]">
                    <label className="text-sm mb-1">Activos/Eliminados</label>
                    <Select value={showDeleted} onValueChange={setShowDeleted}>
                        <SelectTrigger>
                            <SelectValue placeholder="Activos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="activos">Activos</SelectItem>
                            <SelectItem value="eliminados">Eliminados</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* ID Reporte */}
                {columnVisibility.id !== false && (
                    <div className="flex flex-col gap-1 min-w-[150px]">
                        <label className="text-sm mb-1">ID</label>
                        <Input
                            value={idReporteFilter}
                            onChange={e => setIdReporteFilter(e.target.value)}
                            placeholder="Buscar ID..."
                            className="w-full"
                        />
                    </div>
                )}
                
                {/* Gerencia */}
                {columnVisibility.gerencia_name !== false && (
                    <div className="flex flex-col gap-1 min-w-[150px]">
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
                )}
                
                {/* Tipo de Reporte */}
                {columnVisibility.tipo_reporte !== false && (
                    <div className="flex flex-col gap-1 min-w-[150px]">
                        <label className="text-sm mb-1">Tipo de reporte</label>
                        <Select value={tipoReporteFilter} onValueChange={setTipoReporteFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">Todos</SelectItem>
                                {tipoReporteOptions.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                
                {/* Generado por */}
                {columnVisibility.generado_por !== false && (
                    <div className="flex flex-col gap-1 min-w-[200px]">
                        <label className="text-sm mb-1">Reportado por</label>
                        <Combobox
                            data={generadoPorOptions}
                            value={generadoPorFilter}
                            onChange={setGeneradoPorFilter}
                            placeholder="Seleccione quien reportó..."
                            onInputChange={value => {
                                if (!value) setGeneradoPorFilter('');
                            }}
                        />
                    </div>
                )}
                
                {/* Encargado de cierre */}
                {columnVisibility.encargado_cierre !== false && (
                    <div className="flex flex-col gap-1 min-w-[180px]">
                        <label className="text-sm mb-1">Encargado de cierre</label>
                        <Combobox
                            data={encargadoCierreOptions}
                            value={encargadoCierreFilter}
                            onChange={setEncargadoCierreFilter}
                            placeholder="Seleccione Encargado..."
                            onInputChange={value => {
                                if (!value) setEncargadoCierreFilter('');
                            }}
                        />
                    </div>
                )}
                
                {/* Empresa que reporta */}
                {columnVisibility.company_name !== false && (
                    <div className="flex flex-col gap-1 min-w-[200px]">
                        <label className="text-sm mb-1">Empresa que reporta</label>
                        <Combobox
                            data={empresaGeneradoraOptions}
                            value={empresaGeneradoraFilter}
                            onChange={setEmpresaGeneradoraFilter}
                            placeholder="Seleccione Empresa..."
                            onInputChange={value => {
                                if (!value) setEmpresaGeneradoraFilter('');
                            }}
                        />
                    </div>
                )}
                
                {/* Empresa reportada */}
                {columnVisibility.company_report_name !== false && (
                    <div className="flex flex-col gap-1 min-w-[200px]">
                        <label className="text-sm mb-1">Empresa reportada</label>
                        <Combobox
                            data={empresaReportadaOptions}
                            value={empresaReportadaFilter}
                            onChange={setEmpresaReportadaFilter}
                            placeholder="Seleccione Empresa..."
                            onInputChange={value => {
                                if (!value) setEmpresaReportadaFilter('');
                            }}
                        />
                    </div>
                )}
                
                {/* Estado del reporte */}
                {columnVisibility.estado !== false && (
                    <div className="flex flex-col gap-1 min-w-[130px]">
                        <label className="text-sm mb-1">Estado del reporte</label>
                        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">Todos</SelectItem>
                                {estadoOptions.map((e) => (
                                    <SelectItem key={e} value={e}>{e}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                
                {/* Controles al final */}
                <div className="flex flex-col gap-1 min-w-[120px]">
                    <label className="text-sm mb-1">Mostrar</label>
                    <Select value={pagination.pageSize.toString()} onValueChange={handlePageSizeChange}>
                        <SelectTrigger>
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
                
                <div className="flex flex-col gap-1 min-w-[150px]">
                    <label className="text-sm mb-1">Columnas</label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                Ocultar/Mostrar
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {columnLabels[column.id] || column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Filtros de rango de fechas en una nueva fila */}
            <div className="flex flex-wrap gap-4 py-2 w-full border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 w-full mb-2">Filtros de fechas por rango</h3>
                
                {/* Rango de fecha de evento */}
                {columnVisibility.fecha_evento !== false && (
                    <div className="flex flex-col gap-1 min-w-[300px]">
                        <label className="text-sm mb-1">Fecha de evento</label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="date"
                                value={fechaEventoDesde}
                                onChange={e => setFechaEventoDesde(e.target.value)}
                                placeholder="Desde..."
                                className="flex-1"
                            />
                            <span className="text-xs text-muted-foreground">hasta</span>
                            <Input
                                type="date"
                                value={fechaEventoHasta}
                                onChange={e => setFechaEventoHasta(e.target.value)}
                                placeholder="Hasta..."
                                className="flex-1"
                            />
                        </div>
                    </div>
                )}

                {/* Rango de fecha de cierre */}
                {columnVisibility.report_closed_at !== false && (
                    <div className="flex flex-col gap-1 min-w-[300px]">
                        <label className="text-sm mb-1">Fecha de cierre</label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="date"
                                value={fechaCierreDesde}
                                onChange={e => setFechaCierreDesde(e.target.value)}
                                placeholder="Desde..."
                                className="flex-1"
                            />
                            <span className="text-xs text-muted-foreground">hasta</span>
                            <Input
                                type="date"
                                value={fechaCierreHasta}
                                onChange={e => setFechaCierreHasta(e.target.value)}
                                placeholder="Hasta..."
                                className="flex-1"
                            />
                        </div>
                    </div>
                )}

                {/* Botón para limpiar filtros de fecha */}
                <div className="flex flex-col gap-1 min-w-[120px]">
                    <label className="text-sm mb-1">&nbsp;</label>
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                            setFechaEventoDesde('');
                            setFechaEventoHasta('');
                            setFechaCierreDesde('');
                            setFechaCierreHasta('');
                        }}
                        className="w-full"
                    >
                        Limpiar fechas
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
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
                                        <TableCell key={cell.id}>
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
