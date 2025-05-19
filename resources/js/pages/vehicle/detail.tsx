import { Head, usePage } from '@inertiajs/react';
import QRCode from "react-qr-code";
import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  Card as ChartCard,
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

// Datos ficticios de kilometraje del último mes (por día)
const mileageChartData = [
  { day: "01", km: 120 },
  { day: "02", km: 135 },
  { day: "03", km: 140 },
  { day: "04", km: 150 },
  { day: "05", km: 160 },
  { day: "06", km: 170 },
  { day: "07", km: 180 },
  { day: "08", km: 200 },
  { day: "09", km: 210 },
  { day: "10", km: 220 },
  { day: "11", km: 230 },
  { day: "12", km: 250 },
  { day: "13", km: 260 },
  { day: "14", km: 270 },
  { day: "15", km: 280 },
  { day: "16", km: 290 },
  { day: "17", km: 300 },
  { day: "18", km: 310 },
  { day: "19", km: 320 },
  { day: "20", km: 340 },
  { day: "21", km: 350 },
  { day: "22", km: 360 },
  { day: "23", km: 370 },
  { day: "24", km: 380 },
  { day: "25", km: 390 },
  { day: "26", km: 400 },
  { day: "27", km: 410 },
  { day: "28", km: 420 },
  { day: "29", km: 430 },
  { day: "30", km: 440 },
];

const mileageChartConfig = {
  km: {
    label: "Kilometraje",
    color: "hsl(var(--chart-1))",
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
        <span className="font-mono text-sm text-gray-500">
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
    const { vehicle } = usePage().props;
    console.log(vehicle);

    // Datos ficticios de inspecciones
    const inspections = [
        {
            tipo: "Inspección Diaria Pre uso",
            realizado_por: "Juan Pérez",
            fecha: "2024-06-01",
            vencimiento: "2024-06-02",
            estado: "Aprobado",
            observaciones: "Sin novedades"
        },
        {
            tipo: "Inspección Trimestral",
            realizado_por: "Ana Gómez",
            fecha: "2024-04-10",
            vencimiento: "2024-07-10",
            estado: "Aprobado",
            observaciones: "Cambio de aceite"
        },
        {
            tipo: "Inspección Semestral",
            realizado_por: "Carlos Ruiz",
            fecha: "2024-01-15",
            vencimiento: "2024-07-15",
            estado: "Aprobado",
            observaciones: "Revisión de frenos"
        },
        {
            tipo: "Inspección Parada Anual",
            realizado_por: "María López",
            fecha: "2023-12-01",
            vencimiento: "2024-12-01",
            estado: "Aprobado",
            observaciones: "Mantenimiento general"
        }
    ];

    return (
        <>
            <Head title={`Hoja de Vida: ${vehicle.license_plate}`} />
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center justify-center py-8 px-2">
                <div className="w-full max-w-4xl bg-white rounded-xl border shadow-2xl flex flex-col overflow-hidden print:shadow-none print:rounded-none print:bg-white">
                    {/* Barra superior: título y reloj */}
                    <div className="flex flex-col md:flex-row items-center justify-between border-b px-8 py-4 bg-gray-50 print:bg-white">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                            <h1 className="text-3xl font-bold uppercase tracking-widest text-gray-700 flex-1 text-center md:text-left">
                                Hoja de Vida Vehículo
                            </h1>
                            <div>
                                <Clock />
                            </div>
                        </div>
                    </div>
                    {/* Encabezado con QR y datos principales */}
                    <div className="flex flex-col md:flex-row items-center justify-between border-b px-8 py-8 bg-white print:bg-white">
                        <div className="flex-1 flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-2xl font-bold text-blue-700">{vehicle.license_plate}</span>
                                <span className="text-base bg-blue-100 text-blue-700 px-2 py-1 rounded">{vehicle.brand}</span>
                                <span className="text-base bg-gray-100 text-gray-700 px-2 py-1 rounded">{vehicle.model}</span>
                                <span className="text-base bg-gray-100 text-gray-700 px-2 py-1 rounded">{vehicle.year}</span>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                                <span className="mr-4">Chasis: <span className="font-semibold">{vehicle.chassis_number}</span></span>
                                <span>Motor: <span className="font-semibold">{vehicle.engine_number}</span></span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center mt-6 md:mt-0">
                            <div className="bg-white p-0 shadow border">
                                <QRCode value={getVehicleShowUrl(vehicle.id)} size={110} bgColor="#fff" />
                            </div>
                            <span className="text-xs text-gray-400 mt-2">QR Hoja de Vida</span>
                        </div>
                    </div>
                    {/* Datos del vehículo en formato tarjetas compactas */}
                    <div className="px-8 py-6">
                        <h3 className="text-lg font-bold mb-4 text-blue-700">Datos del Vehículo</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-blue-700 font-semibold">Cód. llamada</span>
                                <span className="text-base font-bold text-blue-900">{vehicle.code}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-gray-600 font-semibold">Tipo</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.type}</span>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-blue-700 font-semibold">Color</span>
                                <span className="text-base font-bold text-blue-900">{vehicle.color}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-gray-600 font-semibold">Capacidad</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.seating_capacity}</span>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-blue-700 font-semibold">Combustible</span>
                                <span className="text-base font-bold text-blue-900">{vehicle.fuel_type}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-gray-600 font-semibold">Kilometraje</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.mileage}</span>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-blue-700 font-semibold">SOAT</span>
                                <span className="text-base font-bold text-blue-900">{vehicle.insurance_expiry_date}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center shadow-sm">
                                <span className="text-xs text-gray-600 font-semibold">Activo</span>
                                <span className="text-base font-bold text-gray-900">{vehicle.is_active === "1" ? "Sí" : "No"}</span>
                            </div>
                        </div>
                    </div>
                    {/* Gráfico de kilometraje */}
                    <div className="px-8 pb-8">
                        <ChartCard>
                            <CardHeader>
                                <CardTitle>Kilometraje último mes</CardTitle>
                                <CardDescription>Histórico diario</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={mileageChartConfig}>
                                    <LineChart
                                        data={mileageChartData}
                                        margin={{ top: 20, left: 12, right: 12 }}
                                        width={400}
                                        height={40} // altura reducida
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
                                            dataKey="km"
                                            type="monotone"
                                            stroke="var(--color-desktop, #2563eb)"
                                            strokeWidth={2}
                                            dot={{
                                                fill: "var(--color-desktop, #2563eb)",
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
                                <div className="flex gap-2 font-medium leading-none">
                                    Tendencia mensual <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="leading-none text-muted-foreground">
                                    Kilometraje diario del último mes
                                </div>
                            </CardFooter>
                        </ChartCard>
                    </div>
                    {/* Tabla de inspecciones */}
                    <div className="px-8 pb-10">
                        <h3 className="text-lg font-bold mb-4 mt-2 text-blue-700">Historial de Inspecciones</h3>
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="min-w-full text-sm bg-white">
                                <thead>
                                    <tr className="bg-blue-50">
                                        <th className="px-3 py-2 border text-left font-semibold text-blue-700">Tipo</th>
                                        <th className="px-3 py-2 border text-left font-semibold text-blue-700">Realizado por</th>
                                        <th className="px-3 py-2 border text-left font-semibold text-blue-700">Fecha</th>
                                        <th className="px-3 py-2 border text-left font-semibold text-blue-700">Vencimiento</th>
                                        <th className="px-3 py-2 border text-left font-semibold text-blue-700">Estado</th>
                                        <th className="px-3 py-2 border text-left font-semibold text-blue-700">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inspections.map((insp, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50">
                                            <td className="px-3 py-2 border">{insp.tipo}</td>
                                            <td className="px-3 py-2 border">{insp.realizado_por}</td>
                                            <td className="px-3 py-2 border">{insp.fecha}</td>
                                            <td className="px-3 py-2 border">{insp.vencimiento}</td>
                                            <td className="px-3 py-2 border">{insp.estado}</td>
                                            <td className="px-3 py-2 border">{insp.observaciones}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
