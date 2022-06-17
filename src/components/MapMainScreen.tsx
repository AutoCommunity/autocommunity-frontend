import React from "react";
import CustomMap from "./CustomMap";
import axios from "axios";
import Auth from './Auth';

import 'leaflet/dist/leaflet.css'
import { Layout, Menu, Modal, Form, message, Input, Button, Tooltip, Select, Space } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import '../index.css'
import Sider from "antd/lib/layout/Sider";
import MarkerList from "./MarkerList";
import MarkerInfoModal from "./MarkerInfoModal";
import { Modal as MobileModal, Button as MobileButton, Form as MobileForm, Picker as MobileSelect } from "antd-mobile";
import { isMobile } from 'react-device-detect';
import { toggleTheme, forceSetTheme } from "./ToggleTheme";

const { Option } = Select;

class MapMainScreen extends React.Component {
  constructor(props: any) {
    super(props)
    this.saveMarkers = this.saveMarkers.bind(this);
    this.sendMarker = this.sendMarker.bind(this);
    this.saveUsername = this.saveUsername.bind(this);
    this.handleCenterClick = this.handleCenterClick.bind(this);
    this.selectMarker = this.selectMarker.bind(this);
    this.rateMarker = this.rateMarker.bind(this);
  }

  state = {
    isLoading: false,
    markers: [],
    isSavingMarker: false,
    markerAddress: '',
    markerCoords: {lat: 0, lng: 0},
    username: '',
    center: [50.166258, 19.9415741],
    selectedMarker: {},
    mobileSelectVisible: false,
    mobileSelectLabel: 'Other 👻'
  }

  handleClose = async() => this.setState({ isSavingMarker: false });
  handleShow = async () => this.setState({ isSavingMarker: false });

  selectMarker(marker: any) {
    this.setState({selectedMarker: marker});
  }

  async rateMarker(rate: any, marker: any) {
    await axios.post(process.env.REACT_APP_API_URL + '/api/markers/rate',
      {
        rate: rate,
        markerId: marker.id
      },
      {withCredentials: true})
      .then()
      .catch(_error => {})

      await this.updateMarkers();
      const newMarker = this.state.markers.find((mrk: any) => mrk.id === marker.id);
      if (newMarker)this.selectMarker(newMarker);
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

   async updateMarkers() {
    const data = await axios
      .get(process.env.REACT_APP_API_URL + '/api/markers/get')
      .then(response => response.data);
    this.setState({markers: data});
  }

  async sendMarker(event: any) {
    console.log(event);
    const requestBody = {
      name: event.name,
      markerType: event.markerType,
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
    
    await this.updateMarkers();
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
    forceSetTheme();
    if (!isMobile) {
      return (
        <Layout className="layout">
          <Sider
            style={{
              overflow: 'auto',
              height: '100%',
              width: '20%',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
            }}
            width={'20%'}
          >
            <Layout style={{ minHeight: "100vh" }}>
              <Header style={{ position: 'fixed', zIndex: 2, width: '20%' }}>
                <div className="logo"> Autocommunity </div>
              </Header>
              <Content
                style={{
                  marginTop: 64,
                  padding: 0,
                  height: "90%",
                }}
              >
                <Menu
                  style = {{
                    padding: "5px"
                  }}
                  //theme="dark" 
                  mode="inline" 
                  defaultSelectedKeys={['menu-item-auth']}
                  className="main-menu"
                  items = {
                    [
                      {
                        key: 'menu-item-auth',
                        label: <Auth username={this.state.username} saveUsername = {this.saveUsername} getUserConfig = {this.getUserConfig}/>
                      },
                    ]
                  }
                >
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
                }}
              >
                <Space>
                  Autocommunity, 2022
                  <Button onClick={toggleTheme}>Toggle Theme</Button>
                </Space>
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
                width: "80%",
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
                forceSetTheme = {forceSetTheme}
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
                initialValues={{
                  "markerType": "5",
                }}
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

                <Form.Item
                  label = "Marker Type"
                  name = "markerType"
                >
                  <Select>
                    <Option value="0">Gas Station ⛽</Option>
                    <Option value="1">Car Wash 🧼</Option>
                    <Option value="2">Service Station 🛠️</Option>
                    <Option value="3">Drift 🚗</Option>
                    <Option value="4">Drag racing 🏎️</Option>
                    <Option value="5">Other 👻</Option>
                  </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Add place
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          }

          <MarkerInfoModal marker={this.state.selectedMarker} 
            selectMarker={this.selectMarker}
            rateMarker={this.rateMarker}
          />
        </Layout>
      )
    } else {
      return (
        <Layout className="layout">
          <Sider
            style={{
              overflow: 'auto',
              height: '100%',
              width: '300px',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
            }}
            width={'300px'}
          >
            <Header style={{ position: 'fixed', zIndex: 2, width: '300px'}}>
              <div className="logo"> Autocommunity </div>
            </Header>
            <Layout style={{ minHeight: "100vh" }}>
              <Content
                style={{
                  marginTop: 64,
                  padding: 0,
                  height: "90%",
                }}
              >
                <Menu
                  style = {{
                    padding: "5px"
                  }}
                  //theme="dark" 
                  mode="inline" 
                  defaultSelectedKeys={['menu-item-auth']}
                  className="main-menu"
                  items = {
                    [
                      {
                        key: 'menu-item-auth',
                        label: <Auth username={this.state.username} saveUsername = {this.saveUsername} getUserConfig = {this.getUserConfig}/>
                      }
                    ]
                  }
                >
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
                }}
              >
                <Space>
                  Autocommunity, 2022
                  <Button onClick={toggleTheme}>Toggle Theme</Button>
                </Space>
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
                forceSetTheme = {forceSetTheme}
              />
            </Content>
          </Layout>

          { this.state.isSavingMarker &&
            <MobileModal 
              title="Woohoo, you're about to add new place! Please enter name:" 
              visible={this.state.isSavingMarker}
              onClose={() => this.setState({isSavingMarker: false})}
              closeOnMaskClick={true}
              content={
                <MobileForm 
                name = "Save marker"
                onFinish={this.sendMarker}
                initialValues={{
                  "markerType": "5",
                }}
              >
                <MobileForm.Item
                  label="Address"
                  name="address"
                >
                  <Tooltip trigger={['hover']} title={this.state.markerAddress} placement="bottom">
                    <div>
                      <Input
                        disabled
                        value={this.state.markerAddress}
                      />
                    </div>
                  </Tooltip>
                </MobileForm.Item>
                <MobileForm.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input name of your place!' }]}
                >
                  <Input />
                </MobileForm.Item>

                <MobileForm.Item
                  label = "Marker Type"
                  name = "markerType"
                >
                  <MobileButton
                      onClick={() => {
                        this.setState({ mobileSelectVisible: true })
                      }}
                    >
                      {this.state.mobileSelectLabel}
                    </MobileButton>
                  <MobileSelect
                    mouseWheel={true}
                    closeOnMaskClick={true}
                    visible={this.state.mobileSelectVisible}
                    onClose={() => {
                      this.setState({ mobileSelectVisible: false })
                    }}
                    onConfirm={(_, ext) => 
                      this.setState({ mobileSelectLabel: ext.items[0]!.label })
                    }
                    cancelText={'Cancel'}
                    confirmText={'Confirm'}
                    defaultValue={
                      [
                        '5'
                      ]
                    }
                    columns={[
                      [
                        { label: 'Gas Station ⛽', value: '0' },
                        { label: 'Car Wash 🧼', value: '1'},
                        { label: 'Service Station 🛠️', value: '2'},
                        { label: 'Drift 🚗', value: '3'},
                        { label: 'Drag racing 🏎️', value: '4'},
                        { label: 'Other 👻', value: '5' },
                      ]
                    ]}
                  />
                </MobileForm.Item>

                <MobileForm.Item>
                  <MobileButton color="primary" type="submit">
                    Add place
                  </MobileButton>
                </MobileForm.Item>
              </MobileForm>
              }
            >
            </MobileModal>
          }

          <MarkerInfoModal marker={this.state.selectedMarker}
            selectMarker={this.selectMarker}
            rateMarker={this.rateMarker}
          />
        </Layout>
      )
    }
  }
}

export default MapMainScreen;