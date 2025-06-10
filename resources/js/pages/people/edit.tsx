import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';

import { toast } from 'sonner';

type PersonForm = {
    id: number;
    doi: string;
    email: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    cargo: string;
    role_id: number;
    company_id?: string;
};

type Role = {
    id: number;
    code: string;
    nombre: string;
    descripcion: string;
    estado: string;
    created_at: string;
    updated_at: string;
};

type Company = {
    id: string;
    nombre: string;
    ruc: string;
    email: string;
    descripcion: string;
    estado: string;
    created_at: string;
    updated_at: string;
    contractor_company_type_id: string | null;
    situation: string | null;
    code: string;
};

type EditPersonProps = {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    person?: PersonForm & { role_id: number; company_id?: string };
    roles: Role[];
    companies: Company[];
    userRoleCode: string;
};

export default function EditPerson({ isOpen = false, onOpenChange, person, roles, companies, userRoleCode }: EditPersonProps) {
    console.log('EditPerson component rendered with person:', person);
    
    // Prepare company options for Combobox
    const companyOptions = companies.map(company => ({
        value: company.id,
        label: `${company.nombre} (${company.ruc})`
    }));

    // Prepare role options for Combobox
    const roleOptions = roles.map(role => ({
        value: role.id.toString(),
        label: `${role.nombre} (${role.code})`
    }));

    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<PersonForm>({
        id: person?.id || 0,
        doi: person?.doi || '',
        email: person?.email || '',
        nombres: person?.nombres || '',
        apellidos: person?.apellidos || '',
        telefono: person?.telefono || '',
        cargo: person?.cargo || '',
        role_id: person?.role_id || 0,
        company_id: person?.company_id || '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsDialogOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (person) {
            setData({
                id: person.id,
                doi: person.doi,
                email: person.email,
                nombres: person.nombres,
                apellidos: person.apellidos,
                telefono: person.telefono,
                cargo: person.cargo,
                role_id: person.role_id || 0,
                company_id: person.company_id || '',
            });
        }
    }, [person, setData]);

    useEffect(() => {
        // Check if required fields are filled
        setIsFormValid(data.doi.trim() !== '' && data.nombres.trim() !== '' && data.apellidos.trim() !== '');
    }, [data.doi, data.nombres, data.apellidos]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        put(route('contrata.personal.update', person?.id), {
            onSuccess: (page) => {
                const flash = page.props.flash;

                if (flash.success) {
                    toast.success(flash.success);
                    setIsDialogOpen(false);
                    if (onOpenChange) onOpenChange(false);
                }

                if (flash.error) {
                    toast.error(flash.error);
                }
            },
            onError: (errors) => {
                setIsDialogOpen(true);
                toast.error('Ocurrió un error al intentar actualizar la persona.');
            },
        });
    };

    // Reset form when dialog closes
    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (onOpenChange) onOpenChange(open);

        if (!open) {
            clearErrors();
        }
    };

    return (
        <div>
            <Dialog
                open={isDialogOpen}
                onOpenChange={handleDialogChange}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Persona</DialogTitle>
                        <DialogDescription>Complete los campos para editar la persona.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-3" method="post" action={route('contrata.personal.update', person?.id)}>
                        <div className="grid gap-2">
                            <Label htmlFor="doi">DOI</Label>
                            <Input id="doi" value={data.doi} onChange={(e) => setData('doi', e.target.value)} />
                            <InputError message={errors.doi} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nombres">Nombres</Label>
                            <Input id="nombres" value={data.nombres} onChange={(e) => setData('nombres', e.target.value)} />
                            <InputError message={errors.nombres} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="apellidos">Apellidos</Label>
                            <Input id="apellidos" value={data.apellidos} onChange={(e) => setData('apellidos', e.target.value)} />
                            <InputError message={errors.apellidos} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} />
                            <InputError message={errors.telefono} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cargo">Cargo</Label>
                            <Input id="cargo" value={data.cargo} onChange={(e) => setData('cargo', e.target.value)} />
                            <InputError message={errors.cargo} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role_id">Rol</Label>
                            <Select value={data.role_id.toString()} onValueChange={(value) => setData('role_id', parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id.toString()}>
                                            {role.nombre} ({role.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role_id} />
                        </div>
                        {userRoleCode === 'SA' && (
                            <div className="grid gap-2">
                                <Label htmlFor="company_id">Empresa</Label>
                                <Combobox
                                    data={companyOptions}
                                    value={data.company_id || ''}
                                    onChange={(value) => {
                                        setData('company_id', value);
                                    }}
                                    placeholder="Seleccione una empresa..."
                                    className="w-full"
                                />
                                <InputError message={errors.company_id} />
                            </div>
                        )}
                        <Button type="submit" className="mt-2" disabled={processing || !isFormValid}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Actualizar
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
