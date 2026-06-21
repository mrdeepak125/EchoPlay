'use client';
import SongsList from '@/components/SongsList';
import { getFavourite, getSongData } from '@/services/dataAPI';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { BsFillHeartFill, BsPlayFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { setActiveSong, playPause, setFullScreen } from '@/redux/features/playerSlice';

const page = () => {
  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await getFavourite();
        if (res?.length > 0) {
          const favorites = await getSongData(res);
          setFavouriteSongs(favorites?.reverse() || []);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
      setLoading(false);
    };
    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status]);

  // redirect if user is unauthenticated
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

  const handlePlayAll = () => {
    if (favouriteSongs.length > 0) {
      dispatch(setActiveSong({ song: favouriteSongs[0], data: favouriteSongs, i: 0 }));
      dispatch(setFullScreen(true));
      dispatch(playPause(true));
    }
  };

  return (
    <div className="flex flex-col px-4 md:px-10 py-6 text-white max-w-7xl mx-auto w-full pb-32">
      {/* Header Card / Banner in Material 3 Style */}
      <div className="glass-card p-6 md:p-8 rounded-[24px] mb-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-glow)] to-transparent opacity-30 pointer-events-none" />
        
        {/* Heart Icon Container */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300">
          <BsFillHeartFill className="text-white text-4xl md:text-6xl animate-pulse" />
        </div>

        {/* Text Details & Play All */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left z-10">
          <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Playlist</span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight">
            My <span className="accent-text">Favourites</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm md:text-base mb-4 font-medium">
            {loading ? "Loading songs..." : `${favouriteSongs.length} track${favouriteSongs.length !== 1 ? 's' : ''}`}
          </p>
          
          {favouriteSongs.length > 0 && !loading && (
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all shadow-lg hover:shadow-[var(--accent-glow)] hover:scale-105 active:scale-95 duration-200"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              }}
            >
              <BsPlayFill className="text-xl" />
              Play All
            </button>
          )}
        </div>
      </div>

      {/* Songs List */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold tracking-wide mb-4 text-[var(--text-primary)] border-b border-white/10 pb-2">Tracks</h2>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loader"></span>
          </div>
        ) : favouriteSongs.length === 0 ? (
          <div className="glass-card-flat p-10 text-center text-[var(--text-secondary)]">
            <p className="text-lg font-semibold mb-2">No favourites yet</p>
            <p className="text-sm">Click the heart icon on any song to add it here.</p>
          </div>
        ) : (
          <SongsList SongData={favouriteSongs} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default page;