import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const pin = (color) => new L.DivIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${color}" stroke="#fff" stroke-width="1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  iconSize: [36, 36], iconAnchor: [18, 34], popupAnchor: [0, -30], className: 'map-pin',
});
const greyPin = pin('#8c6450');
const activePin = pin('#bf3f22');
const userPin = new L.DivIcon({ html: '<span class="user-dot"></span>', iconSize: [18, 18], className: '' });

function FitAndFocus({ therapists, selected, userLocation }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(t);
  }, [map]);
  useEffect(() => {
    if (selected) { map.flyTo([selected.lat, selected.lng], 13, { duration: 0.6 }); return; }
    const pts = therapists.map(t => [t.lat, t.lng]);
    if (userLocation) pts.push([userLocation.lat, userLocation.lng]);
    if (pts.length === 1) map.setView(pts[0], 12);
    else if (pts.length > 1) map.fitBounds(pts, { padding: [30, 30], maxZoom: 12 });
  }, [therapists, selected, userLocation, map]);
  return null;
}

export default function TherapistMap({ therapists, selected, onSelect, userLocation }) {
  const markerRefs = useRef({});
  useEffect(() => {
    if (selected) markerRefs.current[selected.id]?.openPopup();
  }, [selected]);
  return (
    <MapContainer center={[31.7, 34.9]} zoom={8} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
      {therapists.map(t => (
        <Marker key={t.id} position={[t.lat, t.lng]} icon={selected?.id === t.id ? activePin : greyPin}
          ref={(r) => { if (r) markerRefs.current[t.id] = r; }}
          eventHandlers={{ click: () => onSelect(t) }}>
          <Popup>
            <div className="popup" dir="rtl">
              <strong>{t.name}</strong><br />{t.address}, {t.city}<br />
              <a href={`tel:${t.phone.replace(/-/g, '')}`}>{t.phone}</a>
            </div>
          </Popup>
        </Marker>
      ))}
      {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} icon={userPin} />}
      <FitAndFocus therapists={therapists} selected={selected} userLocation={userLocation} />
    </MapContainer>
  );
}
