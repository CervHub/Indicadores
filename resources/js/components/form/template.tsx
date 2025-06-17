import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import ImageDrop from '@/components/ui/image-drop';
import {
    AlertTriangle,
    CheckCircle,
    Flame,
    Loader2,
    X
} from 'lucide-react';
import React, { useId, useState } from 'react';
import { toast } from 'sonner';
import MapSelector from './map';
import ReportModal from './ReportModal';
import axios from 'axios';

export default function TemplateForm({
    defaultCoordinates,
    gerencias,
    empresas,
    causas,
    user_id,
    company_id,
    tipo_reporte, // <-- Nuevo parámetro recibido del padre
}: {
    defaultCoordinates: { lat: number; lng: number };
    gerencias: { id: string; name: string }[];
    empresas: { id: string; name: string }[];
    causas: { id: string; name: string }[];
    user_id: string;
    company_id: string;
    tipo_reporte: string; // <-- Nuevo tipo
}) {
    const id = useId();

    // Add filter states for each combobox
    const [managementFilter, setManagementFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [causesFilter, setCausesFilter] = useState('');
    const [engineerFilter, setEngineerFilter] = useState('');

    // Add states for engineers and custom management
    const [engineers, setEngineers] = useState<{ id: number; nombres: string; apellidos: string; cargo: string }[]>([]);
    const [loadingEngineers, setLoadingEngineers] = useState(false);

    // Obtener fecha y hora actual en formato adecuado
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const currentDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const [data, setData] = React.useState({
        eventDate: currentDate,
        eventTime: currentTime,
        management: '',
        customManagement: '',
        company: '',
        engineer: '',
        causes: '',
        eventDescription: '',
        correctiveActions: '',
        riskLevel: '', // <-- Obligatorio seleccionar
        location: '',
        signature: [] as File[],
        coordinates: defaultCoordinates,
        images: [] as File[], // <-- Obligatorio
    });

    const [loadingField, setLoadingField] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [signatureError, setSignatureError] = useState<string | null>(null);

    // Estados para el modal de reporte
    const [modalStatus, setModalStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Convert arrays to options format
    const managementOptions = gerencias.map((g) => ({ value: g.id, label: g.name }));
    const companyOptions = empresas.map((e) => ({ value: e.id, label: e.name }));
    const causesOptions = causas.map((c) => ({ value: c.id, label: c.name }));

    // Function to fetch engineers by company
    const fetchEngineers = async (companyId: string) => {
        setLoadingEngineers(true);
        try {
            const url = route('company.users.engineer-security', { company_id: companyId });
            const response = await fetch(url);
            const result = await response.json();
            if (result.status) {
                setEngineers(result.data);
            }
        } catch (error) {
            console.error('Error fetching engineers:', error);
            toast.error('Error al cargar los ingenieros de seguridad');
        } finally {
            setLoadingEngineers(false);
        }
    };

    // Convert engineers to options format
    const engineerOptions = engineers.map(eng => ({
        value: eng.id.toString(),
        label: `${eng.nombres} ${eng.apellidos}`
    }));

    // Fetch engineers when company changes
    React.useEffect(() => {
        if (data.company) {
            fetchEngineers(data.company);
        } else {
            setEngineers([]);
        }
    }, [data.company]);

    // Check if "Otros" is selected in management
    const showCustomManagement = gerencias.find(g => g.id === data.management)?.name.includes('OTROS');

    // Verifica si todos los campos requeridos están completos
    const isFormValid = () => {
        return (
            data.eventDate &&
            data.eventTime &&
            data.management &&
            (showCustomManagement ? data.customManagement : true) &&
            data.company &&
            data.engineer &&
            data.causes &&
            data.eventDescription &&
            data.correctiveActions &&
            data.riskLevel && // riesgo obligatorio
            data.location &&
            data.signature.length > 0 &&
            data.images.length > 0 // imágenes obligatorias
        );
    };

    // Nueva función para obtener el primer campo faltante
    const getFirstMissingField = () => {
        if (!data.eventDate) return 'Fecha del evento';
        if (!data.eventTime) return 'Hora del evento';
        if (!data.management) return 'Gerencia a reportar';
        if (showCustomManagement && !data.customManagement) return 'Ingrese la gerencia';
        if (!data.company) return 'Empresa a reportar';
        if (!data.engineer) return 'Ingenieros de Seguridad';
        if (!data.causes) return 'Causas';
        if (!data.eventDescription) return 'Descripción del evento';
        if (!data.correctiveActions) return 'Acciones correctivas';
        if (!data.riskLevel) return 'Nivel de riesgo'; // riesgo obligatorio
        if (!data.location) return 'Lugar';
        if (data.images.length === 0) return 'Imagen'; // imágenes obligatorias
        if (data.signature.length === 0) return 'Firma';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const missing = getFirstMissingField();
        if (missing) {
            toast.error(`Por favor, complete el campo obligatorio: ${missing}`);
            return;
        }
        setShowModal(true);
        setModalStatus('idle');
    };

    // Utilidad para convertir un File a base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleConfirmSubmit = async () => {
        setModalStatus('submitting');
        setSubmitting(true);

        try {
            // Convertir imágenes y firma a base64
            const imagesBase64: string[] = [];
            for (const image of data.images) {
                imagesBase64.push(await fileToBase64(image));
            }
            let signatureBase64 = '';
            if (data.signature.length > 0) {
                signatureBase64 = await fileToBase64(data.signature[0]);
            }

            // Detectar dispositivo/computadora
            const device = typeof window !== 'undefined' ? window.navigator.userAgent : '';

            // Preparar FormData para envío
            const formData = new FormData();
            formData.append('fecha_evento', `${data.eventDate} ${data.eventTime}:00`);
            formData.append('fecha_reporte', `${data.eventDate} ${data.eventTime}:00`);
            // formData.append('tipo_inspeccion', null); // <-- Usar prop
            formData.append('tipo_reporte', tipo_reporte);     // <-- Usar prop
            formData.append('descripcion', data.eventDescription);
            formData.append('correctiva', data.correctiveActions);
            formData.append('gravedad', data.riskLevel);
            formData.append('mapa_cordenadas', JSON.stringify(data.coordinates));
            formData.append('user_id', user_id);
            formData.append('lugar', data.location);
            formData.append('causa_id', data.causes);
            formData.append('company_report_id', data.company); // empresa reportada seleccionada
            formData.append('user_report_id', data.engineer);
            formData.append('version', '2.0.0');
            formData.append('device', device); // <-- Agrega el device

            if (showCustomManagement && data.customManagement) {
                formData.append('otros', data.customManagement);
                formData.append('other_managements', data.customManagement);
            }

            if (signatureBase64) {
                formData.append('firma', signatureBase64);
            }
            if (imagesBase64.length > 0) {
                formData.append('images', JSON.stringify(imagesBase64));
            }

            // Agregar levels como JSON
            formData.append(
                'levels',
                JSON.stringify({
                    gerencia: data.management || null,
                    superintendencia: null,
                    taller: null,
                })
            );

            // Obtener token CSRF
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            // Usar la ruta web para el POST, no la API
            // Por ejemplo, si tu ruta web es /report/store:
            // const url = '/report/store';
            // O si usas el helper route:
            const url = route('report.store', { company_id: company_id });
            console.log('Url de envío:', url);
            const response = await axios.post(url, formData, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                    // 'Content-Type' no se debe establecer manualmente para FormData con axios
                },
                validateStatus: function (status) {
                    return status >= 200 && status < 300; // Acepta cualquier 2xx
                }
            });

            const result = response.data;
            console.log('Respuesta del servidor:', result);
            // Acepta cualquier status 2xx y status true en la respuesta
            if (result.status) {

                setShowModal(false);
                toast.success('Reporte enviado exitosamente');
                resetForm();
            } else {
                setModalStatus('error');
                setModalMessage(result.message || 'Error al generar el reporte. Por favor, intente nuevamente.');
            }

        } catch (error: any) {
            console.error('Error:', error);
            setModalStatus('error');
            setModalMessage(
                error?.response?.data?.message ||
                'Error de conexión. Por favor, verifique su conexión a internet e intente nuevamente.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalStatus('idle');
        setModalMessage('');
    };

    // Función para resetear el formulario
    const resetForm = () => {
        setData({
            eventDate: currentDate,
            eventTime: currentTime,
            management: '',
            customManagement: '',
            company: '',
            engineer: '',
            causes: '',
            eventDescription: '',
            correctiveActions: '',
            riskLevel: '',
            location: '',
            signature: [] as File[],
            coordinates: defaultCoordinates,
            images: [] as File[],
        });
        setManagementFilter('');
        setCompanyFilter('');
        setCausesFilter('');
        setEngineerFilter('');
        setEngineers([]);
        setImageError(null);
        setSignatureError(null);
    };

    return (
        <>
            <form className="grid grid-cols-1 gap-6 md:grid-cols-2 p-4 bg-gray-100 rounded-lg" onSubmit={handleSubmit}>
                {/* Fecha y hora del evento */}
                <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="event-date" className="mb-3">
                            Fecha del evento: *
                        </Label>
                        <Input type="date" id="event-date" value={data.eventDate} onChange={(e) => setData({ ...data, eventDate: e.target.value })} />
                    </div>
                    <div>
                        <Label htmlFor="event-time" className="mb-3">
                            Hora del evento: *
                        </Label>
                        <Input type="time" id="event-time" value={data.eventTime} onChange={(e) => setData({ ...data, eventTime: e.target.value })} />
                    </div>
                </div>

                {/* Gerencia - Each combobox in its own row */}
                <div className="col-span-2">
                    <Label htmlFor="management" className="mb-3">
                        Gerencia a reportar: *
                    </Label>
                    <Combobox
                        data={managementOptions}
                        value={managementFilter}
                        onChange={(value) => {
                            setManagementFilter(value);
                            setData({ ...data, management: value });
                        }}
                        onInputChange={value => {
                            if (!value) {
                                setManagementFilter('');
                                setData({ ...data, management: '', customManagement: '' });
                            }
                        }}
                        placeholder="Seleccionar una opción"
                        className="w-full"
                    />
                </div>

                {/* Campo personalizado de gerencia cuando se selecciona "Otros" */}
                {showCustomManagement && (
                    <div className="col-span-2">
                        <Label htmlFor="custom-management" className="mb-3">
                            Ingrese la gerencia: *
                        </Label>
                        <Input
                            type="text"
                            id="custom-management"
                            value={data.customManagement}
                            onChange={(e) => setData({ ...data, customManagement: e.target.value })}
                            placeholder="Escriba el nombre de la gerencia"
                        />
                    </div>
                )}

                {/* Empresa a reportar */}
                <div className="col-span-2">
                    <Label htmlFor="company" className="mb-3">
                        Empresa a reportar: *
                    </Label>
                    <Combobox
                        data={companyOptions}
                        value={companyFilter}
                        onChange={(value) => {
                            setCompanyFilter(value);
                            setData({ ...data, company: value, engineer: '' });
                            setEngineerFilter('');
                        }}
                        onInputChange={value => {
                            if (!value) {
                                setCompanyFilter('');
                                setData({ ...data, company: '', engineer: '' });
                                setEngineerFilter('');
                                setEngineers([]);
                            }
                        }}
                        placeholder="Seleccionar una opción"
                        className="w-full"
                    />
                </div>

                {/* Ingeniero de Seguridad - Solo se muestra si hay empresa seleccionada */}
                {data.company && (
                    <div className="col-span-2">
                        <Label htmlFor="engineer" className="mb-3">
                            Ingenieros de Seguridad: *
                        </Label>
                        {loadingEngineers ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="animate-spin" size={20} />
                                <span className="ml-2">Cargando ingenieros...</span>
                            </div>
                        ) : (
                            <Combobox
                                data={engineerOptions}
                                value={engineerFilter}
                                onChange={(value) => {
                                    setEngineerFilter(value);
                                    setData({ ...data, engineer: value });
                                }}
                                onInputChange={value => {
                                    if (!value) {
                                        setEngineerFilter('');
                                        setData({ ...data, engineer: '' });
                                    }
                                }}
                                placeholder="Seleccionar una opción"
                                className="w-full"
                            />
                        )}
                    </div>
                )}

                {/* Causas - Each combobox in its own row */}
                <div className="col-span-2">
                    <Label htmlFor="causes" className="mb-3">
                        De acuerdo a mi análisis, las causas fueron: *
                    </Label>
                    <Combobox
                        data={causesOptions}
                        value={causesFilter}
                        onChange={(value) => {
                            setCausesFilter(value);
                            setData({ ...data, causes: value });
                        }}
                        onInputChange={value => {
                            if (!value) {
                                setCausesFilter('');
                                setData({ ...data, causes: '' });
                            }
                        }}
                        placeholder="Seleccionar una opción"
                        className="w-full"
                    />
                </div>

                {/* Descripción del evento */}
                <div className="relative col-span-2">
                    <Label htmlFor="event-description" className="mb-3">
                        Descripción del evento: *
                    </Label>
                    <Textarea
                        id="event-description"
                        value={data.eventDescription}
                        onChange={(e) => setData({ ...data, eventDescription: e.target.value })}
                        disabled={loadingField === 'eventDescription'} // Deshabilita si está en carga
                        className="h-40" // Ajusta la altura del Textarea
                    />

                </div>

                {/* Acciones correctivas */}
                <div className="relative col-span-2">
                    <Label htmlFor="corrective-actions" className="mb-3">
                        Acciones correctivas: *
                    </Label>
                    <Textarea
                        id="corrective-actions"
                        value={data.correctiveActions}
                        onChange={(e) => setData({ ...data, correctiveActions: e.target.value })}
                        disabled={loadingField === 'correctiveActions'} // Deshabilita si está en carga
                        className="h-40" // Ajusta la altura del Textarea
                    />
                </div>

                {/* Nivel de riesgo */}
                <div className="col-span-2">
                    <Label className="mb-3">Nivel de riesgo: *</Label>
                    <RadioGroup
                        className="grid grid-cols-3 gap-4"
                        value={data.riskLevel}
                        onValueChange={(value) => setData({ ...data, riskLevel: value })}
                    >
                        {/* Bajo */}
                        <div className="border-input has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-[state=checked]:border-red-500">
                            <RadioGroupItem id={`${id}-low`} value="Bajo" className="sr-only" />
                            <span className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-600 block mx-auto"></span>
                            <label
                                htmlFor={`${id}-low`}
                                className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                            >
                                Bajo
                            </label>
                        </div>
                        {/* Medio */}
                        <div className="border-input has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-[state=checked]:border-red-500">
                            <RadioGroupItem id={`${id}-medium`} value="Medio" className="sr-only" />
                            <span className="w-6 h-6 rounded-full bg-orange-400 border-2 border-orange-500 block mx-auto"></span>
                            <label
                                htmlFor={`${id}-medium`}
                                className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                            >
                                Medio
                            </label>
                        </div>
                        {/* Alto */}
                        <div className="border-input has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-[state=checked]:border-red-500">
                            <RadioGroupItem id={`${id}-high`} value="Alto" className="sr-only" />
                            <span className="w-6 h-6 rounded-full bg-red-500 border-2 border-red-600 block mx-auto"></span>
                            <label
                                htmlFor={`${id}-high`}
                                className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                            >
                                Alto
                            </label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Lugar y ubicación */}
                <div className="col-span-2">
                    <MapSelector
                        defaultCoordinates={defaultCoordinates}
                        coordinates={data.coordinates}
                        setCoordinates={(coords) => setData({ ...data, coordinates: coords })}
                    />
                    <Label className='mb-3 mt-4' htmlFor="location">Lugar: *</Label>
                    <Input
                        type="text"
                        id="location"
                        value={data.location}
                        onChange={(e) => setData({ ...data, location: e.target.value })}
                        placeholder="Ingrese el lugar y ubicación"
                    />

                </div>

                {/* Imágenes adicionales */}
                <ImageDrop
                    label="Carga foto / Imagen:"
                    files={data.images}
                    onFilesChange={(files) => setData({ ...data, images: files })}
                    maxFiles={4}
                    error={imageError}
                    onError={setImageError}
                    required={true}
                    pincel={true}
                />

                {/* Firma */}
                <ImageDrop
                    label="Firma: "
                    files={data.signature}
                    onFilesChange={(files) => setData({ ...data, signature: files })}
                    maxFiles={1}
                    error={signatureError}
                    onError={setSignatureError}
                    required={true}
                />

                {/* Botón de envío */}
                <div className="col-span-2">
                    <Button type="submit" className="flex-start" /* siempre habilitado */>
                        {submitting ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={16} />
                                Enviando reporte...
                            </>
                        ) : (
                            'Generar reporte'
                        )}
                    </Button>
                </div>
            </form>

            {/* Modal de reporte */}
            <ReportModal
                isOpen={showModal}
                onClose={handleCloseModal}
                status={modalStatus}
                onConfirm={handleConfirmSubmit}
                errorMessage={modalMessage}
                title={modalStatus === 'success' ? 'Reporte enviado exitosamente' : undefined}
                description={modalStatus === 'success' ? modalMessage : undefined}
            />
        </>
    );
}