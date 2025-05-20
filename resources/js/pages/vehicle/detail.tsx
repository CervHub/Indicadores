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
            style={{ color: '#fff' }}
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
    const { vehicle, vehicleInspection } = usePage().props;
    console.log(vehicle);

    // Inspecciones desde backend (garantiza 4 tipos, aunque estén vacíos)
    const inspections = [
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

    return (
        <>
            <Head title={`Hoja de Vida: ${vehicle.license_plate}`} />
            <div className="min-h-screen bg-white flex flex-col items-center justify-center py-8 px-2">
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden print:shadow-none print:rounded-none print:bg-white">
                    {/* Barra superior: título y reloj */}
                    <div className="flex flex-col md:flex-row items-center justify-between border-b px-8 py-4" style={{ backgroundColor: '#d7282f' }}>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                            <div>
                                <Clock />
                            </div>
                        </div>
                    </div>
                    {/* Encabezado con QR y datos principales */}
                    <div className="flex flex-col md:flex-row items-center justify-between border-b px-8 py-8 bg-white print:bg-white">
                        <div className="flex-1 flex flex-col items-center md:items-start w-full">
                            <div className="grid grid-cols-4 gap-4 w-full mb-2">
                                <div className="rounded-lg p-3 flex flex-col items-center shadow-sm col-span-2" style={{ backgroundColor: '#d7282f' }}>
                                    <span className="text-xs font-semibold" style={{ color: '#fff' }}>Placa Única Nacional de Rodaje</span>
                                    <span className="text-base font-bold" style={{ color: '#fff' }}>{vehicle.license_plate}</span>
                                </div>
                                <div className="rounded-lg p-3 flex flex-col items-center shadow-sm col-span-2" style={{ backgroundColor: '#d7282f' }}>
                                    <span className="text-xs font-semibold" style={{ color: '#fff' }}>Marca</span>
                                    <span className="text-base font-bold" style={{ color: '#fff' }}>{vehicle.brand}</span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center shadow-sm col-span-2">
                                    <span className="text-xs text-gray-600 font-semibold">Modelo</span>
                                    <span className="text-base font-bold text-gray-900">{vehicle.model}</span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center shadow-sm col-span-2">
                                    <span className="text-xs text-gray-600 font-semibold">Año de Fabricación</span>
                                    <span className="text-base font-bold text-gray-900">{vehicle.year}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center mt-8 md:mt-0 md:ml-8">
                            <div className="bg-white p-4 shadow border rounded-lg flex items-center justify-center" style={{ minWidth: 170, minHeight: 170 }}>
                                <QRCode value={getVehicleShowUrl(vehicle.id)} size={150} bgColor="#fff" />
                            </div>
                            <span className="text-xs text-gray-400 mt-2">QR Hoja de Vida</span>
                        </div>
                    </div>
                    {/* Datos del vehículo en formato tarjetas compactas */}
                    <div className="px-8 py-6">
                        <h3 className="text-lg font-bold mb-4" style={{ color: '#d7282f' }}>Datos del Vehículo</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm" style={{ backgroundColor: '#d7282f' }}>
                                <span className="text-xs font-semibold" style={{ color: '#fff' }}>Código de Llamada</span>
                                <span className="text-base font-bold" style={{ color: '#fff' }}>{vehicle.code}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-gray-600 font-semibold">Clase Vehicular</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.type}</span>
                            </div>
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm" style={{ backgroundColor: '#d7282f' }}>
                                <span className="text-xs font-semibold" style={{ color: '#fff' }}>Color</span>
                                <span className="text-base font-bold" style={{ color: '#fff' }}>{vehicle.color}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-gray-600 font-semibold">Capacidad de Pasajeros</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.seating_capacity}</span>
                            </div>
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm" style={{ backgroundColor: '#d7282f' }}>
                                <span className="text-xs font-semibold" style={{ color: '#fff' }}>Tipo de Combustible</span>
                                <span className="text-base font-bold" style={{ color: '#fff' }}>{vehicle.fuel_type}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-gray-600 font-semibold">Kilometraje</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.mileage}</span>
                            </div>
                            <div className="rounded-lg p-3 flex flex-col items-center shadow-sm" style={{ backgroundColor: '#d7282f' }}>
                                <span className="text-xs font-semibold" style={{ color: '#fff' }}>Número de Serie (VIN)</span>
                                <span className="text-base font-bold" style={{ color: '#fff' }}>{vehicle.chassis_number}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-gray-600 font-semibold">Número de Motor</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.engine_number}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de inspecciones */}
                    <div className="px-8 pb-10">
                        <h3 className="text-lg font-bold mb-4 mt-2" style={{ color: '#d7282f' }}>Historial de Inspecciones</h3>
                        <TooltipProvider>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-xs">
                                <thead>
                                    <tr style={{ backgroundColor: '#d7282f' }}>
                                        <th className="px-2 py-1 text-left font-semibold" style={{ color: '#fff' }}>Tipo</th>
                                        <th className="px-2 py-1 text-left font-semibold" style={{ color: '#fff' }}>Realizado por</th>
                                        <th className="px-2 py-1 text-left font-bold" style={{ color: '#fff' }}>Fecha</th>
                                        <th className="px-2 py-1 text-left font-semibold" style={{ color: '#fff' }}>Vencimiento</th>
                                        <th className="px-2 py-1 text-left font-semibold" style={{ color: '#fff' }}>Estado</th>
                                        <th className="px-2 py-1 text-left font-semibold" style={{ color: '#fff' }}>Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inspections.map((insp, idx) => {
                                        const obs = insp.observaciones || "";
                                        const isLong = obs.length > 25;
                                        return (
                                            <tr key={idx} className="hover:bg-red-50 border-t border-gray-200 text-xs">
                                                <td className="px-2 py-1">{insp.tipo}</td>
                                                <td className="px-2 py-1">{insp.realizado_por}</td>
                                                <td className="px-2 py-1">{insp.fecha}</td>
                                                <td className="px-2 py-1">{insp.vencimiento}</td>
                                                <td className="px-2 py-1">{insp.estado}</td>
                                                <td className="px-2 py-1 max-w-[120px] truncate">
                                                    {isLong ? (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="cursor-pointer">
                                                                    {obs.slice(0, 25) + '...'}
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <span className="whitespace-pre-line">{obs}</span>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ) : (
                                                        obs
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        </TooltipProvider>
                    </div>
                    {/* Gráfico de kilometraje diario */}
                    <div className="px-8 pb-8">
                        <Card className='gap-0 shadow-none border-red-400'>
                            <CardHeader>
                                <CardTitle>Kilometraje diario último mes</CardTitle>
                                <CardDescription>Consumo diario</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={mileageChartConfigDaily} className='aspect-auto h-[250px] w-full'>
                                    <LineChart
                                        data={mileageChartData}
                                        margin={{ top: 20, left: 12, right: 12, bottom: 20 }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="day"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => `${value}`}
                                            label={{ value: "Día", position: "insideBottom", offset: -5 }}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="line" />}
                                        />
                                        <Line
                                            dataKey="daily"
                                            type="monotone"
                                            stroke="#d7282f"
                                            strokeWidth={2}
                                            dot={{
                                                fill: "#d7282f",
                                            }}
                                            activeDot={{
                                                r: 6,
                                            }}
                                        >
                                            <LabelList
                                                position="top"
                                                offset={12}
                                                className="fill-foreground"
                                                fontSize={12}
                                            />
                                        </Line>
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 font-medium leading-none" style={{ color: '#d7282f' }}>
                                    Tendencia diaria <TrendingUp className="h-4 w-4" style={{ color: '#d7282f' }} />
                                </div>
                                <div className="leading-none text-muted-foreground">
                                    Kilometraje consumido por día en el último mes
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    {/* Gráfico de kilometraje acumulado */}
                    <div className="px-8 pb-8">
                        <Card className='gap-0 shadow-none border-red-400'>
                            <CardHeader>
                                <CardTitle>Kilometraje acumulado último mes</CardTitle>
                                <CardDescription>Histórico acumulado</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={mileageChartConfigAccum} className='aspect-auto h-[250px] w-full'>
                                    <LineChart
                                        data={mileageChartData}
                                        margin={{ top: 20, left: 12, right: 12, bottom: 20 }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="day"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => `${value}`}
                                            label={{ value: "Día", position: "insideBottom", offset: -5 }}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="line" />}
                                        />
                                        <Line
                                            dataKey="accumulated"
                                            type="monotone"
                                            stroke="#1e293b"
                                            strokeWidth={2}
                                            dot={{
                                                fill: "#1e293b",
                                            }}
                                            activeDot={{
                                                r: 6,
                                            }}
                                        >
                                            <LabelList
                                                position="top"
                                                offset={12}
                                                className="fill-foreground"
                                                fontSize={12}
                                            />
                                        </Line>
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 font-medium leading-none" style={{ color: '#1e293b' }}>
                                    Tendencia acumulada <TrendingUp className="h-4 w-4" style={{ color: '#1e293b' }} />
                                </div>
                                <div className="leading-none text-muted-foreground">
                                    Kilometraje acumulado del último mes
                                </div>
                            </CardFooter>
                        </Card>
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
