import React, { useEffect, useState } from "react";

export default function Spotify() {
  let userProfileInfo = null;
  let userTopTracks = null;
  let userTopArtists = null;
  useEffect(() => {}, []);

  return (
    <>
      <h1>Hello World</h1>
      <div>
        <ClearSession />
      </div>
    </>
  );
}

const ClearSession = () => {
  const handleClick = (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
    };
    fetch("/spotify-clear-session", options)
      .then((response) => response.json())
      .then((data) => {
        console.log("data");
        if (!data.error) {
          window.location.reload();
        } else {
          console.log(data.error);
        }
      });
  };
  return (
    <button className="btn btn-primary" onClick={handleClick}>
      Logout and Clear Session
    </button>
  );
};
