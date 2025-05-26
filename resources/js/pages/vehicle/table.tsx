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
    const url = (window as any).route
        ? (window as any).route('vehicle.show', vehicleId)
        : `${window.location.origin}/vehicle/${vehicleId}`;
    console.log(`[Vehicle URL]: ${url}`);
    return url;
}

// Nueva utilidad para obtener la URL absoluta de la ruta vehicle.qr
function getVehicleQRUrl(vehicleId: number) {
    return (window as any).route
        ? (window as any).route('vehicle.qr', vehicleId)
        : `${window.location.origin}/vehicle/qr/${vehicleId}`;
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

// Utilidad para descargar QR como PNG en formato rectangular de dos columnas bordeado
function downloadQRCodeCanvas(vehicle: VehicleData, filename: string) {
    // Configuración editable para QR (solo afecta a esta función)
    const QR_TITLE = "VEHÍCULO CONTRATISTA - SEGURIDAD CUAJONE";
    const QR_FOOTER = "GERENCIA DEL PROGRAMA DE SEGURIDAD CUAJONE";
    const QR_TITLE_FONT_SIZE = "1.2rem";
    const QR_FOOTER_FONT_SIZE = "0.82rem";

    // HD scale factor
    const SCALE = 2;

    // Dimensiones base
    const width = 500;
    const height = 260;
    const qrSize = 180;
    const borderRadius = 28;
    const padding = 24;

    // Canvas HD
    const canvas = document.createElement('canvas');
    canvas.width = width * SCALE;
    canvas.height = height * SCALE;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(SCALE, SCALE);

    // Dibuja fondo blanco con borde redondeado
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(width - borderRadius, 0);
    ctx.quadraticCurveTo(width, 0, width, borderRadius);
    ctx.lineTo(width, height - borderRadius);
    ctx.quadraticCurveTo(width, height, width - borderRadius, height);
    ctx.lineTo(borderRadius, height);
    ctx.quadraticCurveTo(0, height, 0, height - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // Borde exterior negro puro y redondeado
    ctx.save();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(borderRadius, 2);
    ctx.lineTo(width - borderRadius, 2);
    ctx.quadraticCurveTo(width - 2, 2, width - 2, borderRadius);
    ctx.lineTo(width - 2, height - borderRadius);
    ctx.quadraticCurveTo(width - 2, height - 2, width - borderRadius, height - 2);
    ctx.lineTo(borderRadius, height - 2);
    ctx.quadraticCurveTo(2, height - 2, 2, height - borderRadius);
    ctx.lineTo(2, borderRadius);
    ctx.quadraticCurveTo(2, 2, borderRadius, 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // Título centrado arriba (mayúsculas, tildes)
    ctx.save();
    ctx.font = `bold ${QR_TITLE_FONT_SIZE} Arial`;
    ctx.fillStyle = "#222";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(QR_TITLE, width / 2, 12);
    ctx.restore();

    import('qrcode').then(QRCodeLib => {
        const qrCanvas = document.createElement('canvas');
        qrCanvas.width = qrSize * SCALE;
        qrCanvas.height = qrSize * SCALE;
        QRCodeLib.toCanvas(
            qrCanvas,
            getVehicleQRUrl(vehicle.id),
            { width: qrSize * SCALE, margin: SCALE },
            function (error: any) {
                if (error) {
                    alert('No se pudo generar el QR para descargar.');
                    return;
                }
                // QR centrado en la primera columna (ajustar Y para dejar espacio al título y footer)
                const qrY = 44;
                ctx.drawImage(
                    qrCanvas,
                    0, 0, qrCanvas.width, qrCanvas.height,
                    padding, qrY, qrSize, qrSize
                );

                // === PLACA DINÁMICA CENTRADA EN LA SEGUNDA COLUMNA ===
                const placaText = (vehicle.license_plate ?? "").toUpperCase();
                ctx.font = "bold 2.1rem Arial";
                const textMetrics = ctx.measureText(placaText);
                const placaTextWidth = textMetrics.width;
                const placaPaddingX = 32;
                const placaBoxW = placaTextWidth + placaPaddingX * 2;
                const placaBoxH = 54;
                const placaRadius = 18;

                // Segunda columna: inicia en
                const col2X = padding + qrSize + 32;
                const col2W = width - col2X - padding;

                // Centrar la placa respecto a la segunda columna
                const placaBoxX = col2X + (col2W - placaBoxW) / 2;
                const placaBoxY = padding + 20;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(placaBoxX + placaRadius, placaBoxY);
                ctx.lineTo(placaBoxX + placaBoxW - placaRadius, placaBoxY);
                ctx.quadraticCurveTo(placaBoxX + placaBoxW, placaBoxY, placaBoxX + placaBoxW, placaBoxY + placaRadius);
                ctx.lineTo(placaBoxX + placaBoxW, placaBoxY + placaBoxH - placaRadius);
                ctx.quadraticCurveTo(placaBoxX + placaBoxW, placaBoxY + placaBoxH, placaBoxX + placaBoxW - placaRadius, placaBoxY + placaBoxH);
                ctx.lineTo(placaBoxX + placaRadius, placaBoxY + placaBoxH);
                ctx.quadraticCurveTo(placaBoxX, placaBoxY + placaBoxH, placaBoxX, placaBoxY + placaBoxH - placaRadius);
                ctx.lineTo(placaBoxX, placaBoxY + placaRadius);
                ctx.quadraticCurveTo(placaBoxX, placaBoxY, placaBoxX + placaRadius, placaBoxY);
                ctx.closePath();
                ctx.fillStyle = "#e5e7eb"; // plomo claro (tailwind gray-200)
                ctx.fill();

                ctx.font = "bold 2.1rem Arial";
                ctx.fillStyle = "#111"; // negro para el texto
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(
                    placaText,
                    placaBoxX + placaBoxW / 2,
                    placaBoxY + placaBoxH / 2 + 2
                );

                // Datos: primero marca, luego modelo, luego año, luego color (centrados respecto a la segunda columna)
                ctx.font = "bold 1.1rem Arial";
                ctx.fillStyle = "#222";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                let infoY = placaBoxY + placaBoxH + 18;
                const infoX = col2X + (col2W - 220) / 2; // 220 es el ancho aprox. de los datos

                ctx.fillText(`Marca:`, infoX, infoY);
                ctx.font = "1.1rem Arial";
                ctx.fillText((vehicle.brand ?? "").toUpperCase(), infoX + 90, infoY);

                ctx.font = "bold 1.1rem Arial";
                ctx.fillText(`Modelo:`, infoX, infoY + 28);
                ctx.font = "1.1rem Arial";
                ctx.fillText((vehicle.model ?? "").toUpperCase(), infoX + 90, infoY + 28);

                ctx.font = "bold 1.1rem Arial";
                ctx.fillText(`Año:`, infoX, infoY + 56);
                ctx.font = "1.1rem Arial";
                ctx.fillText((vehicle.year ?? "").toUpperCase(), infoX + 90, infoY + 56);

                ctx.font = "bold 1.1rem Arial";
                ctx.fillText(`Color:`, infoX, infoY + 84);
                ctx.font = "1.1rem Arial";
                ctx.fillText((vehicle.color ?? '').toUpperCase(), infoX + 90, infoY + 84);

                ctx.restore();

                // Footer pequeño centrado abajo (mayúsculas, tildes, tamaño configurable)
                ctx.save();
                ctx.font = `${QR_FOOTER_FONT_SIZE} Arial`;
                ctx.fillStyle = "#666";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.fillText(QR_FOOTER, width / 2, height - 12);
                ctx.restore();

                // Descargar
                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        );
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

    // Calcular los datos para la página current
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
        const vehicle = data.find(v => v.id === id);
        if (!vehicle) return;
        new Promise<void>((resolve) => {
            downloadQRCodeCanvas(vehicle, `qr_${license_plate}.png`);
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
                                    onClick={e => {
                                        // Imprime la URL del vehículo al hacer click en el Card
                                        e.preventDefault();
                                        console.log(getVehicleShowUrl(vehicle.id));
                                    }}
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
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            onClick={e => { e.preventDefault(); onAction(vehicle, 'desvincular'); }}
                                                        >
                                                            <Unlink className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Desvincular</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={e => { e.preventDefault(); onAction(vehicle, 'actualizar'); }}
                                                        >
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
                                                            onClick={e => { e.preventDefault(); handleDownloadQR(vehicle.license_plate, vehicle.id); }}
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
                                            <QRCode value={getVehicleQRUrl(vehicle.id)} size={100} bgColor="#fff" />
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
