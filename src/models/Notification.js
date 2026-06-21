import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "update", "feature"],
      default: "info",
    },
    emoji: {
      type: String,
      default: "🔔",
    },
    readBy: {
      type: [String], // array of user emails
      default: [],
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema, "notifications");
