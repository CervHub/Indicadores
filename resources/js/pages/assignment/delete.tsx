import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function DeleteAssignment({
    assignment,
    isDialogOpen,
    setIsDialogOpen,
}: {
    assignment: any;
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
}) {
    const { post, processing } = useForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (assignment) {
            post(route('assignments.destroy', { assignment: assignment.id }), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Asignación eliminada correctamente.');
                },
                onError: () => {
                    toast.error('Ocurrió un error al intentar eliminar la asignación.');
                },
            });
        }
    };

    const userName = assignment?.user ? `${assignment.user.nombres} ${assignment.user.apellidos}` : 'Usuario';
    const companyName = assignment?.company?.nombre || 'Empresa';

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Eliminar Asignación</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de eliminar a <strong>{userName}</strong> de la empresa <strong>{companyName}</strong> para hacer el seguimiento de los reportes?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={processing}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="destructive"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Eliminar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
