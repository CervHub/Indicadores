import { Head, usePage } from '@inertiajs/react';
import QRCode from "react-qr-code";
import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
    Card as Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Generar datos de kilometraje diario y acumulado del último mes (acumulado inicia en 0)
function generateMileageChartData() {
    const today = new Date();
    const start = new Date(today);
    start.setMonth(today.getMonth() - 1);
    // Si el mes anterior no tiene ese día (ej: 31), ajusta al último día del mes anterior
    if (start.getMonth() === today.getMonth()) {
        // setMonth desborda si el mes anterior no tiene ese día
        start.setDate(0);
    }
    const data = [];
    let current = new Date(start);
    let accumulated = 0; // inicia en 0
    while (current <= today) {
        const daily = Math.floor(Math.random() * 40) + 10; // entre 10 y 49 km por día
        accumulated += daily;
        data.push({
            day: current.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' }),
            daily,
            accumulated
        });
        current.setDate(current.getDate() + 1);
    }
    return data;
}

const mileageChartData = generateMileageChartData();

const mileageChartConfigDaily = {
    daily: {
        label: "Km por día",
        color: "hsl(var(--chart-1, 0, 100%, 40%))",
    },
} satisfies ChartConfig;

const mileageChartConfigAccum = {
    accumulated: {
        label: "Km acumulado",
        color: "hsl(var(--chart-2, 0, 100%, 40%))",
    },
} satisfies ChartConfig;

// Reloj digital simple
function Clock() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <span
            className="font-mono text-sm font-bold"
            style={{ color: '#000' }}
        >
            {now.toLocaleDateString()} {now.toLocaleTimeString()}
        </span>
    );
}

function getVehicleShowUrl(vehicleId: number) {
    return (window as any).route
        ? (window as any).route('vehicle.show', vehicleId)
        : `${window.location.origin}/vehicle/${vehicleId}`;
}

export default function VehicleDetail() {
    const { vehicle, vehicleInspection, lastCompanyLink, company, allInspectionsHistory } = usePage().props;

    // Concatenar el código de la empresa y el code del VehicleCompany si ambos existen, sin guiones
    let vehicleCode = vehicle.code;
    let companyCode = "";
    let companyName = "";
    if (company && company.code && lastCompanyLink && lastCompanyLink.code) {
        companyCode = company.code;
        vehicleCode = `${company.code}${lastCompanyLink.code}`;
        companyName = company.nombre || "";
    }

    // Placa sin guiones
    const licensePlate = (vehicle.license_plate || "").replace(/-/g, "");

    // Inspecciones desde backend (garantiza 4 tipos, aunque estén vacíos)
    const inspectionsData = [
        vehicleInspection?.['pre-use'] && {
            tipo: vehicleInspection['pre-use'].tipo_inspeccion,
            realizado_por: vehicleInspection['pre-use'].realizado_por,
            fecha: vehicleInspection['pre-use'].created_at,
            vencimiento: vehicleInspection['pre-use'].vencimiento,
            estado: vehicleInspection['pre-use'].estado,
            observaciones: vehicleInspection['pre-use'].observaciones,
        },
        vehicleInspection?.['trimestral'] && {
            tipo: vehicleInspection['trimestral'].tipo_inspeccion,
            realizado_por: vehicleInspection['trimestral'].realizado_por,
            fecha: vehicleInspection['trimestral'].created_at,
            vencimiento: vehicleInspection['trimestral'].vencimiento,
            estado: vehicleInspection['trimestral'].estado,
            observaciones: vehicleInspection['trimestral'].observaciones,
        },
        vehicleInspection?.['semestral'] && {
            tipo: vehicleInspection['semestral'].tipo_inspeccion,
            realizado_por: vehicleInspection['semestral'].realizado_por,
            fecha: vehicleInspection['semestral'].created_at,
            vencimiento: vehicleInspection['semestral'].vencimiento,
            estado: vehicleInspection['semestral'].estado,
            observaciones: vehicleInspection['semestral'].observaciones,
        },
        vehicleInspection?.['anual'] && {
            tipo: vehicleInspection['anual'].tipo_inspeccion,
            realizado_por: vehicleInspection['anual'].realizado_por,
            fecha: vehicleInspection['anual'].created_at,
            vencimiento: vehicleInspection['anual'].vencimiento,
            estado: vehicleInspection['anual'].estado,
            observaciones: vehicleInspection['anual'].observaciones,
        },
    ].filter(Boolean);

    // Asegurar que siempre haya 4 inspecciones (una de cada tipo), aunque estén vacías
    const tipos = ['pre-use', 'trimestral', 'semestral', 'anual'];
    const tiposLabel = {
        'pre-use': 'Diaria Pre-Uso',
        'trimestral': 'Trimestral',
        'semestral': 'Semestral',
        'anual': 'Anual',
    };
    const inspectionsFull = tipos.map(tipo => {
        const data = vehicleInspection?.[tipo] || {};
        return {
            tipo: data.tipo_inspeccion || tiposLabel[tipo],
            realizado_por: data.realizado_por || "",
            fecha: data.created_at || "",
            vencimiento: data.vencimiento || "",
            estado: data.estado || "",
            observaciones: data.observaciones || "",
        };
    });

    // Estado general: si alguna inspección está vacía o no tiene estado o no es "Aprobado", es "Desaprobado"
    const hasDisapproved = inspectionsFull.some(
        (insp) => !insp.estado || insp.estado.toLowerCase() !== "aprobado"
    );
    const statusText = hasDisapproved ? "No Autorizado" : "Autorizado";
    const statusColor = hasDisapproved ? "bg-red-600 text-white" : "bg-green-600 text-white";

    return (
        <>
            <Head title={`Hoja de Vida: ${licensePlate}`} />
            <div className="min-h-screen bg-white flex flex-col items-center justify-center py-8 px-2">
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden print:shadow-none print:rounded-none print:bg-white">
                    {/* Barra superior: estado y fecha */}
                    <div className="flex flex-row items-center justify-between border-b px-8 py-4 bg-gray-100">
                        <div className="flex flex-row items-center gap-4 w-full">
                            <div
                                className={`px-3 py-1 rounded-full font-bold text-base ${statusColor}`}
                                style={{ width: "fit-content", minWidth: 90, textAlign: "center" }}
                            >
                                {statusText}
                            </div>
                            <div className="ml-auto text-gray-600 text-sm">
                                <Clock />
                            </div>
                        </div>
                    </div>
                    {/* Datos principales: solo los campos requeridos */}
                    <div className="px-8 py-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {companyName && (
                                <div className="rounded-lg p-3 flex flex-col items-center shadow-sm bg-gray-50 col-span-2 md:col-span-2">
                                    <span className="text-xs text-gray-600 font-semibold">Empresa</span>
                                    <span className="text-base font-bold text-gray-900">{companyName} <span className="text-xs text-gray-500 ml-2">({companyCode})</span></span>
                                </div>
                            )}
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm bg-gray-50">
                                <span className="text-xs text-gray-600 font-semibold">Placa</span>
                                <span className="text-2xl font-extrabold tracking-widest text-gray-800">{licensePlate}</span>
                            </div>
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm bg-gray-50">
                                <span className="text-xs text-gray-600 font-semibold">Código de Llamada</span>
                                <span className="text-2xl font-extrabold tracking-widest text-gray-800">{vehicleCode}</span>
                            </div>
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm bg-gray-50">
                                <span className="text-xs text-gray-600 font-semibold">Marca</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.brand}</span>
                            </div>
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm bg-gray-50">
                                <span className="text-xs text-gray-600 font-semibold">Modelo</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.model}</span>
                            </div>
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm bg-gray-50">
                                <span className="text-xs text-gray-600 font-semibold">Año de Fabricación</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.year}</span>
                            </div>
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm bg-gray-50">
                                <span className="text-xs text-gray-600 font-semibold">Clase Vehicular</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.type}</span>
                            </div>
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm bg-gray-50">
                                <span className="text-xs text-gray-600 font-semibold">Color</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.color}</span>
                            </div>
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm bg-gray-50">
                                <span className="text-xs text-gray-600 font-semibold">Capacidad de Pasajeros</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.seating_capacity}</span>
                            </div>
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm bg-gray-50">
                                <span className="text-xs text-gray-600 font-semibold">Kilometraje</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.mileage}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Pie de página tipo PDF */}
                    <div className="border-t px-8 py-4 text-xs text-gray-400 text-center print:hidden">
                        Documento generado por el sistema de Gestión SST &copy; {new Date().getFullYear()}
                    </div>
                </div>
            </div>
        </>
    );
}
