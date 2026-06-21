"use client";

import React from "react";
import { motion } from "framer-motion";
import InfoIcon from "@mui/icons-material/Info";
import CodeIcon from "@mui/icons-material/Code";
import HeadsetIcon from "@mui/icons-material/Headset";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import SpeedIcon from "@mui/icons-material/Speed";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { FaGithub, FaHeart, FaPlayCircle } from "react-icons/fa";
import Link from "next/link";

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const features = [
    {
      icon: <HeadsetIcon style={{ fontSize: "28px" }} className="text-[#a855f7]" />,
      title: "Premium Audio Streaming",
      desc: "Enjoy crystal clear, high-fidelity music streaming up to 320kbps powered by JioSaavn & YouTube engines.",
    },
    {
      icon: <OfflineBoltIcon style={{ fontSize: "28px" }} className="text-[#ec4899]" />,
      title: "Seamless Offline Mode",
      desc: "Download and save your favorite tracks locally to listen to music offline, even without an active internet connection.",
    },
    {
      icon: <SpeedIcon style={{ fontSize: "28px" }} className="text-[#06b6d4]" />,
      title: "Ultra-Fast & Responsive",
      desc: "Engineered using client-side caching and state virtualization for near-instant page transitions and controls.",
    },
    {
      icon: <FaPlayCircle style={{ fontSize: "28px" }} className="text-[#10b981]" />,
      title: "Background Playback",
      desc: "Keep the music playing seamlessly in the background while you browse different routes, search, or check lyrics.",
    },
  ];

  const techStack = [
    { name: "Next.js 14", category: "Framework", desc: "Server components, routes optimization & PWA configurations." },
    { name: "Redux Toolkit", category: "State Management", desc: "Unified global control over playback queue, audio state & volume." },
    { name: "Framer Motion", category: "Animations", desc: "Buttery-smooth gestures, page transitions, and mini-player expands." },
    { name: "IndexedDB (IDB)", category: "Local Storage", desc: "High-capacity client database used to securely cache & store offline audio." },
    { name: "Tailwind CSS", category: "Styling", desc: "Clean layout utility styling with responsive glassmorphism styles." },
    { name: "Mongoose / Mongo", category: "Database", desc: "Server-side persistence for custom playlists and user accounts." },
  ];

  return (
    <div className="mx-auto relative flex flex-col w-11/12 lg:w-8/12 text-white min-h-screen pb-24">
      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mt-12 mb-8 justify-center sm:justify-start"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            boxShadow: "0 8px 24px rgba(168, 85, 247, 0.35)",
          }}
        >
          <InfoIcon className="text-white" style={{ fontSize: "32px" }} />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">About EchoPlay</h1>
          <p className="text-sm text-gray-400">Discover the music app that keeps you flowing</p>
        </div>
      </motion.div>

      {/* ===== Content Grid ===== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-8"
      >
        {/* Intro Banner */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 md:p-8 rounded-[24px]"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
          }}
        >
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
            EchoPlay.live — Free Your Music
          </h2>
          <p className="text-gray-300 leading-relaxed text-base">
            EchoPlay is a state-of-the-art, high-performance web music player designed for modern audiophiles. 
            By merging JioSaavn’s rich library and YouTube’s vast collection of live performances, remixes, and podcasts, 
            EchoPlay brings you the ultimate audio streaming catalog in one responsive, glassmorphic layout.
          </p>
          <p className="text-gray-400 leading-relaxed text-sm mt-3">
            With standard features like background play, high-quality audio downloads, local offline playback, and 
            fully custom local playlist creation, EchoPlay elevates your daily audio listening experience without annoying ads or paywalls.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <h3 className="text-xl font-bold border-b border-white/5 pb-2 flex items-center gap-2">
            <HeadsetIcon className="text-[#a855f7]" style={{ fontSize: "20px" }} /> Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="glass-card p-5 rounded-[20px] flex gap-4 items-start"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">{feat.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <h3 className="text-xl font-bold border-b border-white/5 pb-2 flex items-center gap-2">
            <CodeIcon className="text-[#ec4899]" style={{ fontSize: "20px" }} /> Built With Modern Tech
          </h3>
          <p className="text-sm text-gray-400">
            EchoPlay utilizes a client-first, cloud-supported architecture designed to perform gracefully under poor networks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="glass-card-flat p-4 rounded-xl flex flex-col justify-between"
                style={{
                  background: "rgba(255,255,255,0.01)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-white">{tech.name}</span>
                    <span className="text-[10px] uppercase font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                      {tech.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* GitHub / Contribution Section */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 md:p-8 rounded-[24px] text-center"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.04) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
          }}
        >
          <h2 className="text-xl font-bold mb-3 flex justify-center items-center gap-2">
            Open Source Initiative
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6">
            EchoPlay is built with love, open-source modules, and public APIs. Contributions, bug reports, and features suggestions are always welcome on our GitHub repository.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="accent-btn flex items-center gap-2 transition-transform hover:scale-105"
              style={{
                textDecoration: "none",
                borderRadius: "14px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "700",
                display: "inline-flex",
              }}
            >
              <ArrowForwardIcon style={{ fontSize: "18px" }} />
              <span>Start Listening</span>
            </Link>
            <a
              href="https://github.com/mrdeepak125/EchoPlay"
              target="_blank"
              rel="noreferrer"
              className="glass-btn flex items-center gap-2 transition-transform hover:scale-105"
              style={{
                textDecoration: "none",
                borderRadius: "14px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                display: "inline-flex",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <FaGithub size={18} />
              <span>View on GitHub</span>
            </a>
          </div>
          <div className="mt-6 flex justify-center items-center gap-1.5 text-xs text-gray-500">
            <span>Made with</span>
            <FaHeart className="text-pink-500 scale-90" />
            <span>by EchoPlay contributors & community</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
