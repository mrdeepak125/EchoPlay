'use client'

import React, { useState, useEffect } from 'react'
import { MdOutlineFileDownload, MdOutlineFileDownloadDone } from 'react-icons/md'
import { set, get } from 'idb-keyval'

export default function Downloader({ activeSong, icon }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloaded, setIsDownloaded] = useState(false)

  const songUrl = activeSong?.downloadUrl?.[4]?.url
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

        setDownloadProgress(Math.round((receivedLength / contentLength) * 100))
      }

      const blob = new Blob(chunks, { type: 'audio/mpeg' })
      
      // Store the actual audio data in IndexedDB
      const songData = {
        ...activeSong,
        audioData: await blob.arrayBuffer(),
        isDownloaded: true,
      }

      await set(activeSong.id, songData)
      console.log(`Song ${filename} saved successfully in IndexedDB`)

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
    return null // or return a placeholder component
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