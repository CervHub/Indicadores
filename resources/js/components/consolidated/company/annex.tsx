'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

export type Annex = {
    id: string;
    company: string;
    uea: string;
    type: string;
    empl: string;
    obr: string;
    day1: string;
    day2: string;
    day3: string;
    day4: string;
    day5: string;
    day6: string;
    day7: string;
    day8: string;
    day9: string;
    day10: string;
    day11: string;
    day12: string;
    day13: string;
    day14: string;
    day15: string;
    day16: string;
    day17: string;
    day18: string;
    day19: string;
    day20: string;
    day21: string;
    day22: string;
};

const renderTooltip = (day: string, value: string) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <span>{value}</span>
            </TooltipTrigger>
            <TooltipContent>
                <p>
                    {day}: {value}
                </p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export const getColumns = (handleActionClick: (id: string, action: string) => void): ColumnDef<Annex>[] => [
    {
        id: 'actions',
        cell: ({ row }) => {
            const item = row.original;

            return (
                <div className="flex gap-2">
                    <span
                        aria-label="Eliminar"
                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-red-700 text-xs text-white hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-800"
                        onClick={() => handleActionClick(item, 'e-a')}
                    >
                        <Trash2 className="h-4 w-4" />
                    </span>
                </div>
            );
        },
    },
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
        accessorKey: 'empl',
        header: 'Empl',
    },
    {
        accessorKey: 'obr',
        header: 'Obr',
    },
    {
        accessorKey: 'day1',
        header: 'D. 1',
        cell: (info) => renderTooltip('D. 1', info.getValue()),
    },
    {
        accessorKey: 'day2',
        header: 'D. 2',
        cell: (info) => renderTooltip('D. 2', info.getValue()),
    },
    {
        accessorKey: 'day3',
        header: 'D. 3',
        cell: (info) => renderTooltip('D. 3', info.getValue()),
    },
    {
        accessorKey: 'day4',
        header: 'D. 4',
        cell: (info) => renderTooltip('D. 4', info.getValue()),
    },
    {
        accessorKey: 'day5',
        header: 'D. 5',
        cell: (info) => renderTooltip('D. 5', info.getValue()),
    },
    {
        accessorKey: 'day6',
        header: 'D. 6',
        cell: (info) => renderTooltip('D. 6', info.getValue()),
    },
    {
        accessorKey: 'day7',
        header: 'D. 7',
        cell: (info) => renderTooltip('D. 7', info.getValue()),
    },
    {
        accessorKey: 'day8',
        header: 'D. 8',
        cell: (info) => renderTooltip('D. 8', info.getValue()),
    },
    {
        accessorKey: 'day9',
        header: 'D. 9',
        cell: (info) => renderTooltip('D. 9', info.getValue()),
    },
    {
        accessorKey: 'day10',
        header: 'D. 10',
        cell: (info) => renderTooltip('D. 10', info.getValue()),
    },
    {
        accessorKey: 'day11',
        header: 'D. 11',
        cell: (info) => renderTooltip('D. 11', info.getValue()),
    },
    {
        accessorKey: 'day12',
        header: 'D. 12',
        cell: (info) => renderTooltip('D. 12', info.getValue()),
    },
    {
        accessorKey: 'day13',
        header: 'D. 13',
        cell: (info) => renderTooltip('D. 13', info.getValue()),
    },
    {
        accessorKey: 'day14',
        header: 'D. 14',
        cell: (info) => renderTooltip('D. 14', info.getValue()),
    },
    {
        accessorKey: 'day15',
        header: 'D. 15',
        cell: (info) => renderTooltip('D. 15', info.getValue()),
    },
    {
        accessorKey: 'day16',
        header: 'D. 16',
        cell: (info) => renderTooltip('D. 16', info.getValue()),
    },
    {
        accessorKey: 'day17',
        header: 'D. 17',
        cell: (info) => renderTooltip('D. 17', info.getValue()),
    },
    {
        accessorKey: 'day18',
        header: 'D. 18',
        cell: (info) => renderTooltip('D. 18', info.getValue()),
    },
    {
        accessorKey: 'day19',
        header: 'D. 19',
        cell: (info) => renderTooltip('D. 19', info.getValue()),
    },
    {
        accessorKey: 'day20',
        header: 'D. 20',
        cell: (info) => renderTooltip('D. 20', info.getValue()),
    },
    {
        accessorKey: 'day21',
        header: 'D. 21',
        cell: (info) => renderTooltip('D. 21', info.getValue()),
    },
    {
        accessorKey: 'day22',
        header: 'D. 22',
        cell: (info) => renderTooltip('D. 22', info.getValue()),
    },
];
