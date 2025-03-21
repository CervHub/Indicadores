'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';

export type MinemTemplate2 = {
    company: string;
    concession_code: string;
    concession_name: string;
    created_at: string;
    deleted_at: string | null;
    female_administrative: string;
    female_general_operations: string;
    female_managers: string;
    female_plant_staff: string;
    file_status_id: string;
    id: number;
    male_administrative: string;
    male_general_operations: string;
    male_managers: string;
    male_plant_staff: string;
    month: string;
    updated_at: string;
    year: string;
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

export const getColumns = (): ColumnDef<MinemTemplate2>[] => [
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
        accessorKey: 'concession_code',
        header: () => renderTooltip('Codigo de la Concesion', 'Código de la Concesión'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'male_managers',
        header: () => renderTooltip('Gerentes Hombres', 'Gerentes H.'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'male_administrative',
        header: () => renderTooltip('Administrativos Hombres', 'Administrativos H.'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'male_general_operations',
        header: () => renderTooltip('Operaciones Generales Hombres', 'Operaciones Generales H.'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'male_plant_staff',
        header: () => renderTooltip('Personal de Planta Hombres', 'Personal de Planta H.'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'female_managers',
        header: () => renderTooltip('Gerentes Mujeres', 'Gerentes M.'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'female_administrative',
        header: () => renderTooltip('Administrativos Mujeres', 'Administrativos M.'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'female_plant_staff',
        header: () => renderTooltip('Personal de Planta Mujeres', 'Personal de Planta M.'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'female_general_operations',
        header: () => renderTooltip('Operaciones Generales Mujeres', 'Operaciones Generales M.'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
];
