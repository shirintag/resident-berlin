import React, { Component } from 'react';
import ReactDom from "react-dom";
import MyMap from "./components/googleMap";
import FBLogin from "./components/login_facebook";
import FacebookLogin from 'react-facebook-login';
import NavBar from "./components/NavBar";
import processEvent from "./utils/processEvents";
import 'whatwg-fetch';


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
            let ids = json.event_ids.slice(0,50);
            let i, chunk = 50;

            // create batches of 50 ids
            let batches = [];
            for (i=0; i<ids.length; i+=chunk) {
                batches.push(ids.slice(i,i+chunk));
            }

            batches.forEach(function(batch) {
                batch = batch.map((id) => {return {relative_url: String(id) } } );
                FB.api('/', 'POST', {
                    batch: batch
                }, (res) => {
                    // parse JSON bodies, and processEvents
                    let batch_events = res.map((e) => {
                        return processEvent(JSON.parse(e.body))
                    });
                    let events = _this.state.events;
                    events.push.apply(events, batch_events);  // extend array
                    _this.setState({
                        events: events
                    });
                });
            });
        });

    }

  render() {
    return (
      <div>
            <div className='nav'>
                <div className='button'><NavBar /></div>
                <div className='login'><FBLogin callback={this.saveLoginData} /></div>
            </div>

            <div className="map">
                <MyMap events={{"data": this.state.events}}/>
            </div>
      </div>
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
