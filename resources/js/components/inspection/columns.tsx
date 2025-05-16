'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, FileText, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { ReportabilityVehicle } from '@/types';



export const getColumns = (): ColumnDef<ReportabilityVehicle>[] => [
    {
        accessorKey: 'id',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="p-0"
            >
                ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        maxSize: 60,
    },
    {
        accessorKey: 'fecha_evento',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="p-0"
            >
                Fecha Evento
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => formatDateTime(row.original.fecha_evento),
    },
    {
        accessorKey: 'fecha_reporte',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="p-0"
            >
                Fecha Reporte
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => formatDateTime(row.original.fecha_reporte),
    },
    {
        accessorKey: 'tipo_inspeccion_descripcion',
        header: 'Tipo Inspección',
    },
    {
        accessorKey: 'nombre_usuario',
        header: 'Usuario',
    },
    {
        accessorKey: 'nombre_empresa',
        header: 'Empresa',
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
            const estado = row.original.estado;
            let badgeClass = '';
            let badgeText = '';

            switch (estado) {
                case 'Generado':
                    badgeClass = 'bg-blue-500 text-white';
                    badgeText = 'Generado';
                    break;
                case 'Revisado':
                    badgeClass = 'bg-orange-500 text-white';
                    badgeText = 'Revisado';
                    break;
                case 'Finalizado':
                    badgeClass = 'bg-green-600 text-white';
                    badgeText = 'Finalizado';
                    break;
                default:
                    badgeClass = 'bg-gray-500 text-white';
                    badgeText = estado;
                    break;
            }

            return (
                <Badge variant={'default'} className={badgeClass}>
                    {badgeText}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
            const [detalleClicked, setDetalleClicked] = useState(false);
            const urlDetalle = route('inspection.detalle', { reportability_id: row.original.id });
            const urlPdf = route('inspection.download', { reportability_id: row.original.id });

            const handleDetalleClick = () => {
                setDetalleClicked(true);
            };

            const handlePdfClick = () => {
                window.open(urlPdf, '_blank');
            };

            return (
                <div className="flex flex-wrap space-x-2">
                    <Link href={urlDetalle} className="flex items-center">
                        <Button
                            variant="warning"
                            aria-label="Toggle detalle"
                            className={`flex h-7 items-center p-2 text-xs text-white ${detalleClicked ? 'cursor-not-allowed opacity-50' : ''}`}
                            onClick={handleDetalleClick}
                            disabled={detalleClicked}
                        >
                            <Eye className="h-3 w-3" /> Detalle
                        </Button>
                    </Link>
                    <Button
                        aria-label="Toggle pdf"
                        className="h-7 bg-red-700 p-2 text-xs text-white hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-800"
                        onClick={handlePdfClick}
                    >
                        <FileText className="h-3 w-3" /> PDF
                    </Button>
                </div>
            );
        },
        minSize: 200,
    },
];
