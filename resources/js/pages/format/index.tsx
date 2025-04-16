import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react'; // Importamos Link de Inertia.js
import { useState } from 'react';
import IndicationsModal from './option'; // Importamos el modal de opciones
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Formatos',
        href: '/formatos',
    },
];

const staticReports = [
    {
        title: 'Reporte',
        subtitle: 'Actos subestándar',
        description: 'Este reporte detalla los actos subestándar observados en las operaciones.',
        image: '/reports/IMG-05.png',
        background: '/reports/FONDO%20AMARILLO.svg',
        route: route('format.acts'), // Usamos el nombre de la ruta
    },
    {
        title: 'Reporte',
        subtitle: 'Condiciones subestándar',
        description: 'Este reporte identifica las condiciones subestándar presentes en el entorno.',
        image: '/reports/IMG-02.png',
        background: '/reports/FONDO%20ROJO.svg',
        route: route('format.conditions'), // Usamos el nombre de la ruta
    },
    {
        title: 'Reporte',
        subtitle: 'Incidentes',
        description: 'Este reporte documenta los incidentes ocurridos en el lugar de trabajo.',
        image: '/reports/IMG-03.png',
        background: '/reports/FONDO%20TURQUESA.svg',
        route: route('format.incidents'), // Usamos el nombre de la ruta
    },
    {
        title: 'Inspección',
        subtitle: 'General',
        description: 'Inspección general para evaluar el cumplimiento de estándares.',
        image: '/reports/IMG-04.png',
        background: '/reports/FONDO%20VERDE.svg',
        route: route('format.inspection'), // Usamos el nombre de la ruta
    },
    {
        title: 'Inspección',
        subtitle: 'Vehicular diaria',
        description: 'Inspección diaria de vehículos para garantizar su operatividad.',
        image: '/reports/IMG-01.png',
        background: '/reports/FONDO%20AMARILLO.svg',
        route: '', // Ruta sin cambios
    },
];

export default function Format() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Formatos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                    {staticReports.map((report, index) => (
                        <Link
                            key={index}
                            href={report.subtitle === 'Vehicular diaria' ? '#' : report.route} // Evitamos la navegación para "Vehicular diaria"
                            onClick={(e) => {
                                if (report.subtitle === 'Vehicular diaria') {
                                    e.preventDefault(); // Prevenimos la navegación
                                    setIsDialogOpen(true); // Abrimos el modal
                                }
                            }}
                            className="group"
                        >
                            <Card
                                className="group relative flex h-48 flex-row overflow-visible bg-cover bg-center bg-no-repeat shadow-md"
                                style={{
                                    backgroundImage: `url(${report.background})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {/* Primera columna: Title y Subtitle */}
                                <div className="flex w-[70%] flex-col justify-center p-4">
                                    <CardHeader className="text-left">
                                        {/* Cambiar entre título y descripción al hacer hover */}
                                        <CardTitle className="text-lg font-bold text-white uppercase group-hover:hidden sm:text-xl md:text-xl lg:text-2xl 2xl:text-2xl">
                                            {report.title}
                                        </CardTitle>
                                        <p className="text-sm text-white uppercase group-hover:hidden sm:text-base md:text-xs lg:text-base 2xl:text-xl">
                                            {report.subtitle}
                                        </p>
                                        <p className="hidden text-sm text-white group-hover:block sm:text-base md:text-xs lg:text-base 2xl:text-xl">
                                            {report.description}
                                        </p>
                                    </CardHeader>
                                </div>
                                {/* Segunda columna: Imagen encima del card */}
                                <div className="absolute right-0 bottom-0 flex origin-bottom-right transform items-end transition-transform duration-300 group-hover:scale-110">
                                    <img src={report.image} alt={report.subtitle} className="h-48 w-auto object-cover" />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
            <IndicationsModal isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
        </AppLayout>
    );
}
