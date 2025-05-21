"use client"
import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define a custom filter function

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  ueas: { id: string; name?: string; nombre?: string }[]
}

// Helper para mostrar estado legible
function getEstadoLabel(estado?: string) {
  if (estado === "1") return "Activa";
  if (estado === "0") return "Inactiva";
  return estado ?? "";
}

export function DataTable<TData extends { nombre?: string; ruc?: string; estado?: string; updated_at?: string; uea?: any[] }, TValue>({
  columns,
  data,
  ueas,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pageSize, setPageSize] = React.useState(10)
  const [pageIndex, setPageIndex] = React.useState(0)
  const [estadoFilter, setEstadoFilter] = React.useState<string>("__all__");
  const [ueaFilter, setUeaFilter] = React.useState<string>("__all__");

  // Filtro personalizado por estado, nombre, ruc y uea
  const filteredData = React.useMemo(() => {
    let filtered = data;
    if (globalFilter) {
      const filter = globalFilter.toLowerCase();
      filtered = filtered.filter((row) =>
        (row.nombre && row.nombre.toLowerCase().includes(filter)) ||
        (row.ruc && row.ruc.toLowerCase().includes(filter)) ||
        (row.estado && row.estado.toLowerCase().includes(filter))
      );
    }
    if (estadoFilter && estadoFilter !== "__all__") {
      filtered = filtered.filter(row => row.estado === estadoFilter);
    }
    if (ueaFilter && ueaFilter !== "__all__") {
      filtered = filtered.filter(row =>
        Array.isArray(row.uea) &&
        row.uea.some((u: any) => String(u.uea_id) === ueaFilter)
      );
    }
    return filtered;
  }, [data, globalFilter, estadoFilter, ueaFilter]);

  // Ordenar por updated_at descendente por defecto
  const sortedData = React.useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (!a.updated_at || !b.updated_at) return 0;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [filteredData]);

  const table = useReactTable({
    data: sortedData,
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
      pagination: { pageIndex, pageSize },
    },
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
    },
    onPaginationChange: updater => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize })
        setPageIndex(newState.pageIndex)
        setPageSize(newState.pageSize)
      } else if (updater && typeof updater === "object") {
        if ("pageIndex" in updater) setPageIndex(updater.pageIndex)
        if ("pageSize" in updater) setPageSize(updater.pageSize)
      }
    },
  })

  React.useEffect(() => {
    table.setPageSize(pageSize)
  }, [pageSize, table])

  const totalRows = table.getFilteredRowModel().rows.length;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  // Obtener los estados únicos para el select (siempre muestra como texto legible)
  const estadoOptions = React.useMemo(() => {
    const estados = Array.from(new Set(data.map(row => row.estado).filter(Boolean)));
    return estados;
  }, [data]);

  // Opciones de UEA para el select
  const ueaOptions = React.useMemo(() => {
    return ueas.map(u => ({
      value: String(u.id),
      label: u.name || u.nombre || u.id,
    }));
  }, [ueas]);

  return (
    <div>
      <div className="flex flex-wrap items-center py-4 gap-4">
        <Input
          placeholder="Filtrar por estado, nombre o RUC..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm">Estado</label>
          <ShadSelect value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos</SelectItem>
              {estadoOptions.map((estado) => (
                <SelectItem key={estado} value={String(estado)}>
                  {getEstadoLabel(estado)}
                </SelectItem>
              ))}
            </SelectContent>
          </ShadSelect>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">UEA</label>
          <ShadSelect value={ueaFilter} onValueChange={setUeaFilter}>
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
          </ShadSelect>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Mostrar</label>
          <ShadSelect value={String(pageSize)} onValueChange={val => setPageSize(Number(val))}>
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map(size => (
                <SelectItem key={size} value={String(size)}>
                  {size} registros
                </SelectItem>
              ))}
            </SelectContent>
          </ShadSelect>
        </div>
      </div>
      <div className="rounded-md border grid grid-cols-1">
        <Table className="table-fixed w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={
                      header.getSize()
                        ? { width: header.getSize(), maxWidth: header.getSize(), minWidth: header.getSize() }
                        : undefined
                    }
                    className="truncate whitespace-nowrap overflow-ellipsis"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={
                        cell.column.getSize()
                          ? { width: cell.column.getSize(), maxWidth: cell.column.getSize(), minWidth: cell.column.getSize() }
                          : undefined
                      }
                      className="truncate whitespace-nowrap overflow-ellipsis align-middle"
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <span className="text-xs text-muted-foreground">
          Mostrando {from}-{to} de {totalRows} registros
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
