'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserPlaylists, createPlaylist, deletePlaylist } from '@/services/playlistApi';
import { setProgress } from '@/redux/features/loadingBarSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { MdDeleteOutline, MdQueueMusic, MdAdd } from 'react-icons/md';

export default function MyPlaylistsPage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPlaylists();
    }
  }, [status]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      dispatch(setProgress(40));
      const res = await getUserPlaylists();
      if (res?.success === true) {
        setPlaylists(res.data?.playlists || []);
      }
      dispatch(setProgress(100));
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      setCreating(true);
      const res = await createPlaylist(newPlaylistName.trim());
      if (res?.success === true) {
        toast.success('Playlist created successfully!');
        setNewPlaylistName('');
        // Add new playlist to local state or refetch
        setPlaylists([res.data?.playlist, ...playlists]);
      } else {
        toast.error(res?.message || 'Failed to create playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePlaylist = async (e, playlistId) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      const res = await deletePlaylist(playlistId);
      if (res?.success === true) {
        toast.success('Playlist deleted');
        setPlaylists(playlists.filter((p) => p._id !== playlistId));
      } else {
        toast.error(res?.message || 'Failed to delete playlist');
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Something went wrong');
    }
  };

  if (status === 'loading') {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <span className="loader"></span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  return (
    <div className="mx-auto relative flex flex-col w-11/12 lg:w-9/12 text-white min-h-screen pb-24">
      {/* Page Header */}
      <div 
        className="glass-card mt-10 p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{
          background: "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(6,182,212,0.06) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-6 flex-col sm:flex-row text-center sm:text-left">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--accent-primary, #a855f7), var(--accent-secondary, #ec4899))",
              boxShadow: "0 8px 30px var(--accent-glow)"
            }}
          >
            <MdQueueMusic size={36} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white">My Library</h1>
            <p className="text-sm text-gray-400 mt-1">
              Manage your custom playlists and saved favourites
            </p>
          </div>
        </div>

        {/* Create Playlist Form */}
        <form onSubmit={handleCreatePlaylist} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="New playlist name..."
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="glass-input"
            style={{ maxWidth: '240px', padding: '10px 14px', borderRadius: '12px', fontSize: '14px' }}
            disabled={creating}
          />
          <button
            type="submit"
            className="accent-btn flex items-center gap-1 shrink-0"
            style={{ padding: '10px 16px', borderRadius: '12px' }}
            disabled={creating}
          >
            <MdAdd size={20} />
            <span>Create</span>
          </button>
        </form>
      </div>

      {/* Library Categories Cards (Material 3 standard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        {/* Favourites Card */}
        <Link href="/favourite" style={{ textDecoration: 'none' }}>
          <div 
            className="glass-card p-6 flex items-center justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 rounded-[24px]"
            style={{
              background: "linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.06) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-glow, rgba(168,85,247,0.3))";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.4), 0 0 15px var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
            }}
          >
            <div className="flex items-center gap-5">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                style={{
                  background: "linear-gradient(135deg, var(--accent-primary, #a855f7), var(--accent-secondary, #ec4899))",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">Favourites</h2>
                <p className="text-sm text-gray-400 mt-1">Your loved tracks & songs</p>
              </div>
            </div>
            <span className="text-2xl text-[var(--accent-primary)] font-bold">→</span>
          </div>
        </Link>

        {/* Playlists Card */}
        <div 
          onClick={() => {
            const el = document.getElementById("playlists-section");
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="glass-card p-6 flex items-center justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 rounded-[24px]"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(168,85,247,0.06) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-glow, rgba(168,85,247,0.3))";
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.4), 0 0 15px var(--accent-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
          }}
        >
          <div className="flex items-center gap-5">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
              style={{
                background: "linear-gradient(135deg, #06b6d4, var(--accent-primary, #a855f7))",
              }}
            >
              <MdQueueMusic size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Playlists</h2>
              <p className="text-sm text-gray-400 mt-1">
                {playlists?.length || 0} custom collections
              </p>
            </div>
          </div>
          <span className="text-2xl text-[var(--accent-primary)] font-bold">↓</span>
        </div>
      </div>

      {/* Playlists Title & List Section */}
      <div id="playlists-section" className="mt-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🎶</span> Playlists List
        </h2>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <span className="loader"></span>
          </div>
        ) : playlists?.length === 0 ? (
          <div className="glass-card p-12 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-xl text-gray-400 mb-2">No Playlists Created Yet</p>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Enter a name above and click create to start your first custom playlist.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {playlists.map((playlist) => (
                <motion.div
                  key={playlist._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/myPlaylists/${playlist._id}`} style={{ textDecoration: 'none' }}>
                    <div 
                      className="glass-card p-5 flex flex-col justify-between h-40 hover:scale-[1.02] hover:-translate-y-1 transition-all rounded-[24px]"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent-glow)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.07)";
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }} className="truncate">
                            {playlist.name}
                          </p>
                          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
                            {playlist.songs?.length || 0} tracks
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeletePlaylist(e, playlist._id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                          title="Delete Playlist"
                        >
                          <MdDeleteOutline size={22} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary, #a855f7)', fontSize: '13px', fontWeight: '700' }}>
                        <span>Open Playlist</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>  );
}
