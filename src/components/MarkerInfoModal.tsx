import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";
import { Modal, Button, Rate, message, Typography, Space } from 'antd';
import EventList from './EventList';
import AddEventForm from './AddEventForm';
import { Modal as MobileModal, Button as MobileButton } from 'antd-mobile';
import { isMobile } from 'react-device-detect';
import GlobalStorage from '../storage/GlobalStorage';
import { inject, observer } from 'mobx-react';

interface MarkerInfoModalProps {
    globalStorage?: GlobalStorage,
    marker: any,
    selectMarker: any,
    rateMarker: any,
    updateMarkers: any,
    updateEvents: any,
}

interface MarkerInfoType {
    id: string,
    name: string,
    markerType: string,
    address: string,
    lat: number,
    lng: number,
    rate: number,
    rateCnt: number,
    owner: string,
    events: []
}

const MarkerInfoModal: React.FC<MarkerInfoModalProps> = inject(
    "globalStorage"
)(observer((props: MarkerInfoModalProps) => {
    const [markerInfo, setMarkerInfo] = useState({} as MarkerInfoType);
    
    const updateMarkerInfo = () => {
        if (props.marker.id !== undefined && props.marker.id !== '') {
            axios.get(process.env.REACT_APP_API_URL + '/api/markers/get?markerId=' + props.marker.id)
                .then(response => setMarkerInfo(response.data))
                .catch(_error => setMarkerInfo({} as MarkerInfoType))
        } else {
            setMarkerInfo({} as MarkerInfoType);
        }
    }

    const removeMarker = async (id: string) => {
        await axios.post(process.env.REACT_APP_API_URL + '/api/markers/remove?markerId=' + id, null, {
            withCredentials: true
        })
            .catch((error) => {
                console.error(error.response.data)
                message.error('Could not remove marker');
              });
        props.updateMarkers();
        props.globalStorage!.changeMarkerInfoVisible(false);
    }

    const [addingEvent, setAddingEvent] = useState(false);

    useEffect(updateMarkerInfo, [props.marker, addingEvent]);


    if (!isMobile) {
        return (
            <>
            <Modal title={markerInfo.name} 
                    visible={props.globalStorage!.markerInfoVisible} 
                    footer={null}
                    onCancel={() => {
                        props.selectMarker({});
                        props.globalStorage!.changeMarkerInfoVisible(false);
                    }}
            >
                <Typography.Text
                    ellipsis={{ tooltip: markerInfo.address }}
                >
                    {markerInfo.address}
                </Typography.Text>
                <Rate 
                    allowHalf 
                    value={markerInfo.rate} 
                    onChange = { async rate => {
                            await props.rateMarker(rate, props.marker); 
                            updateMarkerInfo();
                            props.updateMarkers();
                        }
                    }
                />
                <span className="ant-rate-text">{markerInfo.rateCnt} votes</span>

                <EventList events = {markerInfo.events}/>
                <Space>
                <Button
                    type = "primary"
                    onClick = {() => setAddingEvent(true)}
                >
                    Add event
                </Button>
                <Modal title = "Add new event at the current marker"
                        visible = {addingEvent}
                        footer = {null}
                        onCancel = {() => setAddingEvent(false)}
                        width={600}
                >
                    <AddEventForm marker={props.marker} selectMarker={props.selectMarker} setAddingEvent={setAddingEvent} updateEvents={props.updateEvents}/>
                </Modal>
                {
                    markerInfo.owner === props.globalStorage!.username ?
                    <Button
                        danger = {true}
                        onClick = {async () => await removeMarker(markerInfo.id)}
                    >
                        Remove
                    </Button>
                    :
                    <></>
                }
                </Space>
            </Modal>
            </>
        );
    }
    else {
        return (
            <MobileModal title={markerInfo.name} 
                visible={props.marker.id !== undefined && props.marker.id !== ''}
                onClose={() => props.selectMarker({})}
                showCloseButton={true}
                content={
                    <>
                        <Typography.Text
                            ellipsis={{ tooltip: markerInfo.address }}
                        >
                            {markerInfo.address}
                        </Typography.Text>
                        <Rate 
                            allowHalf 
                            value={markerInfo.rate} 
                            onChange = { async rate => {
                                    await props.rateMarker(rate, props.marker); 
                                    updateMarkerInfo();
                                }
                            }
                        />
                        <span className="ant-rate-text">{markerInfo.rateCnt} votes</span>
                        <EventList events ={markerInfo.events}/>
                        <MobileButton color = "primary" onClick = {() => setAddingEvent(true)}>
                            Add event
                        </MobileButton>
                        <MobileModal title = "Add new event at the current marker"
                            visible = {addingEvent}
                            onClose = {() => setAddingEvent(false)}
                            showCloseButton={true}
                            content={
                                <AddEventForm marker={props.marker} selectMarker={props.selectMarker} setAddingEvent={setAddingEvent} updateEvents={props.updateEvents}/>
                            }
                        >
                        </MobileModal>
                    </>
                }
            >
            </MobileModal>
        );
    }
}
));
export default MarkerInfoModal;


