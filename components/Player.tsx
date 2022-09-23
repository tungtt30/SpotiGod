import React from "react";
import {
  AdjustmentsHorizontalIcon,
  PauseIcon,
  PlayIcon,
  FaceSmileIcon,
  RectangleGroupIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/solid";
import useSpotify from "./hooks/useSpotify";
import { useSongContext } from "../contexts/SongContext";
import { SongReducerActionType } from "../types";
import Image from "next/image";

const isPlaying = false;

const Player = () => {
  const {
    songContextState: { isPlaying, selectedSong },
    dispatch,
  } = useSongContext();
  const spotifyApi = useSpotify();
  const handlePlayPause = async () => {
    const response = await spotifyApi.getMyCurrentPlaybackState();
    if (!response.body) return;
    if (response.body.is_playing) {
      await spotifyApi.pause();
      dispatch({
        type: SongReducerActionType.ToggleIsPlaying,
        payload: false,
      });
    } else {
      await spotifyApi.play();
      dispatch({
        type: SongReducerActionType.ToggleIsPlaying,
        payload: true,
      });
    }
  };

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-800 grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        {selectedSong && (
          <>
            <div className="hidden md:block">
              {" "}
              <Image
                src={selectedSong.album.images[0].url}
                alt={`${selectedSong.name}`}
                height="40px"
                width="40px"
              />
            </div>
            <div>
              <h3>{selectedSong.name}</h3>
              <p>{selectedSong.artists[0].name}</p>
            </div>
          </>
        )}
      </div>

      {/* icon */}
      <div className="flex justify-evenly items-center">
        <AdjustmentsHorizontalIcon className="icon-playback" />
        <AdjustmentsHorizontalIcon className="icon-playback" />
        {isPlaying ? (
          <PauseIcon className="icon-playback" onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="icon-playback" onClick={handlePlayPause} />
        )}
        <FaceSmileIcon className="icon-playback" />
        <RectangleGroupIcon className="icon-playback" />
      </div>

      {/* right */}
      <div className="flex justify-end items-center pr-5 space-x-3 md:space-x-4">
        <ViewColumnsIcon className="icon-playback" />
        <input type="range" min={0} max={100} className="w-20 md:w-auto" />
      </div>
    </div>
  );
};

export default Player;
