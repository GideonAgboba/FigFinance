import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const { Schema } = mongoose;

const EventCategorySchema = new mongoose.Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    name: { type: String, required: "{PATH} is required!" },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

EventCategorySchema.set("versionKey", "version");
EventCategorySchema.plugin(updateIfCurrentPlugin);

const EventCategory = mongoose.model("EventCategory", EventCategorySchema);

export default EventCategory;
