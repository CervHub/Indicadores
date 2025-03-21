'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';

export type Annex30 = {
    company: string;
    accident_type: string;
    age: string;
    created_at: string;
    day: string;
    deleted_at: string | null;
    disability: string;
    education_level: string;
    file_status_id: string;
    id: number;
    injury_nature: string;
    marital_status: string;
    month: string;
    month_name: string;
    occupation: string;
    partial_permanent: string;
    partial_temporary: string;
    permanent_temporary: string;
    remuneration: number;
    time: string;
    total_permanent: string;
    updated_at: string;
    year: string;
    years_experience: string;
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

export const getColumns = (): ColumnDef<Annex30>[] => [
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
        accessorKey: 'accident_type',
        header: () => renderTooltip('Tipo De Accidente (Tabla 10 De Anexo N° 31)', 'T.A.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'injury_nature',
        header: () => renderTooltip('Naturaleza De La Lesión (Tabla 11 De Anexo N° 31)', 'N.L.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'age',
        header: () => renderTooltip('Edad', 'Edad'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'marital_status',
        header: () => renderTooltip('Estado Civil', 'E.C.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'education_level',
        header: () => renderTooltip('Nivel De Educación', 'N.E.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'years_experience',
        header: () => renderTooltip('Años De Experiencia', 'A.E.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'time',
        header: () => renderTooltip('Tiempo', 'T.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'day',
        header: () => renderTooltip('Día', 'Día'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'month_name',
        header: () => renderTooltip('Mes', 'Mes'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'partial_temporary',
        header: () => renderTooltip('Parcial Temporal', 'P.T.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'permanent_temporary',
        header: () => renderTooltip('Permanente Temporal', 'P.T.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'partial_permanent',
        header: () => renderTooltip('Parcial Permanente', 'P.P.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'total_permanent',
        header: () => renderTooltip('Total Permanente', 'T.P.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'disability',
        header: () => renderTooltip('Incapacidad', 'I.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'occupation',
        header: () => renderTooltip('Ocupación', 'O.'),
        cell: (info) => renderTooltip(info.getValue() as string, info.getValue() as string),
    },
    {
        accessorKey: 'remuneration',
        header: () => renderTooltip('Remuneración', 'R.'),
        cell: (info) => <span>{info.getValue() as number}</span>,
    },
];
