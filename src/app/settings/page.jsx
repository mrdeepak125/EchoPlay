"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setQuality } from "@/redux/features/audioQualitySlice";
import { motion } from "framer-motion";
import Link from "next/link";
import { getUserInfo } from "@/services/dataAPI";
import { useRouter } from "next/navigation";
import { themes, applyTheme } from "@/components/ThemeProvider";

const QualityOptions = [
  {
    key: "high",
    label: "High Quality",
    desc: "320 kbps — Best audio experience",
    icon: "🎵",
    color: "#a855f7",
  },
  {
    key: "medium",
    label: "Medium Quality",
    desc: "160 kbps — Balanced quality & data",
    icon: "🎶",
    color: "#06b6d4",
  },
  {
    key: "low",
    label: "Low Quality",
    desc: "96 kbps — Save data / low bandwidth",
    icon: "📻",
    color: "#f59e0b",
  },
];

const Section = ({ title, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    style={{
      background: "rgba(255,255,255,0.04)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: "20px",
      overflow: "hidden",
      marginBottom: "20px",
    }}
  >
    <div style={{
      padding: "18px 22px 14px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}>
      <span style={{ fontSize: "20px" }}>{icon}</span>
      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#f1f5f9", margin: 0 }}>{title}</h2>
    </div>
    <div style={{ padding: "16px 22px" }}>{children}</div>
  </motion.div>
);

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const { quality } = useSelector((state) => state.audioQuality || { quality: "high" });
  const [userInfo, setUserInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [activeTheme, setActiveTheme] = useState("purple");

  useEffect(() => {
    const saved = localStorage.getItem("site-theme") || "purple";
    setActiveTheme(saved);
  }, []);

  const handleThemeChange = (key) => {
    setActiveTheme(key);
    applyTheme(key);
  };

  useEffect(() => {
    if (status === "authenticated") {
      setLoadingInfo(true);
      getUserInfo()
        .then((data) => setUserInfo(data))
        .catch(() => {})
        .finally(() => setLoadingInfo(false));
    }
  }, [status]);

  return (
    <div style={{
      maxWidth: "680px",
      margin: "0 auto",
      padding: "24px 16px 100px",
      minHeight: "100vh",
    }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "28px", padding: "0 4px" }}
      >
        <h1 style={{
          fontSize: "28px",
          fontWeight: "800",
          margin: "0 0 4px",
          background: "linear-gradient(135deg, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          ⚙️ Settings
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
          Manage your account, audio quality & preferences
        </p>
      </motion.div>

      {/* Account Section */}
      <Section title="Account" icon="👤">
        {status === "loading" ? (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} className="skeleton" />
            <div style={{ flex: 1 }}>
              <div style={{ height: 14, width: "60%", marginBottom: 8 }} className="skeleton" />
              <div style={{ height: 12, width: "40%" }} className="skeleton" />
            </div>
          </div>
        ) : status === "authenticated" && session?.user ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* User card */}
            <div style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.2)",
              borderRadius: "16px",
              padding: "16px",
            }}>
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="avatar"
                  style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(168,85,247,0.5)" }}
                />
              ) : (
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, #a855f7, #ec4899)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", fontWeight: "700", color: "#fff",
                }}>
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div>
                <p style={{ margin: "0 0 4px", fontWeight: "700", fontSize: "16px", color: "#f1f5f9" }}>
                  {session.user.name || userInfo?.userName || "User"}
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
                  {session.user.email}
                </p>
                <span style={{
                  display: "inline-block",
                  marginTop: "6px",
                  background: "rgba(34,197,94,0.15)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#86efac",
                  borderRadius: "8px",
                  padding: "2px 8px",
                  fontSize: "11px",
                  fontWeight: "700",
                }}>
                  ✓ Logged in
                </span>
              </div>
            </div>
            {/* Account info rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Name", value: session.user.name || userInfo?.userName || "—" },
                { label: "Email", value: session.user.email || "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <span style={{ color: "#64748b", fontSize: "14px" }}>{label}</span>
                  <span style={{ color: "#f1f5f9", fontSize: "14px", fontWeight: "600" }}>{value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#fca5a5",
                borderRadius: "12px",
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "fit-content",
                fontFamily: "inherit",
              }}
            >
              🚪 Sign Out
            </button>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ color: "#64748b", marginBottom: "16px", fontSize: "15px" }}>
              You are not logged in. Sign in to access your playlists, favourites and more.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link href="/login" style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                color: "#fff",
                borderRadius: "12px",
                padding: "10px 24px",
                fontWeight: "700",
                fontSize: "14px",
                textDecoration: "none",
                display: "inline-block",
              }}>
                Login
              </Link>
              <Link href="/signup" style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f1f5f9",
                borderRadius: "12px",
                padding: "10px 24px",
                fontWeight: "600",
                fontSize: "14px",
                textDecoration: "none",
                display: "inline-block",
              }}>
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </Section>

      {/* Audio Quality Section */}
      <Section title="Audio Quality" icon="🎵">
        <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px", marginTop: 0 }}>
          Choose streaming quality. Higher quality uses more data.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {QualityOptions.map((opt) => (
            <motion.button
              key={opt.key}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch(setQuality(opt.key))}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 16px",
                borderRadius: "14px",
                border: quality === opt.key
                  ? `1.5px solid ${opt.color}`
                  : "1px solid rgba(255,255,255,0.08)",
                background: quality === opt.key
                  ? `rgba(${opt.color === "#a855f7" ? "168,85,247" : opt.color === "#06b6d4" ? "6,182,212" : "245,158,11"},0.12)`
                  : "rgba(255,255,255,0.03)",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: "24px" }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: "0 0 2px",
                  fontWeight: "700",
                  fontSize: "15px",
                  color: quality === opt.key ? opt.color : "#f1f5f9",
                }}>
                  {opt.label}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>{opt.desc}</p>
              </div>
              {quality === opt.key && (
                <span style={{
                  width: "20px", height: "20px",
                  borderRadius: "50%",
                  background: opt.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "12px",
                  flexShrink: 0,
                }}>
                  ✓
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Theme Settings Section */}
      <Section title="Theme Settings" icon="🎨">
        <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px", marginTop: 0 }}>
          Choose a site accent theme. Changes apply instantly.
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", paddingBottom: "8px" }}>
          {Object.keys(themes).map((key) => {
            const theme = themes[key];
            const isSelected = activeTheme === key;
            return (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  border: isSelected ? "3.5px solid #fff" : "1px solid rgba(255,255,255,0.2)",
                  boxShadow: isSelected ? `0 0 16px ${theme.primary}` : "none",
                  transition: "all 0.2s ease",
                }} className="hover:scale-105" />
                <span style={{ 
                  fontSize: "11px", 
                  fontWeight: isSelected ? "700" : "500", 
                  color: isSelected ? "#fff" : "#94a3b8" 
                }}>
                  {theme.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* App Info Section */}
      <Section title="About EchoPlay" icon="🎧">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { label: "Version", value: "2.0.0 — Glass UI" },
            { label: "Build", value: "2026 Edition" },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              <span style={{ color: "#64748b", fontSize: "14px" }}>{label}</span>
              <span style={{ color: "#f1f5f9", fontSize: "14px", fontWeight: "600" }}>{value}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
            <Link href="/changelog" style={{
              background: "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "#d8b4fe",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "700",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              📋 Changelog
            </Link>
            <a href="https://github.com/mrdeepak125/EchoPlay" target="_blank" rel="noreferrer" style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#94a3b8",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              ⭐ GitHub
            </a>
            <Link href="/dmca" style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#64748b",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              textDecoration: "none",
            }}>
              DMCA
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
