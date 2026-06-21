'use client';
import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setIsTyping } from '@/redux/features/loadingBarSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Searchbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/search/${encodeURIComponent(searchTerm.trim())}`);
    setIsExpanded(false);
    dispatch(setIsTyping(false));
  };

  const handleFocus = () => {
    dispatch(setIsTyping(true));
    setIsExpanded(true);
  };

  const handleBlur = () => {
    dispatch(setIsTyping(false));
    if (!searchTerm) setIsExpanded(false);
  };

  // Voice search using Web Speech API
  const startVoiceSearch = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setIsExpanded(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('');
      setSearchTerm(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-search if we got something
      if (searchTerm.trim()) {
        setTimeout(() => {
          router.push(`/search/${encodeURIComponent(searchTerm.trim())}`);
        }, 300);
      }
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error !== 'aborted') {
        console.warn('Voice search error:', e.error);
      }
    };

    recognition.start();
  }, [searchTerm, router]);

  const stopVoiceSearch = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      id="navbar-search-form"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        position: 'relative',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: isExpanded ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
        border: isExpanded
          ? '1px solid rgba(168,85,247,0.5)'
          : '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '6px 10px',
        transition: 'all 0.3s ease',
        boxShadow: isExpanded ? '0 0 0 3px rgba(168,85,247,0.1)' : 'none',
      }}>
        {/* Search Icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={isExpanded ? "#a855f7" : "rgba(255,255,255,0.5)"}
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: 'stroke 0.2s' }}>
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          name="search-field"
          id="search-field"
          autoComplete="off"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isListening ? '🎤 Listening...' : 'Search songs...'}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: isListening ? '#a855f7' : '#f1f5f9',
            fontSize: '14px',
            width: isExpanded ? '160px' : '110px',
            transition: 'width 0.3s ease',
            fontFamily: 'inherit',
          }}
        />

        {/* Voice Search Button */}
        <button
          type="button"
          id="voice-search-btn"
          onClick={isListening ? stopVoiceSearch : startVoiceSearch}
          title={isListening ? 'Stop listening' : 'Voice search'}
          style={{
            background: isListening
              ? 'rgba(168,85,247,0.25)'
              : 'rgba(255,255,255,0.05)',
            border: isListening
              ? '1px solid rgba(168,85,247,0.5)'
              : '1px solid transparent',
            borderRadius: '8px',
            color: isListening ? '#a855f7' : 'rgba(255,255,255,0.5)',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {isListening ? (
            // Animated mic icon when listening
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.div>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
          {/* Pulse ring when listening */}
          {isListening && (
            <motion.div
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '8px',
                background: 'rgba(168,85,247,0.3)',
                zIndex: -1,
              }}
            />
          )}
        </button>
      </div>
    </form>
  );
};

export default Searchbar;