import { Button, List } from "antd";
import { AimOutlined } from "@ant-design/icons";

function MarkerList(props: {markers: any[], handleCenterClick: any}) {
  return (
    <List
      style={{
        background: "white",
        margin: "5px"
      }}
      bordered={true}
      dataSource={props.markers}
      renderItem = {(item : {name: any, lat: any, lng: any}) => (
        <List.Item
          style = {{
            margin: "5px"
          }}
          key = {item.name}
        >
          <List.Item.Meta
            title={<div>{item.name}</div>}
          />
          <Button type="primary" icon={<AimOutlined />} shape="circle"
            onClick = {
              () => props.handleCenterClick(item)
            }
          />
        </List.Item>
      )}
    />
  );
}

export default MarkerList;