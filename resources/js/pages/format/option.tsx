import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { CheckCircle, Truck } from 'lucide-react';
import { useId, useState } from 'react';

type ModalProps = {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
};

const options = [
    {
        value: 'daily',
        title: 'Inspección',
        subtitle: 'Vehicular diaria',
        description: 'Inspección diaria de vehículos para garantizar su operatividad.',
        background: '/reports/FONDO%20AMARILLO.svg',
        route: route('format.dailyVehicleInspection'), // Usamos el nombre de la ruta
        icon: Truck,
    },
    {
        value: 'quarterly',
        title: 'Inspección',
        subtitle: 'Vehicular trimestral',
        description: 'Inspección trimestral de vehículos para mantenimiento preventivo.',
        background: '/reports/FONDO%20ROJO.svg',
        route: route('format.quarterlyVehicleInspection'), // Usamos el nombre de la ruta
        icon: CheckCircle,
    },
    {
        value: 'semiannual',
        title: 'Inspección',
        subtitle: 'Vehicular semestral',
        description: 'Inspección semestral de vehículos para evaluar su estado general.',
        background: '/reports/FONDO%20TURQUESA.svg',
        route: route('format.semiannualVehicleInspection'), // Usamos el nombre de la ruta
        icon: Truck,
    },
    {
        value: 'annual',
        title: 'Inspección',
        subtitle: 'Vehicular parada anual',
        description: 'Inspección anual de vehículos durante la parada programada.',
        background: '/reports/FONDO%20VERDE.svg',
        route: route('format.annualVehicleShutdownInspection'), // Usamos el nombre de la ruta
        icon: CheckCircle,
    },
];

export default function IndicationsModal({ isDialogOpen, setIsDialogOpen }: ModalProps) {
    const id = useId();
    const [selectedOption, setSelectedOption] = useState<string | null>(null); // Estado para la opción seleccionada

    const handleCardClick = (value: string) => {
        setSelectedOption(value); // Actualizar la opción seleccionada
    };

    const handleDialogOpenChange = (open: boolean) => {
        if (!open) {
            setSelectedOption(null); // Restablecer la selección al cerrar el modal
        }
        setIsDialogOpen(open);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogContent className="pb-3 sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Seleccionar el tipo de Inspección Vehicular:</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    {options.map((option) => (
                        <Link
                            key={`${id}-${option.value}`}
                            href={option.route}
                            onClick={() => handleCardClick(option.value)}
                            className={cn(
                                'relative flex cursor-pointer flex-col gap-4 rounded-md border p-4 shadow-xs outline-none',
                                selectedOption === option.value
                                    ? 'border-3 border-blue-500' // Borde azul más grueso
                                    : 'border-input',
                                selectedOption && selectedOption !== option.value
                                    ? 'pointer-events-none opacity-50' // Deshabilitar y reducir opacidad para las no seleccionadas
                                    : 'hover:border-3 hover:border-blue-500',
                            )}
                            style={{
                                backgroundImage: `url(${option.background})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="flex justify-between gap-2">
                                <option.icon className="opacity-60" size={24} aria-hidden="true" />
                            </div>
                            <Label className="font-semibold tracking-tight text-white">{option.title}</Label>
                            <span className="text-sm text-white">{option.subtitle}</span>
                            <p className="text-xs text-white">{option.description}</p>
                        </Link>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
