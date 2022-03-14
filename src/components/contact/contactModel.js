import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const { Schema } = mongoose;

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: "{PATH} is required!" },
    email: { type: String, required: "{PATH} is required!" },
    subject: { type: String, required: "{PATH} is required!" },
    message: { type: String, required: "{PATH} is required!" },
  },
  { timestamps: true }
);

ContactSchema.set("versionKey", "version");
ContactSchema.plugin(updateIfCurrentPlugin);

const Contact = mongoose.model("Contact", ContactSchema);

export default Contact;
