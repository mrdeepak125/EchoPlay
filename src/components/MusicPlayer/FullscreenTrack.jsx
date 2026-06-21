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
  const [swipeDelta, setSwipeDelta] = useState({ x: 0, y: 0 });
  const songRef = useRef(null);
  const swipeAxisRef = useRef(null); // Lock direction mid-swipe ('vertical' or 'horizontal')

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setIsSwiping(true);
      
      // Lock axis on the first movement tick
      if (!swipeAxisRef.current) {
        const isVertical = Math.abs(eventData.deltaY) > Math.abs(eventData.deltaX);
        swipeAxisRef.current = isVertical ? 'vertical' : 'horizontal';
        setSwipeDownActive(isVertical);
        setSwipeDirection(isVertical ? 'Down' : eventData.dir);
      }
 
      if (swipeAxisRef.current === 'vertical') {
        // Drag vertically (bound swipe down to positive values so they can't drag up past limit)
        setSwipeDelta({ x: 0, y: Math.max(0, eventData.deltaY) });
      } else {
        // Drag horizontally
        setSwipeDelta({ x: -eventData.deltaX, y: 0 });
      }
    },
    onSwipedLeft: () => {
      if (swipeAxisRef.current === 'horizontal') {
        handleNextSong();
      }
      resetSwipe();
    },
    onSwipedRight: () => {
      if (swipeAxisRef.current === 'horizontal') {
        handlePrevSong();
      }
      resetSwipe();
    },
    onSwipedDown: (eventData) => {
      if (swipeAxisRef.current === 'vertical' && eventData.deltaY > 120) {
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
    setSwipeDelta({ x: 0, y: 0 });
    swipeAxisRef.current = null;
  }

  return (
    <div
      className={`${
        fullScreen ? "block" : "hidden"
      } w-[100vw] flex lg:flex-row lg:w-[1000px] mx-auto flex-col lg:justify-between mt-10`}
    >
      <div className="flex flex-col items-center lg:w-96">
        <div
          {...handlers}
          className="relative h-80 w-80 lg:h-[500px] lg:w-[500px] sm:mt-5 mt-28 overflow-hidden touch-none"
        >
          <AnimatePresence initial={false} custom={swipeDirection}>
            <motion.div
              key={activeSong?.id || "default"}
              custom={swipeDirection}
              initial={{ 
                x: swipeDirection === "Right" ? 320 : -320, 
                y: swipeDownActive ? 400 : 0,
                opacity: 0.4
              }}
              animate={{
                x: isSwiping ? swipeDelta.x : 0,
                y: isSwiping ? swipeDelta.y : 0,
                opacity: 1,
                transition: { type: "tween", duration: isSwiping ? 0 : 0.2 },
              }}
              exit={{ 
                x: swipeDirection === "Left" ? -320 : 320,
                y: swipeDownActive ? 400 : 0,
                opacity: 0.4
              }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              ref={songRef}
            >
              <div className="relative w-full h-full rounded-2xl overflow-visible group">
                {/* Dynamic ambient glow behind image */}
                <div 
                  className="absolute inset-0 scale-[0.92] blur-[30px] opacity-80 transition-all duration-700 group-hover:scale-100"
                  style={{
                    backgroundImage: `url(${activeSong?.localImage || activeSong?.image?.[2]?.url || activeSong?.image?.[2]?.link || activeSong?.image?.[1]?.url || ""})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '16px',
                  }}
                />
                <img
                  src={activeSong?.localImage || activeSong?.image?.[2]?.url || activeSong?.image?.[2]?.link || activeSong?.image?.[1]?.url || ""}
                  alt="cover art"
                  className="rounded-2xl object-cover w-full h-full bg-black/40 shadow-[0_25px_60px_rgba(0,0,0,0.65)] select-none transition-transform duration-500 group-hover:scale-[1.01]"
                  draggable="false"
                />
              </div>
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
