"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import { useDispatch } from "react-redux";
import { setProgress } from "@/redux/features/loadingBarSlice";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const InputField = ({ label, type, name, value, onChange, placeholder, icon }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{
        display: "block",
        marginBottom: "6px",
        fontSize: "13px",
        fontWeight: "600",
        color: focused ? "#a855f7" : "#94a3b8",
        transition: "color 0.2s",
      }}>
        {icon} {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required
          style={{
            width: "100%",
            background: focused ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.06)",
            border: focused ? "1.5px solid rgba(168,85,247,0.6)" : "1px solid rgba(255,255,255,0.12)",
            borderRadius: "12px",
            color: "#f1f5f9",
            padding: "12px 16px",
            fontSize: "15px",
            outline: "none",
            transition: "all 0.25s",
            boxShadow: focused ? "0 0 0 3px rgba(168,85,247,0.12)" : "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
};

const page = () => {
  const { status } = useSession();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onchange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(setProgress(70));
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (!res.error) {
        toast.success("Welcome back! 🎵");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error(error?.message || "Login failed");
    } finally {
      dispatch(setProgress(100));
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="loader" />
      </div>
    );
  }
  if (status === "authenticated") redirect("/");

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      paddingBottom: "100px",
    }}>
      {/* Background decorative blobs */}
      <div style={{
        position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", top: "10%", left: "5%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", right: "5%",
          width: "250px", height: "250px",
          background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(40px)",
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "440px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "28px",
          padding: "44px 36px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px", height: "64px",
            margin: "0 auto 16px",
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            boxShadow: "0 8px 24px rgba(168,85,247,0.4)",
          }}>
            🎵
          </div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "800",
            margin: "0 0 6px",
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Welcome Back
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Sign in to continue to EchoPlay
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handelSubmit}>
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onchange}
            placeholder="you@example.com"
            icon="📧"
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={onchange}
            placeholder="Your password"
            icon="🔒"
          />

          <div style={{ textAlign: "right", marginTop: "-12px", marginBottom: "20px" }}>
            <Link href="/reset-password" style={{
              color: "#a855f7",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
            }}>
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            style={{
              width: "100%",
              padding: "13px",
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              border: "none",
              borderRadius: "14px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              fontFamily: "inherit",
              boxShadow: "0 8px 24px rgba(168,85,247,0.35)",
              marginBottom: "16px",
            }}
          >
            {loading ? "Signing in..." : "🚀 Sign In"}
          </motion.button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "#475569", fontSize: "13px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          </div>

          {/* Google Login */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("google")}
            style={{
              width: "100%",
              padding: "12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "14px",
              color: "#f1f5f9",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          marginTop: "24px",
          color: "#64748b",
          fontSize: "14px",
        }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{
            color: "#a855f7",
            fontWeight: "700",
            textDecoration: "none",
          }}>
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default page;
