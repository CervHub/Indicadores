import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link } from '@inertiajs/react';

type StatementDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function StatementDialog({ open, onOpenChange }: StatementDialogProps) {
    const [accepted, setAccepted] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="pb-3 sm:max-w-[350px]" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Declaración</DialogTitle>
                </DialogHeader>
                <div className="flex items-start gap-2 my-2">
                    <input
                        type="checkbox"
                        id="accept-terms"
                        checked={accepted}
                        onChange={e => setAccepted(e.target.checked)}
                        className="mt-1"
                    />
                    <label htmlFor="accept-terms" className="text-sm select-none">
                        Declaro bajo protesta de decir verdad que la información proporcionada en el formato de inspección vehicular es verídica y completa, y asumo la responsabilidad de su contenido.
                    </label>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        onClick={() => {
                            setAccepted(false);
                            onOpenChange(false);
                        }}
                        disabled={!accepted}
                    >
                        Acepto
                    </Button>
                    <Link href={route('format.index')}>
                        <Button
                            type="button"
                            variant="secondary"
                        >
                            No acepto
                        </Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
