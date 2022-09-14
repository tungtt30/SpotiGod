import { Session } from "inspector";
import NextAuth, { CallbacksOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { scopes, spotifyApi } from "../../../config/spotify";
import { ExtendedToken, TokenError } from "../../../types";

const refeshAccessToken = async (
  token: ExtendedToken
): Promise<ExtendedToken> => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    const { body: refeshAccessToken } = await spotifyApi.refreshAccessToken();
    return {
      ...token,
      accessToken: refeshAccessToken.access_token,
      refreshToken: refeshAccessToken.refresh_token || token.refreshToken,
      accessTokenExpiresAt: Date.now() + refeshAccessToken.expires_in * 1000,
    };
  } catch (error) {
    return {
      ...token,
      error: TokenError.refeshAccessTokenError,
    };
  }
};

const jwtCallback: CallbacksOptions["jwt"] = async ({
  token,
  account,
  user,
}) => {
  //user login for the fisrt time
  let extendedToken: ExtendedToken;
  if (account && user) {
    extendedToken = {
      ...token,
      user,
      accessToken: account.access_token as string,
      refreshToken: account.refresh_token as string,
      accessTokenExpiresAt: (account.expires_at as number) * 1000, //converted to ms
    };

    return extendedToken;
  }
  // subsequen reques to check auth sessions
  if (Date.now() + 5000 < (token as ExtendedToken).accessTokenExpiresAt) {
    return token;
  }
  // access token has expired, refresh it
  return await refeshAccessToken(token as ExtendedToken);
};

const sessionCallback: CallbacksOptions["session"] = async ({
  session,
  token,
}) => {
  session.accessToken = (token as ExtendedToken).accessToken;
  session.error = (token as ExtendedToken).error;
  return session;
};

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: scopes,
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
});
