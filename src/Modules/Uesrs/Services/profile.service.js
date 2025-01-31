import BlackListTokensModel from "../../../DB/Models/black-list.model.js";
import UserModel from "../../../DB/Models/user.model.js";
import { emitter } from "../../../Services/sende-email.service.js";
import { comparing, decryption, encryption, hashing } from "../../../Utils/crypto.js";
import jwt from "jsonwebtoken"

// get profile service
export const getProfile = async (req, res) => {
  const { _id } = req.authUser;
  console.log(req.authUser);
  const user = await UserModel.findById(_id);
  user.phone = decryption(user.phone, process.env.SECRET_KEY);
  res.status(200).json({
    user,
  });
}

// update password service
export const updatePasswordService = async (req, res) => {
  try {
    console.log(req.authUser.token);
    const { _id } = req.authUser;
    const { oldPassword, newPassword, confirmedPassword } = req.body;
    if (newPassword !== confirmedPassword)
      return res.status(401).json({ message: "password dosn't match" });
    const user = await UserModel.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const isPasswordCorrect = await comparing(oldPassword, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid password" });
    // hasing new password
    const hashedPassword = hashing(newPassword, Number(process.env.SALT));
    user.password = hashedPassword;
    await user.save();
    // revoke user token
    await BlackListTokensModel.create(req.authUser.token);
    res.status(200).json({ message: "password updated successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `server error try later ${error}`,
    });
  }
};

// update profile data
export const updateProfileService = async (req, res) => {
  try {
    const { _id } = req.authUser;
    const { email, username, phone } = req.body;
    const user = await UserModel.findById(_id)
    if (!user) return res.status(404).json({ message: "expired token, login agin" })
    // update username
    user.username = username;
    // update phone
    const encryptedPhone = encryption(phone, process.env.SECRET_KEY)
    user.phone = encryptedPhone
    // update email
    const emailExist = await UserModel.findOne({ email })
    // 1- find email
    if (emailExist) return res.status(409).json({ message: "email already exist" })
    const token = jwt.sign({ email }, process.env.JWT_SIGNUP_SECRET, { expiresIn: 1800 });
    // confirm email link (dynamicly)
    const confirmEmailLink = `${req.protocol}://${req.headers.host}/auth/verify/${token}`;
    // send email
    emitter.emit("sendEmail", {
      to: email,
      subject: `verify your email`,
      html: `<h1>Verify your email</h1>
          <a href="${confirmEmailLink}"> Click to verify</a>`,
    });
    user.email = email
    user.isEmailVerified = false
    await user.save()
    res.status(200).json({ message: "profile updated successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `server error try later ${error}`,
    });
  }
}

// List user service
export const listUserService = async (req, res) => {
  try {
    const users = await UserModel.find()
    res.status(200).json({ users })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: `server error try later ${error}`,
    });
  }
}