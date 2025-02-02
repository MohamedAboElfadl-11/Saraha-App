import path from "path";
import UserModel from "../../../DB/Models/user.model.js";
import * as secure from "../../../Utils/crypto.js";
import { emitter } from "../../../Services/sende-email.service.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import BlackListTokensModel from "../../../DB/Models/black-list.model.js";

// signup service
export const signupService = async (req, res) => {

  const { username, email, phone, password, gender, age, role } = req.body;
  // find email
  const emailExist = await UserModel.findOne({ email });
  if (emailExist)
    return res.status(409).json({
      message: "Email already exist",
    });

  // encryption phone
  const encryptedPhone = secure.encryption(phone, process.env.SECRET_KEY);

  // hashed password
  const hashedPassword = secure.hashing(password, Number(process.env.SALT));

  // token jwt 1- genetrate token
  const token = jwt.sign({ email }, process.env.JWT_SIGNUP_SECRET, {
    expiresIn: 1800,
  });

  // confirm email link (dynamicly) http://localhost/3000/auth/verify/${email}
  const confirmEmailLink = `${req.protocol}://${req.headers.host}/auth/verify/${token}`;

  // send email
  emitter.emit("sendEmail", {
    to: email,
    subject: `verify your email`,
    html: `<h1>Verify your email</h1>
      <a href="${confirmEmailLink}"> Click to verify</a>`,
    attachments: [
      {
        filename: "pdf_1.pdf",
        path: path.resolve("Assets/pdf_1.pdf"),
      },
    ],
  });

  // create user
  const newUser = await UserModel.create({
    username,
    email,
    password: hashedPassword,
    phone: encryptedPhone,
    gender,
    age,
    role
  });

  res.status(201).json({
    message: "User created successfully",
    newUser,
  });
};

// verify email services
export const verifyEmailService = async (req, res) => {
  const { token } = req.params;
  // 2- decode token { email, iat }
  const decodedData = jwt.verify(token, process.env.JWT_SIGNUP_SECRET);

  const user = await UserModel.findOneAndUpdate(
    { email: decodedData.email },
    { isEmailVerified: true },
    { new: true }
  );
  if (!user)
    return res.status(404).json({
      message: "user not found",
    });
  res.status(200).json({
    message: "email verified successfully",
    user,
  });
};

// login service
export const loginService = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user)
    return res.status(409).json({
      message: "Invalid email or password",
    });

  const isPasswordCorrect = await secure.comparing(password, user.password);
  if (!isPasswordCorrect)
    return res.status(401).json({
      message: "Invalid email or password",
    });
  // genetrate access token to login service
  const accessToken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_ACCESS, { expiresIn: 1800, jwtid: uuidv4() });
  // generate refresh token => generate new access token
  const refreshtoken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_REFRESH, { expiresIn: '7d', jwtid: uuidv4() });
  res.status(200).json({
    message: "Login successfully",
    accessToken,
    refreshtoken,
  });
};

export const refreshTokenService = async (req, res) => {
  const { refreshtoken } = req.headers
  const decodedData = jwt.verify(refreshtoken, process.env.JWT_REFRESH)
  console.log(decodedData)
  const accessToken = jwt.sign({ _id: decodedData._id, email: decodedData.email }, process.env.JWT_ACCESS, { expiresIn: 1800 });
  res.status(200).json({
    message: "Token refershed successfully",
    accessToken
  })
};

// 1- accsess token => expired in 1h
// 2- refresh token => re-generate new access token => expired in 1h

// logout service
export const logoutService = async (req, res) => {

  const { accesstoken, refreshtoken } = req.headers;
  // verify the token
  const decodedData = jwt.verify(accesstoken, process.env.JWT_ACCESS)
  const decodeRefreshToken = jwt.verify(refreshtoken, process.env.JWT_REFRESH)
  await BlackListTokensModel.insertMany([
    {
      tokenId: decodedData.jti,
      expiryDate: decodedData.exp
    },
    {
      tokenId: decodeRefreshToken.jti,
      expiryDate: decodeRefreshToken.exp
    }
  ])
  res.status(200).json({ message: "User logged out successfully" })
}

// forget password service
export const forgetPasswordService = async (req, res) => {
  const { email } = req.body
  const user = await UserModel.findOne({ email })
  if (!user) return res.status(400).json({ message: "User not found" })
  // generate OTP
  const otp = Math.floor(Math.random() * 10000)
  // send OTP to user throw email
  emitter.emit("sendEmail", {
    to: user.email,
    subject: `OTP`,
    html: `<h4>reset your password</h4>
      <h5> Use this OTP to reset your password ${otp} </h5>`,
    attachments: [],
  });
  // hashing OTP
  const hashedOtp = secure.hashing(otp.toString(), Number(process.env.SALT));
  user.otp = hashedOtp
  await user.save();
  res.status(200).json({
    message: "OTP sent successfully"
  });
}

// reset password service
export const resetPasswordService = async (req, res) => {

  const { email, otp, password, confirmPassword } = req.body
  if (password !== confirmPassword) return res.status(400).json({ message: "Dosn't match" })

  const user = await UserModel.findOne({ email })
  if (!user) return res.status(400).json({ message: "User not found" })

  if (!user.otp) return res.status(400).json({ message: "generate new otp" })
  // compare otp between user otp
  const isOtpMatched = await secure.comparing(otp.toString(), user.otp)
  if (!isOtpMatched) return res.status(404).json({ message: "Otp not matched" })

  // hashing new password
  const hashedPassword = await secure.hashing(password, Number(process.env.SALT));

  // update new password and remove otp fromDB
  await UserModel.updateOne({ email }, { password: hashedPassword, $unset: { otp: "" } })
  res.status(200).json({ message: "password reseted successfully" })
}