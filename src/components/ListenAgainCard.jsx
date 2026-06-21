import React from "react";
import { BsPlayFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import {
  playPause,
  setActiveSong,
  setFullScreen,
} from "@/redux/features/playerSlice";
import { BiHeadphone } from "react-icons/bi";
import { useSelector } from "react-redux";

const ListenAgainCard = ({ song, index, SongData }) => {
  const { activeSong } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const handlePlayClick = (song, index) => {
    dispatch(setActiveSong({ song, data: SongData, i: index }));
    dispatch(setFullScreen(true));
    dispatch(playPause(true));
  };
  return (
    <div
      onClick={() => handlePlayClick(song, index)}
      className={`flex items-center mt-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 border ${
        activeSong?.id === song?.id
          ? "bg-white/10 border-[var(--accent-primary)]/40 text-[var(--accent-primary)]"
          : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10 text-white"
      } w-full`}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="relative flex-shrink-0 w-12 h-12">
          <img
            src={song?.image?.[2]?.url || song?.image?.[2]?.link || song?.image?.[1]?.url}
            alt={song?.name}
            className="rounded-xl object-cover w-full h-full border border-white/5 shadow-sm"
          />
          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <BsPlayFill size={20} className="text-white" />
          </div>
          {activeSong?.id === song?.id && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <BiHeadphone size={24} className="text-[var(--accent-primary)] animate-bounce" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold truncate">
            {song?.name?.replace("&#039;", "'")?.replace("&amp;", "&")}
          </p>
          <p className="text-xs text-gray-400 truncate mt-0.5 font-medium">
            {song?.artists?.primary?.map((artist) => artist?.name).join(", ") || song?.subtitle || "Unknown Artist"}
          </p>
        </div>
      </div>
    </div>
  );};

export default ListenAgainCard;
