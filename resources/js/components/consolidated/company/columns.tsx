'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type Company = {
    nombre: string;
    ruc: string;
    estado: string; // 'Subió' | 'No subió nada'
    anexos: { uea: string | null; tipo: string | null; fecha: string | null }[];
};

export const getColumns = (): ColumnDef<Company>[] => [
    {
        accessorKey: 'nombre',
        header: 'Nombre',
        cell: ({ row }) => row.original.nombre || 'N/A',
    },
    {
        accessorKey: 'ruc',
        header: 'RUC',
        cell: ({ row }) => row.original.ruc || 'N/A',
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => (
            <Badge variant={row.original.estado === 'Subió' ? 'success' : 'destructive'}>
                {row.original.estado}
            </Badge>
        ),
    },
    {
        id: 'anexos_badges',
        header: 'Anexos',
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-1">
                {row.original.anexos && row.original.anexos.length > 0 ? (
                    row.original.anexos.map((anexo, idx) => (
                        <TooltipProvider key={idx}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="outline" className="cursor-pointer">
                                        {anexo.uea || 'Anexo'}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-xs">
                                        <div><strong>UEA:</strong> {anexo.uea || '-'}</div>
                                        <div><strong>Tipo:</strong> {anexo.tipo || '-'}</div>
                                        <div><strong>Fecha:</strong> {anexo.fecha || '-'}</div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))
                ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                )}
            </div>
        ),
    },
];
