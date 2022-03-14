import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const { Schema } = mongoose;

const SubscribeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

SubscribeSchema.set("versionKey", "version");
SubscribeSchema.plugin(updateIfCurrentPlugin);

const Subscribe = mongoose.model("Subscribe", SubscribeSchema);

export default Subscribe;
