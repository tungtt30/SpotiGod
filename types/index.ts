import { User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Dispatch } from "react";

export enum TokenError {
  RefeshAccessTokenError = "RefeshAccessTokenError",
}
export interface ExtendedToken extends JWT {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  user: User;
  error?: TokenError;
}

export interface ExtendedSession extends Session {
  accessToken: ExtendedToken["accessToken"];
  error: ExtendedToken["error"];
}

export interface PlaylistContextState {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  selectedPlaylistId: string | null;
  selectedPlaylist: SpotifyApi.SinglePlaylistResponse | null;
}
export interface IPlaylistContexts {
  playlistContextState: PlaylistContextState;
  updatePlaylistContextState: (
    updatedObj: Partial<PlaylistContextState>
  ) => void;
}

export interface SongContextState {
  selectedSongId?: string;
  selectedSong: any | null;
  isPlaying: boolean;
  volume: number;
  deviceId: string | null;
}

export interface ISongContext {
  songContextState: SongContextState;
  dispatch: Dispatch<SongReducerAction>;
}
export enum SongReducerActionType {
  SetDevice = "SetDevice",
  ToggleIsPlaying = "ToggleIsPlaying",
}

export type SongReducerAction =
  | {
      type: SongReducerActionType.SetDevice;
      payload: Pick<SongContextState, "deviceId" | "volume">;
    }
  | {
      type: SongReducerActionType.ToggleIsPlaying;
      payload: boolean;
    };
