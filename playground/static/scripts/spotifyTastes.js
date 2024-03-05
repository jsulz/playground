import React, { useEffect, useState } from "react";

export default function Spotify() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [topSongs, setTopSongs] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [trackTimeRange, setTrackTerm] = useState("short_term");
  const [artistTimeRange, setArtistTerm] = useState("short_term");
  const [oauthToken, setOauthToken] = useState(null);
  const [whichPlayer, setWhichPlayer] = useState(null);

  useEffect(() => {
    fetch("/spotify-user-info")
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data.data);
        setWhichPlayer(data.data.product);
      });
    fetch("/spotify-auth-token")
      .then((response) => response.json())
      .then((data) => {
        setOauthToken(data.data);
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
    const paramString = "type=artists&time_range=" + artistTimeRange;
    const params = new URLSearchParams(paramString);
    let active = true;
    fetch("/spotify-user-history?" + params)
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setTopArtists(data.data);
        }
      });

    return () => {
      active = false;
    };
  }, [artistTimeRange]);

  const handlePlayTrack = (e, track) => {
    e.preventDefault();
    if (whichPlayer !== "premium") {
      setCurrentlyPlaying(track);
    } else {
      console.log(track.uri);
      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${oauthToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [track.uri], position_ms: 0 }),
      };
      fetch("https://api.spotify.com/v1/me/player/play", options)
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });
    }
  };

  let player = null;
  if (whichPlayer) {
    if (whichPlayer !== "premium") {
      player = <Player currentlyPlaying={currentlyPlaying} />;
    } else {
      player = (
        <SpotifyPlayer
          currentlyPlaying={currentlyPlaying}
          oauthToken={oauthToken}
        />
      );
    }
  }

  return (
    <>
      <div>
        <div className="row row-cols-2">
          <div className="col">
            {userProfile && <UserProfile userProfileInfo={userProfile} />}
          </div>
          <div className="col">{userProfile && player}</div>
        </div>
        {topSongs && (
          <TopSongs
            playTrack={handlePlayTrack}
            userTopTracks={topSongs}
            timeRange={trackTimeRange}
            setTimeRange={setTrackTerm}
          />
        )}
        {topArtists && (
          <TopArtists
            userTopArtists={topArtists}
            timeRange={artistTimeRange}
            setTimeRange={setArtistTerm}
          />
        )}
      </div>
    </>
  );
}

const UserProfile = ({ userProfileInfo }) => {
  return (
    <>
      <div class="card mb-3" style={{ maxWidth: "540px" }}>
        <div class="row g-0">
          <div class="col-md-8">
            <div class="card-body">
              <div class="col-md-4">
                {userProfileInfo.image.length > 0 && (
                  <img
                    src={`${userProfileInfo.image[0]}`}
                    class="img-fluid rounded-start"
                    alt="..."
                  />
                )}
              </div>
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
            autoPlay
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

const TRACK = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

const SpotifyPlayer = ({ currentlyPlaying, oauthToken }) => {
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(TRACK);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(oauthToken);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        const options = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${oauthToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ device_ids: [device_id] }),
        };
        fetch("https://api.spotify.com/v1/me/player", options)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          });
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, []);
  console.log(current_track);

  if (!is_active) {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <b>
              {" "}
              Instance not active. Transfer your playback using your Spotify app{" "}
            </b>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <img
              src={current_track.album.images[0].url}
              className="now-playing__cover"
              alt=""
            />

            <div className="now-playing__side">
              <div className="now-playing__name">{current_track.name}</div>
              <div className="now-playing__artist">
                {current_track.artists[0].name}
              </div>
              <button
                className="btn-spotify"
                onClick={() => {
                  player.togglePlay();
                }}
              >
                {is_paused ? "PLAY" : "PAUSE"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
};

const TopSongs = ({ userTopTracks, playTrack, timeRange, setTimeRange }) => {
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
        Top Listened to Tracks in the{" "}
        <TimeSpentSelector time={timeRange} setTimeRange={setTimeRange} />
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

const TopArtists = ({ userTopArtists, timeRange, setTimeRange }) => {
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
        Top Listened to Artists in the{" "}
        <TimeSpentSelector time={timeRange} setTimeRange={setTimeRange} />
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

const TimeSpentSelector = ({ time, setTimeRange }) => {
  const periods = ["long term", "medium term", "short term"];

  const handleClick = (e) => {
    e.preventDefault();
    const term = e.target.innerText.split(" ").join("_");
    setTimeRange(term);
  };

  const dropdown = periods.map((period) => {
    if (time.split("_").join(" ") !== period) {
      return (
        <li onClick={handleClick}>
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
        {time.split("_").join(" ")}
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
