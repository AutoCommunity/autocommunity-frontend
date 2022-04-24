import React, { useReducer } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from "leaflet";
import MarkerList from './MarkerList';

const visitorIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

function LocationMarkers(props: {markers: any[]}) {
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const map = useMapEvents({
    locationfound: (e) => {
      map.flyTo(e.latlng, map.getZoom());
    },
    dragend: () => forceUpdate(),
    zoomend: () => forceUpdate(),
  });
  if (props.markers.length > 0)map.flyTo(props.markers[0], map.getZoom());
  
  return (
    <React.Fragment>
      {props.markers.filter((position) => map.getBounds().contains(position)).map((position, idx) => <Marker position={position} icon={visitorIcon} key={`marker-${idx}`}> <Popup>You are here</Popup> </Marker> )}
    </React.Fragment>
  );
}

function CustomMap(props: {markers: any[]}){
  return (
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
        }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarkers markers={props.markers}/>

    </MapContainer>
  );
}

export default CustomMap;