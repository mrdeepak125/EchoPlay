"use client";
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getQualityUrl } from "@/redux/features/audioQualitySlice";
import { get } from "idb-keyval";

const Player = ({
  activeSong,
  isPlaying,
  volume,
  seekTime,
  onEnded,
  onTimeUpdate,
  onLoadedData,
  repeat,
  handlePlayPause,
  handlePrevSong,
  handleNextSong,
  setSeekTime,
  appTime,
}) => {
  const ref = useRef(null);
  const { quality } = useSelector((state) => state.audioQuality || { quality: "high" });
  const [localUrl, setLocalUrl] = useState("");

  useEffect(() => {
    let url = "";
    const checkOffline = async () => {
      if (activeSong?.id) {
        try {
          const storedSong = await get(activeSong.id);
          if (storedSong?.audioData) {
            const blob = new Blob([storedSong.audioData], { type: "audio/mpeg" });
            url = URL.createObjectURL(blob);
            setLocalUrl(url);
            return;
          }
        } catch (error) {
          console.error("Error loading offline song:", error);
        }
      }
      setLocalUrl("");
    };
    checkOffline();
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [activeSong]);

  // Get correct audio URL based on selected quality or local storage
  const audioSrc = localUrl || (
    activeSong?.isYoutube || activeSong?.source === "youtube"
      ? activeSong?.url
      : (activeSong?.downloadUrl ? getQualityUrl(activeSong.downloadUrl, quality) : "")
  );
  // Play / pause control
  useEffect(() => {
    if (!ref.current) return;
    if (isPlaying) {
      const playPromise = ref.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Auto-play was prevented; just log
          console.warn("Autoplay prevented:", err);
        });
      }
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  // Volume
  useEffect(() => {
    if (ref.current) ref.current.volume = volume;
  }, [volume]);

  // Seek
  useEffect(() => {
    if (ref.current && !isNaN(seekTime)) ref.current.currentTime = seekTime;
  }, [seekTime]);

  // Media session metadata
  const mediaMetaData = activeSong?.name
    ? {
        title: activeSong?.name,
        artist: activeSong?.primaryArtists,
        artwork: [
          {
            src: activeSong?.image?.[2]?.url,
            sizes: "500x500",
            type: "image/jpg",
          },
        ],
      }
    : {};

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata(mediaMetaData);
      navigator.mediaSession.setActionHandler("play", () => handlePlayPause());
      navigator.mediaSession.setActionHandler("pause", () => handlePlayPause());
      navigator.mediaSession.setActionHandler("previoustrack", () => handlePrevSong());
      navigator.mediaSession.setActionHandler("nexttrack", () => handleNextSong());
      navigator.mediaSession.setActionHandler("seekbackward", () => setSeekTime(appTime - 5));
      navigator.mediaSession.setActionHandler("seekforward", () => setSeekTime(appTime + 5));
    }
  }, [activeSong]);

  return (
    <audio
      key={audioSrc}
      src={audioSrc}
      ref={ref}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
      preload="auto"
    />
  );
};

export default Player;
