import React from "react";

const FullSpotifyWidget = ({ playlistId }) => {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}`}
        width="100%"
        height="400"
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
    </div>
  );
};

export default FullSpotifyWidget;
