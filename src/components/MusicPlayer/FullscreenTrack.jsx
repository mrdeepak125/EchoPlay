import Lyrics from "./Lyrics";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setFullScreen } from "@/redux/features/playerSlice";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";

const FullscreenTrack = ({
  fullScreen,
  activeSong,
  handlePrevSong,
  handleNextSong,
}) => {
  const dispatch = useDispatch();
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDownActive, setSwipeDownActive] = useState(false);
  const songRef = useRef(null);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setIsSwiping(true);
      setSwipeDirection(eventData.dir);
      
      // Activate swipe down only when swiping vertically
      if (Math.abs(eventData.deltaY) > Math.abs(eventData.deltaX)) {
        setSwipeDownActive(true);
      }
    },
    onSwipedLeft: () => {
      if (!swipeDownActive) {
        handleNextSong();
      }
      resetSwipe();
    },
    onSwipedRight: () => {
      if (!swipeDownActive) {
        handlePrevSong();
      }
      resetSwipe();
    },
    onSwipedDown: () => {
      if (swipeDownActive) {
        dispatch(setFullScreen(false));
      }
      resetSwipe();
    },
    onSwipedUp: () => {
      resetSwipe();
    },
    onSwiped: resetSwipe,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  function resetSwipe() {
    setIsSwiping(false);
    setSwipeDirection(null);
    setSwipeDownActive(false);
  }

  // Calculate swipe offset for animation
  const getSwipeOffset = () => {
    if (!isSwiping) return { x: 0, y: 0 };
    
    if (swipeDownActive) {
      return { x: 0, y: swipeDirection === "Down" ? 50 : -50 };
    }
    
    return {
      x: swipeDirection === "Left" ? -50 : swipeDirection === "Right" ? 50 : 0,
      y: 0
    };
  };

  return (
    <div
      className={`${
        fullScreen ? "block" : "hidden"
      } w-[100vw] flex lg:flex-row lg:w-[1000px] mx-auto flex-col lg:justify-between mt-10`}
    >
      <div className="flex flex-col items-center lg:w-96">
        <div
          {...handlers}
          className="relative h-80 w-80 lg:h-[500px] lg:w-[500px] sm:mt-5 mt-28 overflow-hidden"
        >
          <AnimatePresence initial={false} custom={swipeDirection}>
            <motion.div
              key={activeSong?.id || "default"}
              custom={swipeDirection}
              initial={{ 
                x: swipeDirection === "Right" ? 300 : -300, 
                y: swipeDownActive ? (swipeDirection === "Down" ? 300 : -300) : 0,
                opacity: 0 
              }}
              animate={{
                x: isSwiping && !swipeDownActive ? getSwipeOffset().x : 0,
                y: isSwiping && swipeDownActive ? getSwipeOffset().y : 0,
                opacity: 1,
                transition: { duration: isSwiping ? 0 : 0.3 },
              }}
              exit={{ 
                x: swipeDirection === "Left" ? -300 : 300,
                y: swipeDownActive ? (swipeDirection === "Down" ? 300 : -300) : 0,
                opacity: 0 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
              ref={songRef}
            >
              <img
                src={activeSong?.image?.[2]?.url}
                alt="cover art"
                className="rounded-2xl object-cover w-full h-full bg-black"
                draggable="false"
              />
            </motion.div>
          </AnimatePresence>

          {/* Swipe hint arrows */}
          {/* {!isSwiping && (
            <>
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                <div className="text-white opacity-30">
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z"
                    />
                  </svg>
                </div>
                <div className="text-white opacity-30">
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <div className="text-white opacity-30">
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                    />
                  </svg>
                </div>
              </div>
            </>
          )} */}
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full select-none cursor-pointer text-center my-5"
        >
          <motion.p
            key={`title-${activeSong?.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="truncate text-white font-bold text-2xl mx-3 mb-1"
          >
            {activeSong?.name
              ? activeSong?.name.replace("&#039;", "'").replace("&amp;", "&")
              : "Song"}
          </motion.p>
          <motion.p
            key={`artist-${activeSong?.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="truncate text-gray-300"
          >
            {activeSong?.artists?.primary
              ? activeSong?.artists.primary?.map((artist, index) => (
                  <React.Fragment key={index}>
                    <Link
                      className="hover:underline mx-1"
                      href={`/artist/${artist?.id}`}
                      onClick={() => dispatch(setFullScreen(false))}
                    >
                      {artist?.name?.trim()}
                    </Link>
                  </React.Fragment>
                ))
              : "Artist"}
          </motion.p>
        </div>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="ml-60 flex-col items-center lg:flex hidden"
      >
        <Lyrics activeSong={activeSong} />
      </div>
    </div>
  );
};

export default FullscreenTrack;
