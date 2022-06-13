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

const MarkerTypes = new Map<string, number> ([
  ["GAS_STATION", 0],
  ["CAR_WASH", 1],
  ["SERVICE_STATION:", 2],
  ["DRIFT", 3],
  ["DRAG_RACING", 4],
  ["OTHER", 5]
]);

const icons = [
  L.divIcon({
    className: "icon0",
    iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
    html: "⛽"
  }),
  L.divIcon({
    className: "icon1",
    iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
    html: "🧼"
  }),
  L.divIcon({
    className: "icon2",
    iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
    html: "🛠️"
  }),
  L.divIcon({
    className: "icon3",
    iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
    html: "🛞"
  }),
  L.divIcon({
    className: "icon4",
    iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
    html: "🏎️"
  }),
  visitorIcon
]

function LocationMarkers(props: {markers: any[], saveMarkers: any, selectMarker: any}) {
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

  const handleClick = (e: any, marker: any) => {
    e.target._popup._closeButton.onclick = (event: any) => event.preventDefault();
    e.target._popup._closeButton.href = "";
    e.target.openPopup();
    props.selectMarker(marker);
  };

  return (
    <React.Fragment>
      {
        props.markers.filter((marker) => map.getBounds().contains(marker)).map((marker, idx) => 
          <Marker position={marker} 
            icon={icons[MarkerTypes.get(marker.markerType) as number] as any} 
            key={`marker-${idx}`}
            eventHandlers={{
              click: (e) => handleClick(e, marker),
            }}
          > 
            <Popup>{marker.name}</Popup> 
          </Marker> 
        )
      }
    </React.Fragment>
  );
}

function CustomMap(props: {style: any, markers: any[], saveMarkers: any, center: any[2], selectMarker: any}){
  return (
    <MapContainer
        key = {JSON.stringify([props.center, new Date().getDate()] )}
        preferCanvas={true}
        center={props.center} 
        zoom={12}
        style={props.style}
        >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarkers markers={props.markers} saveMarkers = {props.saveMarkers} selectMarker = {props.selectMarker}/>

    </MapContainer>
  );
}

export default CustomMap;