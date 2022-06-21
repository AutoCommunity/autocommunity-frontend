import React, { useReducer } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from "leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';


const baseIconOptions : L.BaseIconOptions= {
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
} 

export const MarkerTypes = new Map<string, number> ([
  ["GAS_STATION", 0],
  ["CAR_WASH", 1],
  ["SERVICE_STATION", 2],
  ["DRIFT", 3],
  ["DRAG_RACING", 4],
  ["OTHER", 5]
]);

const icons = [ 
  L.divIcon({
    className: "icon-gas-station",
    ...baseIconOptions,
    html: `<div><span style="font-size: 25px">⛽</span></div>`
  }),
  L.divIcon({
    className: "icon-car-wash",
    ...baseIconOptions,
    html: `<div><span style="font-size: 25px">🧼</span></div>`
  }),
  L.divIcon({
    className: "icon-service-station",
    ...baseIconOptions,
    html: `<div><span style="font-size: 25px">🛠️</span></div>`
  }),
  L.divIcon({
    className: "icon-drift",
    ...baseIconOptions,
    html: `<div><span style="font-size: 30px">🚗</span></div>`
  }),
  L.divIcon({
    className: "icon-drag-racing",
    ...baseIconOptions,
    html: `<div><span style="font-size: 30px">🏎️</span></div>`
  }),
  L.divIcon({
    className: "icon-default",
    ...baseIconOptions,
    html: `<div><span style="font-size: 30px">👻</span></div>`
  }),
]

function LocationMarkers(props: {markers: any[], saveMarkers: any, selectMarker: any, forceSetTheme: any, setBounds: any}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const map = useMapEvents({
    locationfound: (e) => {
      map.flyTo(e.latlng, map.getZoom());
    },
    click: (e) => {
      props.saveMarkers(e.latlng);
    },
    dragend: () => props.setBounds(map.getBounds()),
    zoomend: () => props.setBounds(map.getBounds()),
  });

  //props.setBounds(map.getBounds())

  const handleClick = (e: any, marker: any) => {
    props.selectMarker(marker);
  };

  props.forceSetTheme();

  return (
    <MarkerClusterGroup
      chunkedLoading
    >
      {
        props.markers.filter((marker) => map.getBounds().contains(marker)).map((marker, idx) => 
          <Marker
            draggable={false}
            position={marker}
            icon={icons[MarkerTypes.get(marker.markerType) as number]} 
            key={`marker-${idx}`}
            eventHandlers={{
              click: (e) => handleClick(e, marker),
            }}
          >
          </Marker> 
        )
      }
    </MarkerClusterGroup>
  );
}

function CustomMap(props: {style: any, markers: any[], saveMarkers: any, center: any[2], selectMarker: any, forceSetTheme: any, setBounds: any}){
  return (
    <MapContainer
      key={JSON.stringify([props.center, new Date().getDate()] )}
      preferCanvas={true}
      center={props.center} 
      zoom={12}
      style={props.style}
      >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarkers markers={props.markers} saveMarkers = {props.saveMarkers} selectMarker = {props.selectMarker} 
      forceSetTheme = {props.forceSetTheme} setBounds = {props.setBounds}/>

    </MapContainer>
  );
}

export default CustomMap;