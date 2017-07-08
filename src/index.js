import React, { Component } from 'react';
import ReactDom from "react-dom";
import MyMap from "./components/googleMap";
import FBLogin from "./components/login_facebook";
import FacebookLogin from 'react-facebook-login';
import NavBar from "./components/NavBar";
import 'whatwg-fetch';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

class  App extends Component {
    constructor(props){
        super(props);

        this.state = {
            events: [],
            PicturesEvents: [],
            loginData: null
        };

        this.saveLoginData = this.saveLoginData.bind(this)
        this.getEvents = this.getEvents.bind(this)
    }

    saveLoginData(response) {
        console.log(response, "this is saveLoginData");
        // console.log(this.state);
        this.setState({
            loginData: response
        });
        this.getEvents();
        return "localhost:8080"


    }

    getEvents(date){
        console.log("getEvents " + date)
        let _this = this;
        var date = '2017-04-22';
        // fetching ids
        fetch('/api/events/' + date)
          .then(function(res) {
              return res.json()
          }).then(function(json) {
            // Remove slice to show all events
            let ids = json.event_ids.slice(0,10);
            console.log(ids);
            ids.forEach(function(id) {
                FB.api(String(id), (res) => {
                    //console.log(res);
                    console.log(_this.state);
                    let events = _this.state.events;
                    events.push(res);
                    _this.setState({
                        events: events
                    });
                });
            })
        });

    }

  render() {
    const position = [51.505, -0.09];
    return (
        <Map center={position} zoom={13}>
            <TileLayer
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>
                    <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
                </Popup>
            </Marker>
        </Map>
    );
  }
}

// TODO add client_secret in ENVIRONMENT variables and add it to FB.init
FB.init({
    appId      : "960532494079095",
    xfbml      : true,
    version    : 'v2.8'
});
// console.log(window.google)
ReactDom.render(<App />, document.querySelector(".app"));
