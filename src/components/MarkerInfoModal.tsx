import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";
import { Modal } from 'antd';
import EventList from './EventList';

interface MarkerInfoModalProps {
    marker: any,
    selectMarker: any
}

const MarkerInfoModal: React.FC<MarkerInfoModalProps> = (props: MarkerInfoModalProps) => {
    const [events, setEvents] = useState([]);

    // execute first argument when sth from list in second arg changes 
    useEffect(() => {
        axios.get(process.env.REACT_APP_API_URL + '/api/event/get/marker?markerId=' + props.marker.id)
            .then(response => setEvents(response.data))
            .catch(_error => setEvents([]))
    }, [props.marker.id]);

    return (
        <>
        <Modal title={props.marker.name} 
                visible={props.marker.id !== undefined && props.marker.id !== ''} 
                footer={null}
                onCancel={() => props.selectMarker({})}
        >
            <EventList events ={events}/>
            todo: add event button 
        </Modal>
        </>
    );
};
export default MarkerInfoModal;


