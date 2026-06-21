"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const navItems = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: "search",
    label: "Search",
    href: "/search",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    id: "library",
    label: "Library",
    href: "/myPlaylists",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { fullScreen } = useSelector((state) => state.player || { fullScreen: false });

  useEffect(() => setMounted(true), []);
  if (!mounted || fullScreen) return null;

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      id="bottom-nav"
      style={{
        position: "relative",
        zIndex: 45,
        display: "flex",
        alignItems: "stretch",
        background: "rgba(8,8,20,0.93)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
        height: "64px",
      }}
      className="lg:hidden"
    >
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            id={`bottom-nav-${item.id}`}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              textDecoration: "none",
              position: "relative",
              color: active ? "var(--accent-primary, #a855f7)" : "rgba(255,255,255,0.45)",
              transition: "color 0.2s ease",
            }}
          >
            {active && (
              <motion.div
                layoutId="bottomNavActive"
                style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: "2px",
                  borderRadius: "0 0 4px 4px",
                  background: "linear-gradient(90deg, var(--accent-primary, #a855f7), var(--accent-secondary, #ec4899))",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <motion.div
              animate={{ scale: active ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{
                padding: "2px",
                borderRadius: "10px",
                ...(active ? {
                  background: "var(--accent-glow, rgba(168,85,247,0.12))",
                } : {}),
              }}
            >
              {item.icon(active)}
            </motion.div>
            <span style={{
              fontSize: "10px",
              fontWeight: active ? "700" : "500",
              letterSpacing: "0.2px",
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );}
