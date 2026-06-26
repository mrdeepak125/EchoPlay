"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const EMOJI_OPTIONS = ["🔔", "🎵", "🚀", "✨", "⚠️", "🎉", "🔥", "💡", "🛠️", "📢"];
const TYPE_OPTIONS = ["info", "success", "warning", "update", "feature"];

const TYPE_COLORS = {
  info: { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)", text: "#93c5fd", badge: "#3b82f6" },
  success: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", text: "#86efac", badge: "#22c55e" },
  warning: { bg: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.4)", text: "#fde047", badge: "#eab308" },
  update: { bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.4)", text: "#d8b4fe", badge: "#a855f7" },
  feature: { bg: "rgba(236,72,153,0.15)", border: "rgba(236,72,153,0.4)", text: "#f9a8d4", badge: "#ec4899" },
};

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    emoji: "🔔",
    pinned: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check if already logged in as admin
  useEffect(() => {
    const email = document.cookie
      .split("; ")
      .find((c) => c.startsWith("echoplay_admin_email="))
      ?.split("=")[1];
    const adminAuth = document.cookie
      .split("; ")
      .find((c) => c.startsWith("echoplay_admin="));
    if (email && adminAuth) {
      setAdminEmail(decodeURIComponent(email));
      setIsAuthenticated(true);
      fetchNotifications();
    }
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.success) setNotifications(data.data);
    } catch (e) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setAdminEmail(loginData.email);
        toast.success("Welcome, Admin!");
        fetchNotifications();
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (e) {
      toast.error("Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setAdminEmail("");
    router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return toast.error("Title and message are required");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": `admin@echoplay.app:echoplay@2006`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Notification sent! 🎉");
        setForm({ title: "", message: "", type: "info", emoji: "🔔", pinned: false });
        fetchNotifications();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Failed to create notification");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notification?")) return;
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": `admin@echoplay.app:echoplay@2006`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted");
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  // ============ LOGIN SCREEN ============
  if (!isAuthenticated) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.loginHeader}>
            <div style={styles.adminIcon}>🛡️</div>
            <h1 style={styles.loginTitle}>EchoPlay Admin</h1>
            <p style={styles.loginSubtitle}>Secure Admin Dashboard</p>
          </div>
          <form onSubmit={handleLogin} style={styles.loginForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                style={styles.input}
                placeholder="admin@echoplay.app"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                style={styles.input}
                placeholder="••••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              style={{ ...styles.primaryBtn, opacity: loginLoading ? 0.7 : 1 }}
            >
              {loginLoading ? "Authenticating..." : "🔐 Login as Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============ ADMIN DASHBOARD ============
  return (
    <div style={styles.dashboard}>
      {/* Top Bar */}
      <header style={{ ...styles.topBar, flexWrap: isMobile ? "wrap" : "nowrap", gap: isMobile ? "10px" : "0" }}>
        <div style={styles.topBarLeft}>
          <span style={styles.adminBadge}>🛡️ Admin</span>
          <h1 style={{ ...styles.dashTitle, fontSize: isMobile ? "16px" : "20px" }}>EchoPlay Admin Panel</h1>
        </div>
        <div style={{ ...styles.topBarRight, width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "space-between" : "flex-end" }}>
          <span style={{ ...styles.adminEmailText, fontSize: isMobile ? "12px" : "14px", overflow: "hidden", textOverflow: "ellipsis", maxWidth: isMobile ? "160px" : "none" }}>{adminEmail}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <div style={{ ...styles.content, padding: isMobile ? "16px" : "28px" }}>
        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{notifications.length}</div>
            <div style={styles.statLabel}>Total Notifications</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statNumber, color: "#a855f7" }}>
              {notifications.filter((n) => n.pinned).length}
            </div>
            <div style={styles.statLabel}>Pinned</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statNumber, color: "#ec4899" }}>
              {notifications.filter((n) => n.type === "feature").length}
            </div>
            <div style={styles.statLabel}>Features</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statNumber, color: "#22c55e" }}>
              {notifications.filter((n) => n.type === "update").length}
            </div>
            <div style={styles.statLabel}>Updates</div>
          </div>
        </div>

        <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
          {/* Create Notification Form */}
          <div style={styles.formCard}>
            <h2 style={styles.cardTitle}>📢 Send Notification</h2>
            <form onSubmit={handleSubmit} style={styles.notifForm}>
              <div style={{ ...styles.formRow, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Emoji</label>
                  <div style={styles.emojiGrid}>
                    {EMOJI_OPTIONS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setForm({ ...form, emoji: em })}
                        style={{
                          ...styles.emojiBtn,
                          background: form.emoji === em ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)",
                          border: form.emoji === em ? "1px solid #a855f7" : "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type</label>
                  <div style={styles.typeGrid}>
                    {TYPE_OPTIONS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, type: t })}
                        style={{
                          ...styles.typeBtn,
                          background: form.type === t ? TYPE_COLORS[t].bg : "rgba(255,255,255,0.05)",
                          border: form.type === t ? `1px solid ${TYPE_COLORS[t].border}` : "1px solid rgba(255,255,255,0.1)",
                          color: form.type === t ? TYPE_COLORS[t].text : "#9ca3af",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={styles.input}
                  placeholder="Notification title..."
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ ...styles.input, minHeight: "120px", resize: "vertical", whiteSpace: "pre-wrap", lineHeight: "1.6" }}
                  placeholder="Notification message... (press Enter for new line, Space for space)"
                  required
                />
              </div>

              <div style={styles.checkRow}>
                <label style={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={form.pinned}
                    onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                    style={styles.checkbox}
                  />
                  📌 Pin this notification (shows first)
                </label>
              </div>

              {/* Preview */}
              {form.title && (
                <div style={{
                  ...styles.preview,
                  background: TYPE_COLORS[form.type]?.bg || "rgba(59,130,246,0.1)",
                  border: `1px solid ${TYPE_COLORS[form.type]?.border || "rgba(59,130,246,0.3)"}`,
                }}>
                  <div style={styles.previewHeader}>
                    <span>{form.emoji}</span>
                    <span style={{ ...styles.previewTitle, color: TYPE_COLORS[form.type]?.text }}>
                      {form.title}
                    </span>
                    {form.pinned && <span style={styles.pinnedTag}>📌 Pinned</span>}
                  </div>
                  <p style={{ ...styles.previewMsg, whiteSpace: "pre-wrap" }}>{form.message || "Preview message..."}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{ ...styles.primaryBtn, width: "100%", opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? "Sending..." : "📢 Send to All Users"}
              </button>
            </form>
          </div>

          {/* Notifications List */}
          <div style={styles.listCard}>
            <div style={styles.listHeader}>
              <h2 style={styles.cardTitle}>🔔 All Notifications</h2>
              <button onClick={fetchNotifications} style={styles.refreshBtn}>
                🔄 Refresh
              </button>
            </div>
            {loading ? (
              <div style={styles.loadingMsg}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div style={styles.emptyMsg}>
                <div style={styles.emptyIcon}>🔕</div>
                <p>No notifications yet. Create your first one!</p>
              </div>
            ) : (
              <div style={styles.notifList}>
                {notifications.map((notif) => {
                  const colors = TYPE_COLORS[notif.type] || TYPE_COLORS.info;
                  return (
                    <div
                      key={notif._id}
                      style={{
                        ...styles.notifItem,
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <div style={styles.notifTop}>
                        <div style={styles.notifLeft}>
                          <span style={styles.notifEmoji}>{notif.emoji}</span>
                          <div>
                            <div style={styles.notifTitleRow}>
                              <span style={{ ...styles.notifTitle, color: colors.text }}>
                                {notif.title}
                              </span>
                              {notif.pinned && <span style={styles.pinnedTag}>📌</span>}
                              <span style={{
                                ...styles.typeBadge,
                                background: colors.badge,
                              }}>
                                {notif.type}
                              </span>
                            </div>
                            <p style={{ ...styles.notifMsg, whiteSpace: "pre-wrap" }}>{notif.message}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(notif._id)}
                          style={styles.deleteBtn}
                        >
                          🗑️
                        </button>
                      </div>
                      <div style={styles.notifMeta}>
                        <span>👥 {notif.readBy?.length || 0} read</span>
                        <span>🕐 {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== STYLES =====
const styles = {
  loginPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0d1a2e 100%)",
    padding: "20px",
  },
  loginCard: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
  },
  loginHeader: { textAlign: "center", marginBottom: "32px" },
  adminIcon: { fontSize: "48px", marginBottom: "12px" },
  loginTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 6px",
  },
  loginSubtitle: { color: "#9ca3af", fontSize: "14px", margin: 0 },
  loginForm: { display: "flex", flexDirection: "column", gap: "20px" },
  dashboard: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0d1a2e 100%)",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 28px",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  topBarLeft: { display: "flex", alignItems: "center", gap: "12px" },
  adminBadge: {
    background: "rgba(168,85,247,0.2)",
    border: "1px solid rgba(168,85,247,0.4)",
    color: "#d8b4fe",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
  dashTitle: { fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 },
  topBarRight: { display: "flex", alignItems: "center", gap: "16px" },
  adminEmailText: { color: "#9ca3af", fontSize: "14px" },
  logoutBtn: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  content: { padding: "28px", maxWidth: "1400px", margin: "0 auto" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },
  statCard: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
  },
  statNumber: { fontSize: "36px", fontWeight: "700", color: "#a855f7" },
  statLabel: { color: "#9ca3af", fontSize: "13px", marginTop: "4px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    alignItems: "start",
  },
  formCard: {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "28px",
  },
  listCard: {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  cardTitle: { fontSize: "18px", fontWeight: "700", color: "#fff", margin: "0 0 20px" },
  notifForm: { display: "flex", flexDirection: "column", gap: "16px" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { color: "#d1d5db", fontSize: "13px", fontWeight: "600" },
  input: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  },
  emojiGrid: { display: "flex", flexWrap: "wrap", gap: "6px" },
  emojiBtn: {
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    lineHeight: 1,
    transition: "all 0.2s",
  },
  typeGrid: { display: "flex", flexWrap: "wrap", gap: "6px" },
  typeBtn: {
    padding: "5px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.2s",
  },
  checkRow: { display: "flex", alignItems: "center" },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#d1d5db",
    fontSize: "14px",
    cursor: "pointer",
  },
  checkbox: { width: "16px", height: "16px", accentColor: "#a855f7" },
  preview: {
    borderRadius: "12px",
    padding: "14px 16px",
  },
  previewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "6px",
  },
  previewTitle: { fontWeight: "700", fontSize: "14px" },
  previewMsg: { color: "#d1d5db", fontSize: "13px", margin: 0 },
  pinnedTag: {
    background: "rgba(168,85,247,0.2)",
    border: "1px solid rgba(168,85,247,0.3)",
    color: "#d8b4fe",
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #a855f7, #ec4899)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 24px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.3px",
  },
  listHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  refreshBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#9ca3af",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },
  loadingMsg: { color: "#9ca3af", textAlign: "center", padding: "20px" },
  emptyMsg: { textAlign: "center", color: "#6b7280", padding: "40px 20px" },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  notifList: { display: "flex", flexDirection: "column", gap: "12px" },
  notifItem: {
    borderRadius: "14px",
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  notifTop: { display: "flex", alignItems: "flex-start", justifyContent: "space-between" },
  notifLeft: { display: "flex", gap: "10px", alignItems: "flex-start", flex: 1 },
  notifEmoji: { fontSize: "20px", marginTop: "2px" },
  notifTitleRow: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" },
  notifTitle: { fontWeight: "700", fontSize: "14px" },
  typeBadge: {
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  notifMsg: { color: "#d1d5db", fontSize: "13px", margin: 0, lineHeight: 1.5 },
  deleteBtn: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.2)",
    color: "#fca5a5",
    borderRadius: "8px",
    padding: "6px 8px",
    cursor: "pointer",
    fontSize: "14px",
    flexShrink: 0,
  },
  notifMeta: {
    display: "flex",
    gap: "16px",
    color: "#6b7280",
    fontSize: "12px",
  },
};
