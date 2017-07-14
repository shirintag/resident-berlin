import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  withGoogleMap,
  GoogleMap,
  Marker, InfoWindow, OverlayView
} from "react-google-maps";
import mapStyle from "./map_style";
//https://github.com/fullstackreact/google-maps-react/issues/59
import MarkerClusterer from "react-google-maps/lib/addons/MarkerClusterer"

console.log(MarkerClusterer);

const mouseEvents = ['click',
	'mousedown', 'mousemove', 'mouseover',
  'mouseout', 'mouseup', 'mousewheel',
  'DOMMouseScroll', 'touchstart', 'touchend',
  'touchmove', 'dblclick', 'contextmenu'
];

function cancelEvent(e) {
  e.cancelBubble = true;
  e.stopPropagation && e.stopPropagation();
}

function getPixelPositionOffset(width, height) {
  return { x: -(width / 2), y: -(height + 20) };
}


const InitialMap = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={13}
        defaultCenter={{lat: 52.519616, lng: 13.414064}}
        defaultOptions={{ styles: mapStyle }}
        ref={(map) => map && map.panTo(props.center)}
    >
        <MarkerClusterer
            averageCenter
            enableRetinaIcons
            gridSize={16}
            zoomOnClick={false}
            maxZoom={15}
        >
        {props.markers}
        </MarkerClusterer>
    </GoogleMap>
));


export default class MyMap extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            events:{},
            showingInfoWindow: false,
            selectedPlace: {start_time: new Date(), end_time: new Date()},
            eventPicture: "",
            activeMarkerPosition: {lat: 52.519616, lng: 13.414064}
        };
        this.onMarkerClick = this.onMarkerClick.bind(this);
    }

    componentWillReceiveProps(nextProps, i){
        // console.log(nextProps.events.data, "this is mymap");
        this.setState({
            events: nextProps.events.data
        });
    }

    getPhotoEvents(id){
        FB.api(id + "/picture?type=large", (response) => {
            if (response && !response.error){
                this.setState({
                    eventPicture: response.data.url
                });
            }
        });
    }

    // nested function to be able to pass event information
    onMarkerClick(event) {
        let _this = this;
        return function(e) {
            _this.setState({
                eventPicture: "",
                selectedPlace: event,
                activeMarker: event.id,
                showingInfoWindow: true,
                activeMarkerPosition: {lat: event.place.location.latitude,
                                       lng: event.place.location.longitude}
            });
            _this.getPhotoEvents(event.id);
        }
    }

    render() {
        // console.log(window.google);
        let google = window.google;
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
                    onClick={this.onMarkerClick(event)}
                    position={{lat: event.place.location.latitude, lng: event.place.location.longitude}}
                    name={'event' + i}
                    icon={{
                        url: "imgs/icon.png",
                        scaledSize: google ? new google.maps.Size(30,50) : null
                    }}
                    data={event}
                    noRedraw
                    />
                );
            });

        const infoWindow =
            <OverlayView
                position={this.state.activeMarkerPosition}
                mapPaneName={OverlayView.FLOAT_PANE}
                getPixelPositionOffset={getPixelPositionOffset}
                visible={this.state.showingInfoWindow}>
                <div className={this.state.showingInfoWindow ? "info-window": "info-window hidden"}>
                    <img src={this.state.eventPicture}/>
                    <h4>{this.state.selectedPlace.name}</h4>
                    <h6>{this.state.selectedPlace.start_time.toLocaleString()} - {this.state.selectedPlace.end_time.toLocaleString()}</h6>
                    <div className="description" dangerouslySetInnerHTML={{__html: this.state.selectedPlace.description}}></div>
                </div>

            </OverlayView>;

        // we need to get parent element of info-window to turn off events
        // that control the map
        // https://stackoverflow.com/questions/38842632/how-to-make-google-maps-custom-overlay-above-markers-click-zone
        var div = document.querySelector(".info-window");
        if (div && this.state.showingInfoWindow) {
            mouseEvents.map((event) => {
                google.maps.event.addDomListener(div.parentElement, event, cancelEvent)
            });
        }
        // console.log(this.state.activeMarker);
        MapFuncMarkers && MapFuncMarkers.push(infoWindow);

        return (
            <InitialMap
                containerElement={
                    <div style={{height: '100vh', width: '100vw'}}/>
                }
                mapElement={
                    <div style={{height: '100%'}}/>
                }
                markers={MapFuncMarkers}
                center={this.state.activeMarkerPosition}
            />
        )
    }
}
