import React, { useReducer } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from "leaflet";

const visitorIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

function LocationMarkers(props: {markers: any[], saveMarkers: any}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const map = useMapEvents({
    locationfound: (e) => {
      if (props.markers.length > 0) map.flyTo(props.markers[0], map.getZoom());
      else map.flyTo(e.latlng, map.getZoom());
    },
    click: (e) => {
      props.saveMarkers(e.latlng);
    },
    dragend: () => forceUpdate(),
    zoomend: () => forceUpdate(),
  });

  const handleClick = (e: any) => {
    e.target._popup._closeButton.onclick = (event: any) => event.preventDefault();
    e.target._popup._closeButton.href = "";
    e.target.openPopup();
  };

  return (
    <React.Fragment>
      {
        props.markers.filter((position) => map.getBounds().contains(position)).map((position, idx) => 
          <Marker position={position} 
            icon={visitorIcon} 
            key={`marker-${idx}`}
            eventHandlers={{
              click: (e) => handleClick(e),
            }}
          > 
            <Popup>{position.name}</Popup> 
          </Marker> 
        )
      }
    </React.Fragment>
  );
}

function CustomMap(props: {style: any, markers: any[], saveMarkers: any}){
  return (
    <MapContainer
        preferCanvas={true}
        center={[50.166258, 19.9415741]} 
        zoom={12}
        style={props.style}
        >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarkers markers={props.markers} saveMarkers = {props.saveMarkers}/>

    </MapContainer>
  );
}

export default CustomMap;