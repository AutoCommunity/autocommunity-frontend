import React from "react";
import CustomMap from "./CustomMap";
import axios from "axios";
import Auth from './Auth';

import 'leaflet/dist/leaflet.css'
import { Layout, Menu, Modal, Form, message, Input, Button, Tooltip } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import '../index.css'
import 'antd/dist/antd.min.css'
import Sider from "antd/lib/layout/Sider";
import MarkerList from "./MarkerList";
import MarkerInfoModal from "./MarkerInfoModal";





class MapMainScreen extends React.Component {
  constructor(props: any) {
    super(props)
    this.saveMarkers = this.saveMarkers.bind(this);
    this.sendMarker = this.sendMarker.bind(this);
    this.saveUsername = this.saveUsername.bind(this);
    this.handleCenterClick = this.handleCenterClick.bind(this);
    this.selectMarker = this.selectMarker.bind(this);
  }

  state = {
    isLoading: false,
    markers: [],
    isSavingMarker: false,
    markerAddress: '',
    markerCoords: {lat: 0, lng: 0},
    username: '',
    center: [50.166258, 19.9415741],
    selectedMarker: {}
  }

  handleClose = async() => this.setState({ isSavingMarker: false });
  handleShow = async () => this.setState({ isSavingMarker: false });

  selectMarker(marker: any) {
    this.setState({selectedMarker: marker});
  }

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
    const requestBody = {
      name: event.name,
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

  async getAddressByCoordinates(newMarkerCoords: L.LatLng) {
    console.log(JSON.stringify(newMarkerCoords, null, 2));
    const result = await axios
      .get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newMarkerCoords.lat}&lon=${newMarkerCoords.lng}`)
      .then(response => {
        console.log(response.data);
        return response.data.display_name;
      });
    return result;
  }

  async saveMarkers(newMarkerCoords: L.LatLng){
    if (this.state.username === '') {
      message.warning("Please login to add places");
    } else {
      const newMarkerAddress = await this.getAddressByCoordinates(newMarkerCoords);
      this.setState({isSavingMarker: true, markerAddress: newMarkerAddress, markerCoords: newMarkerCoords});
    }
  }
  
  handleCenterClick(item: {lat: any, lng: any}){
    this.setState({
      center: [item.lat, item.lng]
    });
    console.log(this.state.center);
  }

  render() {
    return (
      <Layout className="layout">
        <Sider
          style={{
            overflow: 'auto',
            height: '100%',
            width: '30vw',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
          width={'300px'}
        >
          <Layout style={{ minHeight: "100vh" }}>
            <Header>
              <div className="logo"> Autocommunity </div>
            </Header>
            <Content
              style={{
                padding: 0,
                height: "90%",
                background: "rgb(5, 21, 38)"
              }}
            >
              <Menu
                style = {{
                  padding: "5px"
                }}
                theme="dark" mode="inline" defaultSelectedKeys={['auth']}
              >
                <Menu.Item
                  key="auth"
                >
                  <Auth username={this.state.username} saveUsername = {this.saveUsername} getUserConfig = {this.getUserConfig}/>
                </Menu.Item>
              </Menu>

              <MarkerList
                markers={this.state.markers} 
                handleCenterClick = {this.handleCenterClick}
                selectMarker = {this.selectMarker}
              />

            </Content>
            <Footer
              style={{
                textAlign: 'center',
                height: '5%',
                position: "sticky",
                top: 0,
                bottom: 0,
                color: 'gray'
              }}
            >
              Autocommunity, 2022
            </Footer>
          </Layout>
        </Sider>
        <Layout
          style={{
            padding: 0,
          }}
        >
          <Content
            style={{
              padding: 0,
              height: "100vh",
              width: "calc(100% - 300px)",
              background: 'black',
            }}
          >
            <CustomMap
              style={{
                height: "inherit",
                width: "inherit",
                position: "absolute",
                right: "0",
                bottom: "0",
                top: "0",
              }}
              markers={this.state.markers}
              saveMarkers = {this.saveMarkers}
              center={this.state.center}
              selectMarker = {this.selectMarker}
            />
          </Content>
        </Layout>

        { this.state.isSavingMarker &&
          <Modal title="Woohoo, you're about to add new place! Please enter name:" 
                visible={this.state.isSavingMarker} 
                footer={null}
                onCancel={() => this.setState({isSavingMarker: false})}
          >
            <Form 
              name = "Save marker"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={this.sendMarker}
              autoComplete="off"
            >
              <Form.Item
                label="Address"
                name="address"
                tooltip={{ title: 'Please make sure the address is correct', placement: "right" }}
              >
                <Tooltip trigger={['hover']} title={this.state.markerAddress} placement="bottom">
                  <div>
                    <Input
                      disabled
                      value={this.state.markerAddress}
                    />
                  </div>
                </Tooltip>
              </Form.Item>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input name of your place!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Add place
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        }

        <MarkerInfoModal marker={this.state.selectedMarker} selectMarker={this.selectMarker}/>
      </Layout>
      /*
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
      */
    )
  }
}

export default MapMainScreen;