import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Map, {GoogleApiWrapper, maps, Marker, InfoWindow} from 'google-maps-react';
import mapStyle from "./map_style";
//https://github.com/fullstackreact/google-maps-react/issues/59

export class MyMap extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            events:{},
            showingInfoWindow: false,
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
        console.log(props);
        this.setState({
            selectedPlace: props.data,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    render() {
        // console.log(window.google)
        let google = window.google
        const events = this.props.events.data && this.props.events.data.filter(function(event) {
            // console.log(event, "this is events after filter");
            if (!event.place || !event.place.location) {
                return false;
            }
            return true;
        });

        // console.log(events, 1);

        const MapFuncMarkers = events && events.map((event, i) => {
                // console.log(event, "this is event in map");
                return (
                    <Marker
                    onClick={this.onMarkerClick}
                    position={{lat: event.place.location.latitude, lng: event.place.location.longitude}}
                    name={'event' + i}
                    icon={{
                        url: "imgs/icon.png",
                        scaledSize: google ? new google.maps.Size(30,50) : null
                    }}
                    data={event}
                    />
                );
            });

            const infoWindow =
                <InfoWindow

                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                        <h4>"name: "{this.state.selectedPlace.name}</h4>
                        <h6>"start_time & end_time" {this.state.selectedPlace.start_time} {this.state.selectedPlace.end_time}</h6>
                        <p>"description: " {this.state.selectedPlace.description}</p>
                    </div>

              </InfoWindow>;

        MapFuncMarkers && MapFuncMarkers.push(infoWindow);

        return (
            <Map
                google={window.google}
                zoom={13}
                styles={mapStyle}
                initialCenter={{lat: 52.519616, lng: 13.414064}}
                disableDefaultUI= {true}
                >
                {MapFuncMarkers}

            </Map>
        )
    }


}

export default GoogleApiWrapper({
    apiKey: "AIzaSyD1gktLYHktL4HBVTsR-1zjNyPBUwdVjV0",
    version: 3.26
})(MyMap)
