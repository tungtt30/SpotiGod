import React from "react";
import {
  HomeIcon,
  HeartIcon,
  BuildingLibraryIcon,
  PlusCircleIcon,
  RssIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import IconButton from "./IconButton";
import { usePlaylistContext } from "../contexts/PlaylistContext";
import useSpotify from "./hooks/useSpotify";

const Divider = () => <hr className="border-t-[0.1px] border-gray-900" />;

const Sidebar = () => {
  const spotifyApi = useSpotify();

  const {
    playlistContextState: { playlists },
    updatePlaylistContextState,
  } = usePlaylistContext();

  const setSelectedPlaylist = async (id: string) => {
    const playlistResponse = await spotifyApi.getPlaylist(id);
    updatePlaylistContextState({
      selectedPlaylistId: id,
      selectedPlaylist: playlistResponse.body,
    });
  };
  return (
    <div className="text-gray-500 px-5 pt-5 pb-36 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hidden  sm:max-w-[12rem] lg:max-w-[15rem] hidden md:block ">
      <div className="space-y-4">
        <IconButton icon={HomeIcon} label="Home" />
        <IconButton icon={MagnifyingGlassIcon} label="Search" />
        <IconButton icon={HeartIcon} label="Liked Songs" />
        <IconButton icon={BuildingLibraryIcon} label="Library" />
        <Divider />
        <IconButton icon={PlusCircleIcon} label="Create Playlist" />
        <IconButton icon={RssIcon} label="Your episode" />
        <Divider />
        {playlists.map(({ id, name }) => {
          return (
            <p
              key={id}
              onClick={() => setSelectedPlaylist(id)}
              className="cursor-pointer hover:text-white"
            >
              {name}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
