'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDateTime } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, FileText, Trash2, Lock, Unlock } from 'lucide-react';
import { useState, useEffect } from 'react';

// Este tipo define la forma de nuestros datos.
export type Reportability = {
    id: string;
    gerencia_name: string;
    tipo_reporte: string;
    fecha_evento: string;
    generado_por: string;
    encargado_cierre: string;
    company_name: string;
    company_report_name: string;
    estado: string;
    report_closed_at: string;
    deleted_at?: string | null;
};

export interface ColumnHandlers {
    onDetailClick: (id: string) => void;
    onPdfClick: (id: string) => void;
    onDeleteClick: (id: string) => void;
}

// Función para calcular el tiempo transcurrido
const calculateDuration = (fechaEvento: string, fechaCierre?: string | null): string => {
    const startDate = new Date(fechaEvento);
    const endDate = fechaCierre ? new Date(fechaCierre) : new Date();
    
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
        return `${diffDays}d ${diffHours}h ${diffMinutes}m`;
    } else if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}m`;
    } else {
        return `${diffMinutes}m`;
    }
};

// Componente para mostrar el tiempo con actualización en vivo
const DurationCell = ({ fechaEvento, fechaCierre, estado }: { fechaEvento: string, fechaCierre?: string | null, estado: string }) => {
    const [duration, setDuration] = useState(() => calculateDuration(fechaEvento, fechaCierre));
    
    // Un reporte está completamente cerrado si tiene fecha de cierre Y estado Cerrado/Finalizado
    const isFullyClosed = (fechaCierre !== null && fechaCierre !== undefined) && 
                         (estado === 'Cerrado' || estado === 'Finalizado');
    
    // Un reporte está parcialmente cerrado si tiene solo uno de los dos criterios
    const isPartiallyClosed = ((fechaCierre !== null && fechaCierre !== undefined) && 
                              !(estado === 'Cerrado' || estado === 'Finalizado')) ||
                             ((fechaCierre === null || fechaCierre === undefined) && 
                              (estado === 'Cerrado' || estado === 'Finalizado'));
    
    useEffect(() => {
        if (!isFullyClosed) {
            const interval = setInterval(() => {
                setDuration(calculateDuration(fechaEvento, fechaCierre));
            }, 60000); // Actualizar cada minuto
            
            return () => clearInterval(interval);
        }
    }, [fechaEvento, fechaCierre, isFullyClosed]);
    
    // Determinar colores basado en el estado de cierre
    let colorClass = '';
    let bgClass = '';
    let tooltipMessage = '';
    
    if (isFullyClosed) {
        colorClass = 'text-green-600';
        bgClass = 'bg-green-50';
        tooltipMessage = `Tiempo total para cerrar: ${duration}`;
    } else if (isPartiallyClosed) {
        colorClass = 'text-orange-600';
        bgClass = 'bg-orange-50';
        if (fechaCierre && !(estado === 'Cerrado' || estado === 'Finalizado')) {
            tooltipMessage = `Tiene fecha de cierre pero estado no es Cerrado/Finalizado: ${duration} (verificar estado)`;
        } else {
            tooltipMessage = `Estado es ${estado} pero sin fecha de cierre: ${duration} (verificar fecha)`;
        }
    } else {
        colorClass = 'text-red-600';
        bgClass = 'bg-red-50';
        tooltipMessage = `Tiempo transcurrido sin cerrar: ${duration} (actualizándose)`;
    }
    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className={`cursor-help px-2 py-1 rounded-md ${colorClass} ${bgClass} font-medium`}>
                        {duration}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipMessage}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export const getColumns = (isSecurityEngineer: boolean, handlers: ColumnHandlers, userRoleCode: string): ColumnDef<Reportability>[] => [
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
        accessorKey: 'generado_por',
        header: 'Generado por',
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-help">{row.original.generado_por}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Generado por: {row.original.generado_por}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
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
        header: 'Empresa Reportada',
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
                case 'Abierto':
                    badgeClass = 'bg-red-500 text-white';
                    badgeText = 'Abierto';
                    break;
                case 'Visualizado':
                case 'Revisado':
                    badgeClass = 'bg-orange-500 text-white';
                    badgeText = 'Revisado';
                    break;
                case 'Finalizado':
                case 'Cerrado':
                    badgeClass = 'bg-green-600 text-white';
                    badgeText = 'Cerrado';
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
        accessorKey: 'report_closed_at',
        header: 'Fecha de Cierre',
        cell: ({ row }) => {
            const fechaCierre = row.original.report_closed_at;
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-help">
                                {fechaCierre ? formatDateTime(fechaCierre) : '-'}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Fecha de cierre: {fechaCierre ? formatDateTime(fechaCierre) : 'No cerrado'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
        enableHiding: true,
    },
    {
        accessorKey: 'tiempo_cierre',
        header: 'Tiempo de Resolución',
        cell: ({ row }) => (
            <DurationCell 
                fechaEvento={row.original.fecha_evento}
                fechaCierre={row.original.report_closed_at}
                estado={row.original.estado}
            />
        ),
        enableHiding: true,
    },
    {
        accessorKey: 'deleted_at',
        header: 'Fecha de Eliminación',
        cell: ({ row }) => {
            const fechaEliminacion = row.original.deleted_at;
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-help">
                                {fechaEliminacion ? formatDateTime(fechaEliminacion) : '-'}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Fecha de eliminación: {fechaEliminacion ? formatDateTime(fechaEliminacion) : 'No eliminado'}</p>
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
            const isDeleted = row.original.deleted_at !== null && row.original.deleted_at !== undefined;

            const handleDetalleClick = () => {
                setDetalleClicked(true);
                handlers.onDetailClick(row.original.id);
            };

            const handlePdfClick = () => {
                handlers.onPdfClick(row.original.id);
            };

            const handleDeleteClick = () => {
                handlers.onDeleteClick(row.original.id);
            };

            return (
                <div className="flex items-center space-x-1 min-w-max">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={row.original.estado === 'Abierto' ? 'warning' : 'secondary'}
                                    aria-label={row.original.estado === 'Abierto' ? 'Ingresar y cerrar reporte' : 'Ver detalle'}
                                    className={`flex h-7 w-7 items-center justify-center p-0 ${detalleClicked ? 'cursor-not-allowed opacity-50' : ''} ${row.original.estado === 'Abierto' ? 'bg-red-700 hover:bg-red-900' : 'bg-green-700 hover:bg-green-900'} text-white`}
                                    onClick={handleDetalleClick}
                                    disabled={detalleClicked}
                                >
                                    {row.original.estado === 'Abierto' ? (
                                        <Unlock className="h-4 w-4" />
                                    ) : (
                                        <Lock className="h-4 w-4" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    {row.original.estado === 'Abierto'
                                        ? 'Haz click para ingresar y cerrar el reporte'
                                        : 'Este reporte está cerrado. Haz click para ver el detalle'}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    aria-label="Descargar PDF"
                                    className="h-7 w-7 bg-red-700 p-0 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-800"
                                    onClick={handlePdfClick}
                                >
                                    <FileText className="h-3 w-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Descargar PDF</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {userRoleCode === 'SA' && !isDeleted && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        aria-label="Eliminar"
                                        className="h-7 w-7 bg-red-500 p-0 hover:bg-red-700 dark:bg-red-400 dark:hover:bg-red-600"
                                        onClick={handleDeleteClick}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Eliminar reporte</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            );
        },
        enableHiding: false,
    },
];
