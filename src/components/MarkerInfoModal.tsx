import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";
import { Modal, Button } from 'antd';
import EventList from './EventList';
import AddEventForm from './AddEventForm';
import { Modal as MobileModal, Button as MobileButton } from 'antd-mobile';
import { isMobile } from 'react-device-detect';

interface MarkerInfoModalProps {
    marker: any,
    selectMarker: any
}

const MarkerInfoModal: React.FC<MarkerInfoModalProps> = (props: MarkerInfoModalProps) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (props.marker.id !== undefined && props.marker.id !== '') {
            axios.get(process.env.REACT_APP_API_URL + '/api/event/get/marker?markerId=' + props.marker.id)
                .then(response => setEvents(response.data))
                .catch(_error => setEvents([]))
        }
    });

    const [addingEvent, setAddingEvent] = useState(false);

    if (!isMobile) {
        return (
            <>
            <Modal title={props.marker.name} 
                    visible={props.marker.id !== undefined && props.marker.id !== ''} 
                    footer={null}
                    onCancel={() => props.selectMarker({})}
            >
                <EventList events ={events}/>
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
                <MobileModal title={props.marker.name} 
                    visible={props.marker.id !== undefined && props.marker.id !== ''}
                    onClose={() => props.selectMarker({})}
                    showCloseButton={true}
                    content={
                        <>
                            <EventList events ={events}/>
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


