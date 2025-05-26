// components/MapPicker.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// fix icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
  value?: { lat: number; lng: number };
  onChange: (pos: { lat: number; lng: number }) => void;
  height?: number;
}

// add search control to map
function SearchControl({ onSelect }: { onSelect: (pos: { lat: number; lng: number }) => void }) {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: false,
    });
    map.addControl(searchControl);
    map.on('geosearch/showlocation', (data: any) => {
      const { x, y } = data.location;
      onSelect({ lat: y, lng: x });
      map.setView([y, x], 15);
    });
    return () => {
      map.removeControl(searchControl);
      map.off('geosearch/showlocation');
    };
  }, [map, onSelect]);
  return null;
}

// Komponen untuk nge-pan/zoom pas value berubah
function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

function LocationMarker({ value, onChange }: MapPickerProps) {
  const [position, setPosition] = useState(value);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onChange(e.latlng);
    },
  });
  useEffect(() => {
    if (value) setPosition(value);
  }, [value]);

  return position ? (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = (e.target as any).getLatLng();
          setPosition({ lat, lng });
          onChange({ lat, lng });
        },
      }}
    />
  ) : null;
}

export default function MapPicker({ value, onChange, height = 300 }: MapPickerProps) {
  return (
    <MapContainer
      center={value ?? { lat: -6.200000, lng: 106.816666 }}
      zoom={value ? 15 : 5}
      style={{ height: `${height}px`, width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <SearchControl onSelect={onChange} />
      {value && <Recenter lat={value.lat} lng={value.lng} />}
      <LocationMarker value={value} onChange={onChange} />
    </MapContainer>
  );
}
