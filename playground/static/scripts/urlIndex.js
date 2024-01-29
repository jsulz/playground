import React from "react";
import ReactDOM from "react-dom";
import URLShortener from "./urlShortener";

const urlID = document.getElementById("urls");
if (urlID) {
  ReactDOM.render(<URLShortener />, urlID);
}
