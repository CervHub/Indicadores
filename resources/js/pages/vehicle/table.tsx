import { Button } from '@/components/ui/button'; // Componente Button de ShadCN
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Asegúrate de que esta ruta sea correcta según tu proyecto
import { Input } from '@/components/ui/input'; // Componente Input de ShadCN
import { ChevronLeft, ChevronRight, Edit, Unlink, Link as LinkIcon } from 'lucide-react'; // Iconos de Lucide
import React, { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ReactDOM from 'react-dom';
import QRCode from "react-qr-code";
import { Link } from '@inertiajs/react';

// Utilidad para obtener la URL absoluta de la ruta vehicle.show
function getVehicleShowUrl(vehicleId: number) {
    // Si tienes Ziggy, puedes usar route('vehicle.show', vehicleId)
    // Si no, usa window.location.origin + `/vehicle/${vehicleId}`
    return (window as any).route
        ? (window as any).route('vehicle.show', vehicleId)
        : `${window.location.origin}/vehicle/${vehicleId}`;
}

interface VehicleData {
    id: number;
    brand: string;
    chassis_number: string | null;
    code: string;
    color: string | null;
    created_at: string;
    engine_number: string | null;
    fuel_type: string | null;
    insurance_expiry_date: string | null;
    is_active: string;
    license_plate: string;
    mileage: string | null;
    model: string;
    seating_capacity: string | null;
    type: string;
    updated_at: string;
    year: string;
    is_linked: string; // "1" vinculado, "0" desvinculado
}

interface TableCardProps {
    data: VehicleData[];
    onAction: (item: VehicleData, action: string) => void; // Prop para manejar acciones
}

const ITEMS_PER_PAGE = 15;

// Utilidad para descargar QR como PNG usando canvas
function downloadQRCodeCanvas(vehicleId: number, filename: string) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const qrValue = getVehicleShowUrl(vehicleId);

    import('qrcode').then(QRCodeLib => {
        QRCodeLib.toCanvas(canvas, qrValue, { width: size, margin: 1 }, function (error: any) {
            if (error) {
                alert('No se pudo generar el QR para descargar.');
                return;
            }
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
}

const TableCard: React.FC<TableCardProps> = ({ data, onAction }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [downloadingId, setDownloadingId] = useState<number | null>(null); // Nuevo estado

    // Filtrar los datos según el término de búsqueda (solo por placa)
    const filteredData = data
        .filter((vehicle) => vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => (b.is_linked === "1" ? 1 : 0) - (a.is_linked === "1" ? 1 : 0)); // Vinculados primero

    // Calcular los datos para la página actual
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reiniciar a la primera página al buscar
    };

    // Nueva función para descargar QR como PNG usando canvas
    const handleDownloadQR = (license_plate: string, id: number) => {
        setDownloadingId(id);
        // Usar la URL de la route para el QR
        new Promise<void>((resolve) => {
            downloadQRCodeCanvas(id, `qr_${license_plate}.png`);
            resolve();
        }).finally(() => {
            setDownloadingId(null);
        });
    };

    return (
        <TooltipProvider>
            <div>
                <div className="mb-4">
                    <Input type="text" placeholder="Search by license plate..." value={searchTerm} onChange={handleSearch} className="w-full" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {currentData.map((vehicle) => {
                        const isLinked = vehicle.is_linked === "1";
                        return (
                            <Link
                                href={getVehicleShowUrl(vehicle.id)}
                                key={vehicle.id}
                                className="block"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Card
                                    className={`relative w-full rounded-lg border-2 cursor-pointer ${isLinked ? 'border-green-500' : 'border-gray-300'}`}
                                    // Elimina onClick del Card
                                >
                                    <CardHeader onClick={e => e.stopPropagation()}>
                                        <div className="flex items-start">
                                            <CardTitle
                                                className="truncate max-w-[65%] text-base font-semibold"
                                                title={`${vehicle.license_plate} - ${vehicle.brand}`}
                                            >
                                                {`${vehicle.license_plate} - ${vehicle.brand}`}
                                            </CardTitle>
                                            {/* Botones en la esquina superior derecha */}
                                            <div className="absolute top-2 right-2 flex gap-2">

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="destructive" size="icon" onClick={() => onAction(vehicle, 'desvincular')}>
                                                            <Unlink className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Desvincular</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="outline" size="icon" onClick={() => onAction(vehicle, 'actualizar')}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Editar</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleDownloadQR(vehicle.license_plate, vehicle.id)}
                                                            disabled={downloadingId === vehicle.id}
                                                        >
                                                            {downloadingId === vehicle.id ? (
                                                                // Spinner SVG
                                                                <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                                                </svg>
                                                            ) : (
                                                                // Icono de descarga
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                                                                </svg>
                                                            )}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Descargar QR</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        {/* El resto de la info va abajo */}
                                    </CardHeader>
                                    <CardContent onClick={e => e.stopPropagation()}>
                                        <p className="text-xs mt-1">
                                            <strong>Marca:</strong>
                                            <span className="ml-1">{vehicle.brand}</span>
                                        </p>
                                        <p className="text-xs mt-1">
                                            <strong>Año:</strong>
                                            <span className="ml-1">{vehicle.year}</span>
                                        </p>
                                        <p className="text-xs mt-1">
                                            <strong>Cód. de llamada:</strong>
                                            <span className="ml-1">{vehicle.code}</span>
                                        </p>
                                        <p className="text-xs mt-1">
                                            <strong>Tipo:</strong>
                                            <span className="ml-1">{vehicle.type}</span>
                                        </p>
                                        {/* QR en la esquina inferior derecha */}
                                        <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow" id={`qr-${vehicle.id}`}>
                                            <QRCode value={getVehicleShowUrl(vehicle.id)} size={100} bgColor="#fff" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Mostrar paginación solo si hay más de 15 elementos */}
                {filteredData.length > ITEMS_PER_PAGE && (
                    <div className="mt-4 flex items-center justify-start gap-4">
                        <Button onClick={handlePrevious} disabled={currentPage === 1} variant="outline" className="flex items-center gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button onClick={handleNext} disabled={currentPage === totalPages} variant="outline" className="flex items-center gap-2">
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </TooltipProvider >
    );
};

export default TableCard;
