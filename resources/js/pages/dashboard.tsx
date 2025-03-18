import LineChartComponent from '@/components/charts/line-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Info } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface InfoCardProps {
    title: string;
    buttons: { text: string; url: string }[];
    info: string;
}

const InfoCard = ({ title, buttons, info }: InfoCardProps) => (
    <Card className="relative w-full">
        <CardHeader className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                        <Info className="h-5 w-5" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4 p-4">
                        <p className="text-muted-foreground text-sm">{info}</p>
                    </div>
                </PopoverContent>
            </Popover>
        </CardHeader>
        <CardContent>
            {buttons.map(({ text, url }, index) => (
                <Link key={index} href={url} method="get" className="mb-2 flex w-full items-center gap-2">
                    <Button variant="outline" className="flex w-full items-center gap-2">
                        <span className="flex-1 overflow-hidden text-left text-ellipsis whitespace-nowrap">{text}</span>
                        <ArrowRight className="h-5 w-5 flex-shrink-0" />
                    </Button>
                </Link>
            ))}
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const distributionButtons = [
        { text: 'Actos y condiciones subestándares e incidentes', url: '/company/analysis/category' },
        { text: 'Actos Subestándares', url: '/admin/analysis/category/Actos Subestándares' },
        { text: 'Condiciones Subestándares', url: '/admin/analysis/category/Condiciones Subestándares' },
        { text: 'Incidentes', url: '/admin/analysis/category/Incidentes' },
    ];

    const trendButtons = [
        { text: 'Actos y condiciones subestándares e incidentes', url: 'admin/analysis/year' },
        { text: 'Observaciones detectadas por Gerencia', url: route('company.analysis.inspeccion.year') },
    ];

    const inspectionButtons = [
        { text: 'Planeada, no planeada, comite y otros', url: route('company.analysis.inspeccion') },
        { text: 'Detalles de inspección', url: route('company.analysis.inspeccion.detail') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <LineChartComponent />
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <InfoCard
                        title="DISTRIBUCIÓN POR TIPO"
                        buttons={distributionButtons}
                        info="Información detallada sobre la distribución por tipo."
                    />
                    <InfoCard title="CURVA DE TENDENCIA" buttons={trendButtons} info="Información detallada sobre la curva de tendencia." />
                    <InfoCard
                        title="DISTRIBUCIÓN INSPECCIÓN"
                        buttons={inspectionButtons}
                        info="Información detallada sobre la distribución de inspección."
                    />
                </div>
            </div>
        </AppLayout>
    );
}
