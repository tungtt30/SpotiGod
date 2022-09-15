import React from "react";
import { usePlaylistContext } from "../contexts/PlaylistContext";
import Song from "./Song";

const Songs = () => {
  const {
    playlistContextState: { selectedPlaylist },
  } = usePlaylistContext();
  if (!selectedPlaylist) {
    return null;
  }

  let tracks = selectedPlaylist.tracks?.items;

  return (
    <div className="flex flex-col space-y-1 px-8 pb-28">
      {tracks.map((item, index) => {
        return <Song key={item.track?.id} item={item} itemIndex={index} />;
      })}
    </div>
  );
};

export default Songs;
