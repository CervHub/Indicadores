import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Info, AlertTriangle } from 'lucide-react';
import {CONST_UNIDAD_DE_MEDIDA} from '@/lib/utils';

// Tipos e interfaces
export type CategoryAttribute = {
    id: string | number;
    name: string;
    attribute_type: string;
};

export type Causa = {
    id: string | number;
    nombre: string;
    name?: string;
    group: string;
    has_attributes?: boolean;
    attribute_type?: string;
    category_attributes?: CategoryAttribute[];
    document_url?: string;
    document_name?: string;
    instruction?: string;
};

export type CausaState = {
    id: string | number;
    name?: string;
    state: string;
    observation: string;
};

export type ExtraFormData = Record<string, Record<string, any>>;

// Hook para manejar causas y modal centralizado
export function useCausasState(causas: Causa[]) {
    const [causaStates, setCausaStates] = React.useState<CausaState[]>(
        causas.map((causa) => ({
            id: causa.id,
            name: causa.name,
            state: '',
            observation: '',
        }))
    );
    const [extraFormData, setExtraFormData] = React.useState<ExtraFormData>({});
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalAttributes, setModalAttributes] = React.useState<CategoryAttribute[]>([]);
    const [modalTitle, setModalTitle] = React.useState('');
    const [modalCausaId, setModalCausaId] = React.useState<string | number | null>(null);

    return {
        causaStates,
        setCausaStates,
        extraFormData,
        setExtraFormData,
        modalOpen,
        setModalOpen,
        modalAttributes,
        setModalAttributes,
        modalTitle,
        setModalTitle,
        modalCausaId,
        setModalCausaId,
    };
}

// Opciones de neumáticos con imagen de referencia
const TIRE_COUNT_OPTIONS = [
    { value: "4", label: "4", img: "/images/neumaticos/01.png" },
    { value: "6", label: "6", img: "/images/neumaticos/02.png" },
    { value: "10", label: "10", img: "/images/neumaticos/03.png" },
    { value: "12", label: "12", img: "/images/neumaticos/04.png" },
    { value: "14", label: "14", img: "/images/neumaticos/05.png" },
];

// Formulario extra (modal)
function ModalExtraForm({
    attributes,
    causaId,
    extraFormData,
    setExtraFormData,
    causaState,
}: {
    attributes: CategoryAttribute[];
    causaId: string | number;
    extraFormData: ExtraFormData;
    setExtraFormData: React.Dispatch<React.SetStateAction<ExtraFormData>>;
    causaState: CausaState | undefined;
}) {
    const formState = extraFormData[causaId] || {};

    // Helper para mostrar la unidad legible
    function getUnitLabel(unit?: string) {
        if (!unit) return '';
        const found = CONST_UNIDAD_DE_MEDIDA.find(u => u.value === unit);
        return found ? found.label : unit;
    }

    // Helper para validar el valor de un atributo según su min_value
    function getValidation(attr: any, value: any) {
        let cumple = false;
        let regla = '';
        if (attr.attribute_type === 'fecha' && attr.min_value !== null && attr.min_value !== undefined) {
            if (attr.min_value === "0") {
                regla = 'Debe ser mayor o igual a hoy';
                if (value) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const inputDate = new Date(value);
                    inputDate.setHours(0, 0, 0, 0);
                    cumple = inputDate >= today;
                }
            } else if (!isNaN(Number(attr.min_value))) {
                // min_value numérico: días a futuro
                regla = `Debe ser al menos dentro de ${attr.min_value} días`;
                if (value) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const minDate = new Date(today);
                    minDate.setDate(today.getDate() + Number(attr.min_value));
                    const inputDate = new Date(value);
                    inputDate.setHours(0, 0, 0, 0);
                    cumple = inputDate >= minDate;
                }
            }
        } else if (attr.attribute_type === 'entero' && attr.min_value !== null && attr.min_value !== undefined) {
            regla = `Debe ser mayor o igual a ${attr.min_value}`;
            if (value !== undefined && value !== '' && !isNaN(Number(value))) {
                cumple = Number(value) >= Number(attr.min_value);
            }
        } else if (attr.attribute_type === 'texto') {
            regla = 'Debe estar lleno';
            cumple = !!value && value !== '';
        } else {
            regla = 'Debe estar lleno';
            cumple = !!value && value !== '';
        }
        return { cumple, regla };
    }

    // Cambia y guarda valor, nombre, validación y regla, y si está conforme
    const handleChange = (attrId: string | number, value: any, attrName: string, attr: any) => {
        const { cumple, regla } = getValidation(attr, value);
        setExtraFormData(prev => ({
            ...prev,
            [causaId]: {
                ...prev[causaId],
                [attrId]: value,
                [`${attrId}_nombre`]: attrName,
                [`${attrId}_cumple`]: cumple,
                [`${attrId}_regla`]: regla,
                [`${attrId}_conforme`]: cumple ? 'Conforme' : 'No Conforme',
            },
        }));
    };

    // Extrae el número de neumáticos si el título es "Neumáticos X"
    let tireImg: string | undefined;
    if (causaState?.name) {
        const match = causaState.name.match(/^Neum[aá]ticos\s+(\d+)/i);
        if (match) {
            const tireCount = match[1];
            const found = TIRE_COUNT_OPTIONS.find(opt => opt.value === tireCount);
            tireImg = found?.img;
        }
    }

    return (
        <div className="w-full">
            <form
                className="
                    grid grid-cols-1 gap-4
                    sm:grid-cols-2
                    md:grid-cols-2
                    w-full
                "
            >
                {attributes.map(attr => {
                    const value = formState[attr.id];
                    return (
                        <div key={attr.id} className="flex flex-col gap-1">
                            <Label>
                                {attr.name}
                                {attr.unit && (
                                    <span className="text-xs text-muted-foreground ml-1">
                                        ({getUnitLabel(attr.unit)})
                                    </span>
                                )}
                            </Label>
                            {attr.attribute_type === 'fecha' && (
                                <Input
                                    type="date"
                                    value={value || ''}
                                    onChange={e => handleChange(attr.id, e.target.value, attr.name, attr)}
                                />
                            )}
                            {attr.attribute_type === 'entero' && (
                                <Input
                                    type="number"
                                    value={value || ''}
                                    onChange={e => handleChange(attr.id, e.target.value, attr.name, attr)}
                                />
                            )}
                            {attr.attribute_type === 'texto' && (
                                <Input
                                    type="text"
                                    value={value || ''}
                                    onChange={e => handleChange(attr.id, e.target.value, attr.name, attr)}
                                />
                            )}
                            {/* Mostrar regla, si cumple y conforme */}
                            {formState[`${attr.id}_regla`] && (
                                <span className="text-xs mt-1">
                                    {/* Regla: {formState[`${attr.id}_regla`]}<br />
                                    Cumple: {formState[`${attr.id}_cumple`] ? 'Sí' : 'No'}<br /> */}
                                    Estado: {formState[`${attr.id}_conforme`] || ''}
                                </span>
                            )}
                        </div>
                    );
                })}
            </form>
            {tireImg && (
                <div className="w-full flex flex-col items-center mt-4">
                    <span className="text-sm text-muted-foreground mb-2">Referencia de neumáticos</span>
                    <img src={tireImg} alt="Referencia neumáticos" className="max-w-xs max-h-92 " />
                </div>
            )}
        </div>
    );
}

// Tabla de causas con modal global
export function CausasTableWithModal({
    causas,
    causaStates,
    setCausaStates,
    extraFormData,
    setExtraFormData,
    groupedCausas,
    modalOpen,
    setModalOpen,
    modalAttributes,
    setModalAttributes,
    modalTitle,
    setModalTitle,
    modalCausaId,
    setModalCausaId,
}: {
    causas: Causa[];
    causaStates: CausaState[];
    setCausaStates: React.Dispatch<React.SetStateAction<CausaState[]>>;
    extraFormData: ExtraFormData;
    setExtraFormData: React.Dispatch<React.SetStateAction<ExtraFormData>>;
    groupedCausas: Record<string, Causa[]>;
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    modalAttributes: CategoryAttribute[];
    setModalAttributes: (attrs: CategoryAttribute[]) => void;
    modalTitle: string;
    setModalTitle: (title: string) => void;
    modalCausaId: string | number | null;
    setModalCausaId: (id: string | number | null) => void;
}) {
    // Renderiza el input adecuado según attribute_type
    const renderObservationInput = (causa: Causa) => {
        const causaState = causaStates.find((c) => c.id === causa.id);
        const value = causaState?.observation || '';
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
            handleCausaStateChange(causa.id as string, undefined as any, e.target.value);

        function handleCausaStateChange(id: string, state: string, observation: string) {
            const updatedCausaStates = causaStates.map((causa) =>
                causa.id === id
                    ? {
                        ...causa,
                        state: state !== undefined ? state : causa.state,
                        observation,
                    }
                    : causa,
            );
            setCausaStates(updatedCausaStates);
        }

        switch (causa.attribute_type) {
            case 'fecha':
                return (
                    <Input
                        type="date"
                        value={value}
                        onChange={onChange}
                    />
                );
            case 'entero':
                return (
                    <Input
                        type="number"
                        value={value}
                        onChange={onChange}
                    />
                );
            case 'texto':
            default:
                return (
                    <Input
                        type="text"
                        value={value}
                        onChange={onChange}
                    />
                );
        }
    };

    // Verifica si el formulario extra de una causa está completo
    const isExtraFormComplete = (causa: Causa) => {
        if (!causa.has_attributes || !causa.category_attributes) return true;
        const formState = extraFormData[causa.id] || {};
        return causa.category_attributes.every(attr => !!formState[attr.id]);
    };

    // Efecto para autoevaluar el estado de causas con atributos tipo fecha y min_value
    React.useEffect(() => {
        setCausaStates(prevStates => {
            return prevStates.map(causaState => {
                const causa = causas.find(c => c.id === causaState.id);
                if (!causa || !causa.has_attributes || !causa.category_attributes) return causaState;

                // Validaciones por atributo: cumple o no cumple
                const formState = extraFormData[causa.id] || {};
                const validaciones = causa.category_attributes.map(attr => {
                    const value = formState[attr.id];
                    let cumple = false;
                    if (attr.attribute_type === 'fecha' && attr.min_value !== null) {
                        if (value) {
                            if (attr.min_value === "0") {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const inputDate = new Date(value);
                                inputDate.setHours(0, 0, 0, 0);
                                cumple = inputDate >= today;
                            } else {
                                // Otros casos de min_value para fecha pueden agregarse aquí
                                cumple = true;
                            }
                        }
                    } else if (attr.attribute_type === 'entero' && attr.min_value !== null) {
                        if (value !== undefined && value !== '' && !isNaN(Number(value))) {
                            cumple = Number(value) >= Number(attr.min_value);
                        }
                    } else if (attr.attribute_type === 'texto') {
                        cumple = !!value && value !== '';
                    } else {
                        // Otros tipos, considerar como cumple si tiene valor
                        cumple = !!value && value !== '';
                    }
                    return { attrId: attr.id, cumple };
                });

                // Todos los campos completos y válidos
                const allCumplen = validaciones.every(v => v.cumple);

                if (allCumplen) {
                    if (causaState.state !== 'Conforme') {
                        return { ...causaState, state: 'Conforme' };
                    }
                } else {
                    if (causaState.state !== 'No Conforme') {
                        return { ...causaState, state: 'No Conforme' };
                    }
                }
                return causaState;
            });
        });
    }, [extraFormData, causas, setCausaStates]);

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 border-b">
                        <TableHead className="border-r text-center"></TableHead>
                        <TableHead className="border-r text-center">
                            <Download className="w-4 h-4 mx-auto" />
                        </TableHead>
                        <TableHead className="border-r text-center sm:min-w-[400px] md:min-w-[400px] lg:min-w-[400px] xl:min-w-[800px]">
                            Causa
                        </TableHead>
                        <TableHead className="border-r text-center">
                            <FileText className="w-4 h-4 mx-auto" />
                        </TableHead>
                        <TableHead className="border-r text-center">
                            Estado
                        </TableHead>
                        <TableHead className="text-center w-[50px] md:min-w-[50px]">
                            Observaciones
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(groupedCausas).map(([group, groupCausas]) => (
                        <React.Fragment key={group}>
                            <TableRow className="bg-muted/50">
                                <TableCell colSpan={6} className="text-center font-bold border-b">
                                    {group}
                                </TableCell>
                            </TableRow>
                            {groupCausas.map((causa) => (
                                <TableRow key={causa.id} className="border-b">
                                    {/* Info button column */}
                                    <TableCell className="border-r text-center">
                                        {causa.instruction ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button type="button" size="icon" variant="outline" className="mx-0">
                                                        <Info className="w-3 h-5" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Instrucción</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="whitespace-pre-line">{causa.instruction}</div>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <Button type="button" size="icon" variant="outline" disabled className="mx-auto opacity-50">
                                                <Info className="w-5 h-5" />
                                            </Button>
                                        )}
                                    </TableCell>
                                    {/* Documento icon */}
                                    <TableCell className="border-r text-center">
                                        {causa.document_url ? (
                                            <a
                                                href={`/${causa.document_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center text-blue-600"
                                                download={causa.document_name || undefined}
                                                title={causa.document_name || 'Descargar'}
                                            >
                                                <Button type="button" size="icon" variant="outline" className="mx-auto">
                                                    <Download className="w-5 h-5" />
                                                </Button>
                                            </a>
                                        ) : (
                                            <Button type="button" size="icon" variant="outline" disabled className="mx-auto opacity-50">
                                                <Download className="w-5 h-5" />
                                            </Button>
                                        )}
                                    </TableCell>
                                    {/* Nombre de la causa */}
                                    <TableCell className="border-r font-medium whitespace-normal">
                                        {causa.nombre || causa.name}
                                    </TableCell>
                                    {/* Formulario extra icon */}
                                    <TableCell className="border-r text-center p-0 align-middle">
                                        {causa.has_attributes ? (
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className="mx-auto p-0 h-8 w-8 relative"
                                                onClick={() => {
                                                    setModalAttributes(causa.category_attributes || []);
                                                    setModalTitle(causa.nombre || causa.name || '');
                                                    setModalCausaId(causa.id);
                                                    setModalOpen(true);
                                                }}
                                            >
                                                <FileText className="w-4 h-4" />
                                                {!isExtraFormComplete(causa) && (
                                                    <span className="absolute top-0 right-0 flex items-center animate-pulse">
                                                        <AlertTriangle className="w-4 h-4 text-yellow-900 drop-shadow-[0_0_4px_rgba(255,193,7,0.8)]" />
                                                    </span>
                                                )}
                                            </Button>
                                        ) : (
                                            <Button type="button" size="icon" variant="ghost" disabled className="mx-auto opacity-50 p-0 h-8 w-8">
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                    {/* Estado */}
                                    <TableCell className="border-r text-center">
                                        <Select
                                            value={causaStates.find((c) => c.id === causa.id)?.state || ''}
                                            onValueChange={(value) =>
                                                setCausaStates(prev =>
                                                    prev.map((c) =>
                                                        c.id === causa.id
                                                            ? { ...c, state: value }
                                                            : c
                                                    )
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Seleccione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Conforme">Conforme</SelectItem>
                                                <SelectItem value="No Conforme">No Conforme</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    {/* Observaciones */}
                                    <TableCell>
                                        {renderObservationInput(causa)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
            {/* Diálogo global para formulario extra */}
            <Dialog open={modalOpen} onOpenChange={(open) => {
                setModalOpen(open);
                if (!open) setModalCausaId(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{modalTitle}</DialogTitle>
                    </DialogHeader>
                    {modalCausaId && (
                        <ModalExtraForm
                            attributes={modalAttributes}
                            causaId={modalCausaId}
                            extraFormData={extraFormData}
                            setExtraFormData={setExtraFormData}
                            causaState={causaStates.find(c => c.id === modalCausaId)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
