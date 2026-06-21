'use client';
import React, { useState, useEffect } from 'react';
import logo from '../assets/Echoplay.png';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setProgress } from '@/redux/features/loadingBarSlice';
import { MdOutlineMenu } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import Sidebar from './Sidebar/Sidebar';
import NotificationBell from './NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const dispatch = useDispatch();
  const [showNav, setShowNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        id="main-navbar"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          transition: 'all 0.3s ease',
          background: scrolled
            ? 'rgba(8,8,20,0.92)'
            : 'rgba(8,8,20,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(255,255,255,0.04)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Left: Hamburger + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowNav(true)}
            aria-label="Open menu"
            id="navbar-menu-btn"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.9)',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '20px',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            <MdOutlineMenu />
          </button>
          <Link href="/" onClick={() => dispatch(setProgress(100))}>
            <Image
              src={logo}
              alt="EchoPlay Logo"
              priority
              style={{
                height: '28px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Link>
        </div>

        {/* Right: Bell */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <NotificationBell />
        </div>
      </header>

      {/* Sidebar Drawer */}
      <Sidebar showNav={showNav} setShowNav={setShowNav} />

      {/* Overlay */}
      <AnimatePresence>
        {showNav && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowNav(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 30,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
              }}
            />
            <motion.button
              key="close"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setShowNav(false)}
              style={{
                position: 'fixed',
                top: '20px',
                right: '16px',
                zIndex: 50,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '18px',
              }}
              className="md:hidden"
            >
              <IoClose />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;