'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setProgress } from '@/redux/features/loadingBarSlice';
import { playPause, setActiveSong, setFullScreen } from '@/redux/features/playerSlice';
import { homePageData, getSearchedData, getSongData } from '@/services/dataAPI';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BsPlayFill, BsFillVolumeUpFill, BsSearch, BsFire } from 'react-icons/bs';
import { BiMicrophone } from 'react-icons/bi';
import SongCard from '@/components/Homepage/SongCard';

export default function SearchPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { languages } = useSelector((state) => state.languages || { languages: ['hindi'] });
  const { currentSongs, activeSong, isPlaying } = useSelector((state) => state.player || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [trendingData, setTrendingData] = useState(null);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [playingSongId, setPlayingSongId] = useState(null);

  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  // Fetch initial trending data
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoadingTrending(true);
        const res = await homePageData(languages);
        setTrendingData(res);
      } catch (error) {
        console.error('Error fetching trending data:', error);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, [languages]);

  // Debounce the search input
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!searchTerm.trim()) {
      setDebouncedQuery('');
      setPreviewData(null);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
    }, 450);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [searchTerm]);

  // Fetch preview data on debounced query change
  useEffect(() => {
    const fetchSearchPreview = async () => {
      if (!debouncedQuery) return;
      try {
        setLoadingPreview(true);
        const res = await getSearchedData(debouncedQuery);
        setPreviewData(res);
      } catch (error) {
        console.error('Error fetching search preview:', error);
      } finally {
        setLoadingPreview(false);
      }
    };
    fetchSearchPreview();
  }, [debouncedQuery]);

  // Voice Search (Web Speech API)
  const startVoiceSearch = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('');
      setSearchTerm(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error !== 'aborted') {
        console.warn('Voice search error:', e.error);
      }
    };

    recognition.start();
  }, []);

  const stopVoiceSearch = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handlePlaySong = async (song) => {
    try {
      setPlayingSongId(song.id);
      dispatch(setProgress(50));
      const response = await getSongData(song.id);
      const songData = response?.[0];
      if (songData) {
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
        dispatch(setFullScreen(false));
        dispatch(playPause(true));
      }
      dispatch(setProgress(100));
    } catch (err) {
      console.error('Failed to play song:', err);
    } finally {
      setPlayingSongId(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/search/${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <div className="mx-auto relative flex flex-col w-11/12 lg:w-9/12 text-white min-h-screen pb-24">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#a855f7]/10 rounded-full blur-[100px] pointer-events-none z-[-1]" />
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#ec4899]/5 rounded-full blur-[140px] pointer-events-none z-[-1]" />

      {/* Header and Animated Input */}
      <div className="flex flex-col items-center mt-10 mb-10 w-full">
        <motion.h1 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight text-center bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"
        >
          Discover Music
        </motion.h1>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
          <div 
            className="flex items-center bg-white/5 border border-white/10 focus-within:border-purple-500/40 rounded-2xl p-4 gap-4 shadow-2xl transition-all duration-300 backdrop-blur-md"
            style={{
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Search Icon */}
            <BsSearch size={20} className="text-gray-400 shrink-0 ml-1" />

            {/* Input Field */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isListening ? '🎤 Listening to your voice...' : 'Search songs, albums, artists, playlists...'}
              className="w-full bg-transparent border-none outline-none text-white text-base md:text-lg placeholder-gray-400"
            />

            {/* Mic / Voice Search Button */}
            <button
              type="button"
              onClick={isListening ? stopVoiceSearch : startVoiceSearch}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 relative ${
                isListening ? 'bg-purple-500 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {isListening ? (
                <motion.div 
                  animate={{ scale: [1, 1.25, 1] }} 
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  <BiMicrophone size={20} />
                </motion.div>
              ) : (
                <BiMicrophone size={20} />
              )}
              {isListening && (
                <span className="absolute -inset-1 rounded-full border border-purple-500 animate-ping opacity-70" />
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results and Trending sections */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {searchTerm.trim() !== '' ? (
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {loadingPreview ? (
                <div className="flex justify-center items-center py-20">
                  <span className="loader"></span>
                </div>
              ) : previewData ? (
                <div className="flex flex-col gap-8">
                  {/* Songs Preview List */}
                  {previewData.songs?.results?.length > 0 && (
                    <div 
                      className="glass-card p-6"
                      style={{
                        background: "rgba(255,255,255,0.015)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "24px"
                      }}
                    >
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span>🎵</span> Top Track Results
                      </h2>
                      <div className="flex flex-col gap-2">
                        {previewData.songs.results.slice(0, 5).map((song) => {
                          const isCurrentActive = activeSong?.id === song.id;
                          return (
                            <div
                              key={song.id}
                              onClick={() => handlePlaySong(song)}
                              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                                isCurrentActive
                                  ? 'bg-white/10 border-[#a855f7]/40 shadow-[0_4px_20px_rgba(168,85,247,0.15)]'
                                  : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-4 min-w-0 flex-1">
                                <img
                                  src={song.image?.[1]?.url || song.image?.[0]?.url}
                                  alt={song.title}
                                  className="w-12 h-12 rounded-lg object-cover shadow-md border border-white/5 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className={`font-semibold text-sm md:text-base truncate ${
                                    isCurrentActive ? 'text-[#a855f7]' : 'text-white'
                                  }`} style={{ color: isCurrentActive ? 'var(--accent-primary)' : '#fff' }}>
                                    {song.title?.replace(/&#039;/g, "'")?.replace(/&amp;/g, '&')}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate mt-0.5">
                                    {song.primaryArtists || 'Artist'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-center shrink-0">
                                {playingSongId === song.id ? (
                                  <div className="custom-loader w-5 h-5"></div>
                                ) : isCurrentActive && isPlaying ? (
                                  <BsFillVolumeUpFill size={22} className="text-[#a855f7]" style={{ color: 'var(--accent-primary)' }} />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <BsPlayFill size={20} className="text-white ml-0.5" />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Grid for Albums, Artists, Playlists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Albums */}
                    {previewData.albums?.results?.length > 0 && (
                      <div className="glass-card p-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px" }}>
                        <h3 className="text-lg font-bold text-white mb-4">Albums</h3>
                        <div className="flex flex-col gap-3">
                          {previewData.albums.results.slice(0, 4).map((album) => (
                            <Link href={`/album/${album.id}`} key={album.id} className="flex items-center gap-3 group text-decoration-none">
                              <img src={album.image?.[1]?.url} alt={album.title} className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                                  {album.title?.replace(/&#039;/g, "'")?.replace(/&amp;/g, '&')}
                                </p>
                                <p className="text-xs text-gray-400 truncate mt-0.5">
                                  Album • {album.artist || 'Various'}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Artists */}
                    {previewData.artists?.results?.length > 0 && (
                      <div className="glass-card p-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px" }}>
                        <h3 className="text-lg font-bold text-white mb-4">Artists</h3>
                        <div className="flex flex-col gap-3">
                          {previewData.artists.results.slice(0, 4).map((artist) => (
                            <Link href={`/artist/${artist.id}`} key={artist.id} className="flex items-center gap-3 group text-decoration-none">
                              <img src={artist.image?.[1]?.url || artist.image?.[0]?.url} alt={artist.title} className="w-11 h-11 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform border border-white/10" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                                  {artist.title?.replace(/&amp;/g, '&')}
                                </p>
                                <p className="text-xs text-gray-400 truncate mt-0.5">Artist</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Playlists */}
                    {previewData.playlists?.results?.length > 0 && (
                      <div className="glass-card p-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px" }}>
                        <h3 className="text-lg font-bold text-white mb-4">Playlists</h3>
                        <div className="flex flex-col gap-3">
                          {previewData.playlists.results.slice(0, 4).map((playlist) => (
                            <Link href={`/playlist/${playlist.id}`} key={playlist.id} className="flex items-center gap-3 group text-decoration-none">
                              <img src={playlist.image?.[1]?.url} alt={playlist.title} className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                                  {playlist.title?.replace(/&#039;/g, "'")?.replace(/&amp;/g, '&')}
                                </p>
                                <p className="text-xs text-gray-400 truncate mt-0.5">Playlist</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View Full Search Page Button */}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => router.push(`/search/${encodeURIComponent(searchTerm.trim())}`)}
                      className="accent-btn"
                      style={{ borderRadius: '24px', padding: '12px 36px', fontSize: '14px', fontWeight: 'bold' }}
                    >
                      View All Results for "{searchTerm}"
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-20">
                  No results found for your search query. Try another keyword.
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="trending-list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BsFire className="text-orange-500 animate-pulse" />
                <span>Trending Songs & Albums</span>
              </h2>

              {loadingTrending ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      <div className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-lg w-3/4 animate-pulse" />
                      <div className="h-3 bg-white/5 rounded-lg w-1/2 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {trendingData?.trending?.songs?.slice(0, 6).map((song) => (
                    <SongCard key={song.id} song={song} activeSong={activeSong} isPlaying={isPlaying} />
                  ))}
                  {trendingData?.trending?.albums?.slice(0, 6).map((album) => (
                    <SongCard key={album.id} song={album} activeSong={activeSong} isPlaying={isPlaying} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
