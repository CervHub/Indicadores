import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles: string[];
}
export interface Company = {
    id: string;
    nombre: string;
    ruc: string;
    email: string;
    descripcion: string;
    estado: string;
    created_at: string;
    updated_at: string;
    contractor_company_type_id: string | null;
    situation: string | null;
    code: string;
};
export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface Report {
    areaInvolucrada: string | null;
    causaReporte: string;
    descripcionEvento: string;
    eliminadoEn: string | null;
    estadoReporte: string;
    fechaEvento: string;
    fechaReporte: string;
    idCausa: string;
    idEmpresaReporta: string;
    idEmpresaReportada: string;
    idGerencia: string;
    idUsuarioCierre: string | null;
    idUsuarioReasignado: string | null;
    idUsuarioReporta: string;
    motivoReasignacion: string | null;
    nivelGravedad: string;
    nombreEmpresaReporta: string;
    nombreEmpresaReportada: string;
    nombreGerencia: string;
    nombreUsuarioCierre: string;
    nombreUsuarioReasignado: string;
    nombreUsuarioReporta: string;
    tipoReporte: string;
    reportClosedAt?: string | null;
    nombreUsuarioRealmenteCerro?: string | null;
    idUsuarioRealmenteCerro?: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role_code: string;
    company_id: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface ReportabilityVehicle {
    id: string;
    fecha_evento: string;
    fecha_reporte: string;
    estado: string;
    nombre_usuario: string;
    nombre_empresa: string;
    tipo_inspeccion_descripcion: string;
};
