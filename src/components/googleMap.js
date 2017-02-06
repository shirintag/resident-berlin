import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Map, {GoogleApiWrapper, maps, Marker, InfoWindow} from 'google-maps-react';
// import mapStyle from "./map_style";
//https://github.com/fullstackreact/google-maps-react/issues/59
import mapStyle from "./InfoWindow";

export class MyMap extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            events:{},
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
        };
        this.onMarkerClick = this.onMarkerClick.bind(this);
    }

    componentWillReceiveProps(nextProps, i){
        // console.log(nextProps.events.data, "this is mymap");
        this.setState({
            events: nextProps.events.data
        });
    }

    onMarkerClick(props, marker, e) {
        console.log('hey');
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    render() {
        // console.log(window.google)
        let google = window.google

        return (
            <Map
            google={window.google}
            zoom={13}
            styles={mapStyle}
            initialCenter={{lat: 52.519616, lng: 13.414064}}
            disableDefaultUI= {true}
            >
            {
                // {this.props.events.data && this.props.events.data.filter(function(event) {
                //     if (!event.place || !event.place.location) {
                //         return false;
                //     }
                //     return true;
                // }).map((event) => {
                //     console.log(event, "this is event in map");
                //     return (
                //         <Marker
                //         onClick={this.onMarkerClick}
                //         position={{lat: event.place.location.latitude, lng: event.place.location.longitude}}
                //         icon={{
                //             url: "imgs/icon.png",
                //             scaledSize: google ? new google.maps.Size(30,50) : null
                //         }}
                //         />
                //     );
                // })}
            }

                <Marker
                    onClick={this.onMarkerClick}
                    position={{lat: 52.519616, lng: 13.414064}}
                    name={'Current location'} />

                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                        <h1>"hello"</h1>
                    </div>
                </InfoWindow>

            </Map>
        )
    }


}

export default GoogleApiWrapper({
    apiKey: "AIzaSyD1gktLYHktL4HBVTsR-1zjNyPBUwdVjV0",
    version: 3.26
})(MyMap)
