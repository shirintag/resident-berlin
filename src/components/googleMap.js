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
  return { x: -(width + 20), y: -(height / 2) };
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
            gridSize={60}
            zoomOnClick={false}
            maxZoom={14}
        >
        {props.markers}
        {props.infoWindow}
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
        /*this.setState({
            events: nextProps.events.data,
            markers: this.createMarkers()
        });*/
        this.setMarkers();
    }

    getPhotoEvents(id){
        FB.api(id + "/picture?type=large", (response) => {
            if (response && !response.error){
                event = this.state.selectedPlace;
                event.picture = response.data.url;
                this.setInfoWindow(event);
            }
        });
    }

    // nested function to be able to pass event information
    onMarkerClick(event) {
        let _this = this;
        return function(e) {
            _this.setInfoWindow(event);
            _this.getPhotoEvents(event.id);
        }
    }

    setMarkers() {
        let google = window.google;
        const events = this.props.events.data && this.props.events.data.filter(function(event) {
            // console.log(event, "this is events after filter");
            if (!event.place || !event.place.location) {
                return false;
            }
            return true;
        });

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

        this.setState({
            markers: MapFuncMarkers
        })
    }

    setInfoWindow(event) {
        const infoWindow =
            <OverlayView
                position={{lat: event.place.location.latitude,
                           lng: event.place.location.longitude}}
                mapPaneName={OverlayView.FLOAT_PANE}
                getPixelPositionOffset={getPixelPositionOffset}
            >
                <div className="info-window">
                    <img src={event.picture}/>
                    <div id="closeInfoWindow">X</div>
                    <h4>{event.name}</h4>
                    <h6>{event.start_time.toLocaleString()} - {event.end_time.toLocaleString()}</h6>
                    <div className="description" dangerouslySetInnerHTML={{__html: event.description}}></div>
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
            div.className = "info-window"
        }

        div && div.querySelector("#closeInfoWindow").addEventListener( "click",
            () => {
                div.className += " hidden"
        });

        this.setState({
            infoWindow: infoWindow,
            eventPicture: event.picture,
            selectedPlace: event,
            activeMarker: event.id,
            showingInfoWindow: true,
            activeMarkerPosition: {lat: event.place.location.latitude,
                lng: event.place.location.longitude}
            });
    }

    render() {
        // console.log('render');
        return (
            <InitialMap
                containerElement={
                    <div style={{height: '100vh', width: '100vw'}}/>
                }
                mapElement={
                    <div style={{height: '100%'}}/>
                }
                markers={this.state.markers}
                infoWindow={this.state.infoWindow}
                center={this.state.activeMarkerPosition}
            />
        )
    }
}
