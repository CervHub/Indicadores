import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { getPermissionDescription } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { BarChart, Building, FileText, LayoutDashboard, Settings, ShieldAlert, ShieldCheck, Truck, Users } from 'lucide-react'; // Updated icons
import AppLogo from './app-logo';


// SA: 'Super Admin',
// RU: 'Regular User',
// CA: 'Company Admin',
// SCC: 'Sub Comité de Contratistas',
// ALM: 'Almacenes',
// PI: 'Proyectos de Inversión',
// CO: 'Contratos de Obras',
// CS: 'Contratos y Servicios',
// IS: 'Ingeniero de Seguridad',


const groupedNavItems = [
    {
        group: 'Gestión',
        items: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: LayoutDashboard,
                isActive: window.location.pathname === '/dashboard',
                roles: ['SA', 'IS', 'CA', 'SCC', 'ALM', 'PI', 'CO', 'CS'], // Updated to use role codes
            },
            {
                title: 'Empresas',
                url: '/contractor',
                icon: Building,
                isActive: window.location.pathname === '/contractor',
                roles: ['SA'], // Updated to use role codes
            },
            {
                title: 'Gerencias',
                url: '/admin/management',
                icon: Users,
                isActive: window.location.pathname === '/admin/management',
                roles: ['SA'], // Updated to use role codes
            },
            {
                title: 'Gestión de SSO',
                url: '/admin/category',
                icon: ShieldAlert,
                isActive: window.location.pathname === '/admin/category',
                roles: ['SA'], // Updated to use role codes
            },
            {
                title: 'Vehículos',
                url: '/vehicle',
                icon: Truck,
                isActive: window.location.pathname === '/vehicle',
                roles: [], // No roles required
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
                roles: ['CA'], // Updated to use role codes
            },
            {
                title: 'Consolidados',
                url: '/consolidated',
                icon: FileText,
                isActive: window.location.pathname === '/consolidated',
                roles: ['SA', 'SCC', 'ALM', 'PI', 'CO', 'CS'], // Updated to use role codes
            },
            {
                title: 'Reporte',
                url: '/admin/reportability',
                icon: FileText,
                isActive: window.location.pathname === '/admin/reportability',
                roles: ['SA', 'IS', 'CA', 'SCC'], // Updated to use role codes
            },
            {
                title: 'Formatos',
                url: '/format',
                icon: FileText,
                isActive: window.location.pathname === '/format',
                roles: [], // No roles required
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
                roles: ['SA'], // Updated to use role codes
            },
        ],
    },
    {
        group: 'Personal',
        items: [
            {
                title: 'Personal',
                url: '/contrata/personal',
                icon: Users,
                isActive: window.location.pathname === '/contrata/personal',
                roles: ['CA', 'IS'], // Updated to use role codes
            },
            {
                title: 'Ingeniero de Seguridad',
                url: '/admin/security-engineer',
                icon: ShieldCheck,
                isActive: window.location.pathname === '/admin/security-engineer',
                roles: [], // Updated to use role codes
            },
            {
                title: 'Roles',
                url: '/contrata/roles',
                icon: ShieldCheck,
                isActive: window.location.pathname === '/contrata/roles',
                roles: ['CA'], // Updated to use role codes
            }
        ],
    },
];

export function AppSidebar() {
    const { props } = usePage<{ auth: { user: { role_code: string; company_id: string } } }>();
    const userRoleCode = props.auth.user.role_code; // Use role_id directly as the role code

    const userCompanyId = props.auth.user.company_id;

    const userRoleCodes = userRoleCode ? [userRoleCode] : []; // Wrap role_id in an array if present

    // Filter nav items based on user roles and company_id
    const filteredNavGroups = groupedNavItems
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => {
                if (item.title === 'Ingeniero de Seguridad' && userCompanyId !== '1') {
                    return false;
                }
                if (item.title === 'Roles' && userCompanyId !== '1') {
                    return false;
                }
                return item.roles.some((role) => userRoleCodes.includes(role)); // Compare with role_id
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
                {filteredNavGroups.length > 0 ? (
                    filteredNavGroups.map((group) => (
                        <div key={group.group}>
                            <NavMain items={group.items} title={group.group} />
                        </div>
                    ))
                ) : (
                    <div></div> // Render a placeholder when no items are available
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
