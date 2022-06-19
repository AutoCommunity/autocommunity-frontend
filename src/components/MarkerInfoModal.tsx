import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";
import { Modal, Button, Rate } from 'antd';
import EventList from './EventList';
import AddEventForm from './AddEventForm';
import { Modal as MobileModal, Button as MobileButton } from 'antd-mobile';
import { isMobile } from 'react-device-detect';

interface MarkerInfoModalProps {
    marker: any,
    selectMarker: any,
    rateMarker: any
}

interface MarkerInfoType {
    id: string,
    name: string,
    markerType: string,
    lat: number,
    lng: number,
    rate: number,
    rateCnt: number,
    events: []
}

const MarkerInfoModal: React.FC<MarkerInfoModalProps> = (props: MarkerInfoModalProps) => {
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
    const [addingEvent, setAddingEvent] = useState(false);

    useEffect(updateMarkerInfo, [props.marker, addingEvent]);


    if (!isMobile) {
        return (
            <>
            <Modal title={markerInfo.name} 
                    visible={props.marker.id !== undefined && props.marker.id !== ''} 
                    footer={null}
                    onCancel={() => props.selectMarker({})}
            >
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

                <EventList events = {markerInfo.events}/>
                <Button type = "primary" onClick = {() => setAddingEvent(true)}>
                    Add event
                </Button>
                <Modal title = "Add new event at the current marker"
                        visible = {addingEvent}
                        footer = {null}
                        onCancel = {() => setAddingEvent(false)}
                        width={600}
                >
                    <AddEventForm marker={props.marker} selectMarker={props.selectMarker} setAddingEvent={setAddingEvent}/>
                </Modal>
            </Modal>
            </>
        );
    }
    else {
        return (
            <>
                <MobileModal title={markerInfo.name} 
                    visible={props.marker.id !== undefined && props.marker.id !== ''}
                    onClose={() => props.selectMarker({})}
                    showCloseButton={true}
                    content={
                        <>
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
                                    <AddEventForm marker={props.marker} selectMarker={props.selectMarker} setAddingEvent={setAddingEvent}/>
                                }
                            >
                            </MobileModal>
                        </>
                    }
                >
                </MobileModal>
            </>
        );
    }
};
export default MarkerInfoModal;


