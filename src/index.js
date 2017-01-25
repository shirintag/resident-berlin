import React from "react";
import ReactDom from "react-dom";
import Container from "./components/googleMap";
import MyComponent from "./components/login_facebook";

// import {Marker} from './components/Marker'

// export default class App extends Component {
//   render() {
//     return (
//       <div>React simple starter</div>
//     );
//   }
// }




console.log(window.google)
ReactDom.render(<Container />, document.querySelector(".map"));
ReactDom.render(<MyComponent />, document.querySelector(".login"));
