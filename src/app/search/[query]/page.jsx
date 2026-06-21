"use client";
import SwiperLayout from "@/components/Homepage/Swiper";
import SongCard from "@/components/Homepage/SongCard";
import { getSearchedData, getSongData, getYtSearchedData } from "@/services/dataAPI";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SwiperSlide } from "swiper/react";
import { BsPlayFill, BsYoutube, BsMusicNoteBeamed, BsVolumeUpFill } from "react-icons/bs";
import { playPause, setActiveSong, setFullScreen } from "@/redux/features/playerSlice";
import Image from "next/image";
import Link from "next/link";
import SongListSkeleton from "@/components/SongListSkeleton";
import { setProgress } from "@/redux/features/loadingBarSlice";

const Page = ({ params }) => {
  const dispatch = useDispatch();
  const [query] = useState(params.query);
  const [searchedData, setSearchedData] = useState(null);
  const [youtubeResults, setYoutubeResults] = useState(null);
  const [loadingJiosaavn, setLoadingJiosaavn] = useState(true);
  const [loadingYoutube, setLoadingYoutube] = useState(true);
  const { activeSong, currentSongs, isPlaying } = useSelector((state) => state.player || {});
  const [playingSongId, setPlayingSongId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingJiosaavn(true);
      dispatch(setProgress(70));
      const response = await getSearchedData(query);
      setSearchedData(response);
      setLoadingJiosaavn(false);
      dispatch(setProgress(100));
    };
    fetchData();
  }, [query, dispatch]);

  useEffect(() => {
    const fetchYtData = async () => {
      setLoadingYoutube(true);
      dispatch(setProgress(70));
      const response = await getYtSearchedData(query);
      setYoutubeResults(response);
      setLoadingYoutube(false);
      dispatch(setProgress(100));
    };
    fetchYtData();
  }, [query, dispatch]);

  const handlePlayClick = async (song) => {
    if (song?.type === "song") {
      try {
        setPlayingSongId(song.id);
        const Data = await getSongData(song?.id);
        const songData = await Data?.[0];
        if (songData) {
          dispatch(
            setActiveSong({
              song: songData,
              data: currentSongs?.find((s) => s?.id === songData?.id)
                ? currentSongs
                : [...currentSongs, songData],
              i: currentSongs?.find((s) => s?.id === songData?.id)
                ? currentSongs?.findIndex((s) => s?.id === songData?.id)
                : currentSongs?.length,
            })
          );
          dispatch(setFullScreen(false));
          dispatch(playPause(true));
        }
      } catch (err) {
        console.error("Failed to load song:", err);
      } finally {
        setPlayingSongId(null);
      }
    }
  };

  const handlePlayVideo = async (item) => {
    try {
      const videoId = item.id.videoId;
      setPlayingSongId(videoId);
  
      // Call the YouTube-to-MP3 conversion API
      const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '43db6998cdmsh2ebabcbb7bfe84ep1865b9jsn0406325a9b5c',
          'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
        }
      };
      
      const response = await fetch(url, options);
      const result = await response.json();
  
      if (result && result.status === 'ok') {
        const mp3Url = result.link;
        const duration = result.duration;
  
        const songData = {
          name: item.snippet.title,
          artists: [
            {
              name: item.snippet.channelTitle
            }
          ],
          url: mp3Url,
          image : [
            {
              "quality": "50x50",
              "url": item.snippet.thumbnails.default.url
            },
            {
              "quality": "150x150",
              "url": item.snippet.thumbnails.medium.url
            },
            {
              "quality": "500x500",
              "url": item.snippet.thumbnails.high.url
            }
          ],
          artist: item.snippet.channelTitle,
          downloadUrl: [
            {
              "quality": "12kbps",
              "url": "https://aac.saavncdn.com/259/8cda4df29a90d73c44cc5b1eafca5cf8_12.mp4"
            },
            {
              "quality": "48kbps",
              "url": "https://aac.saavncdn.com/259/8cda4df29a90d73c44cc5b1eafca5cf8_48.mp4"
            },
            {
              "quality": "96kbps",
              "url": "https://aac.saavncdn.com/259/8cda4df29a90d73c44cc5b1eafca5cf8_96.mp4"
            },
            {
              "quality": "160kbps",
              "url": "https://aac.saavncdn.com/259/8cda4df29a90d73c44cc5b1eafca5cf8_160.mp4"
            },
            {
              "quality": "320kbps",
              "url": mp3Url
            }
          ],
          duration: duration,
          id: videoId,
          isYoutube: true,
          source: "youtube"
        };
  
        dispatch(
          setActiveSong({
            song: songData,
            data: currentSongs?.find((s) => s?.id === songData?.id)
              ? currentSongs
              : [...currentSongs, songData],
            i: currentSongs?.find((s) => s?.id === songData?.id)
              ? currentSongs?.findIndex((s) => s?.id === songData?.id)
              : currentSongs?.length,
          })
        );
        dispatch(setFullScreen(true));
        dispatch(playPause(true));
      } else {
        console.error("Failed to convert YouTube video to MP3");
      }
    } catch (error) {
      console.error("Error converting YouTube video to MP3: ", error);
    } finally {
      setPlayingSongId(null);
    }
  };

  return (
    <div className="w-11/12 lg:w-10/12 m-auto mt-10 pb-24 text-white">
      {/* Background Ambience */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#a855f7]/5 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-[#ec4899]/5 rounded-full blur-[120px] pointer-events-none z-[-1]" />

      {/* Back Button and Query Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <Link href="/search" className="text-[#a855f7] hover:text-[#ec4899] transition-colors text-sm flex items-center gap-2 mb-2 w-fit font-semibold">
            ← Back to Search
          </Link>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Search results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">"{decodeURIComponent(query)}"</span>
          </h1>
        </div>
      </div>

      {/* Dual Column Layout for Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        
        {/* JioSaavn Results Column */}
        <div 
          className="glass-card p-6 lg:p-8 flex flex-col" 
          style={{ 
            border: "1px solid rgba(255,255,255,0.06)", 
            background: "rgba(255,255,255,0.02)",
            borderRadius: "24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            height: "560px"
          }}
        >
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-xl lg:text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <BsMusicNoteBeamed className="text-[#a855f7]" size={20} />
              </div>
              <span>JioSaavn Tracks</span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {loadingJiosaavn ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : searchedData && searchedData?.songs?.results?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {searchedData?.songs?.results?.map((song, index) => {
                  const isActiveSong = activeSong?.id === song.id;
                  const isCurrentPlaying = isActiveSong && isPlaying;
                  return (
                    <div
                      key={index}
                      onClick={() => handlePlayClick(song)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                        isActiveSong
                          ? "bg-white/10 border-[#a855f7]/30 shadow-[0_4px_20px_rgba(168,85,247,0.15)]"
                          : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden group">
                          <img
                            src={song?.image?.[1]?.url || song?.image?.[2]?.url}
                            alt={song?.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <BsPlayFill size={22} className="text-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm lg:text-base font-semibold truncate ${isActiveSong ? "text-[#a855f7]" : "text-white"}`} style={{ color: isActiveSong ? "var(--accent-primary)" : "#fff" }}>
                            {song?.title?.replace("&#039;", "'")?.replace("&amp;", "&")}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {song?.primaryArtists || 'Various Artists'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center shrink-0 ml-4">
                        {playingSongId === song.id ? (
                          <div className="custom-loader w-5 h-5" />
                        ) : isCurrentPlaying ? (
                          <BsVolumeUpFill size={20} className="text-[#a855f7]" style={{ color: "var(--accent-primary)" }} />
                        ) : song?.duration ? (
                          <span className="text-xs text-gray-400 font-medium">
                            {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 py-6 text-center">No songs found for this search query.</p>
            )}
          </div>
        </div>

        {/* YouTube Results Column */}
        <div 
          className="glass-card p-6 lg:p-8 flex flex-col" 
          style={{ 
            border: "1px solid rgba(255,255,255,0.06)", 
            background: "rgba(255,255,255,0.02)",
            borderRadius: "24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            height: "560px"
          }}
        >
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-xl lg:text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <BsYoutube className="text-[#ef4444]" size={20} />
              </div>
              <span>YouTube Video Results</span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {loadingYoutube ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : youtubeResults?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {youtubeResults.map((item, index) => {
                  const isCurrentActive = activeSong?.id === item.id.videoId;
                  return (
                    <div
                      key={index}
                      onClick={() => handlePlayVideo(item)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                        isCurrentActive
                          ? "bg-white/10 border-[#a855f7]/30 shadow-[0_4px_20px_rgba(168,85,247,0.15)]"
                          : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="relative flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden group">
                          <img
                            src={item.snippet.thumbnails.medium.url || item.snippet.thumbnails.default.url}
                            alt={item.snippet.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <BsPlayFill size={22} className="text-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold truncate ${isCurrentActive ? "text-[#a855f7]" : "text-white"}`} style={{ color: isCurrentActive ? "var(--accent-primary)" : "#fff" }}>
                            {item.snippet.title?.replace("&#039;", "'")?.replace("&amp;", "&")}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {item.snippet.channelTitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center shrink-0 ml-4">
                        {playingSongId === item.id.videoId ? (
                          <div className="custom-loader w-5 h-5" />
                        ) : (
                          <BsYoutube size={22} className="text-red-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 py-6 text-center">No YouTube results found.</p>
            )}
          </div>
        </div>

      </div>

      {/* Full-width Swipers below */}
      <div className="space-y-8 mt-12 w-full">
        {/* Albums Swiper */}
        {searchedData?.albums?.results?.length > 0 && (
          <div className="glass-card p-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px" }}>
            <SwiperLayout title={"Albums"}>
              {searchedData.albums.results.map((album) => (
                <SwiperSlide key={album?.id}>
                  <SongCard song={album} />
                </SwiperSlide>
              ))}
            </SwiperLayout>
          </div>
        )}

        {/* Artists Swiper */}
        {searchedData?.artists?.results?.length > 0 && (
          <div className="glass-card p-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px" }}>
            <SwiperLayout title={"Artists"}>
              {searchedData.artists.results.map((artist) => (
                <SwiperSlide key={artist?.id}>
                  <Link href={`/artist/${artist?.id}`}>
                    <div className="flex flex-col justify-center items-center group">
                      <div className="w-32 h-32 relative overflow-hidden rounded-full border-2 border-transparent group-hover:border-[#a855f7] transition-all" style={{ borderColor: "transparent" }}>
                        <Image
                          src={artist?.image?.[2]?.url || artist?.image?.[1]?.url}
                          alt={artist?.title}
                          fill
                          sizes="128px"
                          className="rounded-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-sm font-bold text-white mt-3 truncate w-32 text-center group-hover:text-[#a855f7] transition-colors" style={{ color: "var(--text-main)" }}>
                        {artist?.title?.replace("&amp;", "&")}
                      </p>
                      {artist?.description && (
                        <p className="text-gray-500 truncate text-[10px] w-32 text-center mt-0.5">
                          {artist?.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </SwiperLayout>
          </div>
        )}

        {/* Playlists Swiper */}
        {searchedData?.playlists?.results?.length > 0 && (
          <div className="glass-card p-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px" }}>
            <SwiperLayout title={"Playlists"}>
              {searchedData.playlists.results.map((playlist) => (
                <SwiperSlide key={playlist?.id}>
                  <SongCard song={playlist} />
                </SwiperSlide>
              ))}
            </SwiperLayout>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
