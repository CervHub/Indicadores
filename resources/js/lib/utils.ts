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

export function formatDateTime(date: Date | string): string {
    if (typeof date === 'string') {
        date = new Date(date);
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son 0-indexados
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

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
