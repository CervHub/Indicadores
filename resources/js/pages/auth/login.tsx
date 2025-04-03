import { Head, useForm } from '@inertiajs/react';
import { Download, Facebook, Instagram, LoaderCircle, Twitter } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Inicia sesión en tu cuenta" description="Ingresa tu correo electrónico y contraseña a continuación para iniciar sesión">
            <Head title="Iniciar sesión" />

            <div className={cn('flex flex-col gap-6')}>
                <Card className="overflow-hidden p-0 shadow-sm md:shadow-md rounded-5xl">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        {/* Imagen a la izquierda */}
                        <div className="relative m-4 hidden bg-white p-2 md:block">
                            <div className="h-full w-full overflow-hidden">
                                <img
                                    src="/auth/img-toq.png"
                                    alt="Imagen"
                                    className="absolute inset-0 h-full w-full object-initial"

                                />

                                <div className="absolute bottom-4 left-4">
                                    <Button variant="destructive" asChild className="flex items-center space-x-2">
                                        <a href="https://play.google.com/store/apps/details?id=com.CERV.GESTIONSSTV1">
                                            <Download className="h-5 w-5" />
                                            <span>Descargar APP</span>
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Formulario a la derecha */}
                        <form className="p-6 md:p-8" onSubmit={submit}>
                            <div className="flex flex-col gap-6">
                                {/* Logos superiores */}
                                <div className="flex items-center justify-between gap-4">
                                    <img src="/auth/logo-SOUTHERN-PERU.png" alt="Logo Grupo México" className="h-4" />
                                    <img src="/auth/CRUZ-minimal-toquepala.png" alt="Logo Southern Peru" className="h-10" />
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <img src="/auth/logogrupomexico-mineria-02.png" alt="Logo Cruz Toquepala" className="h-12" />
                                </div>

                                {/* Título y descripción */}
                                <div className="flex flex-col items-center text-center">
                                    <p className="text-muted-foreground text-sm text-balance">
                                        Ingresa tu correo electrónico o RUC y tu contraseña para iniciar sesión en tu cuenta.
                                    </p>
                                </div>

                                {/* Campos del formulario */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Correo electrónico/RUC</Label>
                                    <Input
                                        id="email"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Contraseña</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Contraseña"
                                    />
                                    <InputError message={errors.password} />
                                    <InputError message={errors.error} />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onClick={() => setData('remember', !data.remember)}
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember">Recuérdame</Label>
                                </div>
                                <div className="flex w-full items-center justify-center">
                                    <Button type="submit" variant={'destructive'} className="w-auto" tabIndex={4} disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Iniciar sesión
                                    </Button>
                                </div>

                                <div className="mt-4 flex justify-center">
                                    <p className="text-sm text-muted-foreground">
                                        Powered by{' '}
                                        <a
                                            href="https://cerv.com.pe/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-dark hover:underline"
                                        >
                                            CERV
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
