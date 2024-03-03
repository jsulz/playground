import React, { useEffect, useState } from "react";

const userProfileInfo = {
  display_name: "jsulz",
  email: "j.sulzdorf@gmail.com",
  followers: 0,
  image: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
};

const userTopArtists = [
  {
    name: "The Districts",
    popularity: 37,
    followers: 100750,
    genres: ["lancaster pa indie", "grungecore", "popmastic"],
    image: "https://i.scdn.co/image/ab6761610000f1789f4013bf7a84aac2e867961d",
  },
  {
    name: "The Districts",
    popularity: 37,
    followers: 100750,
    genres: ["lancaster pa indie", "grungecore", "popmastic"],
    image: "https://i.scdn.co/image/ab6761610000f1789f4013bf7a84aac2e867961d",
  },
  {
    name: "The Districts",
    popularity: 37,
    followers: 100750,
    genres: ["lancaster pa indie", "grungecore", "popmastic"],
    image: "https://i.scdn.co/image/ab6761610000f1789f4013bf7a84aac2e867961d",
  },
  {
    name: "The Districts",
    popularity: 37,
    followers: 100750,
    genres: ["lancaster pa indie", "grungecore", "popmastic"],
    image: "https://i.scdn.co/image/ab6761610000f1789f4013bf7a84aac2e867961d",
  },
  {
    name: "The Districts",
    popularity: 37,
    followers: 100750,
    genres: ["lancaster pa indie", "grungecore", "popmastic"],
    image: "https://i.scdn.co/image/ab6761610000f1789f4013bf7a84aac2e867961d",
  },
];

const userTopTracks = [
  {
    album: {
      name: "Popular Mechanics",
      image: "https://i.scdn.co/image/ab67616d00004851286b23887eb73c8f02f3731e",
      release_date: "2017",
    },
    artists: ["Son Lux", "Lily & Madeleine"],
    name: "Capable",
    popularity: "24",
    duration: 1248203,
    preview_url:
      "https://p.scdn.co/mp3-preview/160bf70ca16d9c06c9ddb320d75489a1ed26f281?cid=7f994fdc60e04c7e9a21d4fef64edadf",
  },
  {
    album: {
      name: "Popular Mechanics",
      image: "https://i.scdn.co/image/ab67616d00004851286b23887eb73c8f02f3731e",
      release_date: "2017",
    },
    artists: ["Son Lux", "Lily & Madeleine"],
    name: "Capable",
    popularity: "24",
    duration: 1248203,
    preview_url:
      "https://p.scdn.co/mp3-preview/160bf70ca16d9c06c9ddb320d75489a1ed26f281?cid=7f994fdc60e04c7e9a21d4fef64edadf",
  },
  {
    album: {
      name: "Popular Mechanics",
      image: "https://i.scdn.co/image/ab67616d00004851286b23887eb73c8f02f3731e",
      release_date: "2017",
    },
    artists: ["Son Lux", "Lily & Madeleine"],
    name: "Capable",
    popularity: "24",
    duration: 1248203,
    preview_url:
      "https://p.scdn.co/mp3-preview/160bf70ca16d9c06c9ddb320d75489a1ed26f281?cid=7f994fdc60e04c7e9a21d4fef64edadf",
  },
  {
    album: {
      name: "Popular Mechanics",
      image: "https://i.scdn.co/image/ab67616d00004851286b23887eb73c8f02f3731e",
      release_date: "2017",
    },
    artists: ["Son Lux", "Lily & Madeleine"],
    name: "Capable",
    popularity: "24",
    duration: 1248203,
    preview_url:
      "https://p.scdn.co/mp3-preview/160bf70ca16d9c06c9ddb320d75489a1ed26f281?cid=7f994fdc60e04c7e9a21d4fef64edadf",
  },
  {
    album: {
      name: "Popular Mechanics",
      image: "https://i.scdn.co/image/ab67616d00004851286b23887eb73c8f02f3731e",
      release_date: "2017",
    },
    artists: ["Son Lux", "Lily & Madeleine"],
    name: "Capable",
    popularity: "24",
    duration: 1248203,
    preview_url:
      "https://p.scdn.co/mp3-preview/160bf70ca16d9c06c9ddb320d75489a1ed26f281?cid=7f994fdc60e04c7e9a21d4fef64edadf",
  },
  {
    album: {
      name: "Popular Mechanics",
      image: "https://i.scdn.co/image/ab67616d00004851286b23887eb73c8f02f3731e",
      release_date: "2017",
    },
    artists: ["Son Lux", "Lily & Madeleine"],
    name: "Capable",
    popularity: "24",
    duration: 1248203,
    preview_url:
      "https://p.scdn.co/mp3-preview/160bf70ca16d9c06c9ddb320d75489a1ed26f281?cid=7f994fdc60e04c7e9a21d4fef64edadf",
  },
];

export default function Spotify() {
  useEffect(() => {}, []);

  return (
    <>
      <div>
        <a href="spotify:album:1q3IaeGzKz13rgMoxXBDEZ" target="_blank">
          test
        </a>
        <UserProfile userProfileInfo={userProfileInfo} />
        <TopSongs userTopTracks={userTopTracks} />
        <TopArtists userTopArtists={userTopArtists} />
        <ClearSession />
      </div>
    </>
  );
}

const UserProfile = ({ userProfileInfo }) => {
  return (
    <>
      <div class="card mb-3" style={{ maxWidth: "540px" }}>
        <div class="row g-0">
          <div class="col-md-4">
            <img
              src={`${userProfileInfo.image}`}
              class="img-fluid rounded-start"
              alt="..."
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">
                Welcome, {userProfileInfo.display_name}
              </h5>
              <p class="card-text">
                <small class="text-body-secondary">
                  Email: {userProfileInfo.email}
                </small>
                <br />
                <small class="text-body-secondary">
                  Followers: {userProfileInfo.followers}
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const TopSongs = ({ userTopTracks }) => {
  const trs = userTopTracks.map((track) => {
    return (
      <tr key={track.preview_url}>
        <td>
          <img src={track.album.image} />
        </td>
        <td>
          {track.name} <br />{" "}
          <small>
            Artists: {track.artists.map((artist) => artist).join(", ")}
          </small>
        </td>
        <td>{track.album.name}</td>
        <td>{track.album.release_date}</td>
        <td>{track.duration}</td>
        <td>
          <audio
            controls
            controlslist="play timeline"
            src={track.preview_url}
          ></audio>
        </td>
      </tr>
    );
  });
  return (
    <>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Track</th>
            <th>Album</th>
            <th>Date Released</th>
            <th>Length</th>
            <th>Audio Preview</th>
          </tr>
        </thead>
        <tbody>{trs}</tbody>
      </table>
    </>
  );
};

/**
  {
    name: "The Districts",
    popularity: 37,
    followers: 100750,
    genres: ["lancaster pa indie", "grungecore", "popmastic"],
    image: "https://i.scdn.co/image/ab6761610000f1789f4013bf7a84aac2e867961d",
  },
 */

const TopArtists = ({ userTopArtists }) => {
  const trs = userTopArtists.map((artist) => {
    return (
      <tr key={artist.name}>
        <td>
          <img src={artist.image} />
        </td>
        <td>{artist.name}</td>
        <td>{artist.genres.map((genre) => genre).join(", ")}</td>
        <td>{artist.followers}</td>
        <td>{artist.popularity}</td>
      </tr>
    );
  });
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Genres</th>
            <th>Followers</th>
            <th>Popularity</th>
          </tr>
        </thead>
        <tbody>{trs}</tbody>
      </table>
    </>
  );
};

const TimeRange = () => {
  // button group
};

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
