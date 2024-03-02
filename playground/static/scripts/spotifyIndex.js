import React from "react";
import ReactDOM from "react-dom";
import Spotify from "./spotifyTastes";

const spotifyEl = document.getElementById("spotify");
if (spotifyEl) {
  ReactDOM.render(<Spotify />, spotifyEl);
}
