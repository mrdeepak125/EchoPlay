import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_EMAIL = "admin@echoplay.app";
const ADMIN_PASSWORD = "echoplay@2006";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const cookieStore = cookies();
      cookieStore.set("echoplay_admin", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 8, // 8 hours
        path: "/",
      });
      cookieStore.set("echoplay_admin_email", email, {
        httpOnly: false,
        maxAge: 60 * 60 * 8,
        path: "/",
      });
      return NextResponse.json({ success: true, message: "Admin authenticated" });
    }
    return NextResponse.json(
      { success: false, message: "Invalid admin credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const cookieStore = cookies();
  cookieStore.delete("echoplay_admin");
  cookieStore.delete("echoplay_admin_email");
  return NextResponse.json({ success: true, message: "Logged out" });
}
