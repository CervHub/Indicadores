import { ChartCat } from '@/components/charts/cat'; // Asegúrate de importar ChartCat
import { Generic } from '@/components/charts/generic';
import GenericInps from '@/components/charts/genericInps';
import { GenericInpsCat } from '@/components/charts/genericInpsCat';
import LineChartComponentCAT from '@/components/charts/line-chart-cat';
import LineChartComponentInspYR from '@/components/charts/line-chart-insp-yr';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface DashboardProps {
    type: string;
}

export default function Dashboard({ type }: DashboardProps) {
    const { props } = usePage();
    const { type: pageType, companies, titles, entities } = props;
    const [categoriesData, setCategoriesData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (pageType && companies && ['actos', 'condiciones', 'incidentes', 'inspección'].includes(pageType)) {
            const companyId = 1; // Ajusta esto según tu lógica para obtener el ID de la empresa
            axios
                .get(route('categories', { company_id: companyId, name: pageType }))
                .then((response) => {
                    console.log(response.data.data);
                    // Maneja la respuesta aquí
                    setCategoriesData(response.data.data);
                })
                .catch((error) => {
                    // Maneja el error aquí
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [pageType, companies]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];

    const distributionButtons = [
        { text: 'Actos y condiciones subestándares e incidentes', type: 'cat' },
        { text: 'Actos Subestándares', type: 'actos' },
        { text: 'Condiciones Subestándares', type: 'condiciones' },
        { text: 'Incidentes', type: 'incidentes' },
    ];

    const trendButtons = [
        { text: 'Actos y condiciones subestándares e incidentes', type: 'yr' },
        { text: 'Observaciones detectadas por Gerencia', type: 'insp.yr' },
    ];

    const inspectionButtons = [
        { text: 'Planeada, no planeada, comite y otros', type: 'insp' },
        { text: 'Detalles de inspección', type: 'inspección' },
    ];

    const options = [...trendButtons, ...inspectionButtons, ...distributionButtons];
    const option = options.find((option) => option.type === pageType);

    breadcrumbs.push({
        title: option?.text,
        href: `/dashboard/${option?.type}`,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={option?.text || 'Dashboard'} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {loading ? (
                    <div>Loading...</div>
                ) : pageType === 'cat' ? (
                    <ChartCat titles={titles} companies={companies} entities={entities} />
                ) : pageType === 'yr' ? (
                    <LineChartComponentCAT />
                ) : pageType === 'insp.yr' ? (
                    <LineChartComponentInspYR />
                ) : pageType === 'insp' ? (
                    <GenericInps />
                ) : pageType === 'inspección' ? (
                    <GenericInpsCat
                        title={option?.text}
                        pageType={pageType}
                        companies={companies}
                        entities={entities}
                        categoriesData={categoriesData}
                    />
                ) : pageType === 'actos' || pageType === 'condiciones' || pageType === 'incidentes' ? (
                    <Generic title={option?.text} pageType={pageType} companies={companies} entities={entities} categoriesData={categoriesData} />
                ) : (
                    <div>Gráfico no encontrado</div>
                )}
            </div>
        </AppLayout>
    );
}
