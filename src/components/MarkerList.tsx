import { Button, List, Space, Avatar } from "antd";
import { AimOutlined, BarsOutlined } from "@ant-design/icons";
import { MarkerTypes } from './CustomMap';
import 'antd/dist/antd.variable.min.css';
import { inject, observer } from "mobx-react";
import GlobalStorage from "../storage/GlobalStorage";
import { FC } from "react";

const avatars = [
  "⛽", "🧼", "🛠️", "🚗", "🏎️", "👻"
];

interface MarkerListProps {
  globalStorage: GlobalStorage;
  markers: any[];
  handleCenterClick: any;
  selectMarker: any;
  bounds: any;
}

const MarkerList: FC<MarkerListProps> = inject(
  'globalStorage'
)
 (observer(({globalStorage, markers, handleCenterClick, selectMarker, bounds}) => {
  const borderColor = globalStorage.theme === "light" ? "black" : "rgb(240,242,245)";
  return (
    <List
      style={{
        margin: "5px",
        borderColor: borderColor
      }}
      bordered={true}
      dataSource={markers.filter(marker => !bounds || bounds.contains(marker))}
      pagination={{
        position: 'bottom',
        style: {
          textAlign: 'center',
        },
        responsive: true
      }}
      renderItem = {(item : {name: any, lat: any, lng: any, markerType: any}) => (
        <List.Item
          style = {{
            margin: "5px",
            borderColor: borderColor
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
          <Space>
            <Button type="primary" icon={<BarsOutlined />} shape="circle"
              onClick = {
                () => selectMarker(item)
              }
            />
            <Button type="primary" icon={<AimOutlined />} shape="circle"
              onClick = {
                () => handleCenterClick(item)
              }
            />
        </Space>
        </List.Item>
      )}
    />
  );
}
)
 );

export default MarkerList;