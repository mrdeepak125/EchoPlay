'use client';
import { setProgress } from '@/redux/features/loadingBarSlice';
import { sendResetPasswordLink } from '@/services/dataAPI';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Link from 'next/link';

const page = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(setProgress(70));
      const res = await sendResetPasswordLink(email);
      if (res.success === true) {
        toast.success('Reset link sent! Check your inbox 📬');
        setSent(true);
      } else {
        toast.error(res.message || 'Failed to send reset link');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      dispatch(setProgress(100));
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px', paddingBottom: '120px',
    }}>
      {/* Blobs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '420px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '28px', padding: '44px 36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '60px', height: '60px', margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
            borderRadius: '18px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '26px',
            boxShadow: '0 8px 24px rgba(6,182,212,0.3)',
          }}>
            🔑
          </div>
          <h1 style={{
            fontSize: '26px', fontWeight: '800', margin: '0 0 8px',
            background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Forgot Password
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              textAlign: 'center', padding: '24px',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '16px',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📬</div>
            <p style={{ color: '#86efac', fontWeight: '700', fontSize: '16px', margin: '0 0 6px' }}>
              Email Sent!
            </p>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
              Check your inbox and click the reset link.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handelSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', marginBottom: '6px',
                fontSize: '13px', fontWeight: '600',
                color: focused ? '#a855f7' : '#94a3b8', transition: 'color 0.2s',
              }}>
                📧 Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  background: focused ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.06)',
                  border: focused ? '1.5px solid rgba(168,85,247,0.6)' : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px', color: '#f1f5f9',
                  padding: '12px 16px', fontSize: '15px', outline: 'none',
                  transition: 'all 0.25s',
                  boxShadow: focused ? '0 0 0 3px rgba(168,85,247,0.12)' : 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>

            <motion.button
              type="submit" whileTap={{ scale: 0.97 }} disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
                border: 'none', borderRadius: '14px', color: '#fff',
                fontSize: '16px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, fontFamily: 'inherit',
                boxShadow: '0 8px 24px rgba(6,182,212,0.3)',
                marginBottom: '16px',
              }}
            >
              {loading ? 'Sending...' : '📤 Send Reset Link'}
            </motion.button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' }}>
          Remember your password?{' '}
          <Link href="/login" style={{ color: '#a855f7', fontWeight: '700', textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default page;