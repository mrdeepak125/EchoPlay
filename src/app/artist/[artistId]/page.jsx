"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { SwiperSlide } from "swiper/react";
import SwiperLayout from "@/components/Homepage/Swiper";
import SongCard from "@/components/Homepage/SongCard";
import SongListSkeleton from "@/components/SongListSkeleton";
import SongList from "@/components/SongsList";
import { setProgress } from "@/redux/features/loadingBarSlice";
import { playPause, setActiveSong, setFullScreen } from "@/redux/features/playerSlice";
import {
  getArtistAlbums,
  getArtistData,
  getArtistSongs,
} from "@/services/dataAPI";

// Icons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import LanguageIcon from "@mui/icons-material/Language";
import PeopleIcon from "@mui/icons-material/People";

const Page = ({ params }) => {
  const dispatch = useDispatch();
  const [artistDetails, setArtistDetails] = useState({});
  const [artistSongs, setArtistSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("popularity");
  const observerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      dispatch(setProgress(30));
      const details = await getArtistData(params.artistId);
      dispatch(setProgress(60));
      setArtistDetails(details);
      dispatch(setProgress(90));
      // Reset songs and pagination on sortBy change
      setArtistSongs([]);
      setPageNumber(0);
      setHasMore(true);
      await fetchSongs(0, sortBy);
      const albums = await getArtistAlbums(params.artistId, 1);
      setArtistAlbums(albums?.albums || []);
      dispatch(setProgress(100));
      setLoading(false);
    };
    fetchData();
  }, [sortBy]);

  const fetchSongs = async (page, sort) => {
    try {
      const songs = await getArtistSongs(params.artistId, page, sort);
      if (songs?.songs?.length > 0) {
        setArtistSongs((prevSongs) => {
          // Filter duplicates to prevent react key errors
          const ids = new Set(prevSongs.map(s => s.id));
          const filtered = songs.songs.filter(s => !ids.has(s.id));
          return [...prevSongs, ...filtered];
        });
        if (songs.songs.length < 9) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching songs:", err);
      setHasMore(false);
    }
  };

  useEffect(() => {
    if (!loading && observerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber((prevPage) => prevPage + 1);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(observerRef.current);
      return () => observer.disconnect();
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (pageNumber > 0) {
      fetchSongs(pageNumber, sortBy);
    }
  }, [pageNumber]);

  const handlePlayArtistSongs = () => {
    if (artistSongs?.length > 0) {
      dispatch(setActiveSong({ song: artistSongs[0], data: artistSongs, i: 0 }));
      dispatch(playPause(true));
      dispatch(setFullScreen(true));
    }
  };

  const handleShuffleArtistSongs = () => {
    if (artistSongs?.length > 0) {
      const shuffled = [...artistSongs].sort(() => Math.random() - 0.5);
      dispatch(setActiveSong({ song: shuffled[0], data: shuffled, i: 0 }));
      dispatch(playPause(true));
      dispatch(setFullScreen(true));
    }
  };

  const imageUrl = artistDetails?.image?.[2]?.url || artistDetails?.image?.[1]?.url;

  return (
    <div className="w-11/12 lg:w-9/12 m-auto pb-24">
      {/* ===== HERO ARTIST HEADER BANNER ===== */}
      <div 
        className="relative overflow-hidden rounded-3xl mt-10 border border-white/10 shadow-2xl p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-6 min-h-[260px] lg:min-h-[320px]"
      >
        {/* Dynamic blurred background banner */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center filter blur-3xl brightness-[0.3] scale-110"
          style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent" />

        {loading ? (
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-white/5 animate-pulse z-10" />
        ) : (
          <div className="relative z-10 shrink-0">
            <img
              src={imageUrl}
              alt={artistDetails?.name}
              className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white/15 shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}

        <div className="relative z-10 text-center md:text-left flex-1 flex flex-col gap-3">
          {loading ? (
            <div className="space-y-3">
              <div className="h-10 w-60 bg-white/5 animate-pulse rounded-lg" />
              <div className="h-6 w-40 bg-white/5 animate-pulse rounded-lg" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
                {artistDetails?.name}
              </h1>

              {/* Badges row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs md:text-sm font-semibold">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-purple-300 capitalize">
                  <AudiotrackIcon style={{ fontSize: "14px" }} />
                  {artistDetails?.dominantType || "Artist"}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-teal-300 capitalize">
                  <LanguageIcon style={{ fontSize: "14px" }} />
                  {artistDetails?.dominantLanguage || "Hindi"}
                </span>
                {artistDetails?.fanCount && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-pink-300">
                    <PeopleIcon style={{ fontSize: "14px" }} />
                    {Number(artistDetails.fanCount).toLocaleString()} Fans
                  </span>
                )}
              </div>

              {/* Action buttons inside header */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                <button
                  onClick={handlePlayArtistSongs}
                  disabled={artistSongs?.length === 0}
                  className="accent-btn flex items-center gap-2"
                  style={{ borderRadius: "12px", padding: "10px 24px", fontSize: "14px" }}
                >
                  <PlayArrowIcon /> Play Top Tracks
                </button>
                <button
                  onClick={handleShuffleArtistSongs}
                  disabled={artistSongs?.length === 0}
                  className="flex items-center gap-2"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "10px 24px",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                >
                  <ShuffleIcon style={{ fontSize: "18px" }} /> Shuffle
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== POPULAR SONGS SECTION ===== */}
      <div className="mt-12 text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Songs</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input"
              style={{
                width: "auto",
                padding: "6px 16px",
                fontSize: "13px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="popularity" className="bg-gray-950 text-white">Popularity</option>
              <option value="latest" className="bg-gray-950 text-white">Latest</option>
              <option value="alphabetical" className="bg-gray-950 text-white">Alphabetical</option>
            </select>
          </div>
        </div>
        
        {loading && pageNumber === 0 ? (
          <SongListSkeleton />
        ) : (
          <div className="glass-card-flat p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <SongList SongData={artistSongs} />
            <div ref={observerRef} className="h-4"></div>
            {loading && pageNumber > 0 && <SongListSkeleton />}
          </div>
        )}
      </div>

      {/* ===== ALBUMS SECTION ===== */}
      {artistAlbums?.length > 0 && (
        <div className="mt-12 text-gray-200">
          <SwiperLayout title={"Albums"}>
            {artistAlbums.map((album, index) => (
              <SwiperSlide key={album.id || index}>
                <SongCard song={album} />
              </SwiperSlide>
            ))}
          </SwiperLayout>
        </div>
      )}
    </div>
  );
};

export default Page;
