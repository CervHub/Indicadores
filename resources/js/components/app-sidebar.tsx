import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { getPermissionDescription } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { BarChart, Building, FileText, LayoutDashboard, Settings, ShieldAlert, ShieldCheck, Truck, Users } from 'lucide-react'; // Updated icons
import AppLogo from './app-logo';

const groupedNavItems = [
    {
        group: 'Gestión',
        items: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: LayoutDashboard,
                isActive: window.location.pathname === '/dashboard',
                roles: ['admin', 'security', 'company'],
            },
            {
                title: 'Empresas',
                url: '/contractor',
                icon: Building,
                isActive: window.location.pathname === '/contractor',
                roles: ['admin'],
            },
            {
                title: 'Gerencias',
                url: '/admin/management',
                icon: Users,
                isActive: window.location.pathname === '/admin/management',
                roles: ['admin'],
            },
            {
                title: 'Gestión de SSO',
                url: '/admin/category',
                icon: ShieldAlert,
                isActive: window.location.pathname === '/admin/category',
                roles: ['admin'],
            },
            {
                title: 'Vehículos',
                url: '/vehicle',
                icon: Truck,
                isActive: window.location.pathname === '/vehicle',
                roles: ['admin', 'company'],
            },
        ],
    },
    {
        group: 'Herramientas',
        items: [
            {
                title: 'Indicadores',
                url: '/annexes',
                icon: BarChart,
                isActive: window.location.pathname === '/annexes',
                roles: ['company'],
            },
            {
                title: 'Consolidados',
                url: '/consolidated',
                icon: FileText,
                isActive: window.location.pathname === '/consolidated',
                roles: ['admin'],
            },
            {
                title: 'Reporte',
                url: '/admin/reportability',
                icon: FileText,
                isActive: window.location.pathname === '/admin/reportability',
                roles: ['admin', 'security', 'company'],
            },
            {
                title: 'Formatos',
                url: '/format',
                icon: FileText,
                isActive: window.location.pathname === '/format',
                roles: ['admin', 'security', 'company'],
            },
        ],
    },
    {
        group: 'Configuración',
        items: [
            {
                title: 'Configuración',
                url: '/settings/general',
                icon: Settings,
                isActive: window.location.pathname === '/settings',
                roles: ['admin'],
            },
        ],
    },
    {
        group: 'Personal',
        items: [
            {
                title: 'Personal',
                url: '/contrata/personal',
                icon: ShieldCheck,
                isActive: window.location.pathname === '/contrata/personal',
                roles: ['company', 'security'],
            },
            {
                title: 'Ingeniero de Seguridad',
                url: '/admin/security-engineer',
                icon: ShieldCheck,
                isActive: window.location.pathname === '/admin/security-engineer',
                roles: ['company'],
            },
        ],
    },
];

export function AppSidebar() {
    const { props } = usePage<{ auth: { user: { role_id: string; company_id: string } } }>();
    const userRoleId = getPermissionDescription(Number(props.auth.user.role_id));
    const userCompanyId = props.auth.user.company_id;

    if (!userRoleId) {
        return null; // Do not render anything if role_id is not present
    }

    const userRoles = [userRoleId]; // Assuming role_id is a single role, wrap it in an array

    // Filter nav items based on user roles and company_id
    const filteredNavGroups = groupedNavItems
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => {
                if (item.title === 'Ingeniero de Seguridad' && userCompanyId !== '1') {
                    return false;
                }
                return item.roles.some((role) => userRoles.includes(role));
            }),
        }))
        .filter((group) => group.items.length > 0); // Remove empty groups

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
