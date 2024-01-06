import React from "react";
import ReactDOM from "react-dom";
import PlaygroundsFirstComponent from "./PlaygroundsFirstComponent";

let reactID = document.getElementById("react-component");
if (reactID != null ){
    // Render first component
    ReactDOM.render(<PlaygroundsFirstComponent />, document.getElementById("react-component"));
}