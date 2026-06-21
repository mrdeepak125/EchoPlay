import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbconnect";
import Notification from "@/models/Notification";

// PATCH — mark a notification as read by the current user
export async function PATCH(req) {
  try {
    await dbConnect();
    const { id, email } = await req.json();
    if (!id || !email) {
      return NextResponse.json({ success: false, message: "id and email required" }, { status: 400 });
    }
    const notification = await Notification.findByIdAndUpdate(
      id,
      { $addToSet: { readBy: email } },
      { new: true }
    );
    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
