function MarkerList(props: {markers: any[]}) {
  return (
      <div> 
        <ul>
          {props.markers.map((marker, idx) => <li key = {idx}> {idx} {marker.name} {marker.lat} {marker.lng} </li>)}
        </ul>
      </div>
     );
}

export default MarkerList;