import { createContext, useContext, useEffect, useReducer } from "react";
import {
  SongContextState,
  ISongContext,
  SongReducerActionType,
} from "../types";
import { ReactNode } from "react";
import useSpotify from "../components/hooks/useSpotify";
import { useSession } from "next-auth/react";
import { songReducer } from "../reducers/songReducer";

const defaultSongContextState: SongContextState = {
  selectedSongId: undefined,
  selectedSong: null,
  isPlaying: false,
  volume: 80,
  deviceId: null,
};

export const SongContext = createContext<ISongContext>({
  songContextState: defaultSongContextState,
  dispatch: () => {},
});

export const useSongContext = () => useContext(SongContext);

const SongContextProvider = ({ children }: { children: ReactNode }) => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [songContextState, dispatch] = useReducer(
    songReducer,
    defaultSongContextState
  );

  useEffect(() => {
    const setCurrentDevice = async () => {
      const availableDevicesResponse = await spotifyApi.getMyDevices();
      if (!availableDevicesResponse.body.devices.length) {
        return;
      }
      const { id: deviceId, volume_percent } =
        availableDevicesResponse.body.devices[0];
      dispatch({
        type: SongReducerActionType.SetDevice,
        payload: {
          deviceId,
          volume: volume_percent as number,
        },
      });
      await spotifyApi.transferMyPlayback([deviceId as string]);
    };

    if (spotifyApi.getAccessToken()) {
      setCurrentDevice();
    }
  }, [spotifyApi, session]);

  useEffect(() => {
    const getCurrentPlayingSong = async () => {
      const songInfo = await spotifyApi.getMyCurrentPlayingTrack();
      if (!songInfo.body) return;
      dispatch({
        type: SongReducerActionType.SetCurrentPlayingSong,
        payload: {
          selectedSongId: songInfo.body.item?.id,
          selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull,
          isPlaying: songInfo.body.is_playing,
        },
      });
    };

    if (spotifyApi.getAccessToken()) {
      getCurrentPlayingSong();
    }
  }, [spotifyApi, session]);

  const songContextProviderData: ISongContext = {
    songContextState,
    dispatch,
  };
  return (
    <SongContext.Provider value={songContextProviderData}>
      {children}
    </SongContext.Provider>
  );
};

export default SongContextProvider;
