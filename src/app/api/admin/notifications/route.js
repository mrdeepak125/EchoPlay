import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";

const ADMIN_EMAIL = "admin@echoplay.app";
const ADMIN_PASSWORD = "echoplay@2006";

function isAdmin(req) {
  // Check Authorization header for admin credentials
  const auth = req.headers.get("x-admin-auth");
  if (auth === `${ADMIN_EMAIL}:${ADMIN_PASSWORD}`) return true;
  // Also check cookies set by admin login
  const adminCookie = req.cookies.get("echoplay_admin")?.value;
  return adminCookie === "true";
}

// GET — fetch all notifications (public)
export async function GET(req) {
  try {
    await dbConnect();
    const notifications = await Notification.find({})
      .sort({ pinned: -1, createdAt: -1 })
      .limit(50);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST — create notification (admin only)
export async function POST(req) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  try {
    await dbConnect();
    const body = await req.json();
    const { title, message, type, emoji, pinned } = body;
    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: "Title and message are required" },
        { status: 400 }
      );
    }
    const notification = await Notification.create({
      title,
      message,
      type: type || "info",
      emoji: emoji || "🔔",
      pinned: pinned || false,
    });
    return NextResponse.json({ success: true, data: notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE — delete notification (admin only)
export async function DELETE(req) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  try {
    await dbConnect();
    const { id } = await req.json();
    await Notification.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
