"use client";
import { setProgress } from "@/redux/features/loadingBarSlice";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

const InputField = ({ label, type, name, value, onChange, placeholder, icon }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{
        display: "block", marginBottom: "6px",
        fontSize: "13px", fontWeight: "600",
        color: focused ? "#a855f7" : "#94a3b8",
        transition: "color 0.2s",
      }}>
        {icon} {label}
      </label>
      <input
        name={name} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={placeholder} required
        style={{
          width: "100%",
          background: focused ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.06)",
          border: focused ? "1.5px solid rgba(168,85,247,0.6)" : "1px solid rgba(255,255,255,0.12)",
          borderRadius: "12px", color: "#f1f5f9",
          padding: "12px 16px", fontSize: "15px", outline: "none",
          transition: "all 0.25s",
          boxShadow: focused ? "0 0 0 3px rgba(168,85,247,0.12)" : "none",
          fontFamily: "inherit", boxSizing: "border-box",
        }}
      />
    </div>
  );
};

const page = () => {
  const { status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ userName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onchange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(setProgress(70));
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          imageUrl: `https://api.dicebear.com/6.x/thumbs/svg?seed=${formData.userName}`,
        }),
      });
      const data = await res.json();
      if (data.success === true) {
        toast.success("Account created! 🎉 Please log in.");
        router.push("/login");
      } else {
        toast.error(data?.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
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
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "20px", paddingBottom: "120px",
    }}>
      {/* Blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "5%", right: "5%",
          width: "280px", height: "280px",
          background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "5%",
          width: "220px", height: "220px",
          background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(40px)",
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: "440px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "28px", padding: "40px 36px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "60px", height: "60px", margin: "0 auto 14px",
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            borderRadius: "18px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "26px",
            boxShadow: "0 8px 24px rgba(168,85,247,0.35)",
          }}>
            🎶
          </div>
          <h1 style={{
            fontSize: "26px", fontWeight: "800", margin: "0 0 6px",
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Create Account
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Join EchoPlay — Music for everyone
          </p>
        </div>

        <form onSubmit={handelSubmit}>
          <InputField label="Username" type="text" name="userName" value={formData.userName}
            onChange={onchange} placeholder="Your name" icon="👤" />
          <InputField label="Email" type="email" name="email" value={formData.email}
            onChange={onchange} placeholder="you@example.com" icon="📧" />
          <InputField label="Password" type="password" name="password" value={formData.password}
            onChange={onchange} placeholder="Min 6 characters" icon="🔒" />

          <motion.button
            type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
            style={{
              width: "100%", padding: "13px",
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              border: "none", borderRadius: "14px", color: "#fff",
              fontSize: "16px", fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, fontFamily: "inherit",
              boxShadow: "0 8px 24px rgba(168,85,247,0.35)",
              marginBottom: "16px",
            }}
          >
            {loading ? "Creating account..." : "✨ Create Account"}
          </motion.button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "#475569", fontSize: "13px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          </div>

          <motion.button
            type="button" whileTap={{ scale: 0.97 }} onClick={() => signIn("google")}
            style={{
              width: "100%", padding: "12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "14px", color: "#f1f5f9",
              fontSize: "15px", fontWeight: "600", cursor: "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center",
              justifyContent: "center", gap: "10px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </motion.button>
        </form>

        <p style={{ textAlign: "center", marginTop: "22px", color: "#64748b", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#a855f7", fontWeight: "700", textDecoration: "none" }}>
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default page;
