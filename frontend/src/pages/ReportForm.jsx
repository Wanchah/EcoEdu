import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

export default function ReportForm() {
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [pos, setPos] = useState({ lat: -0.0917, lng: 34.7680 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (loc) => setPos({ lat: loc.coords.latitude, lng: loc.coords.longitude }),
      () => console.warn('Geolocation denied or unavailable')
    );
  }, []);

  function MapClick() {
    useMapEvents({
      click(e) {
        setPos({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    });
    return null;
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!desc.trim()) return alert('Please enter a description.');
    setLoading(true);
    setSuccess(false);
    try {
      const form = new FormData();
      form.append('description', desc);
      form.append('lat', pos.lat);
      form.append('lng', pos.lng);
      if (file) form.append('image', file);
      await api.post('/reports', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDesc('');
      setFile(null);
      setPreview(null);
      setSuccess(true);
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h3>Report an Issue</h3>

      <label>Description:</label>
      <textarea
        placeholder="Describe the issue..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <label>Upload Image (optional):</label>
      <input type="file" onChange={handleFileChange} style={{ marginBottom: 10 }} />
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: '100%', marginBottom: 10 }} />}
      <hr></hr>
      <label>Click on the map to set location:</label>
      <div style={{ height: 300, marginBottom: 10 }}>
        <MapContainer center={[pos.lat, pos.lng]} zoom={13} style={{ height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClick />
          <Marker position={[pos.lat, pos.lng]} />
        </MapContainer>
      </div>

      <p><strong>Selected Location:</strong> {pos.lat.toFixed(4)}, {pos.lng.toFixed(4)}</p>

      <button onClick={submit} disabled={loading || !desc.trim()}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {success && <p style={{ color: 'green', marginTop: 10 }}>✅ Report submitted successfully!</p>}
    </div>
  );
}