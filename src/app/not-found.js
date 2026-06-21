'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BsSearch, BsArrowLeft, BsDisc } from 'react-icons/bs';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 relative overflow-hidden bg-[#05050f]">
      {/* Background neon ambient glows */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--accent-primary, #a855f7) 0%, transparent 70%)",
          top: "10%",
          left: "15%",
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--accent-secondary, #ec4899) 0%, transparent 70%)",
          bottom: "15%",
          right: "15%",
        }}
      />

      {/* Glass card container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card max-w-lg w-full p-10 text-center flex flex-col items-center relative overflow-hidden"
        style={{
          background: "rgba(10, 10, 25, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "32px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
          backdropFilter: "blur(40px)",
        }}
      >
        {/* Glow Ring Behind Vinyl */}
        <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#a855f7]/30 to-[#ec4899]/30 blur-[40px] -z-10 top-[12%] animate-pulse" />

        {/* Premium Turntable Vinyl Disk Animation */}
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center group select-none">
          {/* Vinyl Platter */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="w-44 h-44 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.6)] cursor-pointer relative"
            style={{
              background: "repeating-radial-gradient(circle, #0f0f12, #0f0f12 3px, #181822 4px, #181822 6px)",
              border: "6px solid #27273a",
            }}
          >
            {/* Glossy Vinyl Grooves Reflex */}
            <div className="absolute inset-0 rounded-full opacity-30 bg-gradient-to-tr from-white via-transparent to-white pointer-events-none" />
            
            {/* Center Record Label */}
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#0f0f12] text-xs font-black tracking-wider text-white uppercase"
              style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
              }}
            >
              404
            </div>
            
            {/* Center Spindle Hole */}
            <div className="absolute w-3 h-3 rounded-full bg-[#05050f] border border-white/20 shadow-inner" />
          </motion.div>

          {/* Record Player Stylus Arm (Hover interactive) */}
          <motion.div
            initial={{ rotate: -15 }}
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="absolute top-2 right-4 w-12 h-28 origin-[15px_15px] pointer-events-auto cursor-pointer"
            style={{
              zIndex: 10,
            }}
          >
            {/* Arm Pivot Base */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3b3b4f] to-[#1e1e2d] border border-white/10 shadow-md" />
            
            {/* Silver Metal Arm Shaft */}
            <div className="w-1 h-20 bg-gradient-to-r from-gray-400 to-gray-200 ml-[14px] shadow-sm" />
            
            {/* Needle Cartridge Head */}
            <div className="w-3.5 h-6 bg-[#ec4899] rounded-sm ml-[8px] mt-[-2px] border border-black/30 shadow-md transform rotate-12 flex items-center justify-center">
              <div className="w-1 h-3 bg-white/40 rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Text Details */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
          Harmonic Silence
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm mb-8">
          The song you requested is not in our playlist, or the page has taken an unscheduled intermission.
        </p>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold px-8 py-3.5 rounded-full transition-all w-full sm:w-auto justify-center text-white"
            style={{
              background: "linear-gradient(135deg, var(--accent-primary, #a855f7) 0%, var(--accent-secondary, #ec4899) 100%)",
              boxShadow: "0 8px 30px rgba(168, 85, 247, 0.3)",
            }}
          >
            <BsArrowLeft size={18} />
            <span>Go Back Home</span>
          </Link>
          <Link 
            href="/search" 
            className="flex items-center gap-2 font-bold px-8 py-3.5 rounded-full border border-white/10 hover:bg-white/5 transition-all w-full sm:w-auto justify-center text-gray-300 hover:text-white"
          >
            <BsSearch size={16} />
            <span>Search Tracks</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}