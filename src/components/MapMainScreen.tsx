import React from "react";
import CustomMap from "./CustomMap";
import MarkerList from "./MarkerList";
import axios from "axios";
import { Modal, Button } from 'react-bootstrap';

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

  handleClose = async() => this.setState({ isSavingMarker: false });
  handleShow = async () => this.setState({ isSavingMarker: false });

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
      })
      .catch((error) => {
        console.log(error.response.data)
        if (error.response.status === 400) {
          window.open(process.env.REACT_APP_FRONT_URL + '/login', '_self')
          return;
        }
      });

    this.setState({isLoading: true, isSavingMarker: false});
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
        <MarkerList style={{
        minWidth: "30%",
        maxWidth: "30%",
        height: "100vh",}} markers = {this.state.markers}/>
        <CustomMap markers={this.state.markers} saveMarkers = {this.saveMarkers}/>
        <Modal show={this.state.isSavingMarker} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default MapMainScreen;