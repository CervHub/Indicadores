import { useCallback } from 'react';

export function useInitials() {
    const getInitials = useCallback((fullName: string | null | undefined): string => {
        if (!fullName) return 'S/N';

        const names = fullName.trim().split(' ');

        if (names.length === 0) return 'S/N';
        if (names.length === 1) return names[0].charAt(0).toUpperCase();

        const firstInitial = names[0].charAt(0);
        const lastInitial = names[names.length - 1].charAt(0);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);

    return getInitials;
}
