"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  nextSong,
  prevSong,
  playPause,
  setFullScreen,
} from "../../redux/features/playerSlice";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";
import FullscreenTrack from "./FullscreenTrack";
import Lyrics from "./Lyrics";
import Downloader from "./Downloader";
import { HiOutlineChevronDown } from "react-icons/hi";
import { MdOutlineTimer } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { Menu, MenuItem, MenuButton } from "@headlessui/react";
import { addFavourite, getFavourite } from "@/services/dataAPI";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FavouriteButton from "./FavouriteButton";
import { get } from "idb-keyval";
import { useSelector as useQualitySelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const MusicPlayer = () => {
  const {
    activeSong,
    currentSongs,
    currentIndex,
    isActive,
    isPlaying,
    fullScreen,
  } = useSelector((state) => state.player);
  const { isTyping } = useSelector((state) => state.loadingBar);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [songStopCount, setSongStopCount] = useState(null);
  const [songsPlayed, setSongsPlayed] = useState(0);
  const [sleepTimeRemaining, setSleepTimeRemaining] = useState(0); // in seconds
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [customNCount, setCustomNCount] = useState(5);
  const [customMinutes, setCustomMinutes] = useState(15);
  const [bgColor, setBgColor] = useState(null);
  const dispatch = useDispatch();
  const { status } = useSession();
  const router = useRouter();

  // Auto-play when song changes
  useEffect(() => {
    if (currentSongs?.length) dispatch(playPause(true));
  }, [currentIndex, dispatch, currentSongs]);

  // Fetch favourites & extract bg color on song change
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const res = await getFavourite();
        if (res) setFavouriteSongs(res);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    fetchFavourites();

    // Extract dominant color from artwork
    if (activeSong?.image?.[1]?.url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = activeSong.image[1].url;
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 10;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, 10, 10);
          const d = ctx.getImageData(0, 0, 10, 10).data;
          setBgColor({ red: d[0], green: d[1], blue: d[2] });
        } catch {}
      };
    }

    if (activeSong?.name) document.title = activeSong.name + " — EchoPlay";
  }, [activeSong]);

  // Lock scroll in fullscreen
  useEffect(() => {
    document.documentElement.style.overflow = fullScreen ? "hidden" : "auto";
    return () => { document.documentElement.style.overflow = "auto"; };
  }, [fullScreen]);

  // Spacebar play/pause
  const handleKeyPress = useCallback(
    (event) => {
      if (!isTyping && (event.keyCode === 32 || event.key === " ")) {
        event.preventDefault();
        handlePlayPause();
      }
    },
    [isTyping]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handlePlayPause = (e) => {
    e?.stopPropagation();
    if (!isActive) return;
    dispatch(playPause(!isPlaying));
  };

  const handleNextSong = useCallback(
    (e) => {
      e?.stopPropagation();
      dispatch(playPause(false));

      if (songStopCount !== null) {
        setSongsPlayed((prev) => prev + 1);
        if (songsPlayed + 1 >= songStopCount) {
          dispatch(playPause(false));
          setSongStopCount(null);
          setSongsPlayed(0);
          return;
        }
      }

      if (!shuffle) {
        dispatch(nextSong((currentIndex + 1) % currentSongs.length));
      } else {
        dispatch(nextSong(Math.floor(Math.random() * currentSongs.length)));
      }
    },
    [dispatch, shuffle, currentIndex, currentSongs, songStopCount, songsPlayed]
  );

  const handlePrevSong = (e) => {
    e?.stopPropagation();
    if (currentIndex === 0) {
      dispatch(prevSong(currentSongs.length - 1));
    } else if (shuffle) {
      dispatch(prevSong(Math.floor(Math.random() * currentSongs.length)));
    } else {
      dispatch(prevSong(currentIndex - 1));
    }
  };

  const handleAddToFavourite = async (favsong) => {
    if (status === "unauthenticated") {
      dispatch(setFullScreen(false));
      router.push("/login");
      return;
    }
    if (favsong?.id && status === "authenticated") {
      try {
        setLoading(true);
        if (favouriteSongs?.includes(favsong.id)) {
          setFavouriteSongs(favouriteSongs.filter((id) => id !== favsong.id));
        } else {
          setFavouriteSongs([...favouriteSongs, favsong.id]);
        }
        const res = await addFavourite(favsong);
        if (res?.success === true) setFavouriteSongs(res?.data?.favourites);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
  };

  // Check for downloaded song
  useEffect(() => {
    const fetchDownloadedSong = async () => {
      const downloadedSong = await get(activeSong.id);
      if (downloadedSong?.isDownloaded) {
        dispatch(playPause({ ...activeSong, downloadUrl: downloadedSong.downloadUrl }));
      }
    };
    if (activeSong?.id) fetchDownloadedSong();
  }, [activeSong, dispatch]);

  // Sleep timer countdown effect
  useEffect(() => {
    let intervalId;
    if (sleepTimeRemaining > 0) {
      intervalId = setInterval(() => {
        setSleepTimeRemaining((prev) => {
          if (prev <= 1) {
            dispatch(playPause(false));
            toast.success("Sleep timer completed! Playback stopped.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [sleepTimeRemaining, dispatch]);

  const setStopAfterNSongs = (count) => {
    if (count > 0) {
      setSongStopCount(count);
      setSongsPlayed(0);
      toast.success(`Playback will stop after ${count} songs`);
    }
  };

  const setSleepTimerDuration = (minutes) => {
    setSleepTimeRemaining(minutes * 60);
    toast.success(`Sleep timer set for ${minutes} minutes`);
  };

  const cancelTimer = () => {
    setSleepTimeRemaining(0);
    toast.success("Sleep timer cancelled");
  };

  const cancelStopCount = () => {
    setSongStopCount(null);
    setSongsPlayed(0);
    toast.success("Song limit cancelled");
  };

  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  const bgRgba = bgColor
    ? `rgba(${bgColor.red}, ${bgColor.green}, ${bgColor.blue}, 0.25)`
    : "rgba(12,10,28,0.92)";

  return (
    <div
      className={`items-center lg:items-stretch hideScrollBar flex flex-col transition-all duration-300 ${
        fullScreen 
          ? "fixed inset-0 h-[100vh] w-[100vw] overflow-y-auto z-[60] px-4 sm:px-12 pt-6 pb-24" 
          : "relative mx-auto w-[94%] md:w-[90%] max-w-6xl h-[76px] rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.55)] overflow-hidden px-4 mb-3"
      }`}
      onClick={() => {
        if (activeSong?.id) dispatch(setFullScreen(!fullScreen));
      }}
      style={{
        backgroundColor: bgRgba,
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
      }}
    >
      {/* Fullscreen top controls */}
      {fullScreen && (
        <div className="absolute top-4 left-4 flex items-center space-x-3 z-10">
          <div onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowTimerModal(true); }}
              className="flex items-center text-white text-2xl focus:outline-none hover:bg-white/15 transition-all"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                padding: "6px 12px",
              }}
              title="Set Sleep Timer"
            >
              <MdOutlineTimer />
              {(sleepTimeRemaining > 0 || songStopCount !== null) && (
                <span className="ml-2 w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
              )}
            </button>
          </div>
          {sleepTimeRemaining > 0 && (
            <div className="text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
              😴 Sleep: {formatTimeRemaining(sleepTimeRemaining)}
            </div>
          )}
          {songStopCount !== null && (
            <div className="text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
              🛑 Stop: {songStopCount - songsPlayed} left
            </div>
          )}
        </div>
      )}

      {/* Close fullscreen */}
      {fullScreen && (
        <HiOutlineChevronDown
          onClick={(e) => { e.stopPropagation(); dispatch(setFullScreen(false)); }}
          className="absolute top-4 right-4 text-white text-3xl cursor-pointer z-10"
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "50%",
            padding: "4px",
          }}
        />
      )}

      {/* Fullscreen art + swipe */}
      <FullscreenTrack
        handleNextSong={handleNextSong}
        handlePrevSong={handlePrevSong}
        activeSong={activeSong}
        fullScreen={fullScreen}
      />

      {/* Mini player + controls row */}
      <div className="flex items-center justify-between pt-2 w-full">
        <Track
          isPlaying={isPlaying}
          isActive={isActive}
          activeSong={activeSong}
          fullScreen={fullScreen}
        />
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Mobile fav + download in fullscreen */}
          <div className={`${fullScreen ? "" : "hidden"} sm:hidden flex items-center justify-center gap-4`}>
            {!(activeSong?.isYoutube || activeSong?.source === "youtube") && (
              <FavouriteButton
                favouriteSongs={favouriteSongs}
                activeSong={activeSong}
                loading={loading}
                handleAddToFavourite={handleAddToFavourite}
                style="mb-4"
              />
            )}
            <div className="mb-3 sm:hidden flex items-center justify-center">
              <Downloader activeSong={activeSong} fullScreen={fullScreen} />
            </div>
          </div>          <Controls
            isPlaying={isPlaying}
            isActive={isActive}
            repeat={repeat}
            setRepeat={setRepeat}
            shuffle={shuffle}
            setShuffle={setShuffle}
            currentSongs={currentSongs}
            activeSong={activeSong}
            fullScreen={fullScreen}
            handlePlayPause={handlePlayPause}
            handlePrevSong={handlePrevSong}
            handleNextSong={handleNextSong}
            handleAddToFavourite={handleAddToFavourite}
            favouriteSongs={favouriteSongs}
            loading={loading}
          />
          <Seekbar
            value={appTime}
            min="0"
            max={duration}
            fullScreen={fullScreen}
            onInput={(event) => setSeekTime(event.target.value)}
            setSeekTime={setSeekTime}
            appTime={appTime}
          />
          {/* The persistent audio element — key change forces reload only on song change */}
          <Player
            activeSong={activeSong}
            volume={volume}
            isPlaying={isPlaying}
            seekTime={seekTime}
            repeat={repeat}
            currentIndex={currentIndex}
            onEnded={handleNextSong}
            handlePlayPause={handlePlayPause}
            handleNextSong={handleNextSong}
            handlePrevSong={handlePrevSong}
            onTimeUpdate={(event) => setAppTime(event.target.currentTime)}
            onLoadedData={(event) => setDuration(event.target.duration)}
            appTime={appTime}
            setSeekTime={setSeekTime}
          />
        </div>
        <VolumeBar
          activeSong={activeSong}
          bgColor={bgColor}
          fullScreen={fullScreen}
          value={volume}
          min="0"
          max="1"
          onChange={(event) => setVolume(event.target.value)}
          setVolume={setVolume}
        />
      </div>

      {/* Lyrics in fullscreen on mobile */}
      {fullScreen && (
        <div className="lg:hidden">
          <Lyrics activeSong={activeSong} currentSongs={currentSongs} />
        </div>
      )}

      {/* Sleep Timer & Stop Count Glass Modal */}
      <AnimatePresence>
        {showTimerModal && (
          <div 
            onClick={(e) => { e.stopPropagation(); setShowTimerModal(false); }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-md p-6 overflow-hidden relative"
              style={{
                background: "rgba(15,15,30,0.95)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MdOutlineTimer className="text-[#a855f7]" style={{ color: "var(--accent-primary)" }} />
                  <span>Playback Timer Options</span>
                </h3>
                <button
                  onClick={() => setShowTimerModal(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <IoClose size={22} />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-6">
                
                {/* Sleep Timer Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300">😴 Sleep Timer</h4>
                  {sleepTimeRemaining > 0 ? (
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                      <div>
                        <p className="text-xs text-gray-400">Timer Active</p>
                        <p className="text-base font-bold text-pink-400">
                          {formatTimeRemaining(sleepTimeRemaining)} remaining
                        </p>
                      </div>
                      <button
                        onClick={cancelTimer}
                        className="text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Presets Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {[5, 15, 30, 45, 60].map((min) => (
                          <button
                            key={min}
                            onClick={() => { setSleepTimerDuration(min); setShowTimerModal(false); }}
                            className="bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white py-2 rounded-lg font-semibold transition-colors"
                          >
                            {min} min
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom Minutes Stepper */}
                      <div className="flex items-center justify-between gap-4 pt-2">
                        <span className="text-xs text-gray-400">Custom minutes:</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setCustomMinutes(Math.max(1, customMinutes - 5))}
                            className="bg-white/5 hover:bg-white/10 text-white w-8 h-8 rounded-lg font-bold flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold text-white w-8 text-center">{customMinutes}</span>
                          <button
                            onClick={() => setCustomMinutes(customMinutes + 5)}
                            className="bg-white/5 hover:bg-white/10 text-white w-8 h-8 rounded-lg font-bold flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => { setSleepTimerDuration(customMinutes); setShowTimerModal(false); }}
                            className="accent-btn"
                            style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px" }}
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stop after N Songs Section */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-gray-300">🛑 Song Counter Stop</h4>
                  {songStopCount !== null ? (
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                      <div>
                        <p className="text-xs text-gray-400">Songs Played</p>
                        <p className="text-base font-bold text-pink-400">
                          {songsPlayed} / {songStopCount} songs
                        </p>
                      </div>
                      <button
                        onClick={cancelStopCount}
                        className="text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-400">Stop playback after:</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setCustomNCount(Math.max(1, customNCount - 1))}
                          className="bg-white/5 hover:bg-white/10 text-white w-8 h-8 rounded-lg font-bold flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-white w-6 text-center">{customNCount}</span>
                        <button
                          onClick={() => setCustomNCount(customNCount + 1)}
                          className="bg-white/5 hover:bg-white/10 text-white w-8 h-8 rounded-lg font-bold flex items-center justify-center"
                        >
                          +
                        </button>
                        <button
                          onClick={() => { setStopAfterNSongs(customNCount); setShowTimerModal(false); }}
                          className="accent-btn"
                          style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px" }}
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicPlayer;
