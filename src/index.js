import React, { Component } from 'react';
import ReactDom from "react-dom";
import MyMap from "./components/googleMap";
import FBLogin from "./components/login_facebook";
import FacebookLogin from 'react-facebook-login';
import NavBar from "./components/NavBar";

class  App extends Component {
    constructor(props){
        super(props);

        this.state = {
            events: [],
            loginData: null
        };

        this.saveLoginData = this.saveLoginData.bind(this)
        this.getEvents = this.getEvents.bind(this)
    }

    saveLoginData(response) {
        console.log(response);
        // console.log(this.state);
        this.setState({
            loginData: response
        });
        this.getEvents();
        return "localhost:8080"
    }

    getEvents(){
        FB.api('me/events', (res) => {
            // console.log(res);
            this.setState({
                events: res
            });
        });

    }

  render() {
    return (
      <div>
          <NavBar />
          <div className="map">
              <MyMap events={this.state.events}/>
          </div>
          <div className="login">
              <FBLogin callback={this.saveLoginData} />
          </div>
      </div>
    );
  }
}
FB.init({
    appId      : "960532494079095",
    xfbml      : true,
    version    : 'v2.8'
});
// console.log(window.google)
ReactDom.render(<App />, document.querySelector(".app"));
