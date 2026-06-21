"use client";
import { homePageData } from "@/services/dataAPI";
import React from "react";
import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import SongCard from "./SongCard";
import { useDispatch, useSelector } from "react-redux";
import SwiperLayout from "./Swiper";
import { setProgress } from "@/redux/features/loadingBarSlice";
import SongCardSkeleton from "./SongCardSkeleton";
import SongBar from "./SongBar";
import ListenAgain from "./ListenAgain";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Material UI Icons
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";

const Home = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { languages } = useSelector((state) => state.languages);
  const { data: session } = useSession();

  // Salutation
  const currentHour = new Date().getHours();
  let salutation = "Good evening";
  let salutationEmoji = "🌙";
  if (currentHour >= 5 && currentHour < 12) {
    salutation = "Good morning";
    salutationEmoji = "☀️";
  } else if (currentHour >= 12 && currentHour < 18) {
    salutation = "Good afternoon";
    salutationEmoji = "🌤️";
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setProgress(70));
      const res = await homePageData(languages);
      setData(res);
      dispatch(setProgress(100));
      setLoading(false);
    };
    fetchData();
  }, [languages]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  return (
    <div style={{ paddingBottom: "20px" }}>

      {/* ===== HERO SECTION ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "24px",
          padding: "36px 28px",
          marginBottom: "28px",
          marginTop: "8px",
          background: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.1) 50%, rgba(6,182,212,0.08) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "200px", height: "200px",
          background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(30px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-20px", left: "30%",
          width: "150px", height: "150px",
          background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(25px)", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "6px", margin: "0 0 6px" }}>
            {salutationEmoji} {salutation}
          </p>
          <h1 style={{
            fontSize: "clamp(22px, 5vw, 36px)",
            fontWeight: "800",
            margin: "0 0 12px",
            lineHeight: 1.2,
            background: "linear-gradient(135deg, #ffffff 0%, #d8b4fe 60%, #f9a8d4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {session?.user?.name
              ? `Hey ${session.user.name.split(" ")[0]}! 👋`
              : "What are you listening to today? 🎵"}
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: "0 0 20px" }}>
            Discover trending tracks, new releases & curated playlists.
          </p>

          {/* Quick Links */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="/search/trending" style={{
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              color: "#fff", borderRadius: "20px",
              padding: "8px 18px", fontSize: "13px", fontWeight: "700",
              textDecoration: "none", display: "flex", alignItems: "center", gap: "6px",
            }}>
              <WhatshotIcon style={{ fontSize: "16px" }} /> Trending
            </Link>
            {session && (
              <Link href="/myPlaylists" style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#f1f5f9", borderRadius: "20px",
                padding: "8px 18px", fontSize: "13px", fontWeight: "600",
                textDecoration: "none", display: "flex", alignItems: "center", gap: "6px",
              }}>
                <LibraryMusicIcon style={{ fontSize: "16px" }} /> My Playlists
              </Link>
            )}
            {session && (
              <Link href="/favourite" style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8", borderRadius: "20px",
                padding: "8px 18px", fontSize: "13px", fontWeight: "600",
                textDecoration: "none", display: "flex", alignItems: "center", gap: "6px",
              }}>
                <FavoriteIcon style={{ fontSize: "16px" }} /> Favourites
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* ===== LISTEN AGAIN ===== */}
      <ListenAgain />

      {/* ===== TRENDING ===== */}
      <SwiperLayout title={
        <span className="flex items-center gap-2">
          <WhatshotIcon className="text-pink-500" style={{ fontSize: "24px" }} /> Trending
        </span>
      }>
        {loading ? (
          <SongCardSkeleton />
        ) : (
          <>
            {data?.trending?.songs?.map((song) => (
              <SwiperSlide key={song?.id}>
                <SongCard song={song} activeSong={activeSong} isPlaying={isPlaying} />
              </SwiperSlide>
            ))}
            {data?.trending?.albums?.map((song) => (
              <SwiperSlide key={song?.id}>
                <SongCard song={song} activeSong={activeSong} isPlaying={isPlaying} />
              </SwiperSlide>
            ))}
          </>
        )}
      </SwiperLayout>

      {/* ===== TOP CHARTS ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: "28px", marginBottom: "28px" }}
      >
        <h2 style={{
          color: "#f1f5f9", fontSize: "20px", fontWeight: "800",
          marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px",
        }}>
          <LeaderboardIcon className="text-purple-500" style={{ fontSize: "24px" }} /> Top Charts
        </h2>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          overflow: "hidden",
          maxHeight: "420px",
          overflowY: "auto",
        }}>
          {loading ? (
            <div style={{ padding: "20px" }}>
              <SongCardSkeleton />
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              {data?.charts?.slice(0, 10)?.map((playlist, index) => (
                <SongBar key={playlist?.id} playlist={playlist} i={index} />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ===== NEW RELEASES ===== */}
      <SwiperLayout title={
        <span className="flex items-center gap-2">
          <NewReleasesIcon className="text-teal-400" style={{ fontSize: "24px" }} /> New Releases
        </span>
      }>
        {loading ? (
          <SongCardSkeleton />
        ) : (
          data?.albums?.map((song) => (
            <SwiperSlide key={song?.id}>
              <SongCard song={song} activeSong={activeSong} isPlaying={isPlaying} />
            </SwiperSlide>
          ))
        )}
      </SwiperLayout>

      {/* ===== FEATURED PLAYLISTS ===== */}
      <SwiperLayout title={
        <span className="flex items-center gap-2">
          <FeaturedPlayListIcon className="text-blue-500" style={{ fontSize: "24px" }} /> Featured Playlists
        </span>
      }>
        {loading ? (
          <SongCardSkeleton />
        ) : (
          data?.playlists?.map((song) => (
            <SwiperSlide key={song?.id}>
              <SongCard key={song?.id} song={song} activeSong={activeSong} isPlaying={isPlaying} />
            </SwiperSlide>
          ))
        )}
      </SwiperLayout>

      {/* Login CTA for non-logged-in users */}
      {!session && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            margin: "28px 0",
            padding: "28px",
            background: "linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(236,72,153,0.08) 100%)",
            border: "1px solid rgba(168,85,247,0.25)",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "20px", margin: "0 0 6px", fontWeight: "700", color: "#f1f5f9" }}>
            🎶 Unlock the full experience
          </p>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 20px" }}>
            Create playlists, save favourites and sync across devices
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link href="/login" style={{
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              color: "#fff", borderRadius: "12px", padding: "10px 24px",
              fontWeight: "700", fontSize: "14px", textDecoration: "none",
            }}>
              Sign In
            </Link>
            <Link href="/signup" style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#f1f5f9", borderRadius: "12px", padding: "10px 24px",
              fontWeight: "600", fontSize: "14px", textDecoration: "none",
            }}>
              Create Account
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
