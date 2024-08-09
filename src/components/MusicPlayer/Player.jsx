"use client";
import React, { useRef, useEffect, useState } from "react";

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
  const [blobUrl, setBlobUrl] = useState(null);

  // Function to get song data from IndexedDB (replace this with your logic)
  const getOfflineSongData = async (songId) => {
    // Your logic to fetch the song data from IndexedDB
    // Example: Retrieve the blob and other metadata
    const blob = await fetchBlobFromIndexedDB(songId); // Replace with your fetch logic
    if (blob) {
      return {
        name: "Offline Song Name",
        primaryArtists: "Offline Artist",
        album: { name: "Offline Album" },
        image: [{ url: "offline-album-art-url.jpg" }],
        blob,
      };
    }
    return null;
  };

  useEffect(() => {
    const setupMediaSession = async () => {
      let songData = activeSong;

      if (songData.isDownloaded) {
        // Fetch data from IndexedDB if it's an offline song
        songData = await getOfflineSongData(songData.id);

        if (songData?.blob) {
          const url = URL.createObjectURL(songData.blob);
          setBlobUrl(url);
        }
      }

      const mediaMetaData = songData?.name
        ? {
            title: songData.name,
            artist: songData.primaryArtists,
            album: songData.album.name,
            artwork: [
              {
                src: songData.image[2]?.url || songData.image[0]?.url,
                sizes: "500x500",
                type: "image/jpg",
              },
            ],
          }
        : {};

      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata(mediaMetaData);

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
      }
    };

    setupMediaSession();

    // Cleanup function to revoke the Blob URL when the component unmounts
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [activeSong, blobUrl]);

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

  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);

  return (
    <>
      <audio
        src={activeSong?.downloadUrl?.[4]?.url}
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
