import React, { useState, useEffect, useRef, useReducer } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L, { Icon, marker } from "leaflet";
//import logo from './logo.svg';
import './App.css';


const visitorIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});


function LocationMarkers(props: {markers: any[], setMarkers: any, forceUpdate: any}) {

  const map = useMapEvents({
    click: (e) => props.setMarkers([...props.markers, e.latlng]),
    locationfound: (e) => {
      props.setMarkers([...props.markers])
      map.flyTo(e.latlng, map.getZoom());
    },
    dragend: () => props.forceUpdate(),
    zoomend: () => props.forceUpdate(),
  });
  return (
    <React.Fragment>
      {props.markers.filter((position) => map.getBounds().contains(position)).map((position, idx) => <Marker position={position} icon={visitorIcon} key={`marker-${idx}`}> <Popup>You are here</Popup> </Marker> )}
    </React.Fragment>
  );
}

function List(props: {style: any, markers: any[]}) {
  return (
      <div style={props.style}> 
        <ul>
          {props.markers.map((marker, idx) => <li> {idx} {marker.lat} {marker.lng} </li>)}
        </ul>
      </div>
     );
}

function Screen() {
  const initialMarkers: any[] = [];
  const [markers, setMarkers] = useState(initialMarkers);
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  return (
    <div style={{
      position: "relative",
      boxSizing: "border-box",
    }}>
      <List style={{
        width: "30%",
        background: "blue",
        height: "100vh",}} markers = {markers}/>

      <MapContainer
        preferCanvas={true}
        center={[50.166258, 19.9415741]} 
        zoom={12}
        style={{
          height: "100vh",
          width: "70%",
          position: "absolute",
          right: "0",
          bottom: "0",
          top: "0",
          background: "red",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarkers markers={markers} setMarkers = {setMarkers} forceUpdate = {forceUpdate} />

      </MapContainer>
    </div>
  );
}

function App() {
  return (
    <div style={{
      position: "relative",
      boxSizing: "border-box",
    }}>

      <Screen />
    </div>
  );
}

export default App;
