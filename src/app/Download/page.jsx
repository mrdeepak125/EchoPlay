"use client";
import SongsList from "@/components/SongsList";
import React, { useEffect, useState } from "react";
import { get, keys, del } from "idb-keyval";
import GetAppIcon from "@mui/icons-material/GetApp";

const Page = () => {
  const [savedSongs, setSavedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingSong, setPlayingSong] = useState(null);

  useEffect(() => {
    const fetchSavedSongs = async () => {
      try {
        setLoading(true);
        const keysList = await keys();
        const songs = await Promise.all(keysList.map((key) => get(key)));
        // Filter out items that are not valid song structures
        const validSongs = songs.filter(s => s && s.id && s.isDownloaded);
        setSavedSongs(validSongs.reverse());
      } catch (err) {
        console.error("Error reading IndexedDB:", err);
      } finally {
        setLoading(false);
      }
    };

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

  return (
    <div className="mx-auto relative flex flex-col w-11/12 lg:w-9/12 text-white min-h-screen pb-24">
      <div className="flex items-center gap-3 mt-10 mb-6">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            boxShadow: "0 8px 20px rgba(168, 85, 247, 0.3)"
          }}
        >
          <GetAppIcon className="text-white" style={{ fontSize: "28px" }} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold">Downloaded Songs</h1>
          <p className="text-sm text-gray-400">Offline playback ready</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loader"></span>
        </div>
      ) : savedSongs.length <= 0 ? (
        <div className="glass-card p-12 text-center mt-6" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-xl text-gray-400 mb-2">No Saved Songs</p>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Tracks you download will be stored locally in your browser so you can listen to them even when offline.
          </p>
        </div>
      ) : (
        <div className="glass-card-flat p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SongsList
            SongData={savedSongs}
            onPlay={handlePlaySong}
            onDelete={handleDeleteSong}
            loading={loading}
            song={playingSong}
            isDownloadSection={true}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
