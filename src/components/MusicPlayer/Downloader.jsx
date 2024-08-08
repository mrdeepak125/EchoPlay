"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdDownloadForOffline } from "react-icons/md";
import { set, get } from "idb-keyval";
import useDownloader from "react-use-downloader";

const Downloader = ({ activeSong, icon }) => {
  const { size, elapsed, percentage, download, error, isInProgress } =
    useDownloader();
  const [downloaded, setDownloaded] = useState(false);

  const songUrl = activeSong?.downloadUrl?.[4]?.url;
  const filename = `${activeSong?.name
    ?.replace("&#039;", "'")
    ?.replace("&amp;", "&")}.mp3`;

  useEffect(() => {
    if (downloaded) {
      fetch(songUrl)
        .then((response) => response.blob())
        .then(async (blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const songData = {
            ...activeSong,
            downloadUrl: blobUrl, // Replace the online URL with Blob URL
            isDownloaded: true, // Flag to indicate it's downloaded
          };
          await set(activeSong.id, songData);
          console.log(`Song ${filename} saved successfully in IndexedDB`);
        })
        .catch((error) => {
          console.error("Failed to save in IndexedDB:", error);
        })
        .finally(() => setDownloaded(false));
    }
  }, [downloaded, songUrl, activeSong, filename]);

  const handleDownload = (e) => {
    e.stopPropagation();
    download(songUrl, filename);
    setDownloaded(true);
  };

  return (
    <div onClick={handleDownload} className={`flex mb-1 cursor-pointer w-7`}>
      <div title={isInProgress ? "Downloading" : "Download"}>
        {isInProgress ? (
          <div className="text-white font-extrabold text-xs">{percentage}%</div>
        ) : icon === 2 ? (
          <MdDownloadForOffline size={25} color={"#ffff"} />
        ) : (
          <MdOutlineFileDownload size={25} color={"#ffff"} />
        )}
      </div>
    </div>
  );
};

export default Downloader;
