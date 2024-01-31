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
            className="text-center spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </>
      )}
    </>
  );
}

const UrlShortener = ({ urls, updateURLs }) => {
  const [message, setMessage] = useState(false);

  const handleCopyClick = (e, url) => {
    e.stopPropagation();
    copyText(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJSON = Object.fromEntries(formData);
    e.target[0].value = "";
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
        if (!found) {
          showToast("URL Added!");
          updateURLs([json].concat(urls));
          const successMessage = (
            <div>
              Short URL: <a href={json.short_url}>{json.short_url}</a>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm ms-2"
                onClick={(e) => handleCopyClick(e, json.short_url)}
              >
                <i className="bi bi-clipboard-check"></i>
              </button>
            </div>
          );
          setMessage(successMessage);
        } else {
          const failureMessage = (
            <div>
              That URL has already been shortened! Here it is:{" "}
              <a href={found.short_url}>{found.short_url}</a>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm ms-2"
                onClick={(e) => handleCopyClick(e, json.short_url)}
              >
                <i className="bi bi-clipboard-check"></i>
              </button>
            </div>
          );
          setMessage(failureMessage);
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
        {message && (
          <div id="passwordHelpBlock" className="form-text mb-3">
            {message}
          </div>
        )}
        <button type="submit" className="btn btn-primary mb-3">
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
      copyText(text);
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
            <i className="bi bi-clipboard-check"></i>
          </button>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => handleDeleteClick(url)}
          >
            <i className="bi bi-trash3"></i>
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

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
  showToast("Copied!");
};

const showToast = (text) => {
  const toastLive = document.getElementById("liveToast");
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);
  const toastText = document.getElementById("toasting");
  toastText.textContent = text;
  toastBootstrap.show();
};
