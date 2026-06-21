"use client";
import React from "react";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { TbRepeat, TbRepeatOnce, TbArrowsShuffle } from "react-icons/tb";
import Downloader from "./Downloader";
import FavouriteButton from "./FavouriteButton";
import { motion } from "framer-motion";

const Controls = ({
  isPlaying,
  repeat,
  setRepeat,
  shuffle,
  setShuffle,
  currentSongs,
  handlePlayPause,
  handlePrevSong,
  handleNextSong,
  activeSong,
  fullScreen,
  handleAddToFavourite,
  favouriteSongs,
  loading,
}) => {
  const accentColor = "var(--accent-primary, #a855f7)";
  const inactiveColor = "rgba(255,255,255,0.6)";
  const activeColor = accentColor;

  return (
    <div className="flex items-center justify-around md:w-80 text-lg lg:w-80 2xl:w-80 gap-4 sm:gap-0">
      {/* Favourite (desktop) */}
      {!(activeSong?.isYoutube || activeSong?.source === "youtube") && (
        <FavouriteButton
          favouriteSongs={favouriteSongs}
          activeSong={activeSong}
          loading={loading}
          handleAddToFavourite={handleAddToFavourite}
          style="sm:block hidden"
        />
      )}
      {/* Repeat */}
      {!repeat ? (
        <TbRepeat
          title="Repeat"
          size={22}
          color={inactiveColor}
          onClick={(e) => { e.stopPropagation(); setRepeat((prev) => !prev); }}
          className={`${!fullScreen ? "hidden sm:block" : "m-2"} cursor-pointer hover:opacity-80 transition-opacity`}
        />
      ) : (
        <TbRepeatOnce
          title="Repeat Once"
          size={22}
          color={activeColor}
          onClick={(e) => { e.stopPropagation(); setRepeat((prev) => !prev); }}
          className={`${!fullScreen ? "hidden sm:block" : "m-2"} cursor-pointer`}
          style={{ filter: "drop-shadow(0 0 6px rgba(168,85,247,0.6))" }}
        />
      )}

      {/* Previous */}
      <motion.div whileTap={{ scale: 0.85 }}>
        <MdSkipPrevious
          title="Previous"
          size={34}
          color={currentSongs?.length ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)"}
          className="cursor-pointer"
          onClick={handlePrevSong}
        />
      </motion.div>

      {/* Play / Pause */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={handlePlayPause}
        style={{
          background: "linear-gradient(135deg, #a855f7, #ec4899)",
          border: "none",
          borderRadius: "50%",
          width: fullScreen ? "64px" : "44px",
          height: fullScreen ? "64px" : "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(168,85,247,0.45)",
          flexShrink: 0,
          transition: "width 0.2s, height 0.2s",
        }}
      >
        {isPlaying ? (
          <BsFillPauseFill size={fullScreen ? 28 : 20} color="#fff" />
        ) : (
          <BsFillPlayFill size={fullScreen ? 28 : 20} color="#fff" style={{ marginLeft: "2px" }} />
        )}
      </motion.button>

      {/* Next */}
      <motion.div whileTap={{ scale: 0.85 }}>
        <MdSkipNext
          title="Next"
          size={34}
          color={currentSongs?.length ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)"}
          className="cursor-pointer"
          onClick={handleNextSong}
        />
      </motion.div>

      {/* Shuffle */}
      <TbArrowsShuffle
        title="Shuffle"
        size={22}
        color={shuffle ? activeColor : inactiveColor}
        onClick={(e) => { e.stopPropagation(); setShuffle((prev) => !prev); }}
        className={`${!fullScreen ? "hidden sm:block" : "m-2"} cursor-pointer hover:opacity-80 transition-opacity`}
        style={shuffle ? { filter: "drop-shadow(0 0 6px rgba(168,85,247,0.6))" } : {}}
      />

      {/* Download (desktop) */}
      {activeSong?.downloadUrl?.length > 0 && (
        <div className="hidden sm:block mt-1">
          <Downloader activeSong={activeSong} fullScreen={fullScreen} />
        </div>
      )}
    </div>
  );
};

export default Controls;
