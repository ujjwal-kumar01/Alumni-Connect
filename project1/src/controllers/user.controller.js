import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asynchandlers.js";
import { fileUploaderOnCloudinary } from '../utils/cloudinary.js';

const register = asyncHandlers(async (req, res) => {
  const { fullName, email, password, year, company, location } = req.body;

  if ([fullName, email, password, year, location].some((field) => !field?.trim())) {
    throw new ApiError(400, "All required fields must be filled");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  let avatarUrl = "";

  // Check for avatar file and upload to Cloudinary
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (avatarLocalPath) {
    const uploadedAvatar = await fileUploaderOnCloudinary(avatarLocalPath);
    if (uploadedAvatar?.url) {
      avatarUrl = uploadedAvatar.url;
    }
  }

  const user = await User.create({
    fullName,
    email,
    password,
    year,
    company,
    location,
    avatar: avatarUrl || "", // optional
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});


export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password -refreshToken -__v");
  
      res.status(200).json({
        success: true,
        users,
        message: "Fetched all alumni successfully",
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({
        success: false,
        message: "Server error while fetching users",
      });
    }
  };
  
  export const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password -refreshToken");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user (excluding password)
    const { password: pwd, ...userData } = user._doc;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const updateUserProfile = async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong", error });
    }
  };
  
export { register };
