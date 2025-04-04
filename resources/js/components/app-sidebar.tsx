import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { getPermissionDescription } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { FileArchive, FileChartPie, FileText, HousePlus, LayoutGrid, Shield, ShieldPlusIcon, UserCheck, Users } from 'lucide-react'; // Import new icons
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
        isActive: window.location.pathname === '/dashboard',
        roles: ['admin', 'security', 'company'], // Add roles property
    },
    {
        title: 'Empresas',
        url: '/contractor',
        icon: HousePlus,
        isActive: window.location.pathname === '/contractor',
        roles: ['admin'],
    },
    {
        title: 'Indicadores',
        url: '/annexes',
        icon: FileArchive,
        isActive: window.location.pathname === '/annexes',
        roles: ['company'],
    },
    {
        title: 'Consolidados',
        url: '/consolidated',
        icon: FileChartPie,
        isActive: window.location.pathname === '/consolidated',
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
        icon: Shield,
        isActive: window.location.pathname === '/admin/category',
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
        title: 'Personal',
        url: '/contrata/personal',
        icon: UserCheck,
        isActive: window.location.pathname === '/contrata/personal',
        roles: ['company', 'security'],
    },
    {
        title: 'Ingeniero de Seguridad',
        url: '/admin/security-engineer',
        icon: ShieldPlusIcon,
        isActive: window.location.pathname === '/admin/security-engineer',
        roles: ['company'],
    },
    {
        title: 'Configuración',
        url: '/settings/general',
        icon: ShieldPlusIcon,
        isActive: window.location.pathname === '/settings',
        roles: ['admin'],
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
    const filteredNavItems = mainNavItems.filter((item) => {
        if (item.title === 'Ingeniero de Seguridad' && userCompanyId !== '1') {
            return false;
        }
        return item.roles.some((role) => userRoles.includes(role));
    });

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
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
