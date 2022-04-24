function MarkerList(props: {style: any, markers: any[]}) {
  return (
      <div style={props.style}> 
        <ul>
          {props.markers.map((marker, idx) => <li key = {idx}> {idx} {marker.lat} {marker.lng} </li>)}
        </ul>
      </div>
     );
}

export default MarkerList;