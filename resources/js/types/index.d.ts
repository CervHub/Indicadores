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

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
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