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

export default function Spotify() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [topSongs, setTopSongs] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [trackTimeRange, setTrackTerm] = useState("short_term");
  const [artistTimeRange, setArtistTerm] = useState("short_term");

  useEffect(() => {
    fetch("/spotify-user-info")
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data.data);
      });
  }, []);

  useEffect(() => {
    const paramString = "type=tracks&time_range=" + trackTimeRange;
    const params = new URLSearchParams(paramString);
    let active = true;
    fetch("/spotify-user-history?" + params)
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setTopSongs(data.data);
        }
      });

    return () => {
      active = false;
    };
  }, [trackTimeRange]);

  useEffect(() => {
    const paramString = "type=tracks&time_range=" + trackTimeRange;
    const params = new URLSearchParams(paramString);
    let active = true;
    fetch("/spotify-user-history?" + params)
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setTopSongs(data.data);
        }
      });

    return () => {
      active = false;
    };
  }, [trackTimeRange]);

  const handlePlayTrack = (e, track) => {
    e.preventDefault();
    setCurrentlyPlaying(track);
  };

  return (
    <>
      <div>
        <div className="row row-cols-2">
          <div className="col">
            {userProfile && <UserProfile userProfileInfo={userProfileInfo} />}
          </div>
          <div className="col">
            <Player currentlyPlaying={currentlyPlaying} />
          </div>
        </div>
        {topSongs && (
          <TopSongs playTrack={handlePlayTrack} userTopTracks={topSongs} />
        )}
        {topArtists && <TopArtists userTopArtists={userTopArtists} />}
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
                <br />
                <ClearSession />
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Player = ({ currentlyPlaying }) => {
  return (
    <>
      {currentlyPlaying ? (
        <>
          <audio
            controls
            controlslist="play timeline"
            src={currentlyPlaying.preview_url}
          ></audio>
          <div>
            <ul>
              <li>Currently Playing: {currentlyPlaying.name}</li>
              <li>
                On: {currentlyPlaying.image} {currentlyPlaying.album.name}
              </li>
              <li>By: {currentlyPlaying.artists.join(", ")}</li>
            </ul>
          </div>
        </>
      ) : (
        <h1>Hello</h1>
      )}
    </>
  );
};

const TopSongs = ({ userTopTracks, playTrack }) => {
  const trs = userTopTracks.map((track) => {
    return (
      <tr key={track.preview_url}>
        <td>
          <img src={track.album.image} />
        </td>
        <td>
          {track.name} <br /> <small>Artists: {track.artists.join(", ")}</small>
        </td>
        <td>{track.album.name}</td>
        <td>{track.album.release_date}</td>
        <td>{track.duration}</td>
        <td>
          <button
            onClick={(e) => playTrack(e, track)}
            type="button"
            class="btn btn-secondary"
          >
            <i class="bi bi-play-circle"></i>
          </button>
        </td>
      </tr>
    );
  });
  return (
    <>
      <h2>
        Top Listened to Tracks in the <TimeSpentSelector time={"short-term"} />
      </h2>
      <table className="table table-dark table-responsive-md">
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

const TopArtists = ({ userTopArtists }) => {
  const trs = userTopArtists.map((artist) => {
    return (
      <tr key={artist.name}>
        <td>
          <img height={64} width={64} src={artist.image} />
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
      <h2>
        Top Listened to Artists in the <TimeSpentSelector time={"short-term"} />
      </h2>
      <table className="table table-dark table-responsive-md">
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

const TimeSpentSelector = ({ time }) => {
  const periods = ["long-term", "medium-term", "short-term"];
  const dropdown = periods.map((period) => {
    if (time != period) {
      return (
        <li>
          <a class="dropdown-item" href="#">
            {period}
          </a>
        </li>
      );
    }
  });
  return (
    <div class="btn-group">
      <button
        type="button"
        class="btn dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {time}
      </button>
      <ul class="dropdown-menu">{dropdown}</ul>
    </div>
  );
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
