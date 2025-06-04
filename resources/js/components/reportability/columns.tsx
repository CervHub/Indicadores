'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    user_report_id: string;
    encargado_cierre: string;
};

export const getColumns = (isSecurityEngineer: boolean): ColumnDef<Reportability>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-help">{row.original.id}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>ID del reporte: {row.original.id}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
        enableHiding: false,
    },
    {
        accessorKey: 'gerencia_name',
        header: 'Gerencia',
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-help">{row.original.gerencia_name}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Gerencia: {row.original.gerencia_name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
        enableHiding: true,
    },
    {
        accessorKey: 'tipo_reporte',
        header: 'Tipo Reporte',
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-help">{row.original.tipo_reporte}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Tipo de reporte: {row.original.tipo_reporte}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
        enableHiding: true,
    },
    {
        accessorKey: 'fecha_evento',
        header: 'Fecha Evento',
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-help">{formatDateTime(row.original.fecha_evento)}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Fecha del evento: {formatDateTime(row.original.fecha_evento)}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
        enableHiding: true,
    },
    {
        accessorKey: 'nombres',
        header: 'Generado por',
        cell: ({ row }) => {
            const nombreCompleto = `${row.original.nombres} ${row.original.apellidos}`.trim();
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-help">{nombreCompleto}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Generado por: {nombreCompleto}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
        enableHiding: true,
    },
    {
        accessorKey: 'encargado_cierre',
        header: 'Encargado de cierre',
        cell: ({ row }) => {
            const encargado = row.original.encargado_cierre || '-';
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-help">{encargado}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Encargado de cierre: {encargado}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
        enableHiding: true,
    },
    {
        accessorKey: 'company_name',
        header: 'Empresa que reporta',
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-help">{row.original.company_name}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Empresa generadora: {row.original.company_name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
        enableHiding: true,
    },
    {
        accessorKey: 'company_report_name',
        header: 'Empresa Reportarada',
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-help">{row.original.company_report_name}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Empresa reportada: {row.original.company_report_name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
        enableHiding: true,
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
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge variant={'default'} className={`${badgeClass} cursor-help`}>
                                {badgeText}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Estado del reporte: {badgeText}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
        enableHiding: true,
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
        enableHiding: false,
    },
];
