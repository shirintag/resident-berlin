import React from "react";
import ReactDom from "react-dom";
import Container from "./components/googleMap";
import MyComponent from "./components/login_facebook";
//export {Marker} from './components/Marker';
//
// Const  App = () => {
// //   render() {
//     return (
//       <div>
//         // <Container />
//         // < MyComponent />
//       </div>
//     );
// //   }
// }




console.log(window.google)
// ReactDom.render(<App />, document.querySelector(".map"));

ReactDom.render(<Container />, document.querySelector(".map"));
ReactDom.render(<MyComponent />, document.querySelector(".login"));
