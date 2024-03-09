import React, { useEffect, useState } from "react";
import {
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  Bar,
} from "recharts";

const currentlyViewing = "Artists";

export default function Spotify() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [topSongs, setTopSongs] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [trackTimeRange, setTrackTerm] = useState("short_term");
  const [artistTimeRange, setArtistTerm] = useState("short_term");
  const [oauthToken, setOauthToken] = useState(null);
  const [whichPlayer, setWhichPlayer] = useState(null);
  const [player, setPlayer] = useState(undefined);
  const [currentlyViewing, setCurrentlyViewing] = useState("Songs");

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
          return response.text();
        })
        .then((data) => {
          setCurrentlyPlaying(track);
        });
    }
  };

  let mediaPlayer = null;
  if (whichPlayer) {
    if (whichPlayer !== "premium") {
      mediaPlayer = <Player currentlyPlaying={currentlyPlaying} />;
    } else {
      mediaPlayer = (
        <SpotifyPlayer
          currentlyPlaying={currentlyPlaying}
          oauthToken={oauthToken}
          player={player}
          setPlayer={setPlayer}
        />
      );
    }
  }

  let table = null;
  if (topSongs && currentlyViewing == "Songs") {
    const popData = topSongs.map((track) => {
      return {
        name: track.name,
        value: track.popularity,
      };
    });
    popData.sort((a, b) => b.value - a.value);
    table = (
      <>
        <TopSongs
          playTrack={handlePlayTrack}
          userTopTracks={topSongs}
          timeRange={trackTimeRange}
          setTimeRange={setTrackTerm}
          currentlyPlaying={currentlyPlaying}
          player={player}
        />
        <HorizontalBarChart data={popData} type={"song"} />
      </>
    );
  } else if (topArtists && currentlyViewing == "Artists") {
    const genres = {};
    topArtists.forEach((artist) => {
      artist.genres.forEach((genre) => {
        if (genre in genres) {
          genres[genre] += 1;
        } else {
          genres[genre] = 1;
        }
      });
    });
    console.log(genres);
    const data = [];
    for (const [key, value] of Object.entries(genres)) {
      data.push({ name: key, value: value });
    }
    data.sort((a, b) => b.value - a.value);
    table = (
      <>
        <TopArtists
          userTopArtists={topArtists}
          timeRange={artistTimeRange}
          setTimeRange={setArtistTerm}
        />
        <HorizontalBarChart data={data} type={"genre"} />
      </>
    );
  }

  return (
    <>
      <div>
        <div className="row row-cols-lg-2 row-cols-1 mb-3">
          <div className="col">
            {userProfile && <UserProfile userProfileInfo={userProfile} />}
          </div>
          <div className="col">{userProfile && mediaPlayer}</div>
        </div>
        <ToggleArtistsSongs
          currentlyViewing={currentlyViewing}
          setCurrentlyViewing={setCurrentlyViewing}
        />
        <div className="row mb-3">{table}</div>
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

const ToggleArtistsSongs = ({ currentlyViewing, setCurrentlyViewing }) => {
  const options = ["Songs", "Artists"];
  const handleChange = (e) => {
    setCurrentlyViewing(e.target.name);
  };
  return (
    <>
      <div
        class="btn-group mb-5 btn-group-lg"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        {options.map((option) => {
          return (
            <>
              <input
                type="radio"
                class="btn-check"
                name={option}
                id={option}
                autocomplete="off"
                onChange={(e) => handleChange(e)}
                checked={currentlyViewing === option}
              />
              <label class="btn btn-outline-primary" htmlFor={option}>
                {option}
              </label>
            </>
          );
        })}
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

const SpotifyPlayer = ({ currentlyPlaying, oauthToken, player, setPlayer }) => {
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
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
          .then((response) => response.text())
          .then((data) => {
            //console.log(data);
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

      player.setName("Playground - Spotify Tastes").then(() => {
        console.log("successfully set name!");
      });

      player.connect();
    };
  }, []);

  const play = <i class="bi bi-play-circle"> Play</i>;
  const pause = <i class="bi bi-pause-circle"> Pause</i>;

  // sort the images so the smallest one is first
  if (is_active) {
    current_track.album.images.sort((a, b) => a.height - b.height);
  }

  if (!is_active) {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <b>
              {" "}
              Instance not active. Wait one moment while we switch to this
              device.{" "}
            </b>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="card mb-3" style={{ maxWidth: "540px" }}>
          <div className="card-body row row-cols-lg-2 row-cols-1 g-2">
            <div className="col col-lg-3">
              <img
                src={current_track.album.images[0].url}
                className="now-playing__cover"
                alt=""
              />
            </div>
            <div className="col col-lg-9">
              <h5 className="card-title">Now Playing: {current_track.name}</h5>
              <p className="card-text">
                <small className="text-body-secondary">
                  By: {current_track.artists[0].name}
                </small>
                <br />
                <button
                  className="btn-spotify btn btn-primary mt-2"
                  onClick={() => {
                    player.togglePlay();
                  }}
                >
                  {is_paused ? play : pause}
                </button>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
};

const TopSongs = ({
  userTopTracks,
  playTrack,
  timeRange,
  setTimeRange,
  currentlyPlaying,
  player,
}) => {
  const durationTransform = (duration_ms) => {
    const duration_s = ~~(duration_ms / 1000);
    const minutes = Math.floor(duration_s / 60);
    let remainder_s = duration_s % 60;
    if (remainder_s < 10) {
      remainder_s = "0" + remainder_s;
    }
    return `${minutes}:${remainder_s}`;
  };

  const handleTableButtonClick = (e, track) => {
    if (currentlyPlaying && track.name == currentlyPlaying.name) {
      player.togglePlay();
    } else {
      playTrack(e, track);
    }
  };

  const trs = userTopTracks.map((track) => {
    let icon = null;
    const play = <i class="bi bi-play-circle"></i>;
    const pause = <i class="bi bi-pause-circle"></i>;
    if (currentlyPlaying) {
      icon = track.name === currentlyPlaying.name ? pause : play;
    } else {
      icon = play;
    }

    return (
      <tr key={track.preview_url}>
        <td>
          <img src={track.album.image} />
        </td>
        <td>
          {track.name} <br />{" "}
          <small>Artist(s): {track.artists.join(", ")}</small>
        </td>
        <td>{track.album.name}</td>
        <td>{track.album.release_date}</td>
        <td>{durationTransform(track.duration)}</td>
        <td>
          <button
            onClick={(e) => handleTableButtonClick(e, track)}
            type="button"
            class="btn btn-secondary"
          >
            {icon}
          </button>
        </td>
      </tr>
    );
  });
  const th_data = [
    "",
    "Track",
    "Album",
    "Date Released",
    "Length",
    "Play Audio",
  ];
  return (
    <>
      <h2>
        Top Listened to Tracks in the{" "}
        <TimeSpentSelector time={timeRange} setTimeRange={setTimeRange} />
      </h2>
      <DataTable trs={trs} th_data={th_data} />
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
  const th_data = ["", "Name", "Genres", "Followers", "Popularity"];
  return (
    <>
      <h2>
        Top Listened to Artists in the{" "}
        <TimeSpentSelector time={timeRange} setTimeRange={setTimeRange} />
      </h2>
      <DataTable trs={trs} th_data={th_data} />
    </>
  );
};

const DataTable = ({ trs, th_data }) => {
  const ths = th_data.map((th) => <th>{th}</th>);
  return (
    <div className="table-responsive-md">
      <table className="table table-dark rounded-3 overflow-hidden">
        <thead>
          <tr>{ths}</tr>
        </thead>
        <tbody>{trs}</tbody>
      </table>
    </div>
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
        class="btn btn-outline-primary dropdown-toggle"
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

const HorizontalBarChart = ({ data, type }) => {
  let label = undefined;
  if (type == "song") {
    label = "Popularity";
  } else {
    label = "Genre Count";
  }
  console.log(data);
  return (
    <>
      <h2>{type} Popularity</h2>
      <ResponsiveContainer width="100%" height={1200}>
        <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
          <XAxis dataKey="value" type="number" />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value, name, props) => [value, label, props]} />
          <Legend formatter={(name) => label} />
          <Bar dataKey="value" fill="#b81d24" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};
