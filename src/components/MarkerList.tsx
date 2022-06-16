import { Button, List, Space, Avatar } from "antd";
import { AimOutlined, BarsOutlined } from "@ant-design/icons";
import { MarkerTypes } from './CustomMap';
import 'antd/dist/antd.variable.min.css';

const avatars = [
  "⛽", "🧼", "🛠️", "🚗", "🏎️", "👻"
];

function MarkerList(props: {markers: any[], handleCenterClick: any, selectMarker: any}) {
  return (
    <List
      style={{
        margin: "5px"
      }}
      bordered={true}
      dataSource={props.markers}
      renderItem = {(item : {name: any, lat: any, lng: any, markerType: any}) => (
        <List.Item
          style = {{
            margin: "5px"
          }}
          key = {item.name + Math.floor(Math.random() * 10000)}
        >
          <List.Item.Meta
            avatar={
            <Avatar shape="circle"> 
              <div>
                <span style={{fontSize: '25px'}}>
                  {avatars[MarkerTypes.get(item.markerType) as number]}
                </span>
              </div>
            </Avatar>}
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