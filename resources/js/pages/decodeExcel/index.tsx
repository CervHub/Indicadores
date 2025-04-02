import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs = [
    {
        title: 'Decodificar Excel',
        href: '/decode',
    },
];

export default function DecodeExcelPage() {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        file: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('decode.store'), {
            onSuccess: () => {
                toast.success('Archivo procesado con éxito');
                reset();
            },
            onError: () => {
                toast.error('Ocurrió un error al procesar el archivo');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Decodificar Excel" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Subir Archivo Excel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    placeholder="Ingresa tu nombre"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="file">Archivo Excel</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                />
                            </div>
                            <Button type="submit" className="w-auto" disabled={processing}>
                                {processing ? (
                                    <div className="flex items-center space-x-2">
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                        <span>Procesando...</span>
                                    </div>
                                ) : (
                                    'Procesar'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
