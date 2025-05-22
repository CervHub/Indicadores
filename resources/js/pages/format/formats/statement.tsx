import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { AREAS_OPTIONS } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type StatementDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setArea: (area: string) => void;
};

export default function StatementDialog({ open, onOpenChange, setArea }: StatementDialogProps) {
    const [accepted, setAccepted] = useState(false);
    const [selectedArea, setSelectedArea] = useState('');

    const handleAccept = () => {
        setAccepted(false);
        onOpenChange(false);
        setArea(selectedArea);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="pb-3 sm:max-w-[350px]" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Declaración</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2 my-2">
                    <label className="text-sm font-medium mb-1">
                        ¿A qué área será la inspección?
                    </label>
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione un área" />
                        </SelectTrigger>
                        <SelectContent>
                            {AREAS_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex items-start gap-2">
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
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        onClick={handleAccept}
                        disabled={!accepted || !selectedArea}
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
