import React from "react";
import ReactDOM from "react-dom";
import Netflix from "./netflixComponents";

const netflixID = document.getElementById("netflix");
if (netflixID) {
  ReactDOM.render(<Netflix />, netflixID);
}
