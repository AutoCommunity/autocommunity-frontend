import { List } from "antd";

function EventList(props: {events: any[]}) {
  return (
    <List
      style={{
        margin: "5px"
      }}
      bordered={true}
      dataSource={props.events}
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

export default EventList;