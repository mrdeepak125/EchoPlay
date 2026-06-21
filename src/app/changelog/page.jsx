"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const CHANGELOG = [
  {
    version: "2.2.0",
    date: "June 2026",
    tag: "Performance & UI Redesign",
    tagColor: "#ef4444",
    emoji: "🛠️",
    changes: [
      { type: "feature", text: "Zero-Interruption Playback: Inline offline content swapping ensures background music never stops when network connection drops" },
      { type: "feature", text: "Global Offline Interceptor: Prevents Next.js routing failures from triggering browser reloads while offline" },
      { type: "feature", text: "Redesigned Search Portal: Beautiful glassmorphic input, animated voice microphone, styled autocomplete preview cards" },
      { type: "feature", text: "Redesigned Query Results: Premium dual-column panels with unified hover play states and YouTube converters" },
      { type: "fix", text: "Fixed: Replaced Notification Bell's standard anchor tags with Next.js Link components to avoid page reloads" },
    ],
  },
  {
    version: "2.1.0",
    date: "June 2026",
    tag: "Feature Expansion",
    tagColor: "#ec4899",
    emoji: "🔥",
    changes: [
      { type: "feature", text: "New dedicated search page /search showing trending music" },
      { type: "feature", text: "Interactive search previews matching Songs, Albums, Artists, Playlists" },
      { type: "feature", text: "Multiple Accent Color Themes in Settings (Purple, Emerald, Sunset, Ocean, Rose)" },
      { type: "feature", text: "Download All songs feature inside album pages (indexedDB + browser download)" },
      { type: "feature", text: "Offline fallback dashboard page (/offline) to play cached downloads" },
      { type: "feature", text: "Sleep timer custom popup dialog replacing simple prompts" },
      { type: "fix", text: "Fixed: myPlaylists page returns 404 — redesigned as complete playlists manager" },
      { type: "fix", text: "Fixed: bottom navigation visible during fullscreen playback" },
      { type: "fix", text: "Removed search input from top navbar for cleaner aesthetics" },
      { type: "improvement", text: "Redesigned 404 Page with music vinyl disk animations" },
      { type: "improvement", text: "Tactile artwork dragging coordinate gestures in fullscreen player" },
      { type: "improvement", text: "Redesigned search results, album details, and favorites pages with premium glass UI" },
    ],
  },
  {
    version: "2.0.0",
    date: "June 2026",
    tag: "Major Release",
    tagColor: "#a855f7",
    emoji: "🚀",
    changes: [
      { type: "feature", text: "Complete Glass UI / Glassmorphism theme redesign" },
      { type: "feature", text: "Bottom navigation bar for mobile & tablet" },
      { type: "feature", text: "Admin panel with notification management system" },
      { type: "feature", text: "Notification bell with real-time unread badge" },
      { type: "feature", text: "Audio quality selector — High / Medium / Low (320/160/96 kbps)" },
      { type: "feature", text: "Voice search using Web Speech API" },
      { type: "feature", text: "Settings page with account details & audio preferences" },
      { type: "feature", text: "Swipe gestures on album art to change songs" },
      { type: "fix", text: "Fixed: Music stops on navigation — background play now works continuously" },
      { type: "fix", text: "Fixed: Song does not auto-advance to next — onEnded now properly triggers" },
      { type: "improvement", text: "Redesigned login, signup & password reset pages with glassmorphism" },
      { type: "improvement", text: "Redesigned fullscreen player with horizontal swipe image slider" },
      { type: "improvement", text: "Improved skeleton loading animations" },
    ],
  },
  {
    version: "1.5.0",
    date: "May 2026",
    tag: "Feature Update",
    tagColor: "#ec4899",
    emoji: "✨",
    changes: [
      { type: "feature", text: "Sleep timer and stop after N songs" },
      { type: "feature", text: "Playlist support — create & manage custom playlists" },
      { type: "feature", text: "Download songs for offline listening" },
      { type: "feature", text: "Add songs to favourites" },
      { type: "improvement", text: "Swipe down to close fullscreen player" },
    ],
  },
  {
    version: "1.0.0",
    date: "April 2026",
    tag: "Initial Release",
    tagColor: "#06b6d4",
    emoji: "🎵",
    changes: [
      { type: "feature", text: "Music streaming from JioSaavn API" },
      { type: "feature", text: "Trending, New Releases, Top Charts sections" },
      { type: "feature", text: "Search songs, artists, albums" },
      { type: "feature", text: "User authentication (Google & email/password)" },
      { type: "feature", text: "Lyrics display in fullscreen player" },
      { type: "feature", text: "Listen again — recently played songs" },
    ],
  },
];

const TYPE_STYLES = {
  feature: { bg: "rgba(168,85,247,0.12)", color: "#d8b4fe", label: "Feature", dot: "#a855f7" },
  fix: { bg: "rgba(34,197,94,0.12)", color: "#86efac", label: "Fix", dot: "#22c55e" },
  improvement: { bg: "rgba(6,182,212,0.12)", color: "#67e8f9", label: "Improvement", dot: "#06b6d4" },
};

export default function ChangelogPage() {
  return (
    <div style={{
      maxWidth: "760px",
      margin: "0 auto",
      padding: "28px 16px 120px",
      minHeight: "100vh",
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "36px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
          <Link href="/settings" style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            color: "#94a3b8",
            padding: "6px 12px",
            fontSize: "13px",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}>
            ← Settings
          </Link>
        </div>
        <h1 style={{
          fontSize: "32px",
          fontWeight: "800",
          margin: "0 0 8px",
          background: "linear-gradient(135deg, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          📋 Changelog
        </h1>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
          Every update, feature and fix — all in one place.
        </p>
      </motion.div>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute",
          left: "22px",
          top: 0,
          bottom: 0,
          width: "2px",
          background: "linear-gradient(to bottom, #a855f7, rgba(168,85,247,0.05))",
          borderRadius: "1px",
        }} />

        {CHANGELOG.map((release, ri) => (
          <motion.div
            key={release.version}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: ri * 0.1 }}
            style={{
              position: "relative",
              marginLeft: "52px",
              marginBottom: "32px",
            }}
          >
            {/* Timeline dot */}
            <div style={{
              position: "absolute",
              left: "-38px",
              top: "18px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: release.tagColor,
              border: `3px solid ${release.tagColor}`,
              boxShadow: `0 0 0 4px rgba(8,8,20,1), 0 0 12px ${release.tagColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              zIndex: 1,
            }} />

            {/* Release Card */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "20px",
              overflow: "hidden",
            }}>
              {/* Card Header */}
              <div style={{
                padding: "20px 24px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "24px" }}>{release.emoji}</span>
                    <h2 style={{
                      margin: 0,
                      fontSize: "22px",
                      fontWeight: "800",
                      color: "#f1f5f9",
                    }}>
                      v{release.version}
                    </h2>
                    <span style={{
                      background: `${release.tagColor}22`,
                      border: `1px solid ${release.tagColor}55`,
                      color: release.tagColor,
                      borderRadius: "20px",
                      padding: "3px 12px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}>
                      {release.tag}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                    📅 {release.date}
                  </p>
                </div>
              </div>

              {/* Changes */}
              <div style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {release.changes.map((change, ci) => {
                    const t = TYPE_STYLES[change.type] || TYPE_STYLES.feature;
                    return (
                      <div key={ci} style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        background: t.bg,
                      }}>
                        <span style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: t.dot,
                          flexShrink: 0,
                          marginTop: "6px",
                        }} />
                        <span style={{
                          background: t.bg,
                          color: t.color,
                          borderRadius: "6px",
                          padding: "1px 8px",
                          fontSize: "11px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          flexShrink: 0,
                        }}>
                          {t.label}
                        </span>
                        <span style={{ color: "#e2e8f0", fontSize: "14px", lineHeight: 1.5 }}>
                          {change.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "20px", color: "#475569", fontSize: "13px" }}>
        🎵 EchoPlay — Crafted with love for music
      </div>
    </div>
  );
}
