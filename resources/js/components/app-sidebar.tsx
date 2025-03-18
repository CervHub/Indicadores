import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, FileArchive, FileChartPie, Folder, HousePlus, LayoutGrid, Users, Shield, FileText, UserCheck, ShieldPlusIcon } from 'lucide-react'; // Import new icons
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
        isActive: window.location.pathname === '/dashboard', // Add isActive property
    },
    {
        title: 'Contratistas',
        url: '/contractor',
        icon: HousePlus,
        isActive: window.location.pathname === '/contractor', // Add isActive property
    },
    {
        title: 'Anexos',
        url: '/annexes',
        icon: FileArchive,
        isActive: window.location.pathname === '/annexes', // Add isActive property
    },
    {
        title: 'Consolidados',
        url: '/consolidated',
        icon: FileChartPie,
        isActive: window.location.pathname === '/consolidated', // Add isActive property
    },
    {
        title: 'Gerencias',
        url: '/admin/management',
        icon: Users,
        isActive: window.location.pathname === '/admin/management', // Add isActive property
    },
    {
        title: 'Gestión de SSO',
        url: '/admin/category',
        icon: Shield,
        isActive: window.location.pathname === '/admin/category', // Add isActive property
    },
    {
        title: 'Reporte',
        url: '/admin/reportability',
        icon: FileText,
        isActive: window.location.pathname === '/admin/reportability', // Add isActive property
    },
    {
        title: 'Personal', // New item
        url: '/admin/personal',
        icon: UserCheck,
        isActive: window.location.pathname === '/admin/personal', // Add isActive property
    },
    {
        title: 'Ingeniero de Seguridad', // New item
        url: '/admin/security-engineer',
        icon: ShieldPlusIcon,
        isActive: window.location.pathname === '/admin/security-engineer', // Add isActive property
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
