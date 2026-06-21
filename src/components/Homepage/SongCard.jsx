"use client";
import React, { memo, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import PlayPause from "../PlayPause";
import {
  playPause,
  setActiveSong,
  setFullScreen,
} from "../../redux/features/playerSlice";
import { getRecommendedSongs, getSongData } from "@/services/dataAPI";
import { useSelector } from "react-redux";

const SongCard = ({ song, isPlaying, activeSong }) => {
  const [loading, setLoading] = useState(false);
  const { currentSongs, autoAdd } = useSelector((state) => state.player);

  const dispatch = useDispatch();

  const handlePauseClick = () => {
    if (song?.type === "song") {
      dispatch(playPause(false));
    }
  };

  const handlePlayClick = async () => {
    if (song?.type === "song") {
      setLoading(true);
      const Data = await getSongData(song?.id);
      const songData = await Data?.[0];
      const recommendedSongs = await getRecommendedSongs(
        songData?.primaryArtistsId,
        songData?.id
      );
      // remove duplicate songs in recommendedSongs array and currentSongs array
      const filteredRecommendedSongs =
        recommendedSongs?.filter(
          (song) => !currentSongs?.find((s) => s?.id === song?.id)
        ) || [];
      dispatch(
        setActiveSong({
          song: songData,
          data: currentSongs?.find((s) => s?.id === songData?.id)
            ? currentSongs
            : autoAdd
            ? [...currentSongs, songData, ...filteredRecommendedSongs]
            : [...currentSongs, songData],
          i: currentSongs?.find((s) => s?.id === songData?.id)
            ? currentSongs?.findIndex((s) => s?.id === songData?.id)
            : currentSongs?.length,
        })
      );
      dispatch(setFullScreen(true));
      dispatch(playPause(true));
      setLoading(false);
    }
  };

  const handlePlayVideo = async (item) => {
    try {
      const videoId = item.id.videoId;
  
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
        const name = result.title;
  
        // Simulate the structure for the active song (adjust as necessary)
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
          id: videoId
        };

        console.log(songData);
        
  
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
    }
  };

  return (
    <div
      key={song?.id}
      className="w-full max-w-[200px] p-3 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] rounded-2xl transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] transform hover:-translate-y-1 cursor-pointer flex flex-col group"
    >
      <Link
        onClick={(e) => {
          if (song?.type === "song") {
            e.preventDefault();
          }
        }}
        href={
          song?.type === "album"
            ? `/album/${song?.id}`
            : song?.type === "playlist"
            ? `/playlist/${song?.id}`
            : ""
        }
        className="w-full flex flex-col text-decoration-none"
      >
        <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center bg-black/45 transition-all duration-300 opacity-0 group-hover:opacity-100 ${
              activeSong?.id === song?.id ? "opacity-100 bg-black/60" : ""
            }`}
          >
            <PlayPause
              isPlaying={isPlaying}
              activeSong={activeSong}
              song={song}
              loading={loading}
              handlePause={handlePauseClick}
              handlePlay={handlePlayClick || handlePlayVideo}
            />
          </div>
          <img
            width={200}
            height={200}
            loading="lazy"
            alt="song_img"
            srcSet={`${song.image?.[0]?.url || song.image?.[0]?.link} 320w, ${
              song.image?.[1]?.url || song.image?.[1]?.link
            } 480w, ${song.image?.[2]?.url || song.image?.[2]?.link} 800w`}
            sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px"
            src={song.image?.[1]?.url || song.image?.[1]?.link}
            className={`${
              song.type === "playlist" && song?.subtitle === "JioSaavn"
                ? "rounded-full"
                : "rounded-xl"
            } w-full h-full object-cover group-hover:scale-105 transition-transform duration-500`}
          />
        </div>

        <div className="mt-3 flex flex-col min-w-0">
          <p
            className={`font-bold text-sm text-white truncate w-full group-hover:text-[#a855f7] transition-colors ${
              song?.subtitle === "JioSaavn" ? "text-center" : ""
            }`}
            style={{ color: activeSong?.id === song?.id ? "var(--accent-primary)" : "#fff" }}
          >
            {song?.name?.replaceAll("&#039;", "'")?.replaceAll("&amp;", "&") ||
              song?.title}
          </p>
          <p className="text-xs truncate text-gray-400 mt-1">
            {song?.artists?.primary?.map((artist) => artist?.name).join(", ") ||
              song?.artists?.map((artist) => artist?.name).join(", ") ||
              (song?.subtitle !== "JioSaavn" && song?.subtitle) || "Various Artists"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default memo(
  SongCard,
  (prev, next) =>
    prev.song === next.song &&
    prev.activeSong === next.activeSong &&
    prev.isPlaying === next.isPlaying
);
