import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';

export default function RoutingControl({ from, to, setDestination }) {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!map || !from || !to) return;

    if (routingRef.current) {
      map.removeControl(routingRef.current);
    }

    routingRef.current = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: true,
      draggableWaypoints: true,
      addWaypoints: true,
      geocoder: L.Control.Geocoder.nominatim(),
      lineOptions: { styles: [{ color: 'blue', weight: 4 }] },
      createMarker: (i, wp) =>
        L.marker(wp.latLng, { draggable: true }).on('dragend', (e) => {
          const { lat, lng } = e.target.getLatLng();
          setDestination({ lat, lng });
        }),
    }).addTo(map);
  }, [map, from, to]);

  return null;
}