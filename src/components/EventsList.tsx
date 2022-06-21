import { List } from "antd";


function EventsList(props: {markers: any[], events: any[], bounds: any}) {
  return (
    <List
      style={{
        margin: "5px"
      }}
      bordered={true}
      dataSource={
        props.events.filter(event => 
            props.markers.filter(marker => !props.bounds || props.bounds.contains(marker))
            .find(marker => marker.id === event.markerId)
        )
        .sort((a: any, b: any) => new Date(a.startDate).getTime() === new Date(b.startDate).getTime() 
            ? (a.id < b.id ? -1 : +1) : (new Date(a.startDate).getTime() < new Date(b.startDate).getTime() ? -1 : +1))
      }
      pagination={{
        position: 'bottom',
        style: {
          textAlign: 'center',
        },
      }}
      renderItem = {(item : {name: string, description: string, startDate: any, endDate: any, id: any}) => (
        <List.Item
          style = {{
            margin: "5px"
          }}
          key = {item.id}
        >
            <List.Item.Meta
                title={<div>{item.name}</div>}
                description={<div>{item.description}</div>}
            />
            {item.startDate} - {item.endDate}
        </List.Item>
      )}
    />
  );
}

export default EventsList;