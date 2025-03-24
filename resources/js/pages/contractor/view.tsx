import { usePage } from '@inertiajs/react';
import { LoaderCircle, Clipboard, RefreshCw, Eye } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type ContractorForm = {
    id: string;
    ruc: string | null;
    nombre: string | null;
    descripcion: string | null;
    email: string | null;
    password: string | null;
};

export default function ViewContractor({
    contractor,
    isDialogOpen,
    setIsDialogOpen,
}: {
    contractor: ContractorForm | null;
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
}) {
    const { flash } = usePage<{
        flash: { success?: string };
    }>().props;

    const [password, setPassword] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPassword = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(route('admin.contractor.show.password', { contrata: contractor?.id }));
            if (response.data.success) {
                setPassword(response.data.password);
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching password:', error);
            setError('Hubo un problema al obtener la contraseña.');
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(route('admin.contractor.reset.password', { contrata: contractor?.id }));
            if (response.data.success) {
                toast.success(response.data.message, {
                    duration: 10000,
                    closeButton: true,
                });
                fetchPassword();
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('Hubo un problema al restablecer la contraseña.');
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            toast.success('Contraseña copiada al portapapeles', {
                duration: 10000,
                closeButton: true,
            });
        }
    };

    return (
        <div>
            {flash?.success && <div className="mb-4 text-green-600">{flash.success}</div>}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Ver Contratista</DialogTitle>
                        <DialogDescription>
                            <strong>Nombre:</strong> {contractor?.nombre}
                            <br />
                            <strong>RUC:</strong> {contractor?.ruc}
                            <br />
                            <strong>Contraseña:</strong> {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : password}
                            {error && <div className="text-red-600">{error}</div>}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Button onClick={fetchPassword} className="mt-2 w-auto" disabled={loading}>
                            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            <Eye className="h-4 w-4" />
                            Mostrar Contraseña
                        </Button>
                        {password ? (
                            <Button onClick={copyToClipboard} className="mt-2 w-auto">
                                <Clipboard className="h-4 w-4" />
                                Copiar Contraseña
                            </Button>
                        ) : (
                            <Button onClick={resetPassword} className="mt-2 w-auto" disabled={loading}>
                                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                <RefreshCw className="h-4 w-4" />
                                Restablecer Contraseña
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
