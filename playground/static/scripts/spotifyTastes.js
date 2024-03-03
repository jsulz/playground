import React, { useEffect, useState } from "react";

const userProfileInfo = {
  display_name: "jsulz",
  email: "j.sulzdorf@gmail.com",
  followers: 0,
  image: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
};

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
  let userTopTracks = null;
  let userTopArtists = null;
  useEffect(() => {}, []);

  return (
    <>
      <div>
        <a href="spotify:album:1q3IaeGzKz13rgMoxXBDEZ" target="_blank">
          test
        </a>
        <UserProfile userProfileInfo={userProfileInfo} />
        <TopSongs />
        <TopArtists />
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
  return (
    <>
      <h2>Top Songs</h2>
    </>
  );
};

const TopArtists = ({ userTopArtists }) => {
  return (
    <>
      <h2>Top Artists</h2>
    </>
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
