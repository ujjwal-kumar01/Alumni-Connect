import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "contactingIds", // explicitly set the collection name
  }
);

export const Contact = mongoose.model("Contact", contactSchema);
