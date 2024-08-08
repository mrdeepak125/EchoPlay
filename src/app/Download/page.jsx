"use client";
import SongsList from "@/components/SongsList";
import { getFavourite, getSongData } from "@/services/dataAPI";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { get, keys, del } from "idb-keyval";

const Page = () => {
  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [savedSongs, setSavedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingSong, setPlayingSong] = useState(null);
  const { status } = useSession();

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      const res = await getFavourite();
      if (res?.length > 0) {
        const favorites = await getSongData(res);
        setFavouriteSongs(favorites?.reverse());
      }
      setLoading(false);
    };

    const fetchSavedSongs = async () => {
      const keysList = await keys();
      const songs = await Promise.all(keysList.map((key) => get(key)));
      setSavedSongs(songs.reverse());
    };

    fetchFavorites();
    fetchSavedSongs();
  }, []);

  const handlePlaySong = (song) => {
    setPlayingSong(song);
  };

  const handleDeleteSong = async (songId) => {
    await del(songId);
    setSavedSongs((prevSongs) =>
      prevSongs.filter((song) => song.id !== songId)
    );
  };

  // Redirect if user is not authenticated
  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <span className="loader"></span>
      </div>
    );
  }
  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="mx-auto relative flex flex-col w-11/12 text-white min-h-screen">
      <h2 className="text-3xl font-semibold mt-10">Download Songs</h2>
      {savedSongs.length <= 0 ? (
        <h1 className="text-xl font-semibold mt-10">No Saved Songs</h1>
      ) : (
        <SongsList
          SongData={savedSongs}
          onPlay={handlePlaySong}
          onDelete={handleDeleteSong}
          loading={loading}
          song={playingSong}
        />
      )}
    </div>
  );
};

export default Page;
