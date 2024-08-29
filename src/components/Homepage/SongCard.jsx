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
      className="flex flex-col lg:w-[205px] lg:[220px] p-2 bg-white/5 bg-opacity-80 backdrop-blur-sm rounded-lg cursor-pointer"
    >
      <Link
        onClick={(e) => {
          if (song?.type == "song") {
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
      >
        <div className="relative w-full lg:h-[178px] group">
          <div
            className={`absolute inset-0 p-2 justify-center items-center bg-black bg-opacity-0 group-hover:flex ${
              activeSong?.id === song?.id
                ? "hover:flex hover:bg-black hover:bg-opacity-70"
                : "hidden"
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
                : "rounded-lg"
            } w-full h-full `}
          />
        </div>

        <div className=" mt-2 lg:mt-4 flex flex-col">
          <p
            className={`font-semibold text-xs lg:text-sm text-white truncate w-full ${
              song?.subtitle === "JioSaavn" ? "text-center" : ""
            }`}
          >
            {song?.name?.replaceAll("&#039;", "'")?.replaceAll("&amp;", "&") ||
              song?.title}
          </p>
          <p className="text-[9px] lg:text-xs truncate text-gray-300 mt-1">
            {song?.artists?.primary?.map((artist) => artist?.name).join(", ") ||
              song?.artists?.map((artist) => artist?.name).join(", ") ||
              (song?.subtitle != "JioSaavn" && song?.subtitle)}
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
