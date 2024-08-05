"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { get, keys } from "idb-keyval";
import { setProgress } from "@/redux/features/loadingBarSlice";
import { playPause, setActiveSong } from "@/redux/features/playerSlice";
// import Download from "@/components/Download";
// import SongPlayer from "@/components/SongPlayer";
import Link from "next/link";
import { BsPlayFill, BsFillPlayFill } from "react-icons/bs";

const Page = ({ params }) => {
  const [savedSongs, setSavedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { status } = useSession();
  const [playingSong, setPlayingSong] = useState(null);

  useEffect(() => {
    const fetchSavedSongs = async () => {
      setLoading(true);
      const keysList = await keys();
      const songs = await Promise.all(keysList.map(key => get(key)));
      setSavedSongs(songs.reverse());
      setLoading(false);
    };

    fetchSavedSongs();
  }, []);

  const handlePlayClick = (song, index) => {
    dispatch(setActiveSong({ song, data: savedSongs, i: index }));
    dispatch(playPause(true));
  };

  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.round(durationInSeconds % 60);

    return minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, "0")}` : `${seconds}`;
  };

  if (status === 'loading') {
    return <div className='w-screen h-screen flex justify-center items-center'>
      <span className="loader"></span>
    </div>;
  }
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  return (
    <div className='mx-auto relative flex flex-col w-11/12 text-white min-h-screen'>
      <h1 className='text-6xl font-semibold mt-10'>Saved Songs</h1>
      {savedSongs.length <= 0 && !loading ? (
        <h1 className='text-xl font-semibold mt-10'>No Saved Songs</h1>
      ) : (
        savedSongs.map((song, index) => (
          <div
            key={song.id}
            onClick={() => handlePlayClick(song, index)}
            className="flex items-center mt-5 cursor-pointer group border-b-[1px] border-gray-400 justify-between"
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-10 h-10" />
                <p className="group-hover:hidden font-extrabold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-200">
                  {index + 1}.
                </p>
                <BsPlayFill
                  size={25}
                  className="group-hover:block hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-200"
                />
              </div>
              <div className="w-32 lg:w-80">
                <p className="text-sm lg:text-lg font-semibold truncate">
                  {song.name.replace("&#039;", "'").replace("&amp;", "&")}
                </p>
              </div>
            </div>
            <div className="hidden lg:block w-28">
              {song.playCount && (
                <p className="text-gray-400">{song.playCount} plays</p>
              )}
            </div>
            <div>
              <p>{formatDuration(song.duration)}</p>
            </div>
          </div>
        ))
      )}
      {/* <SongPlayer song={playingSong} /> */}
    </div>
  );
};

export default Page;
