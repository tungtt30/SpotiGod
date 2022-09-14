import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { spotifyApi } from "../../config/spotify";
import { ExtendedSession, TokenError } from "../../types";

const useSpotify = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    if (
      (session as ExtendedSession).error === TokenError.RefeshAccessTokenError
    ) {
      signIn();
    }
    spotifyApi.setAccessToken((session as ExtendedSession).accessToken);
  }, [session]);

  return spotifyApi;
};

export default useSpotify;
