import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const qualityLabels = { high: "HD", medium: "MD", low: "LQ" };
const qualityColors = {
  high: { bg: "rgba(168,85,247,0.2)", text: "#d8b4fe", border: "rgba(168,85,247,0.4)" },
  medium: { bg: "rgba(6,182,212,0.15)", text: "#67e8f9", border: "rgba(6,182,212,0.4)" },
  low: { bg: "rgba(245,158,11,0.15)", text: "#fde68a", border: "rgba(245,158,11,0.3)" },
};

const Track = ({ isPlaying, isActive, activeSong, fullScreen }) => {
  const { quality } = useSelector((state) => state.audioQuality || { quality: "high" });
  const qColor = qualityColors[quality] || qualityColors.high;

  return (
    <div className={`flex-1 flex items-center justify-start ${fullScreen ? "hidden" : ""}`}>
      {/* Spinning album art */}
      <motion.div
        animate={{ rotate: isPlaying && isActive ? 360 : 0 }}
        transition={isPlaying && isActive
          ? { duration: 15, repeat: Infinity, ease: "linear" }
          : { duration: 0.3 }
        }
        className="hidden sm:block h-14 w-14 mr-3 flex-shrink-0"
        style={{ borderRadius: "50%", overflow: "hidden" }}
      >
        <img
          src={
            activeSong?.localImage ||
            activeSong?.image?.[2]?.url ||
            "https://res.cloudinary.com/djdi5hkyx/image/upload/v1743319920/ukr7gg6vkmlhf4rfg9qh.jpg"
          }
          alt="cover art"
          draggable="false"
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", borderRadius: "50%",
            border: isPlaying && isActive
              ? "2px solid rgba(168,85,247,0.6)"
              : "2px solid rgba(255,255,255,0.1)",
            transition: "border-color 0.3s",
          }}
        />
      </motion.div>

      <div style={{ minWidth: 0, maxWidth: "180px" }}>
        <p style={{
          color: "#f1f5f9",
          fontWeight: "700",
          fontSize: "14px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: "2px",
        }}>
          {activeSong?.name
            ? activeSong.name.replace("&#039;", "'").replace("&amp;", "&")
            : "Song"}
        </p>
        <p style={{
          color: "#64748b",
          fontSize: "12px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: "3px",
        }}>
          {activeSong?.artists?.primary
            ? activeSong.artists.primary.map((a) => a.name).join(", ")
            : "Artist"}
        </p>
        {/* Quality badge */}
        <span style={{
          background: qColor.bg,
          border: `1px solid ${qColor.border}`,
          color: qColor.text,
          borderRadius: "5px",
          padding: "1px 6px",
          fontSize: "9px",
          fontWeight: "800",
          letterSpacing: "0.5px",
        }}>
          {qualityLabels[quality]}
        </span>
      </div>
    </div>
  );
};

export default Track;
