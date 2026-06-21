"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GetAppIcon from "@mui/icons-material/GetApp";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import LaptopIcon from "@mui/icons-material/Laptop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import toast from "react-hot-toast";

const InstallPage = () => {
  const [activeTab, setActiveTab] = useState("android");
  const [installable, setInstallable] = useState(false);
  const [isAppMode, setIsAppMode] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed PWA)
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      window.navigator.standalone === true;
    setIsAppMode(isStandalone);

    // Check if deferredPrompt is already stored
    if (window.deferredPrompt) {
      setInstallable(true);
    }

    // Listen to custom event fired by layout.js script
    const handlePromptable = () => {
      setInstallable(true);
    };

    window.addEventListener("pwa-install-promptable", handlePromptable);

    // Also check if beforeinstallprompt is fired while we are on this page
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Detect OS to pre-select the appropriate tab
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setActiveTab("ios");
    } else if (/android/i.test(userAgent)) {
      setActiveTab("android");
    } else {
      setActiveTab("desktop");
    }

    return () => {
      window.removeEventListener("pwa-install-promptable", handlePromptable);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      toast.error("Installation prompt not available. Please follow the instructions below to install manually.");
      return;
    }

    // Show the native browser install prompt
    promptEvent.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    if (outcome === "accepted") {
      toast.success("EchoPlay is installing! Welcome aboard.");
      setInstallable(false);
      window.deferredPrompt = null;
    } else {
      toast.error("Installation cancelled.");
    }
  };

  const tabs = [
    { id: "android", label: "Android", icon: <AndroidIcon /> },
    { id: "ios", label: "iOS (iPhone/iPad)", icon: <AppleIcon /> },
    { id: "desktop", label: "Desktop", icon: <LaptopIcon /> },
  ];

  const instructions = {
    android: [
      "Tap the 'Install EchoPlay' button above to trigger direct installation.",
      "If the button doesn't trigger, tap the three vertical dots menu icon (⋮) in the top-right corner of your Chrome browser.",
      "Select 'Install app' or 'Add to Home screen' from the menu.",
      "Confirm the installation in the pop-up dialog. The EchoPlay app icon will appear on your device's home screen."
    ],
    ios: [
      "Open your Safari browser and navigate to echoplay.live (PWAs are only installable via Safari on iOS).",
      "Tap the Share button in the bottom navigation bar (represented by a square with an arrow pointing upwards).",
      "Scroll down through the share options list and select 'Add to Home Screen'.",
      "Give the app a name (default: EchoPlay) and tap 'Add' in the top-right corner. The app will launch in full-screen app mode."
    ],
    desktop: [
      "Click the 'Install EchoPlay' button above, or click the download icon in your browser's address bar (typically on the right-hand side next to the bookmark star).",
      "A confirmation bubble will pop up asking if you want to install the app.",
      "Click 'Install' in the prompt window.",
      "The app will instantly launch in its own standalone window and a shortcut will be created on your desktop/start menu."
    ]
  };

  return (
    <div className="mx-auto relative flex flex-col w-11/12 lg:w-8/12 text-white min-h-screen pb-24">
      {/* ===== Page Header ===== */}
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
          <GetAppIcon className="text-white" style={{ fontSize: "32px" }} />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Install EchoPlay</h1>
          <p className="text-sm text-gray-400">Install the PWA for offline playback & app convenience</p>
        </div>
      </motion.div>

      {/* ===== Action Banner ===== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card p-6 md:p-8 rounded-[24px] mb-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
        }}
      >
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-left">
            {isAppMode ? (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-semibold mb-3">
                  <CheckCircleIcon style={{ fontSize: "14px" }} />
                  <span>Currently Running in App Mode</span>
                </div>
                <h2 className="text-xl font-bold mb-2">You're all set!</h2>
                <p className="text-gray-300 text-sm max-w-md">
                  EchoPlay is installed and running as a native Progressive Web App. Enjoy background audio, local caches, and seamless control!
                </p>
              </>
            ) : installable ? (
              <>
                <h2 className="text-xl font-bold mb-2">Native App Available</h2>
                <p className="text-gray-300 text-sm max-w-md">
                  Install EchoPlay on your device to unlock offline playback, native media control notifications, and faster performance.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-2">Add to Home Screen</h2>
                <p className="text-gray-300 text-sm max-w-md">
                  To install, click your browser's install button or follow the easy step-by-step instructions below for your device.
                </p>
              </>
            )}
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {isAppMode ? (
              <button
                disabled
                className="w-full md:w-auto px-8 py-3.5 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded-xl cursor-default text-sm flex items-center justify-center gap-2"
              >
                <CheckCircleIcon />
                <span>Installed successfully</span>
              </button>
            ) : installable ? (
              <button
                onClick={handleInstallClick}
                className="w-full md:w-auto accent-btn px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_8px_25px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.03]"
              >
                <GetAppIcon />
                <span>Install EchoPlay</span>
              </button>
            ) : (
              <div className="flex gap-2 items-start p-3 bg-blue-500/10 border border-blue-500/20 text-[#93c5fd] rounded-xl text-xs max-w-xs mx-auto md:mx-0">
                <InfoIcon style={{ fontSize: "16px" }} className="mt-0.5 shrink-0" />
                <span>PWA installation depends on browser support. Chrome, Edge, and Safari are recommended.</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ===== Steps Tabs & Details ===== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass-card p-6 md:p-8 rounded-[24px]"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h3 className="text-xl font-bold mb-6 text-center sm:text-left">Installation Instructions</h3>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-white/[0.08] text-white border border-white/10 shadow-md"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {instructions[activeTab].map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/[0.03]"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs"
                  style={{
                    background: "linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.3) 100%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {idx + 1}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default InstallPage;
