import React from "react";
import ReactDOM from "react-dom";
import Gaussian from "./Gaussian";

let gaussianID = document.getElementById("gaussian");
if (gaussianID != null) {
  // Render first component
  ReactDOM.render(<Gaussian />, document.getElementById("gaussian"));
}
