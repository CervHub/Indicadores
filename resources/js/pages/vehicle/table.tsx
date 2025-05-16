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

const TableCard: React.FC<TableCardProps> = ({ data, onAction }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

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
                            <Card
                                key={vehicle.id}
                                className={`relative w-full rounded-lg border-2 ${isLinked ? 'border-green-500' : 'border-gray-300'}`}
                            >
                                <CardHeader>
                                    <div className="flex items-start">
                                        <CardTitle
                                            className="truncate max-w-[75%]"
                                            title={`${vehicle.brand} - ${vehicle.model} (${vehicle.year})`}
                                        >
                                            {vehicle.brand} - {vehicle.model} ({vehicle.year})
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

                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <CardDescription>Placa: {vehicle.license_plate}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        <strong>Codigo:</strong> {vehicle.code}
                                    </p>
                                    <p>
                                        <strong>Tipo:</strong> {vehicle.type}
                                    </p>
                                </CardContent>
                            </Card>
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
