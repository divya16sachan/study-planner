import React from "react";

const FullSpotifyWidget = ({ playlistId, className }) => {
  return (
    <div className={`spotify-widget ${className}`}>
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}`}
        width="100%"
        height="400"
        frameBorder="0"
        allowTransparency
        allow="encrypted-media"
      ></iframe>
    </div>
  );
};

export default FullSpotifyWidget;
