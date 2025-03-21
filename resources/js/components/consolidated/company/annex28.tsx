'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';

export type Annex28 = {
    company: string;
    accident_rate: number;
    created_at: string;
    dangerous_incidents: number;
    deleted_at: string | null;
    disability: number;
    employees: number;
    file_status_id: string;
    frequency_index: number;
    id: number;
    incidents: number;
    lost_days: number;
    man_hours_worked: number;
    minor_accidents: number;
    month: number;
    mortality: number;
    severity_index: number;
    situation: string;
    updated_at: string;
    workers: number;
    year: number;
};

const renderTooltip = (field: string, value: string) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <span>{value}</span>
            </TooltipTrigger>
            <TooltipContent>
                <p>{field}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export const getColumns = (): ColumnDef<Annex28>[] => [
    {
        accessorKey: 'uea',
        header: 'UEA',
        cell: (info) => renderTooltip('UEA', info.getValue()),
    },
    {
        accessorKey: 'type',
        header: 'Tipo',
        cell: (info) => renderTooltip('Tipo', info.getValue()),
    },
    {
        accessorKey: 'company',
        header: 'Contrata',
        cell: (info) => renderTooltip('Compañía', info.getValue()),
    },
    {
        accessorKey: 'situation',
        header: () => renderTooltip('Situación', 'Situación'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'employees',
        header: () => renderTooltip('Empleados', 'Empleados'),
        cell: (info) => <span>{info.getValue() as number}</span>,
        size: 200,
    },
    {
        accessorKey: 'workers',
        header: () => renderTooltip('Obreros', 'Obreros'),
        cell: (info) => <span>{info.getValue() as number}</span>,
    },
    {
        accessorKey: 'incidents',
        header: () => renderTooltip('Incidentes', 'Incidentes'),
        cell: (info) => <span>{info.getValue() as number}</span>,
    },
    {
        accessorKey: 'dangerous_incidents',
        header: () => renderTooltip('Incidentes peligrosos', 'Inc. peligrosos'),
        cell: (info) => <span>{info.getValue() as number}</span>,
    },
    {
        accessorKey: 'minor_accidents',
        header: () => renderTooltip('Accidentes menores', 'Acc. menores'),
        cell: (info) => <span>{info.getValue() as number}</span>,
    },
    {
        accessorKey: 'disability',
        header: () => renderTooltip('Incapacidad', 'Incapacidad'),
        cell: (info) => <span>{info.getValue() as number}</span>,
    },
    {
        accessorKey: 'mortality',
        header: () => renderTooltip('Mortal', 'Mortal'),
        cell: (info) => <span>{info.getValue() as number}</span>,
    },
    {
        accessorKey: 'lost_days',
        header: () => renderTooltip('Días perdidos', 'Días perdidos'),
        cell: (info) => <span>{formatNumber(info.getValue() as number)}</span>,
    },
    {
        accessorKey: 'man_hours_worked',
        header: () => renderTooltip('Horas hombre trabajadas', 'H.H.T.'),
        cell: (info) => <span>{formatNumber(info.getValue() as number)}</span>,
    },
    {
        accessorKey: 'frequency_index',
        header: () => renderTooltip('Índice de frecuencia', 'Índ. frecuencia'),
        cell: (info) => <span>{formatNumber(info.getValue() as number)}</span>,
    },
    {
        accessorKey: 'severity_index',
        header: () => renderTooltip('Índice de severidad', 'Índ. severidad'),
        cell: (info) => <span>{formatNumber(info.getValue() as number)}</span>,
    },
    {
        accessorKey: 'accident_rate',
        header: () => renderTooltip('Tasa de accidentes', 'Tasa de acc.'),
        cell: (info) => <span>{formatNumber(info.getValue() as number)}</span>,
    },
];
