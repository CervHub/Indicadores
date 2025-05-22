import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
];

export const AREAS_OPTIONS = [
    { value: 'Mina', label: 'Mina' },
    { value: 'Concentradora', label: 'Concentradora' },
    { value: 'Campamento', label: 'Campamento' },
]

export const VEHICLE_TYPE_OPTIONS = [
    { value: 'Ambulancia', label: 'Ambulancia' },
    { value: 'Auto Seda', label: 'Auto Seda' },
    { value: 'Auto Sedan', label: 'Auto Sedan' },
    { value: 'Autohormigonera', label: 'Autohormigonera' },
    { value: 'Bomba de concreto estacionaria', label: 'Bomba de concreto estacionaria' },
    { value: 'Bomba Telescopica', label: 'Bomba Telescopica' },
    { value: 'Bombona', label: 'Bombona' },
    { value: 'Bus', label: 'Bus' },
    { value: 'Camion', label: 'Camion' },
    { value: 'Camion Baranda', label: 'Camion Baranda' },
    { value: 'Camion Cama Baja', label: 'Camion Cama Baja' },
    { value: 'Camion Cisterna', label: 'Camion Cisterna' },
    { value: 'Camion Furgón', label: 'Camion Furgón' },
    { value: 'Camion Grua', label: 'Camion Grua' },
    { value: 'Camion Lubricador', label: 'Camion Lubricador' },
    { value: 'Camion Remolcador', label: 'Camion Remolcador' },
    { value: 'Camioneta', label: 'Camioneta' },
    { value: 'CAMIONETA PICK-UP', label: 'CAMIONETA PICK-UP' },
    { value: 'CAMIONETA RURAL', label: 'CAMIONETA RURAL' },
    { value: 'CAMIONETA SUV', label: 'CAMIONETA SUV' },
    { value: 'Cargador Frontal', label: 'Cargador Frontal' },
    { value: 'Dolly', label: 'Dolly' },
    { value: 'Excavadora', label: 'Excavadora' },
    { value: 'Excavadora Hidraulica', label: 'Excavadora Hidraulica' },
    { value: 'Furgón frigorífico', label: 'Furgón frigorífico' },
    { value: 'Grua Telescopica', label: 'Grua Telescopica' },
    { value: 'Manlift', label: 'Manlift' },
    { value: 'MICROBUS', label: 'MICROBUS' },
    { value: 'MICROBUS RURAL', label: 'MICROBUS RURAL' },
    { value: 'Mini Van', label: 'Mini Van' },
    { value: 'Minicargador', label: 'Minicargador' },
    { value: 'Mixer Hormigonera', label: 'Mixer Hormigonera' },
    { value: 'Montacarga', label: 'Montacarga' },
    { value: 'Moto', label: 'Moto' },
    { value: 'Motoniveladora', label: 'Motoniveladora' },
    { value: 'PAVIMENTADORA DE ASFALTO', label: 'PAVIMENTADORA DE ASFALTO' },
    { value: 'Perforadora', label: 'Perforadora' },
    { value: 'Planta Clasificadora o Zaranda', label: 'Planta Clasificadora o Zaranda' },
    { value: 'Plataforma', label: 'Plataforma' },
    { value: 'Prancha', label: 'Prancha' },
    { value: 'Retroexcavadora', label: 'Retroexcavadora' },
    { value: 'Rodillo', label: 'Rodillo' },
    { value: 'SPRINTER 415 CDI/C3665 KOMBI 15+1', label: 'SPRINTER 415 CDI/C3665 KOMBI 15+1' },
    { value: 'Telehandler', label: 'Telehandler' },
    { value: 'Tracto', label: 'Tracto' },
    { value: 'Tractor de Grua', label: 'Tractor de Grua' },
    { value: 'Tractor de Oruga', label: 'Tractor de Oruga' },
    { value: 'VAN TOYOTA HIACE', label: 'VAN TOYOTA HIACE' },
    { value: 'Volquete', label: 'Volquete' },
];

const permissions: { [key: string]: string } = {
    SA: 'Super Admin',
    RU: 'Regular User',
    CA: 'Company Admin',
    SCC: 'Sub Comité de Contratistas',
    ALM: 'Almacenes',
    PI: 'Proyectos de Inversión',
    CO: 'Contratos de Obras',
    CS: 'Contratos y Servicios',
    IS: 'Ingeniero de Seguridad',
};

export function getPermissionDescription(value: string): string | undefined {
    return permissions[value];
}

export function formatDateTime(date: Date | string): string {
    if (typeof date === 'string') {
        date = new Date(date);
    }

    // Ajustar a UTC-5
    const utcDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);

    const day = utcDate.getDate().toString().padStart(2, '0');
    const month = (utcDate.getMonth() + 1).toString().padStart(2, '0');
    const year = utcDate.getFullYear();
    const hours = utcDate.getHours().toString().padStart(2, '0');
    const minutes = utcDate.getMinutes().toString().padStart(2, '0');
    const seconds = utcDate.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function findFieldByValue<T>(
    array: T[],
    searchField: keyof T,
    searchValue: string | number | boolean,
    returnField: keyof T
): T[keyof T] | undefined {
    const foundItem = array.find(item => item[searchField] === searchValue);
    return foundItem ? foundItem[returnField] : undefined;
}

export function findInArrayObject<T>(
    array: T[],
    searchField: keyof T,
    searchValue: string | number | boolean,
    returnField: keyof T,
    castFunction: (value: unknown) => unknown = value => value
): T[keyof T] | undefined {
    const foundItem = array.find(item => castFunction(item[searchField]) === castFunction(searchValue));
    return foundItem ? foundItem[returnField] : undefined;
}

export function formatNumber(value: number | string) {
    if (typeof value === 'string') {
        value = value.replace(',', ''); // Eliminar comas si existen
    }
    const number = parseFloat(value.toString());
    if (!isNaN(number)) {
        return number.toFixed(2);
    }
    return value;
};
