"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const TYPE_COLORS = {
  info: { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", text: "#93c5fd", dot: "#3b82f6" },
  success: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)", text: "#86efac", dot: "#22c55e" },
  warning: { bg: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.3)", text: "#fde047", dot: "#eab308" },
  update: { bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.3)", text: "#d8b4fe", dot: "#a855f7" },
  feature: { bg: "rgba(236,72,153,0.15)", border: "rgba(236,72,153,0.3)", text: "#f9a8d4", dot: "#ec4899" },
};

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState([]);
  const dropdownRef = useRef(null);

  // Load read IDs from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("echoplay_read_notifs") || "[]");
    setReadIds(stored);
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !readIds.includes(n._id)).length;

  const markAllRead = () => {
    const allIds = notifications.map((n) => n._id);
    setReadIds(allIds);
    localStorage.setItem("echoplay_read_notifs", JSON.stringify(allIds));
    // If session, also mark server-side
    if (session?.user?.email) {
      notifications.forEach((n) => {
        if (!readIds.includes(n._id)) {
          fetch("/api/admin/notifications/read", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: n._id, email: session.user.email }),
          }).catch(() => {});
        }
      });
    }
  };

  const markOneRead = (id) => {
    if (!readIds.includes(id)) {
      const newRead = [...readIds, id];
      setReadIds(newRead);
      localStorage.setItem("echoplay_read_notifs", JSON.stringify(newRead));
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div style={styles.wrapper} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => { setOpen(!open); if (!open) {} }}
        style={styles.bellBtn}
        aria-label="Notifications"
        id="notification-bell-btn"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={styles.badge}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={styles.dropdown}
          >
            <div style={styles.dropHeader}>
              <h3 style={styles.dropTitle}>
                🔔 Notifications
                {unreadCount > 0 && (
                  <span style={styles.unreadPill}>{unreadCount} new</span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={styles.markAllBtn}>
                  Mark all read
                </button>
              )}
            </div>

            <div style={styles.notifList}>
              {loading && notifications.length === 0 ? (
                <div style={styles.centerMsg}>
                  <div style={styles.loader} />
                  <span style={{ color: "#9ca3af", fontSize: "13px" }}>Loading...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={{ fontSize: "36px" }}>🔕</div>
                  <p style={styles.emptyText}>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const isRead = readIds.includes(notif._id);
                  const colors = TYPE_COLORS[notif.type] || TYPE_COLORS.info;
                  return (
                    <motion.div
                      key={notif._id}
                      layout
                      onClick={() => markOneRead(notif._id)}
                      style={{
                        ...styles.notifItem,
                        background: isRead
                          ? "rgba(255,255,255,0.02)"
                          : colors.bg,
                        border: isRead
                          ? "1px solid rgba(255,255,255,0.06)"
                          : `1px solid ${colors.border}`,
                        cursor: "pointer",
                      }}
                    >
                      <div style={styles.notifRow}>
                        <span style={styles.notifEmoji}>{notif.emoji}</span>
                        <div style={styles.notifContent}>
                          <div style={styles.notifTitleRow}>
                            <span style={{
                              ...styles.notifTitle,
                              color: isRead ? "#9ca3af" : colors.text,
                            }}>
                              {notif.title}
                            </span>
                            {!isRead && (
                              <span style={{ ...styles.dotIndicator, background: colors.dot }} />
                            )}
                          </div>
                          <p style={styles.notifMsg}>{notif.message}</p>
                          <span style={styles.notifTime}>{formatTime(notif.createdAt)}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <div style={styles.dropFooter}>
                <Link href="/changelog" style={styles.footerLink}>
                  View all updates & changelog →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  wrapper: { position: "relative" },
  bellBtn: {
    position: "relative",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "#e5e7eb",
    padding: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  badge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "linear-gradient(135deg, #a855f7, #ec4899)",
    color: "#fff",
    borderRadius: "20px",
    minWidth: "18px",
    height: "18px",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
    border: "2px solid #0a0a1a",
    lineHeight: 1,
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 12px)",
    width: "360px",
    maxHeight: "480px",
    background: "rgba(15,15,30,0.95)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
  },
  dropHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 18px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  dropTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  unreadPill: {
    background: "linear-gradient(135deg, #a855f7, #ec4899)",
    color: "#fff",
    borderRadius: "20px",
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: "700",
  },
  markAllBtn: {
    background: "none",
    border: "none",
    color: "#a855f7",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "600",
    padding: 0,
  },
  notifList: {
    overflowY: "auto",
    flex: 1,
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  centerMsg: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "32px",
  },
  loader: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2px solid rgba(168,85,247,0.3)",
    borderTopColor: "#a855f7",
    animation: "spin 0.8s linear infinite",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "32px",
  },
  emptyText: { color: "#6b7280", fontSize: "14px", margin: 0 },
  notifItem: {
    borderRadius: "12px",
    padding: "12px 14px",
    transition: "all 0.2s",
  },
  notifRow: { display: "flex", gap: "10px", alignItems: "flex-start" },
  notifEmoji: { fontSize: "22px", lineHeight: 1, marginTop: "2px", flexShrink: 0 },
  notifContent: { flex: 1, minWidth: 0 },
  notifTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "3px",
  },
  notifTitle: { fontSize: "13px", fontWeight: "700", lineHeight: 1.3 },
  dotIndicator: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  notifMsg: {
    color: "#9ca3af",
    fontSize: "12px",
    margin: "0 0 4px",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  notifTime: { color: "#6b7280", fontSize: "11px" },
  dropFooter: {
    padding: "10px 18px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    textAlign: "center",
  },
  footerLink: {
    color: "#a855f7",
    fontSize: "13px",
    textDecoration: "none",
    fontWeight: "600",
  },
};
