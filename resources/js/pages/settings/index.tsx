import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración General',
        href: '/settings/general',
    },
];

interface GeneralSettingsForm {
    web_version: string;
    mobile_version: string;
}

export default function GeneralSettings() {
    const { settingGlobal } = usePage<SharedData>().props;

    const { data, setData, post, reset, errors, processing, recentlySuccessful } = useForm<Partial<GeneralSettingsForm>>({
        web_version: settingGlobal?.web_version || '',
        mobile_version: settingGlobal?.mobile_version || '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [pin, setPin] = useState('');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setIsDialogOpen(true); // Abrir el diálogo para ingresar el PIN
    };

    const handleConfirm = () => {
        if (pin === '135791') {
            setIsDialogOpen(false); // Cerrar el diálogo
            post(route('settings.general.storeOrUpdate'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset(); // Limpiar el formulario al completar la operación
                    setPin(''); // Limpiar el PIN
                    setIsDialogOpen(false); // Cerrar el diálogo
                },
            });
        } else {
            toast.error('El PIN ingresado es incorrecto.');
        }
    };

    const handleClear = () => {
        reset(); // Limpiar el formulario
        setPin(''); // Limpiar el PIN
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración General" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <HeadingSmall
                    title="Configuración General"
                    description="Administra la configuración general de la aplicación, incluyendo versiones web y móvil."
                />

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="web_version">Versión Web</Label>
                        <Input
                            id="web_version"
                            value={data.web_version}
                            onChange={(e) => setData('web_version', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Versión Web"
                        />
                        <InputError message={errors.web_version} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="mobile_version">Versión Móvil</Label>
                        <Input
                            id="mobile_version"
                            value={data.mobile_version}
                            onChange={(e) => setData('mobile_version', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Versión Móvil"
                        />
                        <InputError message={errors.mobile_version} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar Configuración'}
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">¡Configuración guardada correctamente!</p>
                        </Transition>
                    </div>
                </form>
            </div>

            {/* Dialog para ingresar el PIN */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ingrese el PIN de seguridad</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">Para confirmar esta acción, ingrese el PIN de seguridad.</p>
                        <div className="flex justify-center">
                            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={pin} onChange={setPin}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button variant="secondary" onClick={handleClear}>
                                Limpiar
                            </Button>
                            <Button onClick={handleConfirm}>Confirmar</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
