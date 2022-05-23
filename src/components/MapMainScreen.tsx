import React from "react";
import CustomMap from "./CustomMap";
import Form from "./Form";
import MarkerList from "./MarkerList";
import axios from "axios";

import 'leaflet/dist/leaflet.css'





class MapMainScreen extends React.Component {
  //navigate = useNavigate();
  constructor(props: any) {
    super(props)
    this.saveMarkers = this.saveMarkers.bind(this);
    this.sendMarker = this.sendMarker.bind(this);
    
  }

  state = {
    isLoading: false,
    markers: [],
    isSavingMarker: false,
    markerCoords: {lat: 0, lng: 0},
  }

  async componentDidMount() {
    this.setState({isLoading: true});
    const data = await axios
      .get(process.env.REACT_APP_API_URL + '/api/markers/get')
      .then(response => response.data);
    this.setState({markers: data, isLoading: false});
  }

  async sendMarker(event: any){
    event.preventDefault();
    const requestBody = {
      name: event.target.name.value,
      markerType: 0,
      lat: this.state.markerCoords.lat,
      lng: this.state.markerCoords.lng
    }
    await axios
      .post(process.env.REACT_APP_API_URL + '/api/markers/add', requestBody, {
        withCredentials: true
      })
      .then(response => {
        console.log(response)
        if (response.data.status === "FAILURE") {
          window.open(process.env.REACT_APP_FRONT_URL + '/login', '_self')
          return;
        }
      })
      .catch((error) => {
        console.log(error)
      });

    this.setState({isLoading: true, isSavingMarkers: false});
    const data = await axios
      .get(process.env.REACT_APP_API_URL + '/api/markers/get')
      .then(response => response.data);
    this.setState({markers: data, isLoading: false});
  }

  async saveMarkers(newMarkerCoords: any){
    this.setState({isSavingMarker: true, markerCoords: newMarkerCoords});
  }

  render() {
    return (
      <div style={{
        position: "relative",
        boxSizing: "border-box",
      }}>
        {this.state.isSavingMarker && <Form onSubmit={this.sendMarker}/>}
        <MarkerList style={{
        width: "30%",
        height: "100vh",}} markers = {this.state.markers}/>
        <CustomMap markers={this.state.markers} saveMarkers = {this.saveMarkers}/>
      </div>
    )
  }
}

export default MapMainScreen;