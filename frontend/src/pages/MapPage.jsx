import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import RoutingControl from '../components/RoutingControl';
import 'leaflet/dist/leaflet.css';

async function geocode(query) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

export default function MapPage() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [defaultCenter, setDefaultCenter] = useState({ lat: 0.0917, lng: 34.7680 });
  const [showForm, setShowForm] = useState(true); // ✅ toggle form visibility

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setDefaultCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setDefaultCenter({ lat: 0.0917, lng: 34.7680 }) // fallback
    );
  }, []);

  const handleSearch = async (type, value) => {
    const coords = await geocode(value);
    if (coords) {
      if (type === 'from') setFrom(coords);
      if (type === 'to') setTo(coords);
    } else {
      alert(`Could not find location: ${value}`);
    }
  };

  const handleReset = () => {
    setFrom(null);
    setTo(null);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* Centered Search UI */}
      {showForm && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          padding: 20,
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          minWidth: '250px'
        }}>
          <input
            type="text"
            placeholder="From location"
            onBlur={(e) => handleSearch('from', e.target.value)}
          />
          <input
            type="text"
            placeholder="To location"
            onBlur={(e) => handleSearch('to', e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={handleReset}>Reset</button>
            <button onClick={() => setShowForm(false)}>Close</button> {/* ✅ hide form */}
          </div>
        </div>
      )}

      {/* Map */}
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {from && to && <RoutingControl from={from} to={to} setDestination={setTo} />}
      </MapContainer>
    </div>
  );
}