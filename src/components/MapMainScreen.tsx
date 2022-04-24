import React from "react";
import CustomMap from "./CustomMap";
import MarkerList from "./MarkerList";




class MapMainScreen extends React.Component {
  state = {
    isLoading: false,
    markers: []
  }

  async componentDidMount() {
    this.setState({isLoading: true});
    const response = await fetch(process.env.REACT_APP_API_URL + "/api/getMarkers");
    const data = await response.json();
    this.setState({markers: data, isLoading: false});
  }

  render() {
    return (
      <div style={{
        position: "relative",
        boxSizing: "border-box",
      }}>
        <MarkerList style={{
        width: "30%",
        background: "blue",
        height: "100vh",}} markers = {this.state.markers}/>
        <CustomMap markers={this.state.markers}/>
      </div>
    )
  }
}

export default MapMainScreen;