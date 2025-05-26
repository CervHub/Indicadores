import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

export type Vehicle = {
    id: number;
    brand: string;
    model: string;
    license_plate: string;
    code: string | null;
    vehicle_companies?: {
        company?: { nombre?: string; code?: string };
        code?: string;
        created_at?: string;
    }[];
    // ...otros campos si es necesario...
};

export const VehicleColumns: ColumnDef<Vehicle>[] = [

    {
        accessorKey: 'license_plate',
        header: 'Placa',
    },
    {
        accessorKey: 'code',
        header: 'Código de Vehículo',
        cell: ({ row }) => {
            // Toma la última vinculación y concatena company.code + vinculación.code
            const companies = row.original.vehicle_companies ?? [];
            if (!companies.length) return '';
            const sorted = [...companies].sort((a, b) =>
                (b.created_at ?? '') > (a.created_at ?? '') ? 1 : -1
            );
            const last = sorted[0];
            return `${last?.company?.code ?? ''}${last?.code ?? ''}`;
        },
    },
    {
        accessorKey: 'ultima_empresa_vinculada',
        header: 'Empresa Vinculada',
        cell: ({ row }) => {
            const companies = row.original.vehicle_companies ?? [];
            if (!companies.length) return '';
            // Ordenar por created_at descendente y tomar la más reciente
            const sorted = [...companies].sort((a, b) =>
                (b.created_at ?? '') > (a.created_at ?? '') ? 1 : -1
            );
            return sorted[0]?.company?.nombre ?? '';
        },
    },
    {
        accessorKey: 'ins_diaria',
        header: 'Ins. Diaria',
        cell: ({ row }) => {
            // Aquí puedes cambiar la lógica si tienes datos reales
            // Por ahora, siempre muestra "Sin data"
            return <Badge variant="secondary">Sin data</Badge>;
        },
    },
    {
        accessorKey: 'ins_diaria_visita',
        header: 'Ins. Diaria Visita',
        cell: ({ row }) => {
            return <Badge variant="secondary">Sin data</Badge>;
        },
    },
    {
        accessorKey: 'ins_trimestral',
        header: 'Ins. Trimestral',
        cell: ({ row }) => {
            return <Badge variant="secondary">Sin data</Badge>;
        },
    },
    {
        accessorKey: 'ins_semestral',
        header: 'Ins. Semestral',
        cell: ({ row }) => {
            return <Badge variant="secondary">Sin data</Badge>;
        },
    },
    {
        accessorKey: 'ins_parada_planta',
        header: 'Ins. Parada de Planta',
        cell: ({ row }) => {
            return <Badge variant="secondary">Sin data</Badge>;
        },
    },
];
