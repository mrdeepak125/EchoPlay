'use client';
import SongsList from '@/components/SongsList';
import { getSongData } from '@/services/dataAPI';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { getSinglePlaylist } from '@/services/playlistApi';
import { BsPlayFill, BsFillPlayFill } from "react-icons/bs";
import { MdOutlineFileDownload, MdLibraryMusic } from "react-icons/md";
import { useDispatch } from "react-redux";
import { playPause, setActiveSong } from "@/redux/features/playerSlice";
import { set } from "idb-keyval";
import { toast } from "react-hot-toast";

const page = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState({});
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState("");
  const { status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPlaylistSongs = async () => {
      setLoading(true);
      const res = await getSinglePlaylist(params.playlistId);
      if (res?.success === true) {
        setPlaylist(res?.data);
        if (res?.data?.songs?.length > 0) {
          const newSongs = await getSongData(res?.data?.songs);
          setSongs(newSongs?.reverse() || []);
        }
      }
      setLoading(false);
    };
    if (status === 'authenticated') {
      fetchPlaylistSongs();
    }
  }, [params.playlistId, status]);

  // redirect if user is authenticated
  if (status === 'loading') {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <span className="loader"></span>
      </div>
    );
  }
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  const handlePlayClick = () => {
    if (songs.length > 0) {
      dispatch(setActiveSong({ song: songs[0], data: songs, i: 0 }));
      dispatch(playPause(true));
    }
  };

  const handleDownloadAll = async () => {
    if (!songs || songs.length === 0) return;
    
    setDownloading(true);
    setDownloadProgress("Preparing...");
    toast.success(`Starting download of ${songs.length} songs`);

    try {
      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const currentTrackNum = i + 1;
        setDownloadProgress(`Song ${currentTrackNum}/${songs.length} (0%)`);

        // Use the highest quality download URL
        const songUrl = song.downloadUrl?.[4]?.url || song.downloadUrl?.[3]?.url || song.downloadUrl?.[2]?.url;
        if (!songUrl) {
          console.warn(`No download URL for song: ${song.name}`);
          continue;
        }

        const filename = `${song.name?.replace(/&#039;/g, "'")?.replace(/&amp;/g, "&")}.mp3`;

        const response = await fetch(songUrl);
        if (!response.ok) throw new Error(`Failed to fetch song: ${song.name}`);

        const contentLength = Number(response.headers.get("Content-Length"));
        const reader = response.body?.getReader();
        if (!reader) throw new Error(`Unable to read song streams`);

        let receivedLength = 0;
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedLength += value.length;

          if (contentLength) {
            const percent = Math.round((receivedLength / contentLength) * 100);
            setDownloadProgress(`Song ${currentTrackNum}/${songs.length} (${percent}%)`);
          }
        }

        const blob = new Blob(chunks, { type: "audio/mpeg" });
        const arrayBuf = await blob.arrayBuffer();

        // Save to IndexedDB for offline play
        const songData = {
          ...song,
          audioData: arrayBuf,
          isDownloaded: true,
        };
        await set(song.id, songData);

        // Prompt local file download
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }
      toast.success("All songs downloaded successfully!");
    } catch (err) {
      console.error("Batch download error:", err);
      toast.error("An error occurred during downloading");
    } finally {
      setDownloading(false);
      setDownloadProgress("");
    }
  };

  return (
    <div className="w-11/12 lg:w-9/12 m-auto mt-10 pb-32">
      {/* Premium Playlist Header Card */}
      <div 
        className="glass-card p-6 lg:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Subtle blur cover background using first song's image if available */}
        {!loading && songs?.[0]?.image?.[2]?.url && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-10 blur-3xl scale-125"
            style={{
              backgroundImage: `url(${songs[0].image[2].url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: -1,
            }}
          />
        )}

        {/* Playlist Cover Art */}
        <div className="relative group w-[260px] h-[260px] flex-shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.4)] bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
          {loading ? (
            <div className="w-full h-full bg-white/5 animate-pulse" />
          ) : songs?.[0]?.image?.[2]?.url ? (
            <img
              className="object-cover w-full h-full"
              src={songs[0].image[2].url}
              alt={playlist?.name}
            />
          ) : (
            <MdLibraryMusic className="text-[var(--accent-primary)] text-8xl" style={{ color: 'var(--accent-primary)' }} />
          )}
        </div>

        {/* Playlist Details & Actions */}
        <div className="flex-1 text-center md:text-left text-gray-100 flex flex-col gap-3">
          {loading ? (
            <div className="space-y-4">
              <div className="h-8 bg-white/5 rounded-lg w-2/3 animate-pulse" />
              <div className="h-5 bg-white/5 rounded-lg w-1/2 animate-pulse" />
              <div className="h-5 bg-white/5 rounded-lg w-1/3 animate-pulse" />
            </div>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-[#a855f7]" style={{ color: "var(--accent-primary)" }}>User Playlist</p>
              <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight">
                {playlist?.name}
              </h1>
              <p className="text-sm text-gray-400 font-medium">
                Personal collection • {songs?.length || 0} song{songs?.length !== 1 ? 's' : ''}
              </p>

              {/* Action row */}
              <div className="flex items-center gap-3 mt-6 justify-center md:justify-start flex-wrap">
                {songs.length > 0 && (
                  <button
                    onClick={handlePlayClick}
                    className="accent-btn flex items-center gap-2"
                    style={{ borderRadius: "20px", padding: "10px 24px" }}
                  >
                    <BsFillPlayFill size={22} />
                    <span>Play Playlist</span>
                  </button>
                )}

                {songs.length > 0 && (
                  <button
                    onClick={handleDownloadAll}
                    disabled={downloading}
                    className="glass-btn flex items-center gap-2 hover:border-[#a855f7]/30"
                    style={{ borderRadius: "20px", padding: "10px 24px" }}
                  >
                    {downloading ? (
                      <>
                        <div className="custom-loader w-4 h-4" />
                        <span className="text-xs">{downloadProgress}</span>
                      </>
                    ) : (
                      <>
                        <MdOutlineFileDownload size={20} />
                        <span>Download All</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Songs List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-2">
          <MdLibraryMusic className="text-[#a855f7]" style={{ color: "var(--accent-primary)" }} />
          <span>Playlist Tracks</span>
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-14 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="glass-card-flat p-10 text-center text-gray-400">
            <p className="text-lg font-semibold mb-2">Playlist is Empty</p>
            <p className="text-sm">Search and add some tracks to start building your collection.</p>
          </div>
        ) : (
          <SongsList 
            SongData={songs} 
            loading={false} 
            playlistID={playlist?._id} 
            isUserPlaylist={true} 
            setSongs={setSongs} 
          />
        )}
      </div>
    </div>
  );
};

export default page;