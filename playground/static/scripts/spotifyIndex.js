import React from "react";
import ReactDOM from "react-dom";
import Spotify from "./spotifyTastes";
import SpotifyAuth from "./spotifyAuth";

const spotifyEl = document.getElementById("spotify");
const noSpotifyEl = document.getElementById("no-spotify");
if (spotifyEl) {
  ReactDOM.render(<Spotify />, spotifyEl);
}

if (noSpotifyEl) {
  ReactDOM.render(<SpotifyAuth />, noSpotifyEl);
}
