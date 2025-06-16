import React from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { LocateFixed } from 'lucide-react'; // Importa el icono

function LocationSelector({
    setCoordinates,
    setHasClicked,
}: {
    setCoordinates: (coords: { lat: number; lng: number }) => void;
    setHasClicked: (clicked: boolean) => void;
}) {
    useMapEvents({
        click(e) {
            const lat = parseFloat(e.latlng.lat.toFixed(6));
            const lng = parseFloat(e.latlng.lng.toFixed(6));
            setCoordinates({ lat, lng });
            setHasClicked(true);
        },
    });
    return null;
}

export default function MapSelector({
    defaultCoordinates,
    coordinates,
    setCoordinates,
}: {
    defaultCoordinates: { lat: number; lng: number };
    coordinates: { lat: number; lng: number };
    setCoordinates: (coords: { lat: number; lng: number }) => void;
}) {
    const [hasClicked, setHasClicked] = React.useState(false);
    const [zoom, setZoom] = React.useState(13);

    // Componente auxiliar para actualizar el centro y zoom del mapa
    function MapResetter({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
        const map = useMap();
        React.useEffect(() => {
            map.setView([lat, lng], zoom);
        }, [lat, lng, zoom, map]);
        return null;
    }

    // Handler para el botón "Setear ubicación"
    const handleResetLocation = () => {
        setHasClicked(false);
        setCoordinates({ lat: defaultCoordinates.lat, lng: defaultCoordinates.lng });
        setZoom(13);
    };

    return (
        <div className="mt-4 h-128 w-full">
            <MapContainer
                center={[defaultCoordinates.lat, defaultCoordinates.lng]}
                zoom={zoom}
                style={{ height: '100%', width: '100%', zIndex: 1, position: 'relative' }}
                className="rounded-lg border-0 border-gray-300"
            >
                {/* Botón icono overlay arriba a la derecha */}
                <div
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white text-xs"
                        onClick={handleResetLocation}
                        title="Setear ubicación"
                    >
                        <LocateFixed className="w-5 h-5" />
                    </Button>
                </div>
                <MapResetter lat={defaultCoordinates.lat} lng={defaultCoordinates.lng} zoom={zoom} />
                <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                {hasClicked && <Marker position={[coordinates.lat, coordinates.lng]} />}
                <LocationSelector setCoordinates={setCoordinates} setHasClicked={setHasClicked} />
            </MapContainer>
        </div>
    );
}