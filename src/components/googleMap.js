import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Map, {GoogleApiWrapper, maps, Marker} from 'google-maps-react';
import mapStyle from "./map_style"
//https://github.com/fullstackreact/google-maps-react/issues/59
export class MyMap extends React.Component {
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
            >
            <Marker
                position={{lat: 52.519616, lng: 13.414064}}
                icon="imgs/icon.png"/>


            </Map>
            //<Marker position={{lat: 52.519616, lng: 13.414064}} />



        )

  }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyD1gktLYHktL4HBVTsR-1zjNyPBUwdVjV0"
})(MyMap)
