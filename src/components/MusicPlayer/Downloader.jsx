'use client'

import React, { useState, useEffect } from 'react'
import { MdOutlineFileDownload, MdOutlineFileDownloadDone } from 'react-icons/md'
import { set, get } from 'idb-keyval'
import { useSelector } from 'react-redux'
import { getQualityUrl } from '@/redux/features/audioQualitySlice'

export default function Downloader({ activeSong, icon }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloaded, setIsDownloaded] = useState(false)

  const { quality } = useSelector((state) => state.audioQuality || { quality: "high" });

  // Resolve song URL based on whether it is a YouTube stream or JioSaavn song
  const isYoutube = activeSong?.isYoutube || activeSong?.source === 'youtube';
  const songUrl = isYoutube 
    ? activeSong?.url 
    : getQualityUrl(activeSong?.downloadUrl, quality);

  const filename = `${activeSong?.name?.replace(/&#039;/g, "'")?.replace(/&amp;/g, "&")}.mp3`

  useEffect(() => {
    const checkIfDownloaded = async () => {
      if (activeSong && activeSong.id) {
        try {
          const storedSong = await get(activeSong.id)
          setIsDownloaded(!!storedSong)
        } catch (error) {
          console.error('Error checking if song is downloaded:', error)
          setIsDownloaded(false)
        }
      } else {
        setIsDownloaded(false)
      }
    }
    checkIfDownloaded()
  }, [activeSong])

  const handleDownload = async (e) => {
    e.stopPropagation()
    if (!songUrl || !activeSong || !activeSong.id) return

    setIsDownloading(true)
    setDownloadProgress(0)

    try {
      const response = await fetch(songUrl)
      if (!response.ok) throw new Error('Network response was not ok')

      const contentLength = Number(response.headers.get('Content-Length'))
      const reader = response.body?.getReader()
      if (!reader) throw new Error('Unable to read response')

      let receivedLength = 0
      const chunks = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        chunks.push(value)
        receivedLength += value.length

        if (contentLength) {
          setDownloadProgress(Math.round((receivedLength / contentLength) * 100))
        } else {
          // If contentLength is missing/zero, show a progressive mockup based on estimated size
          setDownloadProgress(Math.min(99, Math.round(receivedLength / (1024 * 1024 * 5) * 100)))
        }
      }

      const blob = new Blob(chunks, { type: 'audio/mpeg' })
      
      // Fetch and cache the artwork offline as a base64 Data URL
      let cachedImage = null;
      try {
        const imageUrl = activeSong?.image?.[2]?.url || activeSong?.image?.[1]?.url || activeSong?.image?.[0]?.url || activeSong?.image?.[2]?.link;
        if (imageUrl) {
          const imgResponse = await fetch(imageUrl);
          if (imgResponse.ok) {
            const imgBlob = await imgResponse.blob();
            cachedImage = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = () => resolve(null);
              reader.readAsDataURL(imgBlob);
            });
          }
        }
      } catch (err) {
        console.warn("Failed to cache artwork for offline playback:", err);
      }

      // Store the actual audio data and cached image in IndexedDB
      const songData = {
        ...activeSong,
        audioData: await blob.arrayBuffer(),
        localImage: cachedImage,
        isDownloaded: true,
      }

      await set(activeSong.id, songData)
      console.log(`Song ${filename} and its artwork saved successfully in IndexedDB`)

      setIsDownloaded(true)

      // Trigger download in browser
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)

    } catch (error) {
      console.error('Failed to download or save song:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  if (!activeSong || !activeSong.id) {
    return null
  }

  return (
    <div onClick={handleDownload} className="flex mb-1 cursor-pointer w-7">
      <div title={isDownloading ? "Downloading" : isDownloaded ? "Downloaded" : "Download"}>
        {isDownloading ? (
          <div className="text-white font-extrabold text-xs">{downloadProgress}%</div>
        ) : isDownloaded ? (
          <MdOutlineFileDownloadDone size={25} color="#ffff" />
        ) : icon === 2 ? (
          <MdOutlineFileDownloadDone size={25} color="#ffff" />
        ) : (
          <MdOutlineFileDownload size={25} color="#ffff" />
        )}
      </div>
    </div>
  )
}