import React from "react";
import CustomMap from "./CustomMap";
import MarkerList from "./MarkerList";
import axios from "axios";
import { Modal, Button, Form } from 'react-bootstrap';
import { Login } from './Login';

import 'leaflet/dist/leaflet.css'





class MapMainScreen extends React.Component {
  //navigate = useNavigate();
  constructor(props: any) {
    super(props)
    this.saveMarkers = this.saveMarkers.bind(this);
    this.sendMarker = this.sendMarker.bind(this);
    this.saveUsername = this.saveUsername.bind(this);
  }

  state = {
    isLoading: false,
    markers: [],
    isSavingMarker: false,
    markerCoords: {lat: 0, lng: 0},
    username: '',
  }

  handleClose = async() => this.setState({ isSavingMarker: false });
  handleShow = async () => this.setState({ isSavingMarker: false });

  async componentDidMount() {
    this.setState({isLoading: true});
    const data = await axios
      .get(process.env.REACT_APP_API_URL + '/api/markers/get')
      .then(response => response.data);
    const userData = await this.getUserConfig();
    this.setState({markers: data, isLoading: false, username: userData.username});
  }

  async getUserConfig() {
    return await axios
      .get(process.env.REACT_APP_API_URL + '/api/user/config', {
        withCredentials: true,
      })
      .then(response => {
        return response.data;
      })
      .catch(_error => {
        return {
          username: ''
        };
      });
  }

  async saveUsername(newUsername: string) {
    this.setState({ username: newUsername });
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
        if (error.response.status === 401) {
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
        <div style={{
          minWidth: "30%",
          maxWidth: "30%",
          height: "100vh",
        }}
        >
          <Login username={this.state.username} saveUsername = {this.saveUsername} getUserConfig = {this.getUserConfig} />
          <MarkerList markers = {this.state.markers}/>
        </div>
        <CustomMap markers={this.state.markers} saveMarkers = {this.saveMarkers}/>
        { this.state.username !== '' ?
        <Modal show={this.state.isSavingMarker} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add place</Modal.Title>  
          </Modal.Header>
          <Modal.Body>
            Woohoo, you're about to add new place! Please enter name:
            <Form onSubmit={this.sendMarker}>
              <Form.Group >
                <input className="form-control" id="name" />         
              </Form.Group>
              <Form.Group >
                <Button variant="primary" className="form-control btn btn-primary" type="submit">
                  Add Place
                </Button>
              </Form.Group>
            </Form> 
          </Modal.Body>
        </Modal>
        : <Modal show={this.state.isSavingMarker} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Please login.</Modal.Title>  
            </Modal.Header>
          </Modal>
        }
      </div>
    )
  }
}

export default MapMainScreen;