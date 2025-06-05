import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart,
    Building,
    FileText,
    LayoutDashboard,
    Settings,
    ShieldAlert,
    ShieldCheck,
    Truck,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

// Roles por app
const roles: Record<string, string[]> = {
    Dashboard: ['SA', 'IS', 'CA', 'SCC', 'ALM', 'PI', 'CO', 'CS', 'RU'],
    Empresas: ['SA'],
    Gerencias: ['SA'],
    'Gestión de SSO': ['SA'],
    Vehículos: [],
    Indicadores: ['CA'],
    Consolidados: ['SA', 'CA', 'SCC', 'ALM', 'PI', 'CO', 'CS'],
    Reporte: ['SA', 'IS', 'CA', 'SCC'],
    Formatos: [],
    Inspecciones: [],
    Configuración: ['SA'],
    Personal: ['CA', 'SA'],
    'Ingeniero de Seguridad': [],
    Roles: [],
};

function getRolesForItem(title: string): string[] {
    return roles[title] ?? [];
}

const groupedNavItems = [
    {
        group: 'Gestión',
        items: [
            { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
            { title: 'Empresas', url: '/contractor', icon: Building },
            { title: 'Gerencias', url: '/admin/management', icon: Users },
            { title: 'Gestión de SSO', url: '/admin/category', icon: ShieldAlert },
            { title: 'Vehículos', url: '/vehicle', icon: Truck },
        ],
    },
    {
        group: 'Herramientas',
        items: [
            { title: 'Indicadores', url: '/annexes', icon: BarChart },
            { title: 'Consolidados', url: '/consolidated', icon: FileText },
            { title: 'Reporte', url: '/admin/reportability', icon: FileText },
            { title: 'Formatos', url: '/format', icon: FileText },
            { title: 'Inspecciones', url: '/inspection', icon: FileText },
        ],
    },
    {
        group: 'Configuración',
        items: [
            { title: 'Configuración', url: '/settings/general', icon: Settings },
        ],
    },
    {
        group: 'Personal',
        items: [
            { title: 'Personal', url: '/contrata/personal', icon: Users },
            { title: 'Ingeniero de Seguridad', url: '/admin/security-engineer', icon: ShieldCheck },
            { title: 'Roles', url: '/contrata/roles', icon: ShieldCheck },
        ],
    },
];

export function AppSidebar() {
    const { props } = usePage<{ auth: { user: { role_code: string; company_id: string } } }>();
    const userRoleCode = props.auth.user.role_code;
    const userCompanyId = props.auth.user.company_id;
    const userRoleCodes = userRoleCode ? [userRoleCode] : [];

    const currentPath = window.location.pathname;
    const restrictedItems = ['Consolidados']; // Add more restricted items if needed

    const filteredNavGroups = groupedNavItems
        .map((group) => ({
            ...group,
            items: group.items
                .map((item) => ({
                    ...item,
                    roles: getRolesForItem(item.title),
                    isActive: currentPath === item.url,
                }))
                .filter((item) => {
                    let isRestricted = false;
                    restrictedItems.forEach((restrictedItem) => {
                        if (item.title === restrictedItem && userCompanyId !== '1') {
                            isRestricted = true;
                        }
                    });
                    if (isRestricted) {
                        return false;
                    }
                    return item.roles.some((role) => userRoleCodes.includes(role));
                }),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {filteredNavGroups.map((group) => (
                    <div key={group.group}>
                        <NavMain items={group.items} title={group.group} />
                    </div>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
