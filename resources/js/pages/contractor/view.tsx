import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        setError(null);
    }, [contractor]);

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Ver Contratista</DialogTitle>
                        <DialogDescription>
                            <strong>Nombre:</strong> {contractor?.nombre}
                            <br />
                            <strong>RUC:</strong> {contractor?.ruc}
                            <br />
                            {error && <div className="text-red-600">{error}</div>}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex space-x-3">
                        <Button onClick={resetPassword} className="mt-2 w-auto" disabled={loading}>
                            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
