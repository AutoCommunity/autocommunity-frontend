import { Button, List, Space } from "antd";
import { AimOutlined, BarsOutlined } from "@ant-design/icons";

function MarkerList(props: {markers: any[], handleCenterClick: any, selectMarker: any}) {
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
          <Space >
            <Button type="primary" icon={<BarsOutlined />} shape="circle"
              onClick = {
                () => props.selectMarker(item)
              }
            />
            <Button type="primary" icon={<AimOutlined />} shape="circle"
              onClick = {
                () => props.handleCenterClick(item)
              }
            />
        </Space>
        </List.Item>
      )}
    />
  );
}

export default MarkerList;