import React from "react";
import ReactDOM from "react-dom";
import PlaygroundURLShortener from "./urlShortener";

const urlID = document.getElementById("urls");
if (urlID) {
  ReactDOM.render(<PlaygroundURLShortener />, urlID);
}
