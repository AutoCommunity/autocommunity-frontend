import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L, { Icon } from "leaflet";
//import logo from './logo.svg';
import './App.css';


const visitorIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

function LocationMarkers() {
  const initialMarkers: any[] = [];
  const [markers, setMarkers] = useState(initialMarkers);

  const map = useMapEvents({
    click: (e) => setMarkers([...markers, e.latlng]),
    locationfound: (e) => {
      setMarkers([...markers])
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return (
    <React.Fragment>
      {markers.map((position, idx) => <Marker position={position} icon={visitorIcon} key={`marker-${idx}`}> </Marker> )}
    </React.Fragment>
  );
}

function App() {
  return (
    <MapContainer 
      center={[50.166258, 19.9415741]} 
      zoom={12}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarkers />

    </MapContainer>
  );
}

export default App;
