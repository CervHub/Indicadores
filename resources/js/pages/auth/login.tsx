import { Head, useForm } from '@inertiajs/react';
import { FaAppStore } from 'react-icons/fa';
import { MdAndroid } from 'react-icons/md'; // Importa los íconos de Android y Apple

import { HelpCircle, LoaderCircle } from 'lucide-react'; // Mantén los íconos que ya usas
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    appname?: string; // <-- Agrega appname
}

export default function Login({ status, canResetPassword, appname }: LoginProps) {
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

    // Configuración de logos e imágenes según appname
    let logo1 = null;
    let logo2 = null;
    let logo3 = null;
    let bgImage = null;

    if (appname === 'GestionSST') {
        logo1 = '/auth/logo-SOUTHERN-PERU.png';
        logo2 = '/auth/CRUZ-minimal-toquepala.png';
        logo3 = '/auth/logogrupomexico-mineria-02.png';
        bgImage = '/auth/img-toq.png';
    } else if (appname === 'InspeccionVehicularCuajone') {
        logo3 = '/auth/logogrupomexico-mineria-02.png';
        bgImage = '/auth/img-toq.png';
    }

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.style.display = 'none';
    };

    console.log('App Name:', appname); // Para depuración

    // Determinar clase de fondo móvil según appname
    const mobileBgClass = appname === 'GestionSST' ? 'bg-mobile-gestion-sst' : 'bg-mobile-cuajone-sst';

    return (
        <AuthLayout
            title="Inicia sesión en tu cuenta"
            description="Ingresa tu correo electrónico y contraseña a continuación para iniciar sesión"
            className={mobileBgClass}
        >
            <Head title="Iniciar sesión" />

            <div className={cn('flex flex-col gap-6')}>
                <Card className="rounded-5xl relative overflow-hidden p-0 shadow-sm md:shadow-md">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        {/* Imagen a la izquierda */}
                        <div className="relative m-4 hidden bg-white p-2 md:block">
                            <div className="h-full w-full overflow-hidden">
                                {bgImage && (
                                    <img
                                        src={bgImage}
                                        alt="Imagen"
                                        className="object-initial absolute inset-0 h-full w-full"
                                        onError={handleImgError}
                                    />
                                )}

                                {/* Botón de descarga para Android */}
                                <div className="absolute bottom-16 left-4">
                                    <Button variant="destructive" asChild className="flex items-center space-x-2">
                                        <a
                                            href="https://play.google.com/store/apps/details?id=com.CERV.GESTIONSSTV1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <MdAndroid className="h-5 w-5" /> {/* Ícono de Android */}
                                            <span>Descargar APP Android</span>
                                        </a>
                                    </Button>
                                </div>

                                {/* Botón de descarga para iOS */}
                                <div className="absolute bottom-4 left-4">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="flex items-center space-x-2 bg-gray-800 text-white hover:bg-gray-900">
                                                <FaAppStore className="h-5 w-5" /> {/* Ícono de Apple */}
                                                <span>Descargar APP iOS</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Descarga para iOS</DialogTitle>
                                                <DialogDescription>
                                                    Para descargar la aplicación en iOS, comunícate con nosotros para obtener el aplicativo:
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-2">
                                                <p>Teléfono: +51 913 719 735</p>
                                                <p>Correo: soporte@cerv.com.pe</p>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Botón de ayuda */}
                                <div className="absolute right-10 bottom-4">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600">
                                                <HelpCircle className="size-7 h-7 w-7" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Contacto de Soporte</DialogTitle>
                                                <DialogDescription>
                                                    Si necesitas ayuda, puedes contactarnos a través de los siguientes medios:
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-2">
                                                <p>Correo: soporte@cerv.com.pe</p>
                                                <p>WhatsApp y Teléfono: +51 913 719 735</p>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>

                        {/* Formulario a la derecha */}
                        <form className="p-6 md:p-8" onSubmit={submit}>
                            <div className="flex flex-col gap-6">
                                {/* Logos superiores */}
                                <div className="flex items-center justify-between gap-4">
                                    {logo1 && <img src={logo1} alt="Logo 1" className="h-4" onError={handleImgError} />}
                                    {logo2 && <img src={logo2} alt="Logo 2" className="h-10" onError={handleImgError} />}
                                </div>
                                <div className="mt-4 flex justify-center">
                                    {logo3 && <img src={logo3} alt="Logo 3" className="h-12" onError={handleImgError} />}
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
                            </div>
                            {/* Botones de ayuda y descargas para mobile */}
                            <div className="mt-4 flex flex-row justify-center gap-4 md:hidden">
                                {/* Botón de descarga para Android */}
                                <Button variant="destructive" asChild className="flex h-10 w-10 items-center justify-center p-0">
                                    <a
                                        href="https://play.google.com/store/apps/details?id=com.CERV.GESTIONSSTV1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MdAndroid className="h-5 w-5" />
                                    </a>
                                </Button>

                                {/* Botón de descarga para iOS */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="flex h-10 w-10 items-center justify-center bg-gray-800 p-0 text-white hover:bg-gray-900">
                                            <FaAppStore className="h-5 w-5" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Descarga para iOS</DialogTitle>
                                            <DialogDescription>
                                                Para descargar la aplicación en iOS, comunícate con nosotros para obtener el aplicativo:
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-2">
                                            <p>Teléfono: +51 913 719 735</p>
                                            <p>Correo: soporte@cerv.com.pe</p>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Botón de ayuda */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="flex h-10 w-10 items-center justify-center bg-blue-500 p-0 text-white hover:bg-blue-600">
                                            <HelpCircle className="h-5 w-5" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Contacto de Soporte</DialogTitle>
                                            <DialogDescription>
                                                Si necesitas ayuda, puedes contactarnos a través de los siguientes medios:
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-2">
                                            <p>Correo: soporte@cerv.com.pe</p>
                                            <p>WhatsApp y Teléfono: +51 913 719 735</p>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
