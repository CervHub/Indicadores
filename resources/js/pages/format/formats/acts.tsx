import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { XCircleIcon } from 'lucide-react';
import Dropzone from 'react-dropzone';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const breadcrumbs = [
    { title: 'Gestión de Formatos', href: '/format' },
    { title: 'Actos subestándar', href: '/acts' },
];

const gerencias = [
    { id: 'gerencia1', name: 'Gerencia de Operaciones' },
    { id: 'gerencia2', name: 'Gerencia de Recursos Humanos' },
    { id: 'gerencia3', name: 'Gerencia de Finanzas' },
];

const empresas = [
    { id: 'empresa1', name: 'Empresa A' },
    { id: 'empresa2', name: 'Empresa B' },
    { id: 'empresa3', name: 'Empresa C' },
];

const causas = [
    { id: 'causa1', name: 'Causa 1' },
    { id: 'causa2', name: 'Causa 2' },
    { id: 'causa3', name: 'Causa 3' },
];

const ImagePreview = ({ url, onRemove }: { url: string; onRemove: () => void }) => (
    <div className="relative aspect-19/9">
        <button className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" onClick={onRemove}>
            <XCircleIcon className="fill-primary text-primary-foreground h-5 w-5" />
        </button>
        <img src={url} alt="Preview" className="border-border h-full w-full rounded-md border object-cover" />
    </div>
);

function LocationSelector({ setCoordinates }: { setCoordinates: (coords: { lat: number; lng: number }) => void }) {
    useMapEvents({
        click(e) {
            setCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });
    return null;
}

export default function Acts() {
    const { data, setData, post, processing, errors } = useForm({
        eventDate: '',
        eventTime: '',
        management: '',
        company: '',
        causes: '',
        eventDescription: '',
        additionalInfo: [] as string[],
        location: '',
        signature: '',
        coordinates: { lat: -12.0464, lng: -77.0428 }, // Default to Lima, Peru
        images: [] as string[], // Array for up to 4 images
    });

    const handleImageUpload = (acceptedFiles: File[], field: string) => {
        const newImages = acceptedFiles.map((file) => URL.createObjectURL(file));
        if (field === 'signature') {
            setData(field, newImages[0]); // Only allow one image for signature
        } else {
            setData(field, [...data.images, ...newImages].slice(0, 4)); // Limit to 4 images
        }
    };

    const handleImageRemove = (field: string, index?: number) => {
        if (field === 'signature') {
            setData(field, '');
        } else if (index !== undefined) {
            const updatedImages = [...data.images];
            updatedImages.splice(index, 1);
            setData('images', updatedImages);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('format.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Actos subestándar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:px-[25rem]" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="event-date">Fecha del evento</Label>
                        <Input
                            type="date"
                            id="event-date"
                            value={data.eventDate}
                            onChange={(e) => setData('eventDate', e.target.value)}
                        />
                        {errors.eventDate && <p className="text-red-500">{errors.eventDate}</p>}
                    </div>

                    <div>
                        <Label htmlFor="event-time">Hora del evento</Label>
                        <Input
                            type="time"
                            id="event-time"
                            value={data.eventTime}
                            onChange={(e) => setData('eventTime', e.target.value)}
                        />
                        {errors.eventTime && <p className="text-red-500">{errors.eventTime}</p>}
                    </div>

                    <div>
                        <Label htmlFor="management">Gerencia a reportar</Label>
                        <Select onValueChange={(value) => setData('management', value)} value={data.management}>
                            <SelectTrigger id="management">
                                <SelectValue placeholder="Seleccione una gerencia" />
                            </SelectTrigger>
                            <SelectContent>
                                {gerencias.map((gerencia) => (
                                    <SelectItem key={gerencia.id} value={gerencia.id}>
                                        {gerencia.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.management && <p className="text-red-500">{errors.management}</p>}
                    </div>

                    <div>
                        <Label htmlFor="company">Empresa a reportar</Label>
                        <Select onValueChange={(value) => setData('company', value)} value={data.company}>
                            <SelectTrigger id="company">
                                <SelectValue placeholder="Seleccione una empresa" />
                            </SelectTrigger>
                            <SelectContent>
                                {empresas.map((empresa) => (
                                    <SelectItem key={empresa.id} value={empresa.id}>
                                        {empresa.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.company && <p className="text-red-500">{errors.company}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="causes">Causas</Label>
                        <Select onValueChange={(value) => setData('causes', value)} value={data.causes}>
                            <SelectTrigger id="causes">
                                <SelectValue placeholder="Seleccione una causa" />
                            </SelectTrigger>
                            <SelectContent>
                                {causas.map((causa) => (
                                    <SelectItem key={causa.id} value={causa.id}>
                                        {causa.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.causes && <p className="text-red-500">{errors.causes}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="event-description">Descripción del evento</Label>
                        <Textarea
                            id="event-description"
                            value={data.eventDescription}
                            onChange={(e) => setData('eventDescription', e.target.value)}
                        />
                        {errors.eventDescription && <p className="text-red-500">{errors.eventDescription}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="location">Lugar y ubicación</Label>
                        <Input
                            type="text"
                            id="location"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                        />
                        {errors.location && <p className="text-red-500">{errors.location}</p>}
                        <div className="mt-4 h-64 w-full">
                            <MapContainer
                                center={[data.coordinates.lat, data.coordinates.lng]}
                                zoom={15}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors'
                                />
                                <Marker position={[data.coordinates.lat, data.coordinates.lng]} />
                                <LocationSelector
                                    setCoordinates={(coords) => {
                                        setData('coordinates', coords);
                                        setData('location', `Lat: ${coords.lat}, Lng: ${coords.lng}`);
                                    }}
                                />
                            </MapContainer>
                        </div>
                    </div>

                    <div>
                        <Label>Firma</Label>
                        {data.signature ? (
                            <ImagePreview url={data.signature} onRemove={() => handleImageRemove('signature')} />
                        ) : (
                            <Dropzone onDrop={(files) => handleImageUpload(files, 'signature')}>
                                {({ getRootProps, getInputProps }) => (
                                    <div
                                        {...getRootProps()}
                                        className="flex h-32 cursor-pointer items-center justify-center rounded-md border border-dashed"
                                    >
                                        <input {...getInputProps()} />
                                        <p>Arrastra una imagen o haz clic para subir la firma</p>
                                    </div>
                                )}
                            </Dropzone>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <Label>Imágenes adicionales</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {data.images.map((image, index) => (
                                <ImagePreview
                                    key={index}
                                    url={image}
                                    onRemove={() => handleImageRemove('images', index)}
                                />
                            ))}
                            {data.images.length < 4 && (
                                <Dropzone onDrop={(files) => handleImageUpload(files, 'images')}>
                                    {({ getRootProps, getInputProps }) => (
                                        <div
                                            {...getRootProps()}
                                            className="flex h-32 cursor-pointer items-center justify-center rounded-md border border-dashed"
                                        >
                                            <input {...getInputProps()} />
                                            <p>Arrastra imágenes o haz clic para subir</p>
                                        </div>
                                    )}
                                </Dropzone>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Enviar'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
