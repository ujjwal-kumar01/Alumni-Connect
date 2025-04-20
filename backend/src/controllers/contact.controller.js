import { Contact } from "../models/contact.model.js";

export const submitContact = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // ✅ Check if phone is exactly 10 digits and numeric
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: "Phone number must be exactly 10 digits" });
    }

    const newContact = new Contact({ fullName, email, phone });
    await newContact.save();

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contact: newContact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
