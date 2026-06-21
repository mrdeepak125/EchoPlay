"use client";

import React from "react";
import { motion } from "framer-motion";

// Material UI Icons
import ShieldIcon from "@mui/icons-material/Shield";
import GavelIcon from "@mui/icons-material/Gavel";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

const Page = () => {
  return (
    <div className="mx-auto relative flex flex-col w-11/12 lg:w-8/12 text-white min-h-screen pb-24">
      {/* ===== Page Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mt-12 mb-8 justify-center sm:justify-start"
      >
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            boxShadow: "0 8px 24px rgba(168, 85, 247, 0.35)"
          }}
        >
          <ShieldIcon className="text-white" style={{ fontSize: "32px" }} />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Copyright Policy</h1>
          <p className="text-sm text-gray-400">DMCA Guidelines & Content Takedown</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-8">
        {/* ===== Card 1: Disclaimer Banner ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-6 md:p-8 rounded-[24px]"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
          }}
        >
          <div className="flex gap-4 items-start flex-col sm:flex-row">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[#d8b4fe] shrink-0">
              <InfoIcon style={{ fontSize: "24px" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                Disclaimer & Hosting Info
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                <span className="font-semibold text-white">EchoPlay.live</span> is an indexing service and search engine utilizing public API sources. 
                We do <span className="text-pink-400 font-semibold">NOT</span> host, upload, or store any audio, video, or media files on our own servers. All content shown is linked directly to media hosted on external, third-party hosting services.
              </p>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base mt-3">
                If you are the valid copyright owner of any listed content and wish to request its removal, please submit a formal DMCA-compliant takedown notice using the instructions below.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ===== Card 2: Requirements ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-6 md:p-8 rounded-[24px]"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
          }}
        >
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2 border-b border-white/5 pb-3">
            <GavelIcon className="text-pink-500" style={{ fontSize: "22px" }} />
            DMCA Request Requirements
          </h2>
          <p className="text-gray-300 mb-6 text-sm md:text-base leading-relaxed">
            To ensure your request is processed promptly, please provide the following details under the Digital Millennium Copyright Act framework:
          </p>

          <ul className="flex flex-col gap-4">
            {[
              "Clear identification of the copyrighted work claimed to have been infringed.",
              "The specific URLs (links) of the files or search results on EchoPlay.live containing the allegedly infringing material, enabling us to locate and remove access to it.",
              "Accurate contact information for the complaining party, including physical address, telephone number, and email address.",
              "A statement that the complaining party has a good faith belief that the disputed use of the material is not authorized by the copyright owner, its agent, or the law.",
              "A statement made under penalty of perjury that the information in the notice is accurate and that the complaining party is authorized to act on behalf of the copyright owner.",
              "A physical or electronic signature of the copyright owner or a person authorized to act on their behalf."
            ].map((text, idx) => (
              <li key={idx} className="flex gap-3 items-start text-gray-300 text-sm md:text-base">
                <CheckCircleOutlinedIcon className="text-[#06b6d4] mt-0.5 shrink-0" style={{ fontSize: "18px" }} />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ===== Card 3: Contact ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card p-6 md:p-8 rounded-[24px] text-center"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
          }}
        >
          <h2 className="text-xl font-bold mb-3">Submit Takedown Notice</h2>
          <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto mb-6">
            Please email your fully structured copyright takedown request to our designated inbox. We will review and act upon compliant requests within 24-72 hours.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:deepakpuri9190@gmail.com?subject=DMCA%20Takedown%20Notice%20-%20EchoPlay.live"
              className="accent-btn flex items-center gap-2 transition-transform hover:scale-105"
              style={{
                textDecoration: "none",
                borderRadius: "14px",
                padding: "12px 28px",
                fontSize: "15px",
                fontWeight: "700",
                display: "inline-flex"
              }}
            >
              <EmailIcon style={{ fontSize: "20px" }} />
              <span>Email Takedown Request</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;