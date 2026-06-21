"use client";
import { setProgress } from "@/redux/features/loadingBarSlice";
import { playPause, setActiveSong } from "@/redux/features/playerSlice";
import { getAlbumData } from "@/services/dataAPI";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsPlayFill, BsFillPlayFill } from "react-icons/bs";
import { MdOutlineFileDownload, MdOutlineFileDownloadDone, MdLibraryMusic } from "react-icons/md";
import { useDispatch } from "react-redux";
import { set } from "idb-keyval";
import { toast } from "react-hot-toast";

const Page = ({ params }) => {
  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setProgress(50));
      const response = await getAlbumData(params.albumId);
      dispatch(setProgress(100));
      setAlbumData(response);
      setLoading(false);
    };
    fetchData();
  }, [params.albumId, dispatch]);

  function formatDuration(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.round(durationInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const handlePlayClick = (song, index) => {
    dispatch(setActiveSong({ song, data: albumData?.songs, i: index }));
    dispatch(playPause(true));
  };

  const handleDownloadAll = async () => {
    if (!albumData?.songs || albumData.songs.length === 0) return;
    
    setDownloading(true);
    setDownloadProgress("Preparing...");
    toast.success(`Starting download of ${albumData.songs.length} songs`);

    try {
      for (let i = 0; i < albumData.songs.length; i++) {
        const song = albumData.songs[i];
        const currentTrackNum = i + 1;
        setDownloadProgress(`Song ${currentTrackNum}/${albumData.songs.length} (0%)`);

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
            setDownloadProgress(`Song ${currentTrackNum}/${albumData.songs.length} (${percent}%)`);
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
    <div className="w-11/12 lg:w-9/12 m-auto mt-10 pb-24">
      {/* Premium Album Header Card */}
      <div 
        className="glass-card p-6 lg:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Subtle blur cover background */}
        {!loading && albumData?.image?.[2]?.url && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-10 blur-3xl scale-125"
            style={{
              backgroundImage: `url(${albumData.image[2].url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: -1,
            }}
          />
        )}

        {/* Album Artwork */}
        {loading ? (
          <div className="w-[260px] h-[260px] rounded-2xl bg-white/5 animate-pulse flex-shrink-0" />
        ) : (
          <div className="relative group w-[260px] h-[260px] flex-shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <img
              className="rounded-2xl object-cover w-full h-full border border-white/10"
              src={albumData?.image?.[2]?.url}
              alt={albumData?.name}
            />
          </div>
        )}

        {/* Album Metadata & Action Buttons */}
        <div className="flex-1 text-center md:text-left text-gray-100 flex flex-col gap-3">
          {loading ? (
            <div className="space-y-4">
              <div className="h-8 bg-white/5 rounded-lg w-2/3 animate-pulse" />
              <div className="h-5 bg-white/5 rounded-lg w-1/2 animate-pulse" />
              <div className="h-5 bg-white/5 rounded-lg w-1/3 animate-pulse" />
            </div>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-[#a855f7]">Album</p>
              <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight">
                {albumData?.name?.replace("&amp;", "&")}
              </h1>
              <h2 className="text-base text-gray-400 font-medium">
                {albumData?.subtitle}
              </h2>
              
              <h3 className="text-sm font-semibold text-gray-300">
                By:{" "}
                {albumData?.primaryArtists?.split(",")?.map((artist, index) => (
                  <React.Fragment key={index}>
                    <Link
                      className="hover:underline text-[#a855f7]"
                      style={{ color: "var(--accent-primary)" }}
                      href={`/artist/${albumData?.primaryArtistsId?.split(",")?.[index]?.trim()}`}
                    >
                      {artist?.trim()?.replaceAll("&amp;", "&")}
                    </Link>
                    {index < albumData.primaryArtists.split(",").length - 1 && ", "}
                  </React.Fragment>
                ))}
              </h3>

              <div className="flex items-center gap-3 text-xs text-gray-400 justify-center md:justify-start mt-1">
                <span>📅 {albumData?.year}</span>
                <span>•</span>
                <span>🎵 {albumData?.songCount} songs</span>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-3 mt-6 justify-center md:justify-start flex-wrap">
                <button
                  onClick={() => handlePlayClick(albumData?.songs?.[0], 0)}
                  className="accent-btn flex items-center gap-2"
                  style={{ borderRadius: "20px", padding: "10px 24px" }}
                >
                  <BsFillPlayFill size={22} />
                  <span>Play Album</span>
                </button>

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
              </div>
            </>
          )}
        </div>
      </div>

      {/* Songs Table List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <MdLibraryMusic className="text-[#a855f7]" style={{ color: "var(--accent-primary)" }} />
          <span>Album Tracks</span>
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="h-14 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="glass-card-flat p-2" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)" }}>
            {albumData?.songs?.map((song, index) => (
              <div
                key={song?.id}
                onClick={() => handlePlayClick(song, index)}
                className="flex items-center justify-between p-3.5 rounded-xl cursor-pointer hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group"
              >
                {/* Index & Title */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-400 group-hover:hidden">
                      {index + 1}
                    </span>
                    <BsPlayFill
                      size={20}
                      className="hidden group-hover:block text-white"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm lg:text-base font-semibold text-white truncate">
                      {song?.name?.replace("&#039;", "'")?.replace("&amp;", "&")}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {song?.primaryArtists || "Various Artists"}
                    </p>
                  </div>
                </div>

                {/* Play Counts */}
                <div className="hidden sm:block text-xs text-gray-400 w-32 truncate">
                  {song?.playCount && `${Number(song.playCount).toLocaleString()} plays`}
                </div>

                {/* Duration */}
                <div className="text-xs font-semibold text-gray-400 pl-4">
                  {formatDuration(song?.duration)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
