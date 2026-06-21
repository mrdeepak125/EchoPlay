import React from "react";
import logoWhite from "../../assets/logoWhite.png";
import Languages from "./Languages";
import { FaGithub } from "react-icons/fa";
import { BiSolidDonateHeart } from "react-icons/bi";
import { MdOutlineMenu } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import Profile from "./Profile";
import { useDispatch } from "react-redux";
import Playlists from "./Playlists";
import { setProgress } from "@/redux/features/loadingBarSlice";
import { motion, AnimatePresence } from "framer-motion";

// Material UI Icons
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SettingsIcon from "@mui/icons-material/Settings";
import CampaignIcon from "@mui/icons-material/Campaign";
import GetAppIcon from "@mui/icons-material/GetApp";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: <HomeIcon style={{ fontSize: "20px" }} /> },
  { href: "/search", label: "Search", icon: <SearchIcon style={{ fontSize: "20px" }} /> },
  { href: "/myPlaylists", label: "My Playlists", icon: <LibraryMusicIcon style={{ fontSize: "20px" }} /> },
  { href: "/favourite", label: "Favourites", icon: <FavoriteIcon style={{ fontSize: "20px" }} /> },
  { href: "/Download", label: "Downloads", icon: <GetAppIcon style={{ fontSize: "20px" }} /> },
  { href: "/settings", label: "Settings", icon: <SettingsIcon style={{ fontSize: "20px" }} /> },
  { href: "/changelog", label: "What's New", icon: <CampaignIcon style={{ fontSize: "20px" }} /> },
];

import { usePathname } from "next/navigation";

const Sidebar = ({ showNav, setShowNav }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {showNav && (
        <motion.div
          key="sidebar"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 40,
            height: "100vh",
            width: "min(300px, 80vw)",
            background: "rgba(8,8,20,0.96)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0 24px 24px 0",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 40px var(--accent-glow)",
          }}        >
          {/* Top: Logo + Close */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <Link href="/" onClick={() => { dispatch(setProgress(100)); setShowNav(false); }}>
              <Image
                src={logoWhite}
                alt="EchoPlay Logo"
                style={{ height: "28px", width: "auto", objectFit: "contain" }}
              />
            </Link>
            <button
              onClick={() => setShowNav(false)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "rgba(255,255,255,0.7)",
                width: "34px", height: "34px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: "16px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Profile */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <Profile setShowNav={setShowNav} />
          </div>

          {/* Nav Links */}
          <div style={{ padding: "10px 12px", flex: 1 }}>
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowNav(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 18px",
                    borderRadius: "9999px",
                    color: active ? "var(--accent-primary, #a855f7)" : "#cbd5e1",
                    background: active ? "var(--accent-glow, rgba(168,85,247,0.15))" : "transparent",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    marginBottom: "4px",
                    border: active ? "1px solid var(--accent-glow)" : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "#ffffff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#cbd5e1";
                    }
                  }}
                >
                  <span style={{ fontSize: "18px", width: "24px", textAlign: "center" }}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "12px 0" }} />

            {/* Languages */}
            <Languages />

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "12px 0" }} />

            {/* Playlists */}
            <Playlists setShowNav={setShowNav} />
          </div>

          {/* Footer */}
          <div style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}>
            {[
              { label: "About", href: "/about" },
              { label: "Install", href: "/install" },
              { label: "DMCA", href: "/dmca" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowNav(false)}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#94a3b8",
                  borderRadius: "8px",
                  padding: "5px 10px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/mrdeepak125/EchoPlay"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#94a3b8",
                borderRadius: "8px",
                padding: "5px 10px",
                fontSize: "12px",
                fontWeight: "600",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              <FaGithub size={12} /> GitHub
            </a>
            <a
              href="https://ko-fi.com/kamiflix"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "rgba(168,85,247,0.08)",
                border: "1px solid rgba(168,85,247,0.15)",
                color: "#d8b4fe",
                borderRadius: "8px",
                padding: "5px 10px",
                fontSize: "12px",
                fontWeight: "600",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(168,85,247,0.15)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(168,85,247,0.08)";
                e.currentTarget.style.color = "#d8b4fe";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.15)";
              }}
            >
              <BiSolidDonateHeart size={12} /> Donate
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
