import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in Leaflet + Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map view when coordinates change
const MapUpdater = ({ center, bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, bounds, map]);

  return null;
};

const RideMap = ({ source, destination }) => {
  // Default center (India)
  const defaultCenter = [20.5937, 78.9629]; 
  
  // Calculate center and bounds based on props
  const markers = [];
  if (source?.coords) markers.push(source.coords);
  if (destination?.coords) markers.push(destination.coords);

  let bounds = null;
  if (markers.length > 1) {
    bounds = L.latLngBounds(markers);
  }

  const center = markers.length === 1 ? markers[0] : defaultCenter;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden z-0 relative">
      <MapContainer 
        center={center} 
        zoom={markers.length > 0 ? 6 : 5} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {source?.coords && (
          <Marker position={source.coords}>
            <Popup>Source: {source.name}</Popup>
          </Marker>
        )}

        {destination?.coords && (
          <Marker position={destination.coords}>
            <Popup>Destination: {destination.name}</Popup>
          </Marker>
        )}

        {markers.length > 1 && (
          <Polyline 
            positions={markers} 
            color="#10B981" // Emerald-500
            weight={4}
          />
        )}

        <MapUpdater center={center} bounds={bounds} />
      </MapContainer>
    </div>
  );
};

export default RideMap;
