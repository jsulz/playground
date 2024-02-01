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
          <UrlTable urls={urls} deleteURLs={setURLs} />
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
              <CopyButton url={json} size_class="btn-sm ms-2" />
            </div>
          );
          setMessage(successMessage);
        } else {
          const failureMessage = (
            <div>
              That URL has already been shortened! Here it is:{" "}
              <a href={found.short_url}>{found.short_url}</a>
              <CopyButton url={json} size_class="btn-sm ms-2" />
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
          <div id="messageHelp" className="form-text mb-3">
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

const UrlTable = ({ urls, deleteURLs }) => {
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
          <CopyButton url={url} />
        </td>
        <td>
          <DeleteButton url={url} deleteURLs={deleteURLs} />
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

const CopyButton = ({ url, size_class = "" }) => {
  const handleCopyClick = async (e, url) => {
    try {
      e.stopPropagation();
      await navigator.clipboard.writeText(url.short_url);
      showToast("Copied!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      type="button"
      className={`btn btn-outline-primary ${size_class}`}
      onClick={(e) => handleCopyClick(e, url)}
    >
      <i className="bi bi-clipboard-check"></i>
    </button>
  );
};

const DeleteButton = ({ url, deleteURLs }) => {
  const handleClick = (e) => {
    e.currentTarget.setAttribute("disabled", "");
    const options = {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("/us/" + url.key, options)
      .then((response) => {
        const data = response.json();
        return fetch("/us/all");
      })
      .then((response) => response.json())
      .then((data) => deleteURLs(data));
  };
  return (
    <button
      type="button"
      className="btn btn-outline-primary"
      onClick={handleClick}
    >
      <i className="bi bi-trash3"></i>
    </button>
  );
};

const showToast = (text) => {
  const toastLive = document.getElementById("liveToast");
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);
  const toastText = document.getElementById("toasting");
  toastText.textContent = text;
  toastBootstrap.show();
};
