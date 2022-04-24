import React from "react";
import CustomMap from "./CustomMap";
import MarkerList from "./MarkerList";




class MapMainScreen extends React.Component {
  constructor(props: any) {
    super(props)
    this.saveMarkers = this.saveMarkers.bind(this);
  }

  state = {
    isLoading: false,
    markers: []
  }

  async componentDidMount() {
    this.setState({isLoading: true});
    const response = await fetch(process.env.REACT_APP_API_URL + '/api/markers/get');
    const data = await response.json();
    this.setState({markers: data, isLoading: false});
  }

  async saveMarkers(newMarkerCoords: any){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMarkerCoords)
    };
    const res = await fetch(process.env.REACT_APP_API_URL + '/api/markers/add', requestOptions);
    console.log((await (res.json())).status);

    this.setState({isLoading: true});
    const response = await fetch(process.env.REACT_APP_API_URL + '/api/markers/get');
    const data = await response.json();
    this.setState({markers: data, isLoading: false});
  }

  render() {
    return (
      <div style={{
        position: "relative",
        boxSizing: "border-box",
      }}>
        <MarkerList style={{
        width: "30%",
        background: "blue",
        height: "100vh",}} markers = {this.state.markers}/>
        <CustomMap markers={this.state.markers} saveMarkers = {this.saveMarkers}/>
      </div>
    )
  }
}

export default MapMainScreen;