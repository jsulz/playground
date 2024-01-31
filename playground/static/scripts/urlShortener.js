import React, { useState, useEffect } from "react";

export default function PlaygroundURLShortener() {
  const [urls, setURLs] = useState(null);

  useEffect(() => {
    fetch("/us/all")
      .then((response) => response.json())
      .then((json) => setURLs(json));
  }, []);

  const divStyle = {
    width: "3rem",
    height: "3rem",
    textAlign: "center",
  };

  return (
    <>
      {urls ? (
        <>
          <UrlShortener urls={urls} updateURLs={setURLs} />
          <UrlTable urls={urls} />
        </>
      ) : (
        <>
          <UrlShortener />
          <div
            style={divStyle}
            class="text-center spinner-border text-primary"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </>
      )}
    </>
  );
}

const UrlShortener = ({ urls, updateURLs }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJSON = Object.fromEntries(formData);
    const options = {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formJSON),
    };
    fetch("/us/shorten", options)
      .then((response) => response.json())
      .then((json) => {
        const found = urls.find((url) => url.key === json.key);
        showToast("URL Added!");
        if (!found) {
          updateURLs([json].concat(urls));
        }
      });
  };
  return (
    <div className="col-md-8">
      <form onSubmit={handleSubmit}>
        <label className="form-label" for="url">
          Short URL
        </label>
        <input
          className="form-control mb-3"
          name="url"
          placeholder="Enter a URL to shorten here!"
        />
        <button type="submit" class="btn btn-primary mb-3">
          Get Short URL
        </button>
      </form>
    </div>
  );
};

const UrlTable = ({ urls }) => {
  const handleCopyClick = async (e, url) => {
    try {
      e.preventDefault();
      const text = document.getElementById("id-" + url.key).textContent;
      await navigator.clipboard.writeText(text);
      showToast("Copied!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleDeleteClick = (url) => {
    showToast("Deleted!");
  };

  const tableContent = urls.map((url) => {
    return (
      <tr key={url.key}>
        <td>
          <a href={url.short_url} id={`id-${url.key}`} title={url.long_url}>
            {url.short_url}
          </a>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={(e) => handleCopyClick(e, url)}
          >
            <i class="bi bi-clipboard-check"></i>
          </button>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => handleDeleteClick(url)}
          >
            <i class="bi bi-trash3"></i>
          </button>
        </td>
      </tr>
    );
  });

  return (
    <table className="table">
      <thead>
        <tr>
          <th>URL</th>
          <th>Copy</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>{tableContent}</tbody>
    </table>
  );
};

const showToast = (text) => {
  const toastLive = document.getElementById("liveToast");
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);
  const toastText = document.getElementById("toasting");
  toastText.textContent = text;
  toastBootstrap.show();
};
