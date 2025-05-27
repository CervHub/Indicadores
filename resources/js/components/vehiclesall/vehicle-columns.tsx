import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type Vehicle = {
    placa: string;
    codigo: string | null;
    is_linked?: boolean;
    nombre_company?: string;
    pre_use_estado?: string | null;
    pre_use_status?: string | null;
    pre_use_visit_estado?: string | null;
    pre_use_visit_status?: string | null;
    trimestral_estado?: string | null;
    trimestral_status?: string | null;
    semestral_estado?: string | null;
    semestral_status?: string | null;
    anual_estado?: string | null;
    anual_status?: string | null;
    // ...otros campos si es necesario...
};

function InspectionBadge({
    estado,
    status,
    label,
}: { estado?: string | null; status?: string | null; label: string }) {
    if (!estado && !status) {
        return <Badge variant="secondary">Sin data</Badge>;
    }
    let variant: "success" | "warning" | "secondary" = "secondary";
    if (status) {
        if (status.toLowerCase() === "aprobado") variant = "success";
        else if (status.toLowerCase() === "rechazado") variant = "warning";
    }
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant={variant}>{status ?? estado ?? 'Sin data'}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <div><strong>Status:</strong> {status ?? 'Sin data'}</div>
                        <div><strong>Estado:</strong> {estado ?? 'Sin data'}</div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export const VehicleColumns: ColumnDef<Vehicle>[] = [
    {
        accessorKey: 'placa',
        header: 'Placa',
    },
    {
        accessorKey: 'codigo',
        header: 'Código de Vehículo',
    },
    {
        accessorKey: 'nombre_company',
        header: 'Empresa Vinculada',
    },
    {
        accessorKey: 'pre_use_estado',
        header: 'Ins. Diaria',
        cell: ({ row }) => (
            <InspectionBadge
                estado={row.original.pre_use_estado}
                status={row.original.pre_use_status}
                label="Ins. Diaria"
            />
        ),
    },
    {
        accessorKey: 'pre_use_visit_estado',
        header: 'Ins. Diaria Visita',
        cell: ({ row }) => (
            <InspectionBadge
                estado={row.original.pre_use_visit_estado}
                status={row.original.pre_use_visit_status}
                label="Ins. Diaria Visita"
            />
        ),
    },
    {
        accessorKey: 'trimestral_estado',
        header: 'Ins. Trimestral',
        cell: ({ row }) => (
            <InspectionBadge
                estado={row.original.trimestral_estado}
                status={row.original.trimestral_status}
                label="Ins. Trimestral"
            />
        ),
    },
    {
        accessorKey: 'semestral_estado',
        header: 'Ins. Semestral',
        cell: ({ row }) => (
            <InspectionBadge
                estado={row.original.semestral_estado}
                status={row.original.semestral_status}
                label="Ins. Semestral"
            />
        ),
    },
    {
        accessorKey: 'anual_estado',
        header: 'Ins. Anual',
        cell: ({ row }) => (
            <InspectionBadge
                estado={row.original.anual_estado}
                status={row.original.anual_status}
                label="Ins. Anual"
            />
        ),
    },
];
