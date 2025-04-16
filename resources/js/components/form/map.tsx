import React from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
            setHasClicked(true); // Marca que el usuario ha hecho clic
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

    return (
        <div className="mt-4 h-128 w-full">
            <MapContainer
                center={[defaultCoordinates.lat, defaultCoordinates.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg border-0 border-gray-300"
            >
                <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                {hasClicked && <Marker position={[coordinates.lat, coordinates.lng]} />}
                <LocationSelector setCoordinates={setCoordinates} setHasClicked={setHasClicked} />
            </MapContainer>
        </div>
    );
}
