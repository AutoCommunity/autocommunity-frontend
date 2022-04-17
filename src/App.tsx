import React, { useState, useEffect, useRef, useReducer } from 'react';
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
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const map = useMapEvents({
    click: (e) => setMarkers([...markers, e.latlng]),
    locationfound: (e) => {
      setMarkers([...markers])
      map.flyTo(e.latlng, map.getZoom());
    },
    dragend: () => forceUpdate(),
    zoomend: () => forceUpdate(),
  });
  return (
    <React.Fragment>
      {markers.filter((position) => map.getBounds().contains(position)).map((position, idx) => <Marker position={position} icon={visitorIcon} key={`marker-${idx}`}> <Popup>You are here</Popup> </Marker> )}
    </React.Fragment>
  );
}

function App() {
  return (
    <MapContainer
      preferCanvas={true}
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
