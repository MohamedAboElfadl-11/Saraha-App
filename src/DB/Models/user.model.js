import mongoose from "mongoose";
import { systemRoles } from "../../Constants/constants.js";

const userModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  profilePicture: String,
  otp: String,
  role: {
    type: String,
    default: systemRoles.USER,
    enum: Object.values(systemRoles),
  }
}, { timestamps: true });

const UserModel = mongoose.models.Users || mongoose.model("Users", userModel);

export default UserModel;
