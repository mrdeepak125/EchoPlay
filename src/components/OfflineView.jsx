'use client';
import React, { useEffect, useState } from 'react';
import { get, keys } from 'idb-keyval';
import SongsList from '@/components/SongsList';
import { motion } from 'framer-motion';
import { RiWifiOffLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';

export default function OfflineView() {
  const [savedSongs, setSavedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfflineSongs = async () => {
      try {
        setLoading(true);
        const keysList = await keys();
        const songs = await Promise.all(
          keysList.map(async (key) => {
            const data = await get(key);
            return data;
          })
        );
        const validSongs = songs.filter(s => s && s.id && s.isDownloaded);
        setSavedSongs(validSongs.reverse());
      } catch (err) {
        console.error('Error fetching offline songs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOfflineSongs();
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      toast.success('You are back online!');
      window.location.reload();
    } else {
      toast.error('Still offline. Please check your network connection.');
    }
  };

  return (
    <div className="mx-auto relative flex flex-col w-11/12 lg:w-9/12 text-white min-h-[60vh] pb-24">
      {/* Offline Status Card */}
      <div 
        className="glass-card mt-10 p-8 flex flex-col sm:flex-row items-center gap-6"
        style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(249,115,22,0.06) 100%)",
          border: "1px solid rgba(239,68,68,0.15)",
        }}
      >
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(135deg, #ef4444, #f97316)",
            boxShadow: "0 8px 30px rgba(239,68,68,0.25)"
          }}
        >
          <RiWifiOffLine size={36} className="text-white" />
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white">Connection Lost</h1>
          <p className="text-sm text-gray-400 mt-1">
            You are currently offline. Don't worry, you can still listen to your downloaded songs!
          </p>
        </div>
        <button
          onClick={handleRetry}
          className="accent-btn shrink-0"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            borderRadius: "12px",
            padding: "10px 24px"
          }}
        >
          Check Connection
        </button>
      </div>

      {/* Offline Tracks list */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>📻</span> Offline Downloads
        </h2>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <span className="loader"></span>
          </div>
        ) : savedSongs.length === 0 ? (
          <div className="glass-card p-12 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-xl text-gray-400 mb-2">No Offline Music Found</p>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              You haven't downloaded any tracks yet. When you are back online, tap the download icon on your favorite tracks to save them here.
            </p>
          </div>
        ) : (
          <div className="glass-card-flat p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <SongsList SongData={savedSongs} loading={false} isDownloadSection={true} />
          </div>
        )}
      </div>
    </div>
  );
}
