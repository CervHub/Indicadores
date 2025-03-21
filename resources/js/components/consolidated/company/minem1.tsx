'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';

export type MinemTemplate1 = {
    company: string;
    concession_code: string;
    concession_name: string;
    created_at: string;
    deleted_at: string | null;
    file_status_id: string;
    foreign_female_employees: string;
    foreign_female_workers: string;
    foreign_male_employees: string;
    foreign_male_workers: string;
    id: number;
    local_female_employees: string;
    local_female_workers: string;
    local_male_employees: string;
    local_male_workers: string;
    mining_activities: string;
    month: string;
    national_female_employees: string;
    national_female_workers: string;
    national_male_employees: string;
    national_male_workers: string;
    regional_female_employees: string;
    regional_female_workers: string;
    regional_male_employees: string;
    regional_male_workers: string;
    total_employees: string;
    total_hours_employees: string;
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

export const getColumns = (): ColumnDef<MinemTemplate1>[] => [
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
        header: () => renderTooltip('Codigo de la Concesion', 'Concesión'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'local_male_workers',
        header: () => renderTooltip('Obrero Hombre Trabajador Local', 'O.H.T.L'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'regional_male_workers',
        header: () => renderTooltip('Obrero Hombre Trabajador Regional', 'O.H.T.R'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'national_male_workers',
        header: () => renderTooltip('Obrero Hombre Trabajador Nacional', 'O.H.T.N'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'foreign_male_workers',
        header: () => renderTooltip('Obrero Hombre Trabajador Extranjero', 'O.H.T.E'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'local_female_workers',
        header: () => renderTooltip('Obrero Mujer Trabajadora Local', 'O.M.T.L'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'regional_female_workers',
        header: () => renderTooltip('Obrero Mujer Trabajadora Regional', 'O.M.T.R'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'national_female_workers',
        header: () => renderTooltip('Obrero Mujer Trabajadora Nacional', 'O.M.T.N'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'foreign_female_workers',
        header: () => renderTooltip('Obrero Mujer Trabajadora Extranjera', 'O.M.T.E'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'local_male_employees',
        header: () => renderTooltip('Empleado Hombre Trabajador Local', 'E.H.T.L'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'regional_male_employees',
        header: () => renderTooltip('Empleado Hombre Trabajador Regional', 'E.H.T.R'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'national_male_employees',
        header: () => renderTooltip('Empleado Hombre Trabajador Nacional', 'E.H.T.N'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'foreign_male_employees',
        header: () => renderTooltip('Empleado Hombre Trabajador Extranjero', 'E.H.T.E'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'local_female_employees',
        header: () => renderTooltip('Empleado Mujer Trabajadora Local', 'E.M.T.L'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'regional_female_employees',
        header: () => renderTooltip('Empleado Mujer Trabajadora Regional', 'E.M.T.R'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'national_female_employees',
        header: () => renderTooltip('Empleado Mujer Trabajadora Nacional', 'E.M.T.N'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'foreign_female_employees',
        header: () => renderTooltip('Empleado Mujer Trabajadora Extranjera', 'E.M.T.E'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'total_employees',
        header: () => renderTooltip('Total de Trabajadores', 'Trabajadores'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'total_hours_employees',
        header: () => renderTooltip('Total de Horas de Trabajo', 'Horas de Trabajo'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
        accessorKey: 'mining_activities',
        header: () => renderTooltip('Actividades Mineras', 'Actividades Mineras'),
        cell: (info) => <span>{info.getValue() as string}</span>,
    },
];
