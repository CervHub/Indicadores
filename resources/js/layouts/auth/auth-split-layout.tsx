import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10 bg-muted md:bg-none bg-mobile relative">
            {/* Overlay para el efecto oscuro */}
            <div className="absolute inset-0 bg-black/50 md:hidden"></div>
            <div className="relative w-full max-w-sm md:max-w-4xl">{children}</div>
        </div>
    );
}
