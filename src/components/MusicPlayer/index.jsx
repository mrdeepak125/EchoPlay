"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import getPixels from "get-pixels";
import { extractColors } from "extract-colors";
import { get } from "idb-keyval";

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
  const [sleepTimer, setSleepTimer] = useState(null);
  const [sleepTimerId, setSleepTimerId] = useState(null);
  const dispatch = useDispatch();
  const { status } = useSession();
  const router = useRouter();
  const [bgColor, setBgColor] = useState();

  useEffect(() => {
    if (currentSongs?.length) dispatch(playPause(true));
  }, [currentIndex, dispatch, currentSongs]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const res = await getFavourite();
        if (res) {
          setFavouriteSongs(res);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchFavourites();

    const src = activeSong?.image?.[1]?.url;

    if (src) {
      getPixels(src, (err, pixels) => {
        if (!err) {
          const data = [...pixels.data];
          const width = Math.round(Math.sqrt(data.length / 4));
          const height = width;

          extractColors({ data, width, height })
            .then((colors) => {
              setBgColor(colors[0]);
            })
            .catch(console.log);
        }
      });
    }

    if (activeSong?.name) {
      document.title = activeSong?.name;
    }
  }, [activeSong]);

  useEffect(() => {
    document.documentElement.style.overflow = fullScreen ? "hidden" : "auto";

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [fullScreen]);

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

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handlePlayPause = (e) => {
    e?.stopPropagation();
    if (!isActive) return;

    if (isPlaying) {
      dispatch(playPause(false));
    } else {
      dispatch(playPause(true));
    }
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
        if (res?.success === true) {
          setFavouriteSongs(res?.data?.favourites);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("add to fav error", error);
      }
    }
  };

  useEffect(() => {
    const fetchDownloadedSong = async () => {
      const downloadedSong = await get(activeSong.id);
      if (downloadedSong && downloadedSong.isDownloaded) {
        dispatch(
          playPause({
            ...activeSong,
            downloadUrl: downloadedSong.downloadUrl,
          })
        );
      }
    };

    if (activeSong?.id) {
      fetchDownloadedSong();
    }
  }, [activeSong, dispatch]);

  useEffect(() => {
    if (sleepTimerId) {
      clearTimeout(sleepTimerId);
    }
    if (sleepTimer) {
      const timerId = setTimeout(() => {
        dispatch(playPause(false));
        setSleepTimer(null);
      }, sleepTimer * 60 * 1000);
      setSleepTimerId(timerId);
    }
    return () => {
      if (sleepTimerId) {
        clearTimeout(sleepTimerId);
      }
    };
  }, [sleepTimer, dispatch]);

  const handleTimerClick = (e) => {
    e.stopPropagation();
  };

  const setStopAfterNSongs = () => {
    const userInput = prompt("Enter number of songs to play before stopping:");
    const count = parseInt(userInput, 10);
    if (!isNaN(count) && count > 0) {
      setSongStopCount(count);
      setSongsPlayed(0);
      alert(`Playback will stop after ${count} song(s).`);
    } else {
      alert("Please enter a valid number greater than 0.");
    }
  };

  const setSleepTimerDuration = (minutes) => {
    setSleepTimer(minutes);
    alert(`Sleep timer set for ${minutes} minutes.`);
  };

  console.clear();

  return (
    <div
      className={`relative overflow-scroll items-center lg:items-stretch lg:overflow-visible hideScrollBar sm:px-12  flex flex-col transition-all duration-100 ${
        fullScreen ? "h-[100vh] w-[100vw]" : "w-full h-20 px-8 bg-black "
      }`}
      onClick={() => {
        if (activeSong?.id) {
          dispatch(setFullScreen(!fullScreen));
        }
      }}
      style={{
        backgroundColor: bgColor
          ? `rgba(${bgColor.red}, ${bgColor.green}, ${bgColor.blue}, 0.2)`
          : "rgba(0,0,0,0.2)",
      }}
    >
      {/* Top Icons */}
      {fullScreen && (
        <div className="absolute top-4 left-4 flex items-center space-x-4 z-10">
          {/* Timer Icon and Menu */}
          <div onClick={handleTimerClick}>
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton
                className="flex items-center text-white text-3xl focus:outline-none"
                aria-label="Timer Options"
              >
                <MdOutlineTimer />
                <IoMdArrowDropdown className="ml-1 text-2xl" />
              </MenuButton>
              <Menu.Items className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                <div className="py-1">
                  <MenuItem
                    as="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={setStopAfterNSongs}
                  >
                    Stop after N songs
                  </MenuItem>
                  <Menu as="div" className="relative">
                    <MenuButton className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center">
                      Sleep Timer
                      <IoMdArrowDropdown />
                    </MenuButton>
                    <Menu.Items className="absolute left-full top-0 mt-12 -ml-20 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                      {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(
                        (min) => (
                          <MenuItem
                            key={min}
                            as="button"
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setSleepTimerDuration(min)}
                          >
                            {min} minutes
                          </MenuItem>
                        )
                      )}
                    </Menu.Items>
                  </Menu>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      )}

      {/* Close Fullscreen Icon */}
      <HiOutlineChevronDown
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setFullScreen(!fullScreen));
        }}
        className={`absolute top-4 right-4 text-white text-3xl cursor-pointer ${
          fullScreen ? "" : "hidden"
        }`}
      />

      <FullscreenTrack
        handleNextSong={handleNextSong}
        handlePrevSong={handlePrevSong}
        activeSong={activeSong}
        fullScreen={fullScreen}
      />
      <div className="flex items-center justify-between pt-2 w-full">
        <Track
          isPlaying={isPlaying}
          isActive={isActive}
          activeSong={activeSong}
          fullScreen={fullScreen}
        />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className={`${
              fullScreen ? "" : "hidden"
            } sm:hidden flex items-center justify-center gap-4`}
          >
            <FavouriteButton
              favouriteSongs={favouriteSongs}
              activeSong={activeSong}
              loading={loading}
              handleAddToFavourite={handleAddToFavourite}
              style={"mb-4"}
            />
            <div className={`mb-3 sm:hidden flex items-center justify-center`}>
              <Downloader activeSong={activeSong} fullScreen={fullScreen} />
            </div>
          </div>
          <Controls
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
      {fullScreen && (
        <div className="lg:hidden">
          <Lyrics activeSong={activeSong} currentSongs={currentSongs} />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
