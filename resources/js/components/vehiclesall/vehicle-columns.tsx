import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Vehicle = {
    placa: string;
    codigo: string | null;
    is_linked?: boolean;
    nombre_company?: string;
    pre_use_estado?: string | null;
    pre_use_status?: string | null;
    pre_use_conformidad?: string | null;
    pre_use_fecha_vencimiento?: string | null;
    pre_use_visit_estado?: string | null;
    pre_use_visit_status?: string | null;
    pre_use_visit_conformidad?: string | null;
    pre_use_visit_fecha_vencimiento?: string | null;
    trimestral_estado?: string | null;
    trimestral_status?: string | null;
    trimestral_conformidad?: string | null;
    trimestral_fecha_vencimiento?: string | null;
    semestral_estado?: string | null;
    semestral_status?: string | null;
    semestral_conformidad?: string | null;
    semestral_fecha_vencimiento?: string | null;
    anual_estado?: string | null;
    anual_status?: string | null;
    parada_planta_estado?: string | null;
    parada_planta_status?: string | null;
    parada_planta_conformidad?: string | null;
    parada_planta_fecha_vencimiento?: string | null;
    // ...otros campos si es necesario...
}

// Devuelve la fecha actual en Lima (Perú) usando Intl API
function getNowPeru() {
    // Obtener la hora actual en Lima usando el timezone correcto
    const now = new Date();
    // Obtener la fecha/hora en Lima como string y volver a Date
    const limaString = now.toLocaleString('en-US', { timeZone: 'America/Lima' });
    return new Date(limaString);
}

// Formatea la fecha al estándar de Perú (DD/MM/YYYY HH:mm) usando el timezone de Lima
function formatPeruDate(dateStr?: string | null) {
    if (!dateStr) return 'Sin data';
    const date = new Date(dateStr);
    // Convertir la fecha a la zona horaria de Lima
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Lima',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    // El resultado es "DD/MM/YYYY, HH:mm"
    const formatted = date.toLocaleString('es-PE', options).replace(',', '');
    return formatted;
}

// Devuelve una cuenta regresiva en formato "Xd Xh Xm"
function getCountdown(fecha_vencimiento?: string | null) {
    if (!fecha_vencimiento) return null;
    const now = getNowPeru();
    const venc = new Date(fecha_vencimiento);
    const diff = venc.getTime() - now.getTime();
    if (diff <= 0) return null;
    const mins = Math.floor(diff / 60000) % 60;
    const hours = Math.floor(diff / (60 * 60000)) % 24;
    const days = Math.floor(diff / (24 * 60 * 60000));
    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    parts.push(`${mins}m`);
    return parts.join(' ');
}

function InspectionBadge({
    estado,
    status,
    conformidad,
    fecha_vencimiento,
    label,
    isParadaAnual = false,
}: {
    estado?: string | null;
    status?: string | null;
    conformidad?: string | null;
    fecha_vencimiento?: string | null;
    label: string;
    isParadaAnual?: boolean;
}) {
    let display = 'Sin data';
    let variant: "success" | "warning" | "secondary" = "secondary";
    let vencida = false;

    // Determinar si la fecha está vencida
    if (fecha_vencimiento) {
        const now = getNowPeru();
        const venc = new Date(fecha_vencimiento);
        if (venc < now) {
            vencida = true;
        }
    }

    if (isParadaAnual) {
        if (vencida) {
            display = 'No conforme';
            variant = "warning";
        } else if (estado?.toLowerCase() === 'generado') {
            display = 'Generado';
            variant = "secondary";
        } else if (status && status.toLowerCase() === 'aprobado') {
            display = 'Conforme';
            variant = "success";
        } else if (
            status &&
            ['rechazado', 'desaprobado'].includes(status.toLowerCase())
        ) {
            display = 'No conforme';
            variant = "warning";
        }
    } else {
        if (vencida) {
            display = 'No conforme';
            variant = "warning";
        } else if (status && status.toLowerCase() === 'aprobado') {
            display = 'Conforme';
            variant = "success";
        } else if (
            status &&
            ['rechazado', 'desaprobado'].includes(status.toLowerCase())
        ) {
            display = 'No conforme';
            variant = "warning";
        }
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant={variant}>{display}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <div><strong>Status:</strong> {status ?? 'Sin data'}</div>
                        <div><strong>Estado:</strong> {estado ?? 'Sin data'}</div>
                        <div><strong>Conformidad:</strong> {conformidad ?? 'Sin data'}</div>
                        <div>
                            <strong>Vencimiento:</strong> {formatPeruDate(fecha_vencimiento)}
                            {fecha_vencimiento && getCountdown(fecha_vencimiento) && (
                                <span style={{ marginLeft: 8, color: '#f59e42', fontWeight: 500 }}>
                                    (Faltan {getCountdown(fecha_vencimiento)})
                                </span>
                            )}
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// Acción handler (debe ser pasada por props en DataTable, aquí solo referencia)
export type VehicleAction = 'ver' | 'descargar_qr';

// Cambia a función que recibe onAction
export function getVehicleColumns(onAction?: (placa: string, action: VehicleAction) => void): ColumnDef<Vehicle>[] {
    return [
        {
            accessorKey: 'placa',
            header: () => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>Placa</span>
                        </TooltipTrigger>
                        <TooltipContent>Placa</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            accessorKey: 'codigo',
            header: () => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>Cód.</span>
                        </TooltipTrigger>
                        <TooltipContent>Código de Vehículo</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            accessorKey: 'nombre_company',
            header: () => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>Emp.</span>
                        </TooltipTrigger>
                        <TooltipContent>Empresa Vinculada</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            accessorKey: 'pre_use_estado',
            header: () => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>Diaria</span>
                        </TooltipTrigger>
                        <TooltipContent>Inspección Diaria</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
            cell: ({ row }) => (
                <InspectionBadge
                    estado={row.original.pre_use_estado}
                    status={row.original.pre_use_status}
                    conformidad={row.original.pre_use_conformidad}
                    fecha_vencimiento={row.original.pre_use_fecha_vencimiento}
                    label="Ins. Diaria"
                />
            ),
        },
        {
            accessorKey: 'pre_use_visit_estado',
            header: () => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>Diaria V.</span>
                        </TooltipTrigger>
                        <TooltipContent>Inspección Diaria Visita</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
            cell: ({ row }) => (
                <InspectionBadge
                    estado={row.original.pre_use_visit_estado}
                    status={row.original.pre_use_visit_status}
                    conformidad={row.original.pre_use_visit_conformidad}
                    fecha_vencimiento={row.original.pre_use_visit_fecha_vencimiento}
                    label="Ins. Diaria Visita"
                />
            ),
        },
        {
            accessorKey: 'trimestral_estado',
            header: () => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>Trim.</span>
                        </TooltipTrigger>
                        <TooltipContent>Inspección Trimestral</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
            cell: ({ row }) => (
                <InspectionBadge
                    estado={row.original.trimestral_estado}
                    status={row.original.trimestral_status}
                    conformidad={row.original.trimestral_conformidad}
                    fecha_vencimiento={row.original.trimestral_fecha_vencimiento}
                    label="Ins. Trimestral"
                />
            ),
        },
        {
            accessorKey: 'semestral_estado',
            header: () => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>Sem.</span>
                        </TooltipTrigger>
                        <TooltipContent>Inspección Semestral</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
            cell: ({ row }) => (
                <InspectionBadge
                    estado={row.original.semestral_estado}
                    status={row.original.semestral_status}
                    conformidad={row.original.semestral_conformidad}
                    fecha_vencimiento={row.original.semestral_fecha_vencimiento}
                    label="Ins. Semestral"
                />
            ),
        },
        {
            accessorKey: 'anual_estado',
            header: () => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>Parada</span>
                        </TooltipTrigger>
                        <TooltipContent>Parada Anual</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
            cell: ({ row }) => (
                <InspectionBadge
                    estado={row.original.parada_planta_estado}
                    status={row.original.parada_planta_status}
                    conformidad={row.original.parada_planta_conformidad}
                    fecha_vencimiento={row.original.parada_planta_fecha_vencimiento}
                    label="Parada Anual"
                    isParadaAnual={true}
                />
            ),
        },
        {
            id: 'acciones',
            header: () => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>Acciones</span>
                        </TooltipTrigger>
                        <TooltipContent>Acciones</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
            cell: ({ row }) => {
                const placa = row.original.placa;
                return (
                    <div className="flex gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => onAction?.(placa, 'ver')}
                            title="Ver"
                        >
                            <Eye size={16} />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => onAction?.(placa, 'descargar_qr')}
                            title="Descargar QR"
                        >
                            <QrCode size={16} />
                        </Button>
                    </div>
                );
            },
            enableSorting: false,
            enableColumnFilter: false,
        },
    ];
}
