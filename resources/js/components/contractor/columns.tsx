'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash, Eye, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Importa el componente Badge

// Este tipo define la forma de nuestros datos.
export type Contractor = {
    id: string;
    ruc: string;
    nombre: string;
    estado: string;
    updated_at?: string; // Asegúrate de tener este campo
};

export const getColumns = (
    handleActionClick: (id: string, action: string) => void,
    ueas: { id: string; name?: string; nombre?: string }[]
): ColumnDef<Contractor>[] => [
        {
            accessorKey: 'nombre',
            size: 240,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Nombre
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <span className="block truncate max-w-[200px] whitespace-nowrap">
                    {row.original.nombre}
                </span>
            ),
        },
        {
            accessorKey: 'ruc',
            size: 120,
            enableSorting: true,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start"
                >
                    RUC
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="block truncate max-w-[120px] whitespace-nowrap">
                    {row.original.ruc}
                </span>
            ),
        },
        {
            accessorKey: 'estado',
            size: 80,
            enableSorting: true,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start"
                >
                    Estado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const contractor = row.original;
                return (
                    <Badge variant={contractor.estado === '0' ? 'destructive' : 'success'}>
                        {contractor.estado === '0' ? 'Inactiva' : 'Activa'}
                    </Badge>
                );
            },
        },
        {
            id: 'ueas',
            size: 350,
            header: 'UEAs',
            cell: ({ row }) => {
                const contractor = row.original;
                if (!Array.isArray((contractor as any).uea)) return null;
                const ueaList = (contractor as any).uea
                    .map((u: any) => {
                        const found = ueas.find(
                            (item) => String(item.id) === String(u.uea_id)
                        );
                        return found?.name || found?.nombre || u.uea_id;
                    })
                    .filter(Boolean);
                return (
                    <div className="flex flex-wrap gap-1  truncate">
                        {ueaList.length
                            ? ueaList.map((name: string, idx: number) => (
                                <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs px-2 py-0.5 "
                                >
                                    {name}
                                </Badge>
                            ))
                            : <span className="text-xs text-muted-foreground">Sin UEA</span>
                        }
                    </div>
                );
            },
        },
        {
            accessorKey: 'updated_at',
            size: 180,
            enableSorting: true,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start"
                >
                    Fecha actualización
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const contractor = row.original;
                return (
                    <span className="text-xs block truncate max-w-[160px] whitespace-nowrap">
                        {contractor.updated_at
                            ? new Date(contractor.updated_at).toLocaleString('es-PE')
                            : '-'}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const contractor = row.original;

                return (
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => handleActionClick(contractor.id, 'detail')}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="warning"
                            className="h-8 w-8 p-0"
                            onClick={() => handleActionClick(contractor.id, 'edit')}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        {contractor.estado === '0' ? (
                            <Button
                                variant="success"
                                className="h-8 w-8 p-0"
                                onClick={() => handleActionClick(contractor.id, 'activate')}
                            >
                                <CheckCircle className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                variant="destructive"
                                className="h-8 w-8 p-0"
                                onClick={() => handleActionClick(contractor.id, 'delete')}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];
