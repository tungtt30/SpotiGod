import type { NextPage } from "next";
import Head from "next/head";
import Center from "../components/Center";
import Sidebar from "../components/Sidebar";
import PlaylistContextProvider from "../contexts/PlaylistContext";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <PlaylistContextProvider>
        <Head>
          <title>Spotify God</title>
          <meta name="description" content="Spotify for practice" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex">
          <Sidebar />
          <Center />
        </main>
      </PlaylistContextProvider>
    </div>
  );
};

export default Home;
