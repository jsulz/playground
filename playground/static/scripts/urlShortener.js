import React from "react";

export default function PlaygroundURLShortener() {
  const urls = [
    { key: "1234", short_url: "https://findtheinvisiblecow.com/" },
    { key: "1235", short_url: "https://www.mapcrunch.com/" },
    { key: "1236", short_url: "https://hackertyper.com/" },
  ];
  return (
    <>
      <UrlShortener />
      <URLs urls={urls} />
    </>
  );
}

const UrlShortener = () => {
  return (
    <div className="col-md-8">
      <form>
        <label className="form-label" for="long_url">
          Short URL
        </label>
        <input
          className="form-control mb-3"
          name="long_url"
          placeholder="Enter a URL to shorten here!"
        />
        <button type="submit" class="btn btn-primary mb-3">
          Get Short URL
        </button>
      </form>
    </div>
  );
};

const URLs = ({ urls }) => {
  const handleCopyClick = async (e, url) => {
    try {
      e.preventDefault();
      const text = document.getElementById("id-" + url.key).textContent;
      await navigator.clipboard.writeText(text);
      const toastLive = document.getElementById("liveToast");
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);
      const toastText = document.getElementById("toasting");
      toastText.textContent = "Copied!";
      toastBootstrap.show();
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleDeleteClick = (url) => {
    const toastLive = document.getElementById("liveToast");
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);
    const toastText = document.getElementById("toasting");
    toastText.textContent = "Deleted!";
    toastBootstrap.show();
  };

  const tableContent = urls.map((url) => {
    return (
      <tr key={url.key}>
        <td>
          <a href={url.short_url} id={`id-${url.key}`}>
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
