import React from 'react'
import ReactDOM from 'react-dom'
import Map, {GoogleApiWrapper, maps} from 'google-maps-react';
import mapStyle from "./map_style"

export class Container extends React.Component {
    componentDidMount() {
    console.log('qui puoi fare console.log');
  }
    render() {
        // const style = {
        //     // position: 'fixed',
        //     // 'z-index': -1000,
        //     // top: 0,
        //     // left: 0,
        //     // margin: '0px'
        // }

        return (
            <Map
                google={window.google}
                zoom={13}
                styles={mapStyle}
                initialCenter={{lat: 52.519616, lng: 13.414064}}
                disableDefaultUI= {true}
              />
    )
  }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyD1gktLYHktL4HBVTsR-1zjNyPBUwdVjV0"
})(Container)
