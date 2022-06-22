import React from "react";
import CustomMap from "./CustomMap";
import axios from "axios";
import Auth from './Auth';

import 'leaflet/dist/leaflet.css'
import { Layout, Menu, Modal, Form, message, Input, Button, Tooltip, Select, Space, Switch, Spin } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import '../index.css'
import Sider from "antd/lib/layout/Sider";
import MarkerList from "./MarkerList";
import EventsList from "./EventsList";
import MarkerInfoModal from "./MarkerInfoModal";
import { Modal as MobileModal, Button as MobileButton, Form as MobileForm, Picker as MobileSelect } from "antd-mobile";
import { isMobile } from 'react-device-detect';
import { inject } from "mobx-react";
import GlobalStorage from "../storage/GlobalStorage";

const { Option } = Select;

@inject('globalStorage')
class MapMainScreen extends React.Component {
  globalStorage: GlobalStorage;
  constructor(props: any) {
    super(props)
    this.globalStorage = props.globalStorage;
    this.saveMarkers = this.saveMarkers.bind(this);
    this.sendMarker = this.sendMarker.bind(this);
    this.saveUsername = this.saveUsername.bind(this);
    this.handleCenterClick = this.handleCenterClick.bind(this);
    this.selectMarker = this.selectMarker.bind(this);
    this.rateMarker = this.rateMarker.bind(this);
    this.setBounds = this.setBounds.bind(this);
    this.updateMarkers = this.updateMarkers.bind(this);
    this.updateEvents = this.updateEvents.bind(this);
    this.getUserConfig = this.getUserConfig.bind(this, this.globalStorage);
  }

  state = {
    isLoading: false,
    markers: [],
    events: [],
    isSavingMarker: false,
    markerAddress: '',
    markerCoords: {lat: 0, lng: 0},
    username: '',
    center: [50.166258, 19.9415741],
    selectedMarker: {},
    mobileSelectVisible: false,
    mobileSelectLabel: 'Other 👻',
    bounds: null,
    switchChecked: true
  }

  handleClose = async() => this.setState({ isSavingMarker: false });
  handleShow = async () => this.setState({ isSavingMarker: false });

  setBounds(mapBounds: any) {
    this.setState({ bounds: mapBounds });
  }

  selectMarker(marker: any) {
    this.setState({selectedMarker: marker});
    this.globalStorage.changeMarkerInfoVisible(true);
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
  }

  async componentDidMount() {
    this.setState({isLoading: true});
    const markersData = await axios
      .get(process.env.REACT_APP_API_URL + '/api/markers/get/all')
      .then(response => response.data);

    const eventsData = await axios
      .get(process.env.REACT_APP_API_URL + '/api/event/all')
      .then(response => response.data);

    const userData = await this.getUserConfig();
    this.setState({markers: markersData, events: eventsData, isLoading: false, username: userData.username});
  }

  async getUserConfig() {
    return await axios
      .get(process.env.REACT_APP_API_URL + '/api/user/config', {
        withCredentials: true,
      })
      .then(response => {
        this.globalStorage.userLogin(response.data.username);
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
      .get(process.env.REACT_APP_API_URL + '/api/markers/get/all')
      .then(response => response.data);
    this.setState({markers: data});
  }

  async updateEvents() {
    const data = await axios
      .get(process.env.REACT_APP_API_URL + '/api/event/all')
      .then(response => response.data);
    this.setState({events: data});
  }

  async sendMarker(event: any) {
    this.setState({isLoading: true});

    const requestBody = {
      name: event.name,
      markerType: event.markerType,
      lat: this.state.markerCoords.lat,
      lng: this.state.markerCoords.lng,
      address: this.state.markerAddress,
    }
    await axios
      .post(process.env.REACT_APP_API_URL + '/api/markers/add', requestBody, {
        withCredentials: true
      })
      .then(response => {
      })
      .catch((error) => {
      });
    
    this.setState({isLoading: false, isSavingMarker: false});
    await this.updateMarkers();
  }

  async getAddressByCoordinates(newMarkerCoords: L.LatLng) {
    const result = await axios
      .get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newMarkerCoords.lat}&lon=${newMarkerCoords.lng}`)
      .then(response => {
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
  }

  render() {
    this.globalStorage.forceSetTheme();
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
              <Spin spinning={this.state.isLoading}>
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
                        {
                          key: 'menu-item-switch',
                          label: <Switch defaultChecked = {this.state.switchChecked} onClick = {(value) => this.setState({ switchChecked: value})}/>
                        }
                      ]
                    }
                  >
                  </Menu>
                    { 
                    this.state.switchChecked ? 
                      <MarkerList
                        markers={this.state.markers} 
                        handleCenterClick = {this.handleCenterClick}
                        selectMarker = {this.selectMarker}
                        bounds = {this.state.bounds}
                      />
                    : 
                      <EventsList
                        markers = {this.state.markers}
                        events = {this.state.events}
                        bounds = {this.state.bounds}
                      />
                    }
                </Content>
              </Spin>
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
                  <Button onClick={this.globalStorage.toggleTheme}>Toggle Theme</Button>
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
                forceSetTheme = {this.globalStorage.forceSetTheme}
                setBounds = {this.setBounds}
              />
            </Content>
          </Layout>

          { this.state.isSavingMarker &&
            <Modal title="Woohoo, you're about to add new place! Please enter name:" 
                  visible={this.state.isSavingMarker} 
                  footer={null}
                  onCancel={() => this.setState({isSavingMarker: false})}
            >
              <Spin spinning={this.state.isLoading}>
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
                    <Button type="primary" htmlType="submit" loading={this.state.isLoading}>
                      Add place
                    </Button>
                  </Form.Item>
                </Form>
              </Spin>
            </Modal>
          }

          <MarkerInfoModal
            marker={this.state.selectedMarker} 
            selectMarker={this.selectMarker}
            rateMarker={this.rateMarker}
            updateMarkers={this.updateMarkers}
            updateEvents={this.updateEvents}
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
              <Spin spinning={this.state.isLoading}>
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
                        {
                          key: 'menu-item-switch',
                          label: <Switch defaultChecked = {this.state.switchChecked} onClick = {(value) => this.setState({ switchChecked: value})}/>
                        }
                      ]
                    }
                  >
                  </Menu>
                    { 
                    this.state.switchChecked ? 
                      <MarkerList
                        markers={this.state.markers} 
                        handleCenterClick = {this.handleCenterClick}
                        selectMarker = {this.selectMarker}
                        bounds = {this.state.bounds}
                      />
                    : 
                      <EventsList
                        markers = {this.state.markers}
                        events = {this.state.events}
                        bounds = {this.state.bounds}
                      />
                    }

                </Content>
              </Spin>
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
                  <Button onClick={this.globalStorage.toggleTheme}>Toggle Theme</Button>
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
                forceSetTheme = {this.globalStorage.forceSetTheme}
                setBounds = {this.setBounds}
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
                    <Input
                      disabled
                      value={this.state.markerAddress}
                    />
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

          <MarkerInfoModal
            marker={this.state.selectedMarker}
            selectMarker={this.selectMarker}
            rateMarker={this.rateMarker}
            updateMarkers={this.updateMarkers}
            updateEvents={this.updateEvents}
          />
        </Layout>
      )
    }
  }
}

export default MapMainScreen;