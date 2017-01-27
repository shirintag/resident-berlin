import React from "react";
import ReactDom from "react-dom";
import MyMap from "./components/googleMap";
import FBLogin from "./components/login_facebook";
//export {Marker} from './components/Marker';
//
const  App = () => {
//   render() {
    return (
      <div>
          <div className="map">
              <MyMap />
          </div>
          <div className="login">
              <FBLogin />
          </div>
      </div>
    );
//   }
}




console.log(window.google)
ReactDom.render(<App />, document.querySelector(".app"));

// ReactDom.render(<Container />, document.querySelector(".map"));
// ReactDom.render(<MyComponent />, document.querySelector(".login"));
