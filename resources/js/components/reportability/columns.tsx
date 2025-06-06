'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, FileText } from 'lucide-react';
import { useState } from 'react';

// Este tipo define la forma de nuestros datos.
export type Reportability = {
    id: string;
    nombres: string;
    apellidos: string;
    fecha_evento: string;
    estado: string; // Cambiado a string para reflejar el estado literal
    tipo_reporte: string;
    gerencia_name: string;
    company_id: string;
    company_name: string;
    company_report_id: string;
    company_report_name: string;
};



export const getColumns = (isSecurityEngineer: boolean): ColumnDef<Reportability>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'gerencia_name',
        header: 'Gerencia',
    },
    {
        accessorKey: 'tipo_reporte',
        header: 'Tipo Reporte',
    },
    {
        accessorKey: 'fecha_evento',
        header: 'Fecha Evento',
        cell: ({ row }) => formatDateTime(row.original.fecha_evento),
    },
    {
        accessorKey: 'nombres',
        header: 'Generado por',
    },
    {
        accessorKey: 'company_name',
        header: 'Empresa Generadora',
    },
    {
        accessorKey: 'company_report_name',
        header: 'Empresa Reportarada',
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
            const urlDetalle = route('admin.reportability.detalle', { reportability_id: row.original.id });
            const urlPdf = route('company.reportability.download', { reportability_id: row.original.id });

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
                            <Eye className="h-3 w-3" /> {isSecurityEngineer ? 'Revisar' : 'Detalle'}
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
    },
];
