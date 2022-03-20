import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { Icon } from "leaflet";
import logo from './logo.svg';
import './App.css';

const visitorIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

function LocationMarker() {
  const [position, setPosition] = useState(null);

  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e:any) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, []);

  return position === null ? null : (
    <Marker position={position} icon={visitorIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function App() {
  return (
    <MapContainer 
      center={[45.4, -75.7]} 
      zoom={12}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <LocationMarker />
    </MapContainer>
  );
}

export default App;
