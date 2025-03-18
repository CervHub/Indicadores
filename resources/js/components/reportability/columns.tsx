'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatDateTime } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, FileText } from 'lucide-react';

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

export const getColumns = (
    handleClick: (action: string, report: Reportability) => void,
    isLoading: boolean,
    setIsLoading: (loading: boolean) => void,
): ColumnDef<Reportability>[] => [
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
            return (
                <Badge variant={'default'} className={estado === 'Generado' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-black'}>
                    {estado}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
            const [isLoading, setIsLoading] = useState(false);
            const urlDetalle = route('admin.reportability.detalle', { reportability_id: row.original.id });
            const handlePdfClick = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(route('company.reportability.download', { reportability_id: row.original.id }), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/pdf',
                        },
                    });
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `report_${row.original.id}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                } catch (error) {
                    console.error('Error downloading PDF:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            return (
                <ToggleGroup type="multiple" variant="outline">
                    <ToggleGroupItem
                        value="detalle"
                        aria-label="Toggle detalle"
                        className="flex h-7 cursor-pointer items-center bg-blue-700 p-2 text-xs text-white hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-800"
                    >
                        <Link href={urlDetalle} className="flex items-center">
                            <Eye className="mr-1 h-3 w-3" /> Detalle
                        </Link>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="pdf"
                        aria-label="Toggle pdf"
                        className="h-7 cursor-pointer bg-red-700 p-2 text-xs text-white hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-800"
                        onClick={handlePdfClick}
                    >
                        {isLoading ? (
                            <span className="loader"></span> // Aquí puedes agregar un spinner o cualquier indicador de carga
                        ) : (
                            <>
                                <FileText className="h-3 w-3" /> PDF
                            </>
                        )}
                    </ToggleGroupItem>
                </ToggleGroup>
            );
        },
    },
];
