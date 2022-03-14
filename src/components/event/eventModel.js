import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const { Schema } = mongoose;

const locationSchema = mongoose.Schema(
  {
    type: { type: String, required: true, default: "Point" },
    coordinates: { type: Array, required: true },
  },
  { _id: false }
);

const EventSchema = new mongoose.Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    title: { type: String, required: "{PATH} is required!" },
    description: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "EventCategory",
      required: true,
    },
    address: locationSchema,
    viewCount: {
      type: Number,
      default: 0,
    },
    isVirtual: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EventSchema.index({ address: "2dsphere" });
EventSchema.set("versionKey", "version");
EventSchema.plugin(updateIfCurrentPlugin);

const Event = mongoose.model("Event", EventSchema);

export default Event;
