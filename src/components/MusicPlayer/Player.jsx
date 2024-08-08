"use client";
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect } from "react";

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

  // Logging to check if ref is being set correctly
  // console.log("Ref current:", ref.current);

  if (ref.current) {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  // Media session metadata:
  const mediaMetaData = activeSong.name
    ? {
        title: activeSong?.name,
        artist: activeSong?.primaryArtists,
        album: activeSong?.album.name,
        artwork: [
          {
            src: activeSong.image[2]?.url,
            sizes: "500x500",
            type: "image/jpg",
          },
        ],
      }
    : {};

  useEffect(() => {
    // Check if the Media Session API is available in the browser environment
    if ("mediaSession" in navigator) {
      // Set media metadata
      navigator.mediaSession.metadata = new window.MediaMetadata(mediaMetaData);

      // Define media session event handlers
      navigator.mediaSession.setActionHandler("play", onPlay);
      navigator.mediaSession.setActionHandler("pause", onPause);
      navigator.mediaSession.setActionHandler("previoustrack", onPreviousTrack);
      navigator.mediaSession.setActionHandler("nexttrack", onNextTrack);
      navigator.mediaSession.setActionHandler("seekbackward", () => {
        setSeekTime(appTime - 5);
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        setSeekTime(appTime + 5);
      });
    } else {
      // console.log("Media Session API is not available");
    }
  }, [mediaMetaData]);

  // Media session handlers:
  const onPlay = () => {
    handlePlayPause();
  };

  const onPause = () => {
    handlePlayPause();
  };

  const onPreviousTrack = () => {
    handlePrevSong();
  };

  const onNextTrack = () => {
    handleNextSong();
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  // Updates audio element only on seekTime change (and not on each rerender):
  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);

  return (
    <>
      <audio
        src={activeSong?.downloadUrl?.[4]?.url || activeSong?.downloadUrl}
        ref={ref}
        loop={repeat}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
      />
    </>
  );
};

export default Player;
